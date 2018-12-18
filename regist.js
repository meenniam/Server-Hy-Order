const express = require('express');
const emailExistence = require('email-existence');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const db = require('./firebaseApp.js');




router.post('/adduser',(req,res,next)=>{

  admin.auth().createUser({
    uid: req.body.uid.toLowerCase(),
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    displayName: req.body.displayName
  })
    .then(function(userRecord) {

      bcrypt.genSalt(10, function(err, salt) {
         bcrypt.hash(req.body.password, salt, function(err, hash) {
           // Store hash in your password DB.
           var data = {
             "username": req.body.uid.toLowerCase(),
             "password": hash
           }
           db.collection('Login').doc().set(data)
           .then(()=>{
            console.log("Successfully created new user indatabase login:", userRecord.uid);
           })
         });
       });

      console.log("Successfully created new user:", userRecord.uid);
      res.send("Successfully created new user")
    })
    .catch(function(error) {
      console.log("Error creating new user:", error.code);
      res.json({message: error.code })

    });




});

module.exports = router;
