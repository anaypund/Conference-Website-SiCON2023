const express = require('express');
const mongoose = require('mongoose');
const routes = express.Router();
const Register= require('../models/registration')
const submitPaper = require('../models/papers')
const login = require('../models/login')
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
const axios = require('axios')
const Path = require('path');
const { urlencoded } = require('body-parser');
const { Console } = require('console');
require('dotenv').config()

routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json());
routes.use(methodOverride('_method'));
routes.use(upload());
routes.use("/static",express.static("public"))


routes.get("/", (req,res)=>{
    res.render("index");
})

routes.post("/",async (req,res)=>{
    let result=req.body.id;
    let user=await submitPaper.findOne({id:result})
    console.log(user.email)
    console.log(result)
    console.log(req.files);
    if (req.files){
                let resultFile= result+".pdf"
                var file = req.files.file;
                file.name=resultFile;
                var filename= file.name;
                console.log(filename);
                var filePath;
                console.log(user.topic);
                if(user.topic==="ML"){
                    filePath="db/recipts/ML/"+filename;
                }
                else if(user.topic==="IOT"){
                    filePath="db/recipts/IOT/"+filename;
                }
                else if(user.topic==="Big_Data"){
                    filePath="db/recipts/BD/"+filename;
                }
                else{
                    filePath="db/recipts/OTH/"+filename;
                }
                        
                //file moved to static/recipts folder and uploaded to database
                file.mv(filePath, async function(err){
                    if(err){
                        console.log(err)
                        // res.status(401).redirect("/error")

                    }
                    else{
                        const application= await submitPaper.findOneAndUpdate({id: result}, {$set:{recipt: "checked"}},{upsert:true,runValidators:true})
                        const application2= await submitPaper.findOneAndUpdate({id: result}, {$set:{reciptPath:filePath}},{upsert:true,runValidators:true})
                            
                            
                        // sending mail to reviewer
                        var to="anaypund123@gmail.com"; //add some field
                        var subject= "Payment Recieved "+result+" from "+user.name;
                        var body="Name: "+user.name+"\n"+"ID: "+result+"\n"+"Mail: "+user.email+"\n"+"Mobile No.: "+user.Mobile_Number+"\n"+"Topic: "+user.topic+"\n"+"Gender: "+user.gender+"\n"+"Submission Mode: "+user.mode+"\n"+"Designation: "+user.designation+"\n"+"University: "+req.body.college+"\n"+"Country: "+req.body.country
                        
                        
                        var transporter= nodemailer.createTransport({
                            service:'gmail',
                            auth:{
                                user:'siconinfo@sipnaengg.ac.in',//add some field
                                pass:'Si!pna@0209' //add some field
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
                            to:user.email,
                            subject:"Greetings From Team SiCON 2023!",
                            text:"Hey "+user.name+" Thank You. We are very pleased to have you as a part of this conference.\n\n\nWe recieved Your payment confirmation from your SiCON ID:\n\n"+ result+"\n\nPlease wait till we send you the confirmation email."
                            +"\n Thank You\n",
                            attachments:[{
                                path:filePath
                            },{
                                path:"public/images/Flyer.jpeg"
                            }]
                        }
/*************************************Email Deliver******************************************/
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
            /*************************************Delivery Over**********************************/
                        res.status(201).redirect('/success');
                    
                }})
            }else{
                console.log('error exe')
            }
    }

)

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
            let tempTopic;
            let finalTopic;
            let topicOthers= req.body.topicOthers;
            if(req.body.topic==="O"){
                tempTopic="OTH";
                finalTopic= topicOthers;
            }
            else{
                if(req.body.topic === "Big_Data"){
                    tempTopic="BD"
                }
                else{
                    tempTopic=req.body.topic
                }
                finalTopic=req.body.topic;
            }
            console.log(finalTopic);
        //File upload 
            if(req.files){
                // generating User ID
                const id = await submitPaper.countDocuments({"topic": finalTopic});
                let result= null;
                
                if(id<10){
                    result= "SiCON"+tempTopic+"000"+(id+1).toString()
                }
                else if(id<100 && id>=10){
                    result= "SiCON"+tempTopic+"00"+(id+1).toString();
                }
                else if(id<1000 && id>=100){
                    result= "SiCON"+tempTopic+"0"+(id+1).toString();
                }
                else{
                    result= "SiCON"+tempTopic+id.toString();
                }
            // End Generating ID
                let resultFile= result+".docx"

                console.log(req.files);
                var file = req.files.file;
                file.name=resultFile;
                var filename= file.name;
                console.log(filename);
                var filePath;
                if(finalTopic==="ML"){
                    filePath="db/papers/ML/"+filename;
                }
                else if(finalTopic==="IOT"){
                    filePath="db/papers/IOT/"+filename;
                }
                else if(finalTopic==="Big_Data"){
                    filePath="db/papers/BD/"+filename;
                }
                else{
                    filePath="db/papers/OTH/"+filename;
                }
            
                let name= req.body.prefix+" "+req.body.firstname+" "+req.body.lastname;
            
                //file moved to static/papers folder and uploaded to database
                file.mv(filePath, async function(err){
                    if(err){
                        console.log(err)
                        // res.status(401).redirect("/error")

                    }
                    else{
                            
                            const submittedPapers= new submitPaper({
                                topic: finalTopic,
                                name: name,
                                email: req.body.email,
                                gender:req.body.gender,
                                Mobile_Number: req.body.Mobile_Number,
                                submissionMode: req.body.mode,
                                designation: req.body.designation,
                                university: req.body.college,
                                country: req.body.country,
                                fileName: filename,
                                filePath: filePath,
                                id: result,
                                recipt: null,
                                reciptPath: null
                               })
                               
                                   const submitted= await submittedPapers.save();
                            
                        // sending mail to reviewer
                        var to="anaypund123@gmail.com"; //add some field
                        var subject= "Paper of topic "+finalTopic+" from "+name;
                        var body="Name: "+name+"\n"+"ID: "+result+"\n"+"Mail: "+req.body.email+"\n"+"Mobile No.: "+req.body.Mobile_Number+"\n"+"Topic: "+finalTopic+"\n"+"Gender: "+req.body.gender+"\n"+"Submission Mode: "+req.body.mode+"\n"+"Designation: "+req.body.designation+"\n"+"University: "+req.body.college+"\n"+"Country: "+req.body.country
                        
                        
                        var transporter= nodemailer.createTransport({
                            service:'gmail',
                            auth:{
                                user:'siconinfo@sipnaengg.ac.in',//add some field
                                pass:'Si!pna@0209' //add some field
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
/*************************************Email Deliver******************************************/
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
            /*************************************Delivery Over**********************************/
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
    // const loginUser= new login({
    //     email: "anaypund123@gmail.com",
    //     password:"anay@123",
    //    })
    //    const registered= await loginUser.save();
})

routes.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user= await login.findOne({email:email});
        if(password===user.password){
            res.status(201).redirect("/api/v1/admin");
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



/**********************************************************ADMIN PANEL**********************************************************************/
routes.get('/api/v1/admin', async (req,res) => {
    // res.status(200).send("<a href='/api/v1/admin/ML'>ALL MACHINE LEARNING APPLICATIONS</a> <br><a href='/api/v1/admin/IOT'>ALL IOT APPLICATIONS</a><br><a href='/api/v1/admin/BD'>ALL BIG DATA APPLICATIONS</a>");
    // const topic = req.body.topic;
    // const name = req.body.name;
    // const email = req.body.email;
    // const id = req.body.id;
    // const filePath = req.body.filePath;
    const { topic, name, email, id, sort, fileName, reciptPath, Delete}= req.query;
    // const {sort}=req.query;
    const queryObject={};
    // if(Delete){
    //     const id= Delete;
    //     console.log("hii")
    //     console.log(id);
    // }
    if(fileName){
        let tempCollection=await submitPaper.findOne({fileName:fileName})
            const filePath =  tempCollection.filePath;
            res.download(
                filePath, 
                fileName, // Remember to include file extension
                (err) => {
                    if (err) {
                        console.log(err)
                    }
            });
        }
    if(reciptPath){
        let tempCollection=await submitPaper.findOne({reciptPath:reciptPath})
            const filePath =  tempCollection.reciptPath;
            res.download(
                filePath, 
                filePath, // Remember to include file extension
                (err) => {
                    if (err) {
                        console.log(err)
                    }
            });
        }
        
    
    
    if(topic){
    queryObject.topic= topic
    }
    if(name){
        queryObject.name={$regex:name, $options:'i'}
    }
    if(id){
        queryObject.id={$regex:id, $options:'i'}
    }
    if(email){
        queryObject.email={$regex:email, $options:'i'}
    }
    let result=  submitPaper.find(queryObject);
    // console.log(queryObject)
    if(sort){
        const sortList= sort.split(',').join(' ');
        result= result.sort(sortList)
    }
    else{
        result= result.sort('id')
    }
    const getAll = await result;
    
    
    res.status(200).render("admin",{
        getAll: getAll,
        nbHits:getAll.length
    });
    
})
routes.delete(async(req,res)=>{
        const {id:DeleteButton}=req.params
        try {
            const task=await submitPaper.findOneAndDelete({_id:DeleteButton})
            if(!DeleteButton)
            {
                return res.status(404).json({msg: 'application not found'})
            }
            return res.status(200)
        } catch (error) {
            return res.status(500).json({error: error})
        }
    }

)


/********************************************************END ADMIN PANEL********************************************************************/


module.exports = routes;


