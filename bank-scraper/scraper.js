'use strict'

let xray = require('x-ray'),
	phantom = require('x-ray-phantom');

let bankScraper = function(config, CurrencyModel){
	let promises = [];
	let bankList = config.banks;
	let currencyMapper = config.currencyMappings;
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
					for (let i = currencies.length - 1; i >= 0; i--) {
						var c = currencies[i];

						// remove zeroed, empty elements
						if(!c.buy || c.buy == 0 || !c.sell || c.sell == 0){
							currencies.splice(i, 1);
							continue;
						}

						// support regex value extraction
						if(bank.currencyRegex) {
							let match = c.currency.match(new RegExp(bank.currencyRegex));
							c.currency = match.shift() || c.currency;
						}

						// handle different  mappings of same currency
						let trimmedCurrency = c.currency.trim().replace(/\r?\n|\r/g, "");
						c.currency = currencyMapper[trimmedCurrency.toLowerCase()] || trimmedCurrency;
					}

					resolve({bank: bank.name, currencies: currencies});
				}
			});
		});

		promises.push(promise);
	});

	return Promise.all(promises).then(results => {
		console.log(`scrapping done:: scrapped ${results.length} bank`);

		var currency = new CurrencyModel({creationDate: new Date(), rates: results});
		currency.save((error, currency) => {
			if(error){
				console.log(error);
			}else{
				console.log('latest currency rates saved into db');
			}
		});

		// Sets a new interval
		setTimeout(bankScraper, config.refreshInterval, config, CurrencyModel);
		return currency.toJSON();
	});
};

module.exports = bankScraper;