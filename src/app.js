const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
require("./db/connection");
const path = require("path");
const hbs = require("hbs");
const Register = require("./models/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req,res) =>{
    res.render("index");
})

app.get("/registration", (req,res)=>{
    res.render("registration");
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post("/registration", async (req,res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        //console.log(req.body.name);

        if(password === confirmpassword){
            const RegisterEmployee = new Register({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword,
                number : req.body.number
            })

            const token = await RegisterEmployee.generateAuthToken();

            const registered = await RegisterEmployee.save();
            res.status(201).render("index")
        }

        else{
            res.status(400).send("Password not matching");
        }

    }catch(error){
        res.status(400).send(error);
    }
})

app.post("/login", async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        const isMatch = bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        //console.log("token is " + token);

        if(isMatch){   //if(useremail.password === password)
            res.status(201).render("index");
        }else{
            res.send("Incorrect Login");
        }
    }
    catch(error){
        res.status(400).send("Invalid Login");
    }
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})