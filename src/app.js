// 7:30 packages
//14:00 form creation
//16:10 crypto
require('dotenv').config()
const express= require('express')
const routes=require('./routes/main.js')
const connectDB=require('../db/connect')
const Register= require('./models/registration')
const hbs=require('hbs')
const mongooses=require('mongoose')
const BodyParser=require('body-parser')
const bcrypt=require('bcryptjs')
const nodemailer = require('nodemailer')

const {default: mongoose}=require('mongoose')

const app= express()

app.use(BodyParser.urlencoded({ extended: true }))
app.use("/static",express.static("public"))
app.use("",routes)
app.use(express.json())

app.set('view engine', 'hbs')
app.set("views","views")

hbs.registerPartials("views/partials")
mongoose.set('strictQuery', false);

// const securePassword = async(password)=>{
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordMatch = await bcrypt.compare(password,passwordHash);
//     console.log(passwordMatch);
// }
// securePassword("anay");


const port= process.env.PORT || 8000
const start=async () =>{
try {
    connectDB(process.env.MONGO_URI)
    console.log('Connected to database!')
    // Product.deleteMany()
    // Product.create(jsonProduct)
    app.listen(port, console.log(`Server listening on ${port}...`))
} catch (error) {
    console.log(error)
}}

start()

