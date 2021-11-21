const {Schema, model} = require('mongoose');

const TokenModel = new Schema({
	tokenId: String,
	userId: String
})

module.exports = model('Token', TokenModel)
