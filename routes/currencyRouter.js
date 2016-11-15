'use strict'

let express = require('express');

let routes = function(CurrencyModel){
	let currencyRouter = express.Router();
	currencyRouter.route('/currencies')
	.get(function(req, res){
		CurrencyModel.findOne().sort({creationDate: -1}).exec().then(doc => {
			let responseJson = doc.toJSON();
			res.json(responseJson);
		});
	});

	return currencyRouter;
};

module.exports = routes;