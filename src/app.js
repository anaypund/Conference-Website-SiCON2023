const express= require('express')
const routes=require('./routes/main.js')
const hbs=require('hbs')
const mongooses=require('mongoose')
const BodyParser=require('body-parser')
const {default: mongoose}=require('mongoose')

const app= express()

app.use(BodyParser.urlencoded({ extended: true }))
app.use("/static",express.static("public"))
// app.use("",routes)

app.set('view engine', 'hbs')
app.set("views","views")

hbs.registerPartials("views/partials")
// mongoose.set('strictQuery', true);
app.get('/', async(req,res)=>{
    res.render("index")
})

app.listen(process.env.PORT | 5000,()=>{
    console.log('listening on port 5000........')
})