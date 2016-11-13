let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let currencyModel = new Schema({
	creationDate : {
		type: Date
	},
	rates:[{
		bank: {
			type: String
		},
		currencies: [{
			currency: {
				type: String
			},
			buy: {
				type: Number
			},
			sell: {
				type: Number
			}
		}]
	}]
});

module.exports = mongoose.model('Currency', currencyModel);