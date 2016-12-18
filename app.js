'use strict'

const cluster = require('cluster'),
numCPUs = require('os').cpus().length;

let express = require('express'),
mongoose = require('mongoose'),
config = require('./config'),
cache = require('memory-cache'),
bankScraper = require('./bank-scraper/scraper'),
CurrencyModel = require('./models/currencyModel');

if(cluster.isMaster){
	cluster.on('online', (worker) => {
		console.log('Yay, the worker responded after it was forked');
	});

	// Fork workers.
	for (var i = numCPUs - 1; i >= 0; i--) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died with signal/code ${signal || code}, forking...`);
		cluster.fork();
	});

	// use native promises instead of mongoose deprecated
	// mongoose.Promise = global.Promise;
	// mongoose.connect('mongodb://localhost/currencyAPI');

	// Run only once, no need to scrap in parallel clusters
	bankScraper(config).then(results => {
		console.log('currency rates updated.');
	});
} else {
	// update cache per worker whenever master fetches new currency rates
	process.on('message', (msg) => {
		console.log('Updating worker with currency results from master...');
		if(msg.byCurrency && msg.byBank){
			cache.put('by-currency', msg.byCurrency);
			cache.put('by-bank', msg.byBank);
		} else{
			console.log(`Error updating worker, msg: ${msg}`);
		}
	});

	let app = express();
	let port = process.env.PORT || 3000;

	let currencyRouter = require('./routes/currencyRouter')();
	app.use('/api', currencyRouter);

	// run server
	app.listen(port, function(){
		console.log('Running on PORT: ' + port);
	});
}