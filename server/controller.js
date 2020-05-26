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
        requestTime: {
            $gt: getYesterdayDate()
        },
        module: moduleId
    })
    console.log(`[controller] Cantidad de turnos hoy en modulo ${moduleId}: ${turnsCount}`)
    //Retorna el nombre del modulo seguido del proximo numero de turno disponible
    return `${moduleId}-${++turnsCount}`
}

module.exports = {
    newTurn: async (userData, res) => {
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
                                requestTime : new Date(),
                                turnNumber  : turnNumber
                            })

            turn.save()
            console.log('[controller] Turno solicitado', turn)
            response.success({
                response: res,
                text    : turnNumber
            })
        }
    },
    attendTurn: async (userData, res) => {
        const isValidTurn = validations.checkTurnNumber(userData)
        if (!isValidTurn.state) {
            response.error({
                response     : res,
                status       : 400,
                text         : isValidTurn.text,
                errorDetails : isValidTurn.errorDetails
            })
            return
        }
        
        const turn = await model.Turn.findOne({
            requestTime: {
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
            turn.attendTime = new Date()
            turn.save()
            response.success({
                response: res
            })
        }
    },
    turnDetails: async (userData, res) => {
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
                requestTime: {
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
    getTurns: async (res) => {
        const turns = await model.Turn.find({})
        console.log('turns', turns)
        
        if(turns) {
            console.log(`[controller] Recuperando información de ${turns.length} turno${turns.length === 1 ? '' : 's'}`)
            response.success({
                response : res,
                text     : turns
            })
        }
        else {
            response.error({
                response : res
            })
        }
    },
    getNextTurn: async (userData, res) => {
        //Obtiene la cantidad de turnos del dia de hoy del modulo especificado y que ya fueron atendidos 
        const attendedTurns = await model.Turn.countDocuments({
            requestTime: {
                $gt: getYesterdayDate()
            },
            module: userData.moduleId,
            attendTime: {
                $ne: null
            }
        })

        if(!Number.isInteger(attendedTurns)) {
            response.error({
                response : res
            })
            return
        }

        //Si esta tomado por un usuario lo retorna
        const turn = await model.Turn.findOne({
            requestTime: {
                $gt: getYesterdayDate()
            },
            turnNumber: `${userData.moduleId}-${attendedTurns + 1}`
        })

        if(!turn) {
            response.error({
                response : res,
                status   : 200,
                text     : 'No hay turnos en espera para el módulo seleccionado' 
            })
            return
        }

        response.success({
            response : res,
            text     : attendedTurns + 1
        })
    },
    finishTurn: async (userData, res) => {
        const turn = await model.Turn.findOne({
            requestTime: {
                $gt: getYesterdayDate()
            },
            turnNumber: userData.turnNumber
        })

        if(!turn) {
            response.error({
                response     : res,
                status       : 400,
                text         : 'El turno enviado no existe'
            })
        }

        turn.finishTime = new Date()
        turn.save()
        response.success({
            response : res,
        })
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
    editModule: async (userData, res) => {
        const module = await model.Module.findOne({
            moduleLetter: userData.moduleLetter
        })

        module.author = userData.author
        module.description = userData.description
        module.save()
        console.log('[controller] Modulo actualizado', module)
        response.success({
            response: res
        })
    },
    getModules: async (res) => {
        const   modules      = await model.Module.find({}),
                modulesCount = modules.length

        if(modulesCount) {
            console.log(`[controller] Recuperando información de ${modulesCount} módulo${modulesCount > 1 ? 's' : ''}`)

            let moduleList = []
            for(const moduleItem of modules) {
                const turns = await model.Turn.find({
                    module:  moduleItem.moduleLetter
                })
                let totalTime = 0, validTurns = 0
                for(const turn of turns) {
                    if(turn.attendTime && turn.finishTime) {
                        let minutes = new Date(turn.finishTime).getMinutes() - new Date(turn.attendTime).getMinutes()
                        if(!minutes) {
                            minutes++
                        }
                        totalTime += minutes
                        validTurns++
                    }
                }
                moduleList = [...moduleList, {
                    moduleLetter : moduleItem.moduleLetter,
                    description  : moduleItem.description,
                    author       : moduleItem.author,
                    created      : moduleItem.created,
                    average      : validTurns !== 0 ? totalTime / validTurns : 0,
                    turns        : validTurns
                }]
            }
            
            response.success({
                response : res,
                text     : moduleList
            })
        }
        else {
            response.error({
                response : res,
                status   : 201,
                text     : 'No se encontró ningun módulo creado'
            })
        }
    },
    nextLetter: async (res) => {
        const modules = await model.Module.find({})
        if (modules) {
            //Inicia en 65 que es el codigo de la letra 'A', y le suma la cantidad de modulos existentes, es decir si hay 3 modulos ABC 
            //devuelve 68 que es el codigo de la 'D'
            response.success({
                response : res,
                text     : String.fromCharCode(modules.length + 65)
            })
        }
        else {
            response.error({
                response : res
            })
        }
    },
}