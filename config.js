'use strict'

let banks = require("./bankList");
let config = {};

config.banks = banks;
config.port = process.env.PORT || 8000;
config.refreshInterval = 900000;

module.exports = config;