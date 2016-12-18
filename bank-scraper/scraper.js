'use strict'
const cluster = require('cluster');
let Xray = require('x-ray'),
Phantom = require('x-ray-phantom'),
cache = require('memory-cache');

let bankScraper = function(config, CurrencyModel){
	let promises = [];
	let bankList = config.banks;
	let currencyMapper = config.currencyMappings;
	console.log(`scrapping started:: scrapping ${bankList.length} bank`);

	bankList.forEach(function(bank){
		let promise = new Promise((resolve, reject) => {
			console.log('scrapping bank: ' + bank.name);
			let bankScrap = Xray().driver(Phantom({webSecurity: false, weak: false}));
			
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
						if(isNaN(c.buy) || !c.buy || c.buy == 0 || isNaN(c.sell) || !c.sell || c.sell == 0){
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

						// handle different multipliers / decimal points
						let multiplier = bank.multiplier || 1;
						c.buy = Math.round(c.buy * multiplier * 10000) / 10000;
						c.sell = Math.round(c.sell * multiplier * 10000) / 10000;
					}

					resolve({code: bank.code, name: bank.name, currencies: currencies});
				}
			});
		});

		promises.push(promise);
	});

	return Promise.all(promises).then(results => {
		console.log(`scrapping done:: scrapped ${results.length} bank`);

		let creationDate = new Date();
		let byCurrency = {creationDate: creationDate};
		let byBank = {creationDate: creationDate};

		results.forEach(r => {
			byBank[r.code.toUpperCase()] = r;
			r.currencies.forEach(c => {
				byCurrency[c.currency] = byCurrency[c.currency] || [];
				byCurrency[c.currency].push({bank: r.name, buy: c.buy, sell: c.sell});
			});
		});

		cache.put('by-currency', byCurrency);
		cache.put('by-bank', byBank);

		// Sends out the result to all workers
		console.log('updating workers with latest results...');
		Object.keys(cluster.workers).forEach((id) => {
			cluster.workers[id].send({byCurrency: byCurrency, byBank: byBank});
		});

		// TODO: check mongoose connectivity;
		// currency.save((error, currency) => {
		// 	if(error){
		// 		console.log(error);
		// 	}else{
		// 		console.log('latest currency rates saved into db');
		// 	}
		// });

		// Sets a new interval
		setTimeout(bankScraper, config.refreshInterval, config, CurrencyModel);
		return byCurrency;
	});
};

module.exports = bankScraper;