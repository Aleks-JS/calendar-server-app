const {Schema, model} = require('mongoose');

const EventSchema = new Schema({
	userId: String,
	title: {type: String, required: true},
	attributes: {
		startDate: {type: Date, transform: date => new Date(date).getTime(), required: true},
		endDate: {type: Date, transform: date => new Date(date).getTime(), required: true},
		createDate: {type: Date, transform: date => new Date(date).getTime(), required: true},
		type: {type: String, required: true},
		event: {type: String, required: true},
		reminded: {
			reminderTime: {type: Date, transform: date => date.getTime()},
			needToReminded: Boolean
		}
	},
	content: {
		description: String
	}
}, {
	timestamps: {createdAt: 'created_at', updatedAt: 'update_at'}
})

class Event {
	constructor(event) {
		this.id = event._id;
		this.title = event.title;
		this.attributes = this.transformAttributes(event.attributes);
		this.content = event.content;
	}

	transformAttributes(attr) {
		const attributes = {};
		Object.keys(attr).forEach(key => {
			switch (key) {
				case 'startDate' || 'endDate' || 'createDate':
					attributes[key] = new Date(attr[key])
					break
				case 'reminded':
					const reminded = {}
					Object.keys(attr[key]).forEach(remindedKey => {
						reminded[remindedKey] = remindedKey === 'reminderTime'
							? new Date(attr[key][remindedKey])
							: attr[key][remindedKey]
					})
					attributes[key] = reminded
					break
				default:
					attributes[key] = attr[key]
			}
		})
		return attributes
	}
}

/** Модель события в БД */
module.exports = {
	EventModel: model('Event', EventSchema),
	Event
}
