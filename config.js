'use strict'

let banks = require("./bank-scrapper/list");
let config = {};

config.banks = banks;
config.port = process.env.PORT || 8000;
config.refreshInterval = 900000;

module.exports = config;