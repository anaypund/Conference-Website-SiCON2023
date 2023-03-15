const mongoose = require('mongoose');

const submitPaperSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    Mobile_Number: {
        type: Number,
        required: true,
        unique:true,
    },
    fileName:{
        type: String,
        required: true,
    },
    filePath:{
        type: String,
        required: true,
    },
    topic:{
        type: String,
        required: true,
    },
    id:{
        type: String,
        unique: true,
    },
    submitted:{
        type:Boolean,
    }
})



module.exports = mongoose.model('submitPaper', submitPaperSchema)