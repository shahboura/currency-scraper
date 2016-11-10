var banks = require("./banksList");
var config = {};

config.banks = banks;
config.port = process.env.PORT || 8000;

module.exports = config;