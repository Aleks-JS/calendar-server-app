module.exports = {
	secret: 'SECRET_RANDOM_KEY',
	corsOptions: {
		origin: 'http://localhost:4200',
		optionsSuccessStatus: 200
	},
	jwt: {
		secret: 'SECRET_RANDOM_KEY',
		tokens: {
			access: {
				expiresIn: '30s',
				type: 'access'
			},
			refresh: {
				expiresIn: '60d',
				type: 'refresh'
			}
		}
	},
	mongoUri: `mongodb+srv://aleks-JS:UdlxQhTPByNbln83@cluster0.sa9n1.mongodb.net/calendar_app?retryWrites=true&w=majority`
}
