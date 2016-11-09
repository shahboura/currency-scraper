var express = require('express'),
	mongoose = require('mongoose'),
	phantom = require('x-ray-phantom'),
	xray = require('x-ray');

// var db = mongoose.connect('');
var app = express();
var port = process.env.PORT || 3000;

var currencyRouter = express.Router();
currencyRouter.route('/currencies')
	.get(function(req, res){
		var responseJson = {hello: "this is my api"};
		
		res.json(responseJson);
	});

app.use('/api', currencyRouter);

var cib = xray().driver(phantom({webSecurity: false, weak: false}));
cib('http://www.cibeg.com/English/Pages/CIBCurrencies.aspx', 'table.currTable tr',[{
	currency: 'td:nth-child(1)',
	buy: 'td:nth-child(2)',
	sell: 'td:nth-child(3)'
}])(function(error, currencies){
	console.log("cib-bank");
	console.log(currencies);
});

var baraka = xray().driver(phantom({webSecurity: false, weak: false}));
baraka('http://www.albaraka-bank.com.eg/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%81%D9%8A%D8%A9/%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A7%D9%84%D8%B5%D8%B1%D9%81.aspx', 'div#content table:first-child tr:not(.head)',[{
	currency: 'td:nth-child(2)',
	buy: 'td:nth-child(3)',
	sell: 'td:nth-child(4)'
}])(function(error, currencies){
	console.log("albaraka-bank");
	console.log(currencies);
});

// run server
app.listen(port, function(){
	console.log('Running on PORT: ' + port);
});