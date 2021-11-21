const jwt = require('jsonwebtoken')
const {secret} = require('./../config/app').jwt

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}

	try {
		/** Авторизация через токен */
		const authHeader = req.get('Authorization')
		if (!authHeader) {
			return res.status(401).json({message: 'Token not provided!'})
		}
		const token = authHeader.split(' ')[1]
		const decodedData = jwt.verify(token,secret)
		if (decodedData.type !== 'access') {
			return res.status(401).json({message: 'Invalid token!'})
		}
		req.user = decodedData
		next()
	} catch (e) {
		console.log(e)
		if (e instanceof jwt.TokenExpiredError) {
			console.log(e)
			return res.status(401).json({message: 'Token expired!'})
		}
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({message: 'Invalid token!'})
		}
		return res.status(403).json({message: 'User is not logged in'})
	}
}
