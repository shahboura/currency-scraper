'use strict'

let banks = require("./banksList");
let config = {};

config.banks = banks;
config.port = process.env.PORT || 8000;

module.exports = config;