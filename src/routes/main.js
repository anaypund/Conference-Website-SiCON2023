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
const fs = require('fs')
require('dotenv').config()

routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json());
routes.use(methodOverride('_method'));
routes.use(upload());
routes.use("/static",express.static("public"))



//@routes Get /upload
//@desc Loads Submit form
routes.get("/upload", async (req, res) => {
    res.render("submitForm")
})

// @routes POST /upload
// @desc Uploads files to DB
routes.post("/upload",async(req,res)=>{
    //File upload 
    if(req.files){
        console.log(req.files);
        var file = req.files.file;
        var filename= file.name;
        console.log(filename);
        var filePath="public/papers/"+filename;
      
      // generating User ID
        const id = await submitPaper.countDocuments();
        let result= null;
        if(id<10){
            result= "SiCONid000"+id.toString()
        }
        else if(id<100 && id>=10){
             result= "SiCONid00"+id.toString();
        }
        else if(id<1000 && id>=100){
            result= "SiCONid0"+id.toString();
       }
       else{
        result= "SiCONid"+id.toString();
   }

        //file moved to static/papers folder and uploaded to database
        file.mv(filePath, async function(err){
            if(err){
                console.log(err)
            }
            else{
                const submittedPapers= new submitPaper({
                    topic: req.body.topic,
                    name: req.body.name,
                    email: req.body.email,
                    Mobile_Number: req.body.phone,
                    topic: req.body.topic,
                    fileName: filename,
                    filePath: filePath,
                    id: result,
                    submitted:true,
                   })
                   const submitted= await submittedPapers.save();

                   // sending mail to reviewer
                   var to="anaypund123@gmail.com";
                   var subject= "Paper of topic "+req.body.topic+" from "+req.body.name;
                   var body="Name: "+req.body.name+"\n"+"ID: "+result+"\n"+"Mail: "+req.body.email+"\n"+"Mobile No.: "+req.body.phone+"\n"+"Topic: "+req.body.topic;
                
                   var transporter= nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'siconinfo@sipnaengg.ac.in',
                        pass:'Si!pna@0209'
                    }
                   })

                   var mailOptions= {
                    from:'siconinfo@sipnaengg.ac.in',
                    to:to,
                    subject:subject,
                    text:body,
                    attachments:[{
                        path:filePath
                    }]
                   }

                   transporter.sendMail(mailOptions, function(err,info){
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Email Sent "+ info.response)

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
                   res.status(201).send("Uploaded Successfully!");
            }
        })
    }

    

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
module.exports = routes;


