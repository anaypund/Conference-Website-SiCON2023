const express = require('express');
const mongoose = require('mongoose');
const routes = express.Router();
const Register= require('../models/registration')
const submitPaper = require('../models/papers')
const bcrypt=require('bcryptjs')
// const path=require('path')
// const crypto=require('crypto')
const multer=require('multer')
// const GridFsStorage=require('multer-gridfs-storage')
const Grid=require('gridfs-stream')
const methodOverride=require('method-override')
const bodyParser = require('body-parser');
const upload= require('express-fileupload')
const nodemailer = require('nodemailer')
const createErrors = require('http-errors')
const fs = require('fs')
require('dotenv').config()

routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json());
routes.use(methodOverride('_method'));
routes.use(upload());
routes.use("/static",express.static("public"))


routes.get("/", (req,res)=>{
    res.render("index");
})

//@routes GET Error Page paper
routes.get("/error", (req,res)=>{
    res.render("paperError")
})

//@routes Get /upload
//@desc Loads Submit form
routes.get("/upload", async (req, res) => {
    res.render("submitForm")
})

routes.get("/iot", async (req, res) => {
    res.render("iot")
})

routes.get("/ml", async (req, res) => {
    res.render("ml")
})

routes.get("/big_data", async (req, res) => {
    res.render("big_data")
})

routes.get("/tracks", async (req, res) => {
    res.render("tracks")
})

// routes.use((req,res,next) => {
//     return next(createErrors(404, "File not found:"))
// })
// routes.use((err,req,res,next)=>{
//     res.locals.message= err.message;
//     const status=err.status || 500;
//     res.locals.status= status;
//     res.render('paperError');
// })
// @routes POST /upload
// @desc Uploads files to DB

routes.post("/upload",async(req,res)=>{
    // console.log(req.body.email)
        let checkMail= await submitPaper.findOne({email:req.body.email});

        // console.log(checkMail.email);
        if(checkMail!=null && checkMail.email== req.body.email){
            console.log("Error Called");
            return res.redirect("/error");
        }
        else{
        //File upload 
            if(req.files){
                // generating User ID
                const id = await submitPaper.countDocuments({"topic": req.body.topic});
                let result= null;
                let tempTopic;
                if(req.body.topic === "Big_Data"){
                    tempTopic="BD"
                }
                else{
                    tempTopic=req.body.topic
                }
                if(id<10){
                    result= "SiCON"+tempTopic+"000"+id.toString()
                }
                else if(id<100 && id>=10){
                    result= "SiCON"+tempTopic+"00"+id.toString();
                }
                else if(id<1000 && id>=100){
                    result= "SiCON"+tempTopic+"0"+id.toString();
            }
            else{
                result= "SiCON"+tempTopic+id.toString();
        }
            // End Generating ID
                let resultFile= result+".pdf"

                console.log(req.files);
                var file = req.files.file;
                file.name=resultFile;
                var filename= file.name;
                console.log(filename);
                var filePath;
                if(req.body.topic==="ML"){
                    filePath="public/papers/ML/"+filename;
                }
                else if(req.body.topic==="IOT"){
                    filePath="public/papers/IOT/"+filename;
                }
                else {
                    filePath="public/papers/BD/"+filename;
                }
            
                let name= req.body.firstname+" "+req.body.lastname;
            
                //file moved to static/papers folder and uploaded to database
                file.mv(filePath, async function(err){
                    if(err){
                        console.log(err)
                        // res.status(401).redirect("/error")

                    }
                    else{
                            
                            const submittedPapers= new submitPaper({
                                topic: req.body.topic,
                                name: name,
                                email: req.body.email,
                                gender:req.body.gender,
                                Mobile_Number: req.body.Mobile_Number,
                                fileName: filename,
                                filePath: filePath,
                                id: result,
                               })
                               
                                   const submitted= await submittedPapers.save();
                            
                        // sending mail to reviewer
                        var to=""; //add some field
                        var subject= "Paper of topic "+req.body.topic+" from "+req.body.name;
                        var body="Name: "+req.body.name+"\n"+"ID: "+result+"\n"+"Mail: "+req.body.email+"\n"+"Mobile No.: "+req.body.Mobile_Number+"\n"+"Topic: "+req.body.topic+"\n"+"Gender: "+req.body.gender;
                        
                        var transporter= nodemailer.createTransport({
                            service:'gmail',
                            auth:{
                                user:'siconinfo@sipnaengg.ac.in',//add some field
                                pass:'' //add some field
                            }
                        })

                        var mailOptions= {
                            from:'siconinfo@sipnaengg.ac.in', //add some field
                            to:to,
                            subject:subject,
                            text:body,
                            attachments:[{
                                path:filePath
                            }]
                        }

                        var mailOptionsUser={
                            from:'siconinfo@sipnaengg.ac.in',
                            to:req.body.email,
                            subject:"Greetings From Team SiCON 2023!",
                            text:"Hey "+req.body.firstname+" Thank You. We are very pleased to have you as a part of this conference.\n\n\nHere's Your SiCON ID:\n\n"+ result+"\n\nPlease keep this ID safe with you."
                            +"\n Your Paper Is Submitted to our reviewer team.\n",
                            attachments:[{
                                path:filePath
                            },{
                                path:"public/images/Flyer.jpeg"
                            }]
                        }

                        transporter.sendMail(mailOptions, function(err,info){
                            if(err){
                                console.log(err)
                                // res.status(401).redirect("/error")
                            }
                            else{
                                console.log("Email Sent to reviewer "+ info.response)

                                /****************To delete the files ***************/
                                // fs.unlink(filePath,function(err){
                                //     if(err){
                                //         return res.end(err)
                                //     }
                                //     else{
                                //         console.log("Deleted file")
                                //         return res.redirect("/")
                                //     }
                                // })
                            }
                        })
                        transporter.sendMail(mailOptionsUser, function(err,info){
                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log("Email Sent to user "+ info.response)

                                
                            }
                        })
                        res.status(201).redirect('/success');
                    
                }})
            }
        
        }
})

routes.get("/success", (req,res) => {
    res.render("success");
})
routes.get("/newuser", (req,res)=>{
    res.render("registration")
})

routes.post("/newuser", async (req, res) =>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const name= req.body.firstname+" "+req.body.lastname;
        if(cpassword===password){
           const registerUser= new Register({
            name: name,
            email: req.body.email,
            Mobile_Number: req.body.Mobile_Number,
            gender:req.body.gender,
            password:password,
            confirmpassword:cpassword,
           })
           const registered= await registerUser.save();
           res.status(201).render("index")
        }
        else{
            res.send("Password not same").status(404);
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

routes.get("/login", async (req, res) => {
    res.render("login")
})

routes.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const phNo= req.body.mobileNumber;
        const user= await Register.findOne({email:email});
        if(password===user.password){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid login details");
        }
    } catch (error) {
        res.status(400).send("Invalid login details");
    }
})

routes.get('/authorGuidelines', (req,res) => {
    res.render('author');
})

routes.get('/FAQs', (req,res) => {
    res.render('FAQs');
})

module.exports = routes;


