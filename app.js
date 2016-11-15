'use strict'

let express = require('express'),
	mongoose = require('mongoose'),
	config = require('./config'),
	bankScrapper = require('./bank-scrapper/scrapper'),
	CurrencyModel = require('./models/currencyModel');

let app = express();
let port = process.env.PORT || 3000;
let db = mongoose.connect('mongodb://localhost/currencyAPI');

let currencyRouter = require('./routes/currencyRouter')(CurrencyModel);

app.use('/api', currencyRouter);

let banks = config.banks;

let refreshTimeout = setInterval(() => {
	bankScrapper(banks, CurrencyModel).then(results => {
		console.log('currency rates updated.');
	});
}, config.refreshInterval);

// run server
app.listen(port, function(){
	console.log('Running on PORT: ' + port);
});