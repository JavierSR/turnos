const   express    = require('express'),
        bodyParser = require('body-parser'),
        router     = require('./server/network'),
        app        = express()

app.use(bodyParser.json())
app.use(router)
app.use('/app', express.static('public'))
app.listen(3000)
console.log('Servidor corriendo')
