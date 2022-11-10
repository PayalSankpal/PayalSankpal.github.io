//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/usersDB");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  Email: String,
  Password: String
});

const secret = "Thisisourlittlesecrect.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["Password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req,res){
  const user = new User ({
    Email: req.body.username,
    Password: req.body.password
  });
  user.save(function(err){
    if(!err){res.render("secrets");}
  });
});

app.post("/login", function(req, res){
  User.findOne({Email: req.body.username}, function(err, userpage){
      if (err){console.log(err);}
      else{
        if(userpage){
          if(userpage.Password === req.body.password){
            res.render("secrets");
          }else{
            res.render("home");
          }
        }
      }
    });
});

app.listen("3000", function(){
  console.log("Server started on port 3000.")
});