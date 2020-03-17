const   express     = require('express'),
        router      = express.Router()
        controller  = require('./controller')

router.get('/api/turn', (req, res) => {
    controller.turnDetails(req.body, res)
})

router.post('/api/turn', (req, res) => {
    controller.newTurn(req.body, res)
})

router.patch('/api/turn', (req, res) => {
    controller.finishTurn(req.body, res)
})

module.exports = router