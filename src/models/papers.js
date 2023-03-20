const mongoose = require('mongoose');

const submitPaperSchema = mongoose.Schema({
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
        unique: true,
    },
})



module.exports = mongoose.model('submitPaper', submitPaperSchema)