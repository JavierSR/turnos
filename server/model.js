const   mongoose = require('mongoose'),
        Schema   = mongoose.Schema

const turnSchema = new Schema({
        user        : String,
        turnType    : String,
        module      : String,
        turnNumber  : String, 
        requestTime : Date,
        attendTime  : {
                type: Date,
                default: null
        },
        finishTime  : {
                type: Date,
                default: null
        }
})

const moduleSchema = new Schema({
        moduleLetter : String,
        description  : String,
        author       : String,
        created      : Date
})

module.exports = {
        Turn   : mongoose.model('turnlist', turnSchema),
        Module : mongoose.model('modules', moduleSchema)
}