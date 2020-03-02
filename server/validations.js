const isEmptyObject = (args) => {
    return Object.entries(args).length === 0
}

exports.checkData = (args = {}) => {
    if(isEmptyObject(args)) {
        return {
            state        : false,
            text         : 'No se recibió información para generar el turno',
            errorDetails : 'Empty req.body'
        }
    }
    
    const userDataType = typeof args.user
    if(!args.user || userDataType !== 'string') {
        return {
            state        : false,
            text         : 'No se recibió un usuario válido',
            errorDetails : `Campo "user" vacio o tipo de dato invalido (se esperaba un string, recibido ${userDataType})`
        }
    }

    if(!args.turnType || !(args.turnType === 'print' || args.turnType === 'qr')) {
        return {
            state        : false,
            text         : 'No se recibió un tipo de turno válido',
            errorDetails : `Campo "turnType" invalido (se esperaba conteniera el valor "qr" o "print", recibido ${args.turnType})`
        }
    }

    if(!args.module || typeof args.module !== 'string' || !(args.module.length === 1 && args.module.match(/[a-zA-Z]/i))) {
        return {
            state        : false,
            text         : 'No se recibió un módulo válido',
            errorDetails : `Campo "module" vacio o tipo de dato invalido (se esperaba cualquier letra de la "a" a la "z", recibido ${args.module})`
        }
    }

    return {
        state: true
    }
}

exports.checkTurnNumber = (args = {}) => {
    if(isEmptyObject(args)) {
        return {
            state        : false,
            text         : 'No se recibió turno para actualizar',
            errorDetails : 'Empty req.body'
        }
    }

    const turnNumberType = typeof args.turnNumber
    if(!args.turnNumber || turnNumberType !== 'string') {
        return {
            state        : false,
            text         : 'No se recibió un turno válido',
            errorDetails : `Campo "turnNumber" vacio o tipo de dato invalido (se esperaba un string, recibido ${turnNumberType})`
        }
    }

    return {
        state: true
    }
}
