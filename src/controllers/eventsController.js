const jwt = require('jsonwebtoken')
const {secret} = require('./../config')
const {EventModel, Event} = require('./../models/Event')

/** Получение id юзера из токена */
const getUserId = (token) => {
	const {id: userId} = jwt.verify(token, secret);
	return userId;
}

class EventsController {
	async all(req, res) {
		try {

		} catch (e) {
			res.status(400).json({message: 'Failure to receive events'})
		}
	}

	async event(req, res) {
		try {
			const userId = await getUserId(req.headers.authorization.split(' ')[1])
			const event = await new Event(EventModel.findOne({userId, _id: req.params.id}))
			return res.status(200).json(event)
		} catch (e) {
			res.status(400).json({message: 'Failure to create event'})
		}
	}

	async update(req, res) {
		try {

		} catch (e) {
			res.status(400).json({message: 'Failure to update event'})
		}
	}

	async add(req, res) {
		try {

		} catch (e) {
			res.status(400).json({message: 'Failure to adding event'})
		}
	}

	async delete(req, res) {
		try {

		} catch (e) {
			res.status(400).json({message: 'Failure to delete event'})
		}
	}
}

module.exports = new EventsController()
