const jwt = require('jsonwebtoken')
const {secret} = require('./../config')
module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}

	try {
		/** Авторизация через токен */
		const token = req.headers.authorization
			? req.headers.authorization.split(' ')[1]
			: null
		if (!token) {
			return res.status(403).json({message: 'User is not logged in'})
		}
		const decodedData = jwt.verify(token,secret)
		req.user = decodedData
		next()
	} catch (e) {
		console.log(e)
		return res.status(403).json({message: 'User is not logged in'})
	}
}
