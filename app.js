'use strict'

const cluster = require('cluster'),
numCPUs = require('os').cpus().length;

let express = require('express'),
config = require('./config'),
cache = require('memory-cache'),
bankScraper = require('./bank-scraper/scraper');

if(cluster.isMaster){
	console.log(`Master ${process.pid} is running`);

	// Fork workers.
	for (var i = numCPUs - 1; i >= 0; i--) {
		cluster.fork();
	}

	cluster.on('exit', (code, signal) => {
		console.log(`worker ${process.pid} died with signal/code ${signal || code}, forking...`);
		cluster.fork();
	});

	// Run only once, no need to scrap in parallel clusters
	bankScraper(config).then(() => {
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
		console.log(`Worker ${process.pid} started on port: ${port}`);
	});
}