//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const saltrounds = 5;

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


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltrounds, function(err, hash) {
    const user = new User({
      Email: req.body.username,
      Password: hash
    });
    user.save(function(err) {
      if (!err) {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function(req, res) {
  User.findOne({
    Email: req.body.username
  }, function(err, userpage) {
    if (err) {
      console.log(err);
    } else {
      if (userpage) {
        bcrypt.compare(req.body.password, userpage.Password, function(err, result) {
          if (result===true){
            res.render("secrets");
          }
        });
        }
    }
  });
});

app.listen("3000", function() {
  console.log("Server started on port 3000.")
});
