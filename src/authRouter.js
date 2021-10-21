const Router = require('express')
const router = new Router()
const controller = require('../src/authController')

router.post('/registration', controller.regisration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)

module.exports = router
