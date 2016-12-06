'use strict'

const cluster = require('cluster'),
numCPUs = require('os').cpus().length;

let express = require('express'),
mongoose = require('mongoose'),
config = require('./config'),
bankScraper = require('./bank-scraper/scraper'),
CurrencyModel = require('./models/currencyModel');

// use native promises instead of mongoose deprecated
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/currencyAPI');

if(cluster.isMaster){
	cluster.on('online', (worker) => {
		console.log('Yay, the worker responded after it was forked');
	});

	// Fork workers.
	for (var i = numCPUs - 1; i >= 0; i--) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died, forking...`);
		cluster.fork();
	});

	// Run only once, no need to scrap in parallel clusters
	bankScraper(config, CurrencyModel).then(results => {
		console.log('currency rates updated.');
		console.log(results);
	});
} else {
	let app = express();
	let port = process.env.PORT || 3000;

	let currencyRouter = require('./routes/currencyRouter')(CurrencyModel);
	app.use('/api', currencyRouter);

	// run server
	app.listen(port, function(){
		console.log('Running on PORT: ' + port);
	});
}