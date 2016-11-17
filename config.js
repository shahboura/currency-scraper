'use strict'

let banks = require("./bank-scrapper/list");
let currencyMappings = require('./bank-scrapper/currency-mappings');
let config = {};

config.banks = banks;
config.currencyMappings = currencyMappings;
config.port = process.env.PORT || 8000;
config.refreshInterval = 900000;

module.exports = config;