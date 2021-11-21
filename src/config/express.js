const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./app')
const authRouter = require('./../routes/authRouter');
const eventsRouter = require('./../routes/eventsRouter');
const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = (app) => {
	app.use(bodyParser.json())
	app.use(cors(config.corsOptions));
	app.options('*', cors());
	app.use('/auth', authRouter);
	app.use('/event', eventsRouter);
	app.use('/weather', createProxyMiddleware({
		target: 'https://www.metaweather.com',
		changeOrigin: true,
		pathRewrite: {
			'^/weather': ''
		}
	}));
}
