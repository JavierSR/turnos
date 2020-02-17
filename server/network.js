const express = require('express'),
       router = express.Router()
     response = require('./response')

router.post('/', (req, res) => {
    if (req.query.params === 'error') {
        response.error({
            response: res,
            status: 400,
            errorDetails: 'Error en la petición'
        })
    }
    else {
        response.success({
            response: res,
            text    : 'Post',
            status  : 201
        })
    }
})

module.exports = router