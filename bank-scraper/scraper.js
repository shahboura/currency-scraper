'use strict'
const cluster = require('cluster');
let Xray = require('x-ray'),
Phantom = require('x-ray-phantom');

let bankScraper = function(config, CurrencyModel){
	let promises = [];
	let bankList = config.banks;
	let currencyMapper = config.currencyMappings;
	console.log(`scrapping started:: scrapping ${bankList.length} bank`);

	bankList.forEach(function(bank){
		let promise = new Promise((resolve, reject) => {
			console.log('scrapping bank: ' + bank.name);
			let bankScrap = Xray()
								.driver(Phantom({webSecurity: false, weak: false}))
								.timeout(config.timeout);
			
			bankScrap(bank.url, bank.scopeSelector, [{
				currency: bank.currencySelector,
				buy: bank.buySelector,
				sell: bank.sellSelector
			}])(function(error, currencies){
				if(error) {
					console.error(`error returned from x-ray, when scrapping bank: ${bank.name}\nmsg: ${error}`);
					reject(error);
				}
				else {
					if(currencies === undefined || currencies.length === 0){
						reject(new Error(`error scrapping bank: ${bank.name}, Empty results returned`));
					}

					for (let i = currencies.length - 1; i >= 0; i--) {
						var c = currencies[i];

						// support currency value regex extraction
						if(bank.buySellRegex) {
							var regex = new RegExp(bank.buySellRegex);

							c.buy = c.buy.match(regex).shift() || c.buy;
							c.sell = c.sell.match(regex).shift() || c.sell;
						}

						// remove zeroed, empty elements
						if(isNaN(c.buy) || !c.buy || c.buy == 0 || isNaN(c.sell) || !c.sell || c.sell == 0){
							currencies.splice(i, 1);
							continue;
						}

						// support currency name regex extraction
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
		}).catch(error => {
			console.error(`error thrown when scrapping bank: ${bank.name}\nmsg: ${error}`);
		});

		promises.push(promise);
	});

	return Promise.all(promises).then(results => {
		let creationDate = new Date();
		let byCurrency = {creationDate: creationDate, currencies: {}};
		let byBank = {creationDate: creationDate, banks: {}};
		let failedAttempts = 0;

		results.forEach(r => {
			// broken link, already reported in catch, go on without it.
			if(r === undefined){
				failedAttempts++;
				return;
			}

			byBank.banks[r.code.toUpperCase()] = r;
			r.currencies.forEach(c => {
				byCurrency.currencies[c.currency] = byCurrency.currencies[c.currency] || [];
				byCurrency.currencies[c.currency].push({bank: r.name, buy: c.buy, sell: c.sell});
			});
		});

		console.log(`scrapping done:: scrapped ${results.length - failedAttempts} bank`);

		// Sends out the result to all workers
		console.log('updating workers with latest results...');
		Object.keys(cluster.workers).forEach((id) => {
			cluster.workers[id].send({byCurrency: byCurrency, byBank: byBank});
		});

		// Sets a new interval
		setTimeout(bankScraper, config.refreshInterval, config, CurrencyModel);
		return byCurrency;
	});
};

module.exports = bankScraper;