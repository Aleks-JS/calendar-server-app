const jwt = require('jsonwebtoken');
const {secret, tokens} = require('./../config/app').jwt
const Token = require('./../models/Token')

/** Генерация access токена */
const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles,
		type: tokens.access.type
	}
	const options = {expiresIn: tokens.access.expiresIn}
	return jwt.sign(payload, secret, options)
}

/** Генерация refresh токена */
const generateRefreshToken = (id, roles) => {
	const payload = {
		id,
		roles,
		type: tokens.refresh.type
	}
	const options = {expiresIn: tokens.refresh.expiresIn}
	return {
		id,
		token: jwt.sign(payload, secret, options)
	}
}

/** Обновление refreshToken в БД */
const replaceDbRefreshToken = async (tokenId, userId) => {
	await Token.findOneAndRemove({userId}).exec()
	await Token.create({tokenId, userId})
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	replaceDbRefreshToken
}
