const mongoose = require('mongoose');

const BDSchema = mongoose.Schema({
    id:{
        type: String,
    },
    topic:{
        type: String,
    }
})



module.exports = mongoose.model('BDID', BDSchema)