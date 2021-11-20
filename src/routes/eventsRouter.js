const Router = require('express')
const router = new Router()
const controller = require('./../controllers/eventsController')
const authMiddleware = require('./../middleware/authMiddleware')
const eventPrepareMiddleware = require('./../middleware/eventPrepareMiddleware')

/** TODO: валидация запросов?? express-validator */
router.post('/all', authMiddleware, controller.all)
router.get('/:id', authMiddleware, controller.event)
router.put('/update/:id', authMiddleware, controller.update)
router.post('/add', authMiddleware, eventPrepareMiddleware, controller.add)
router.delete('delete/:id', authMiddleware, controller.delete)

module.exports = router
