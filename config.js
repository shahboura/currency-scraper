'use strict'

let banks = require("./bank-scraper/list");
let currencyMappings = require('./bank-scraper/currency-mappings');
let config = {};

config.banks = banks;
config.currencyMappings = currencyMappings;
config.port = process.env.PORT || 8000;
config.refreshInterval = 900000;

module.exports = config;