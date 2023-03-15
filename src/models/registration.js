const mongoose = require('mongoose');
const bcrypt=require('bcryptjs')


const registrationSchema = mongoose.Schema({
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
    gender:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    confirmpassword:{
        type: String,
        required: true,
    }
})

registrationSchema.pre("save",async function (next){
    if(this.isModified("password"))
    {
        console.log(this.password)
        this.password= await bcrypt.hash(this.password,10);
        console.log(this.password)
        this.confirmpassword=undefined
    }

})

module.exports = mongoose.model('registration', registrationSchema)