const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');


// router.post("/login", (req, res) => {


//  });
 router.post( "/signup", authController.signUp)

  module.exports=router;