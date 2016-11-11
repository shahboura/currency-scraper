'use strict'

let xray = require('x-ray'),
	phantom = require('x-ray-phantom');

let bankScrapper = function(banksList){
	let promises = [];
	debugger;
	banksList.forEach(function(bank){
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
					resolve(currencies);
				}
			});
		});

		promises.push(promise);
	});

	return Promise.all(promises);
};

module.exports = bankScrapper;