exports.success = (args) => {
    args.response.status(args.status || 201).send({
        state: true,
        text: args.text || 'Operación exitosa'
    })
}

exports.error = (args) => {
    if(args.errorDetails) {
        console.error('response.js >> ', args.errorDetails)
    }
    args.response.status(args.status || 500).send({
        state: false,
        text: args.text || 'Parametros incorrectos'
    })
}