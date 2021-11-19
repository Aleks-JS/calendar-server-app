const {Schema, model} = require('mongoose');

const EventSchema = new Schema({
	userId: String,
	title: {type: String, required: true},
	attributes: {
		startDate: {type: String, required: true},
		endDate: {type: String, required: true},
		createDate: {type: String, required: true},
		type: {type: String, required: true},
		event: {type: String, required: true},
		reminded: {
			reminderTime: String,
			needToReminded: String
		}
	},
	content: {
		description: String
	}
})

class Event {
	constructor(event) {
		this.id = event._id;
		this.title = event.title;
		this.attributes = event.attributes;
		this.content = event.content;
	}
}
/** Модель события в БД */
module.exports = {
	EventModel: model('Event', EventSchema),
	Event
}
