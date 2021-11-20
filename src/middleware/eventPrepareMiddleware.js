module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}

	try {
		req.body = Object.assign(req.body, {userId: req.user.id})
		next()
	} catch (e) {
		console.log(e)
		return res.status(500).json({message: 'A data conversion error has occurred'})
	}
}
