'use strict'

let express = require('express'),
cache = require('memory-cache');

let routes = function(){
	let currencyRouter = express.Router();
	
	currencyRouter.route('/currencies')
	.get(function(req, res){
		res.jsonp(cache.get('by-currency') || {});
	});

	currencyRouter.route('/currencies/:currencySymbol')
	.get(function (req, res) {
		let currencySymbol = req.params.currencySymbol.toUpperCase();
		let currenciesStore = cache.get('by-currency') || {};
		res.jsonp(currenciesStore.currencies[currencySymbol] || {});
	});

	currencyRouter.route('/banks')
	.get(function(req, res){
		res.jsonp(cache.get('by-bank') || {});
	});

	currencyRouter.route('/banks/:bankCode')
	.get(function (req, res) {
		let bankCode = req.params.bankCode.toUpperCase();
		let banksStore = cache.get('by-bank') || {};
		res.jsonp(banksStore.banks[bankCode] || {});
	});

	return currencyRouter;
};

module.exports = routes;