const {Schema, model} = require('mongoose');

const User = new Schema({
	profile: {
		birthday: Date,
		location: String,
	},
	email: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	roles: [{type: String, ref: 'Role'}]
})
/** Модель юзера в БД */
module.exports = model('User', User)
