//jshint esversion:6
require('dotenv').config();
const express =require("express");
const bodyParser =require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/secretsDB");
const userSchema=new mongoose.Schema({
    email: String,
    password: String,
});
// const secret="This is our little secret";
//  whic is moved to .env file
console.log(process.env.API_KEY);

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptionFields:["password"]});
const User=new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });     
    newUser.save().then(() => {
        res.render("login");  
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send("Error occurred during registration.");
    });;
    });
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;      
    User.findOne({email:username}).then(foundUser=>{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }).catch(err=>{
            console.log(err);
        });
    });
app.listen(3000,function(){   
    console.log("Server is running");    
});