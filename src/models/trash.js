const mongoose = require('mongoose');

const trashSchema = mongoose.Schema({
    prefix:{
        type: String,
    },
    topic:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    Mobile_Number: {
        type: Number,
        required: true,
    },
    submissionMode: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    fileName:{
        type: String,
        required: true,
    },
    filePath:{
        type: String,
        required: true,
    },
    id:{
        type: String,
    },
    recipt:{
        type:String,
    },
    reciptPath: {
        type: String,
    }
})



module.exports = mongoose.model('Trash', trashSchema)