const   express     = require('express'),
        router      = express.Router()
        controller  = require('./controller')

router.get('/api/turn', (req, res) => {
    controller.turnDetails(req.body, res)
})

router.post('/api/turn', (req, res) => {
    controller.newTurn(req.body, res)
})

router.post('/api/nextTurn', (req, res) => {    
    controller.getNextTurn(req.body, res)
})

router.post('/api/finishTurn', (req, res) => {    
    controller.finishTurn(req.body, res)
})

router.patch('/api/turn', (req, res) => {
    controller.attendTurn(req.body, res)
})

router.get('/api/turnsHistory', (req, res) => {
    controller.getTurns(res)
})

router.get('/api/module', (req, res) => {
    controller.getModules(res)
})

router.post('/api/module', (req, res) => {
    controller.newModule(req.body, res)
})

router.patch('/api/module', (req, res) => {
    controller.editModule(req.body, res)
})

router.get('/api/letter', (req, res) => {
    controller.nextLetter(res)
})

module.exports = router