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
		let currencies = cache.get('by-currency') || {};
		res.jsonp(currencies[currencySymbol] || {});
	});

	currencyRouter.route('/banks')
	.get(function(req, res){
		res.jsonp(cache.get('by-bank') || {});
	});

	return currencyRouter;
};

module.exports = routes;