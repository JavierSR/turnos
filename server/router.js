const   express     = require('express'),
        router      = express.Router()
        response    = require('./response')
        controller  = require('./controller')
        validations = require('./validations')

router.post('/api/turn', (req, res) => {
    const isValidData = validations.checkData(req.body)
    if (!isValidData.state) {
        response.error({
            response     : res,
            status       : 400,
            text         : isValidData.text,
            errorDetails : isValidData.errorDetails
        })
    }
    else {
        controller.newTurn(req.body)
            .then((responseText) => {
                response.success({
                    response: res,
                    text    : responseText,
                    status  : 201
                })
            })
            .catch((error) => {
                response.error({
                    response     : res,
                    status       : 500,
                    text         : 'Error del servidor',
                    errorDetails : error
                })
            })
    }
})

router.patch('/api/turn', (req, res) => {
    const isValidTurn = validations.checkTurnNumber(req.body)
    if (!isValidTurn.state) {
        response.error({
            response     : res,
            status       : 400,
            text         : isValidTurn.text,
            errorDetails : isValidTurn.errorDetails
        })
    }
    else {
        controller.finishTurn(req.body)
            .then(() => {
                response.success({
                    response: res,
                    status  : 201
                })
            })
            .catch((error) => {
                response.error({
                    response     : res,
                    status       : 400,
                    text         : error
                })
            })
    }
})

module.exports = router