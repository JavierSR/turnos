const   db          = require('mongoose'),
        model       = require('./model'),
        response    = require('./response'),
        validations = require('./validations')

db.Promise = global.Promise
db.connect('mongodb+srv://turnos_admin:turnos_admin@cluster0-16idh.mongodb.net/turnos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

console.log('[controller] Conectado a la base de datos')

const getYesterdayDate = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
}

const getTurnNumber = async (moduleId) =>  {
    //Obtiene la cantidad de turnos generados hoy para el modulo seleccionado
    let turnsCount = await model.Turn.countDocuments({
        date: {
            $gt: getYesterdayDate()
        },
        module: moduleId
    })
    console.log(`[controller] Cantidad de turnos hoy en modulo ${moduleId}: ${turnsCount}`)
    //Retorna el nombre del modulo seguido del proximo numero de turno disponible
    return `${moduleId}-${++turnsCount}`
}

module.exports = {
    newTurn : async (userData, res) => {
        const isValidData = validations.checkData(userData)
        if (!isValidData.state) {
            response.error({
                response     : res,
                status       : 400,
                text         : isValidData.text,
                errorDetails : isValidData.errorDetails
            })
        }
        else {
            //Pendiente validar que userData.module exista despues de agregar creacion de modulos
            userData.module  = userData.module.toUpperCase()
            const turnNumber = await getTurnNumber(userData.module),
                  turn       = new model.Turn({
                                ...userData,
                                date       : new Date(),
                                turnNumber : turnNumber,
                                active     : true
                            })

            turn.save()
            console.log('[controller] Turno solicitado', turn)
            response.success({
                response: res,
                text    : turnNumber
            })
        }
    },
    finishTurn : async (userData, res) => {
        const isValidTurn = validations.checkTurnNumber(userData)
        if (!isValidTurn.state) {
            response.error({
                response     : res,
                status       : 400,
                text         : isValidTurn.text,
                errorDetails : isValidTurn.errorDetails
            })
        }
        else {
            const turn = await model.Turn.findOne({
                date: {
                    $gt: getYesterdayDate()
                },
                turnNumber : userData.turnNumber
            })
            
            if(!turn) {
                response.error({
                    response     : res,
                    status       : 400,
                    text         : 'El turno enviado no existe'
                })
            }
            else {
                turn.active = false
                turn.save()
                console.log('[controller] Turno despachado ', userData.turnNumber)
                response.success({
                    response: res
                })
            }
        }
    },
    turnDetails : async (userData, res) => {
        const isValidTurn = validations.checkTurnNumber(userData)
        if (!isValidTurn.state) {
            response.error({
                response     : res,
                status       : 400,
                text         : isValidTurn.text,
                errorDetails : isValidTurn.errorDetails
            })
        }
        else {
            const turn = await model.Turn.findOne({
                date: {
                    $gt: getYesterdayDate()
                },
                turnNumber : userData.turnNumber
            })
            
            if(!turn) {
                response.error({
                    response     : res,
                    status       : 400,
                    text         : 'El turno enviado no existe'
                })
            }
            else {
                console.log('[controller] Devolviendo información de turno ', turn)
                response.success({
                    response: res,
                    text    : JSON.stringify(turn)
                })
            }
        }
    },
    newModule: async (userData, res) => {
        const module = new model.Module({
                            ...userData,
                            created : new Date()
                        })

        module.save()
        console.log('[controller] Modulo creado', module)
        response.success({
            response: res
        })
    },
    getModules: async (res) => {
        const   modules      = await model.Module.find({}),
                modulesCount = modules.length

        if(modulesCount) {
            console.log(`[controller] Recuperando información de ${modulesCount} módulo${modulesCount > 1 ? 's' : ''}`)
            response.success({
                response : res,
                text     : modules
            })
        }
        else {
            response.error({
                response : res,
                status   : 201,
                text     : 'No se encontró ningun módulo creado'
            })
        }
    }
}