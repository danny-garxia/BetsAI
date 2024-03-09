const express = require("express");
const router = express.Router();






router.get( "/login", (req, res) => {
    // res.send("<h1> HomePage </h>!" )
    res.render("index")
 });
 router.get( "/signup", (req, res) => {
     // res.send("<h1> HomePage </h>!" )
     res.render("signUp")
  });
  router.get( "/", (req, res) => {
     // res.send("<h1> HomePage </h>!" )
     res.render("home")
  });

  module.exports=router;