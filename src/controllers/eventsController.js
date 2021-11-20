const {EventModel, Event, ShortEvent, UpdateModel} = require('./../models/Event')

const searchDateConfig = (searchDate) => {
	return {
		start: searchDate
			? new Date(searchDate.year, searchDate.month, 1).getTime()
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
		end: searchDate
			? new Date(searchDate.year, searchDate.month + 1, 0, 23, 59, 59).getTime()
			: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).getTime()
	}
}

const prepareDataEvents = (events, short = false) => {
	/**
	 * Обект, ключами которого устанавливаются даты начала событий, в значении массив событий на эту дату
	 *
	 * Исчисление месяца начинается с 0!!
	 *
	 * В случае отрицательного поиска на фронт отправляется null
	 * */
	return events.length
		? events.reduce((prev, current) => {
			const key = `${current.attributes.startDate.getDate()}.${current.attributes.startDate.getMonth()}.${current.attributes.startDate.getFullYear()}`;
			if (!prev[key]) {
				prev[key] = [short ? new ShortEvent(current) : new Event(current)];
			} else {
				prev[key].push(short ? new ShortEvent(current) : new Event(current));
			}
			return prev;
		}, {})
		: null
}

class EventsController {
	async all(req, res) {
		try {
			const search = searchDateConfig(req.body['searchDate'])
			const events = await EventModel.find({userId: req.user.id, 'attributes.startDate': { $gte: search.start, $lte: search.end }})
			const result = prepareDataEvents(events, true)
			return res.status(200).json(result)
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
			return res.status(200).json(event ? new Event(event) : null)
		} catch (e) {
			res.status(400).json({message: 'Failure to receive event'})
		}
	}

	async update(req, res) {
		try {
			const updateEvent = await EventModel.updateOne({ userId: req.user.id, _id: req.body.id }, new UpdateModel(req.body, req.user.id));
			if (updateEvent) {
				const search = searchDateConfig(req.body['searchDate'])
				const events = await EventModel.find({userId: req.user.id, 'attributes.startDate': { $gte: search.start, $lte: search.end }})
				const result = prepareDataEvents(events, true)
				return res.status(200).json(result)
			}
			return res.status(200).json(true)
		} catch (e) {
			res.status(400).json({message: 'Failure to update event'})
		}
	}

	async add(req, res) {
		try {
			const event = new EventModel(req.body)
			const success = await event.save()
			/** Возвращаем список событий */
			if (success) {
				const search = searchDateConfig(req.body['searchDate'])
				const events = await EventModel.find({userId: req.user.id, 'attributes.startDate': { $gte: search.start, $lte: search.end }})
				const result = prepareDataEvents(events)
				return res.status(200).json(result)
			}
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Failure to adding event'})
		}
	}

	async delete(req, res) {
		try {
			const updateEvent = await EventModel.deleteOne({ userId: req.user.id, _id: req.params.id})
			if (!updateEvent.deletedCount) {
				res.status(400).json({message: `Невозможно совершить удаление. Событие с идентификатором ${req.params.id} не найдено`})
			}
			/** Возвращаем список событий */
			const search = searchDateConfig(req.body['searchDate'])
			const events = await EventModel.find({userId: req.user.id, 'attributes.startDate': { $gte: search.start, $lte: search.end }})
			const result = prepareDataEvents(events, true)
			return res.status(200).json(result)
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Failure to delete event'})
		}
	}
}

module.exports = new EventsController()
