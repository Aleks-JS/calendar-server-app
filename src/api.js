const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
const config = require('./config/app')
const PORT = process.env.PORT || 3000;

const app = express();
require('./config/express')(app)

/*
GET - получение данных
POST - создание данных
PUT - обновление данных
PATCH - мелкое обновление данных 
DELETE - удаление
*/

function createApplication(storage) {
	app.use(
		basicAuth({
			users: {admin: 'supersecret'},
		})
	);

	app.get('/all', (req, res) => {
		console.log(storage.toArray())
		res.status(200).json(storage.toArray());
	});

	app.get('/async/:id', async (req, res) => {
		const id = req.params.id;
		const item = await storage.getAsync(id);

		if (!id || !item) {
			res.status(404).json({
				success: false,
			});
			return;
		}
		res.status(200).json(item);
	});

	app.get('/:id', (req, res) => {
		const id = req.params.id;
		const item = storage.get(id);

		if (!id || !item) {
			res.status(404).json({
				success: false,
			});
			return;
		}
		res.status(200).json(item);
	});

	app.put('/:id', (req, res) => {
		const id = req.params.id;
		const body = req.body;
		const item = storage.get(id);
		const changedItem = {...item, ...body};

		if (!id || !item) {
			res
				.status(500)
				.json({
					success: false,
				})
				.send('Event not found');
			return;
		}
		storage.change(id, changedItem);
		res.status(200).json(changedItem);
	});

	app.post('/events', (req, res) => {
		console.log(req.body);
		const success = storage.add({
			...req.body,
		});
		res
			.json({
				success: success,
			})
			.status(200);
	});

	app.delete('/:id', (req, res) => {
		const id = req.params.id;
		const success = storage.delete(id);
		res
			.json({
				success,
			})
			.status(200);
	});

	const start = async () => {
		try {
			await mongoose.connect(config.mongoUri)
			app.listen(PORT, () => {
				console.log(`Example app listening at http://localhost:${PORT}`);
			});
		} catch (e) {
			console.log(e)
		}
	}

	start();
}

module.exports = {
	createApplication,
};
