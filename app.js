'use strict'

let express = require('express'),
	mongoose = require('mongoose'),
	config = require('./config'),
	bankScraper = require('./bank-scraper/scraper'),
	CurrencyModel = require('./models/currencyModel');

let app = express();
let port = process.env.PORT || 3000;
let db = mongoose.connect('mongodb://localhost/currencyAPI');

let currencyRouter = require('./routes/currencyRouter')(CurrencyModel);

app.use('/api', currencyRouter);

// run server
app.listen(port, function(){
	console.log('Running on PORT: ' + port);
});

let refreshTimeout = setInterval(() => {
	bankScraper(config.banks, config.currencyMappings, CurrencyModel).then(results => {
		console.log('currency rates updated.');
		console.log(results);
	});
}, config.refreshInterval);