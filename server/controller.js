const   db    = require('mongoose'),
        Model = require('./model')

db.Promise = global.Promise
db.connect('mongodb+srv://turnos_admin:turnos_admin@cluster0-16idh.mongodb.net/turnos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

console.log('controller.js >> Conectado a la base de datos')

const getYesterdayDate = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
}
const getTurnNumber = async (moduleId) =>  {
    //Obtiene la cantidad de turnos generados hoy para el modulo seleccionado
    let turnsCount = await Model.countDocuments({
        date: {
            $gt: getYesterdayDate()
        },
        module: moduleId
    })
    console.log(`controller.js >> Cantidad de turnos hoy en modulo ${moduleId}: ${turnsCount}`)
    //Retorna el nombre del modulo seguido del proximo numero de turno disponible
    return `${moduleId}-${++turnsCount}`
}

module.exports = {
    newTurn : (userData) => {
        return new Promise(async (resolve) => {
            //Pendiente validar que userData.module exista despues de agregar creacion de modulos
            userData.module  = userData.module.toUpperCase()
            const turnNumber = await getTurnNumber(userData.module)
            const turn = new Model({...userData,
                date       : new Date(),
                turnNumber : turnNumber,
                active     : true
            })
    
            turn.save()
            console.log('controller.js >> Turno solicitado', turn)
            resolve(turnNumber)
        })
    },
    finishTurn : (userData) => {
        return new Promise(async (resolve, reject) => {
            const turn = await Model.findOne({
                turnNumber : userData.turnNumber
            })
            
            if(!turn) {
                reject('El turno enviado no existe')
            }
            else {
                turn.active = false
                turn.save()
                console.log('controller.js >> Turno despachado ', userData.turnNumber)
                resolve()
            }
        })         
    },
    turnDetails : () => {
    }
}