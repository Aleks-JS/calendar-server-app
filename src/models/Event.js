const {Schema, model} = require('mongoose');

/** Модель событя, сохраняемая в БД */
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

/**
 * Сокращенная модель события,передаваемая на фронт
 *
 * */
class ShortEvent {
	constructor(event) {
		this.id = event._id;
		this.title = event.title;
		this.attributes = this.transformAttributes(event.attributes);
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

/**
 * Полная модель события,передаваемая на фронт
 *
 * */
class Event extends ShortEvent {
	constructor(event) {
		super(event);
		this.id = event._id;
		this.title = event.title;
		this.attributes = super.transformAttributes(event.attributes);
		this.content = event.content;
		this.create = event.created_at;
		this.update = event.update_at;
	}
}

/**
 * Модель обновления события в БД
 *
 * */
class UpdateModel {
	constructor(event, userId) {
		this.userId = userId;
		this.title = event.title;
		this.attributes = {
			startDate: new Date(event.attributes.startDate).getTime(),
			endDate: new Date(event.attributes.endDate).getTime(),
			createDate: new Date(event.attributes.createDate).getTime(),
			type: event.type,
			event: event.event,
			reminded: {
				reminderTime: new Date(event.attributes.reminded.reminderTime).getTime(),
				needToReminded: event.attributes.reminded.needToReminded
			}
		};
		this.content = {
			description: event.content.description
		}
	}
}

/** Модель события в БД */
module.exports = {
	EventModel: model('Event', EventSchema),
	Event,
	ShortEvent,
	UpdateModel
}
