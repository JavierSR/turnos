const   mongoose = require('mongoose'),
        Schema   = mongoose.Schema

const turnSchema = new Schema({
        user       : String,
        turnType   : String,
        module     : String,
        turnNumber : String, 
        date       : Date,
        active     : Boolean
})

module.exports = mongoose.model('turnlist', turnSchema)