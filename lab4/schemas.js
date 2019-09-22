const Schema = require('mongoose').Schema;

const cakeSchema = new Schema({
	whoFor: { type: String, required: true, unique: false },
	createdAt: { type: Date, required: true },
	numCandles: Number
});

module.exports = { cakeSchema }