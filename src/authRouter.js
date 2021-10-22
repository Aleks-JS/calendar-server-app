const Router = require('express')
const router = new Router()
const controller = require('../src/authController')
const {check} = require('express-validator')

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
router.get('/users', controller.getUsers)

module.exports = router
