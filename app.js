const   express    = require('express'),
        bodyParser = require('body-parser'),
        router     = require('./server/router'),
        app        = express()

app.use(bodyParser.json())
app.use(router)
app.use('/app', express.static('public'))
app.listen(3000)
console.log('[___app____] Servidor corriendo')
