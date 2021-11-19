const Router = require('express')
const router = new Router()
const controller = require('./../controllers/eventsController')

router.get('/all', controller.all)
router.get('/:id', controller.event)
router.put('/update/:id', controller.update)
router.post('/add', controller.add)
router.delete('delete/:id', controller.delete)

module.exports = router
