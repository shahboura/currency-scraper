'use strict'

let xray = require('x-ray'),
	phantom = require('x-ray-phantom');

let bankScrapper = function(bankList, CurrencyModel){
	let promises = [];
	console.log(`scrapping started:: scrapping ${bankList.length} bank`);
	bankList.forEach(function(bank){
		let promise = new Promise((resolve, reject) => {
			console.log('scrapping bank: ' + bank.name);
			let bankScrap = xray().driver(phantom({webSecurity: false, weak: false}));

			bankScrap(bank.url, bank.scopeSelector, [{
				currency: bank.currencySelector,
				buy: bank.buySelector,
				sell: bank.sellSelector
			}])(function(error, currencies){
				if(error){
					reject(error);
				}
				else{
					resolve({name: bank.name, rates: currencies});
				}
			});
		});

		promises.push(promise);
	});

	return Promise.all(promises).then(results => {
		console.log(`scrapping done:: scrapped ${results.length} bank`);
		var rates = results.map(scrapResult => {
			return {
				bank: scrapResult.name,
				currencies: scrapResult.rates
			};
		});

		var currency = new CurrencyModel({creationDate: new Date(), rates: rates});
		currency.save((error, currency) => {
			console.log('latest currency rates saved into db');
		});

		return currency.toJSON();
	});
};

module.exports = bankScrapper;