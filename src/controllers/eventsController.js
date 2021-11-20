const jwt = require('jsonwebtoken')
const {secret} = require('./../config')
const {EventModel, Event} = require('./../models/Event')
const User = require('../models/User')

class EventsController {
	async all(req, res) {
		const search = {
			start: req.body['searchDate']
				? new Date(req.body['searchDate'].year, req.body['searchDate'].month, 1).getTime()
				: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
			end: req.body['searchDate']
				? new Date(req.body['searchDate'].year, req.body['searchDate'].month + 1, 0, 23, 59, 59).getTime()
				: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0,23, 59, 59).getTime()
		}
		try {
			const events = await EventModel.find({userId: req.user.id, 'attributes.startDate': { $gte: search.start, $lte: search.end }})
			return res.status(200).json(events)
		} catch (e) {
			res.status(400).json({message: 'Failure to receive events'})
		}
	}

	async event(req, res) {
		try {
			const event = await EventModel.findOne({userId: req.user.id, _id: req.params.id}).exec()
			if (!event) {
				return res.status(403).json({message: 'Event not found'})
			}
			return res.status(200).json(event ? new Event(event) : {})
		} catch (e) {
			res.status(400).json({message: 'Failure to receive event'})
		}
	}

	async update(req, res) {
		try {
			const user = await User.findOne({_id: req.user.id})
		} catch (e) {
			res.status(400).json({message: 'Failure to update event'})
		}
	}

	async add(req, res) {
		try {
			const user = await User.findOne({_id: req.user.id})
			if (!user) {
				return res.status(400).json({message: 'Ошибка пользователя, неавторизированный доступ'})
			}
			const event = new EventModel(req.body)
			const success = await event.save()
			return res.status(200).json({message: 'Event added!'})
		} catch (e) {
			console.log(e)
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
