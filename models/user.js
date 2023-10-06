const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'no username']
    },
    bio:{
        type: String
    },
    password: {
        type: String, 
        required: [true, 'no password']
    },
    friends:{
        type: Array, 
    },
    posts:{
        type: Array,
    }
})

module.exports = mongoose.model('User', userSchema);