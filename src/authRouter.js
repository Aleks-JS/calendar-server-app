const Router = require('express')
const router = new Router()
const controller = require('../src/authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
	/**
	 * Валидация
	 *
	 * @see express-validator
	 */
	check('username', 'Username cannot be empty!').notEmpty(),
	check('password', 'The password can be at least 4 characters and no more than 15 characters!').isLength({min: 4, max: 15})
], controller.registration)
router.post('/login', controller.login)
/** Доступ к списку пользователей только для админа */
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router
