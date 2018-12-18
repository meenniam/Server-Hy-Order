const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const config = require('./config.js');
const admin = require('firebase-admin');
const db = require('./firebaseApp.js')

//////////////////////////////////////////
/////// username//////// password ////////
//////////////////////////////////////////

router.post('/',(req,res)=>{

 var user = req.body.username.toLowerCase();
 var userID;
 if(validator.isEmail(user)){

   console.log("EMAIL");

   admin.auth().getUserByEmail(user)
  .then(function(userRecord) {
    console.log(userRecord.uid);
    ////////////////////////////////////////////////////////////////////////////
      db.collection('Login').where("username","==",userRecord.uid +"").get()
      .then(docs =>{
        var data={}
        docs.forEach(doc=>{
          data= doc.data()
        })
        console.log(data.username);
        bcrypt.compare(req.body.password,data.password,(err,result)=>{
          if(result){
            const token = jwt.sign({ username : userRecord.uid },config.jwtSecret);
            res.json({token})
            console.log("sucsess!!!");

          }
          else {
            if(userRecord.uid != data.username){
              res.json({message:"This ID does't have"})
            }
            else {
              res.json({message:"password incorrect"})
            }
          }

          //console.log("Login:"+result);
        })
     })
     ////////////////////////////////////////////////////////////////////////////////


  })
  .catch(function(error) {
    console.log("h");
  });


 }else {
   console.log("username");

   admin.auth().getUser(user)
  .then(function(userRecord) {
    console.log(userRecord.uid);
    ////////////////////////////////////////////////////////////////////////////
      db.collection('Login').where("username","==",userRecord.uid +"").get()
      .then(docs =>{
        var data={}
        docs.forEach(doc=>{
          data= doc.data()
        })
        console.log(data.username);
        bcrypt.compare(req.body.password,data.password,(err,result)=>{
          if(result){
            const token = jwt.sign({ username:userRecord.uid },config.jwtSecret);
            res.json({token})
            console.log("sucsess!!!");

          }
          else {
            if(userRecord.uid != data.username){
              res.json({message:"This ID does't have"})
            }
            else {
              res.json({message:"password incorrect"})
            }
          }

          //console.log("Login:"+result);
        })
     })
     ////////////////////////////////////////////////////////////////////////////////

  })
  .catch(function(error) {
      res.json({message:"This ID does't have"})
      console.log("This ID does't have");
  });
 }




})

router.get('/logout',(req,res)=>{
  req.session = null;
  res.render('index',{'isLoggedin':false})
})

router.post('/admin',(req,res)=>{

 var user = req.body.username.toUpperCase();
 var userID;
 console.log(user);
 if(validator.isEmail(user)){

   console.log("EMAIL");

   admin.auth().getUserByEmail(user)
  .then(function(userRecord) {
    console.log(userRecord.uid);
    ////////////////////////////////////////////////////////////////////////////
      db.collection('Login').where("username","==",userRecord.uid +"").get()
      .then(docs =>{
        var data={}
        docs.forEach(doc=>{
          data= doc.data()
        })
        console.log(data.username);
        bcrypt.compare(req.body.password,data.password,(err,result)=>{
          if(result){
            const token = jwt.sign({ username : userRecord.uid },config.jwtSecret);
            res.render('home',{'token':token})
            console.log("sucsess!!!");

          }
          else {
            if(userRecord.uid != data.username){
              res.json({message:"This ID does't have"})
            }
            else {
              res.json({message:"password incorrect"})
            }
          }

          //console.log("Login:"+result);
        })
     })
     ////////////////////////////////////////////////////////////////////////////////


  })
  .catch(function(error) {
    console.log("h");
  });


 }else {
   console.log("username");

   admin.auth().getUser(user)
  .then(function(userRecord) {
    console.log(userRecord.uid);
    ////////////////////////////////////////////////////////////////////////////
      db.collection('Login').where("username","==",userRecord.uid +"").get()
      .then(docs =>{
        var data={}
        docs.forEach(doc=>{
          data= doc.data()
        })
        console.log(data.username);
        bcrypt.compare(req.body.password,data.password,(err,result)=>{
          if(result){
            const token = jwt.sign({ username:userRecord.uid },config.jwtSecret);
            req.session.id = token
            req.session.isLoggedin = true
            req.sessionOptions.maxAge = 60000*60*24;
            res.render('home',{'isLoggedin':true})
            console.log("sucsess!!!");

          }
          else {
            if(userRecord.uid != data.username){
              res.json({message:"This ID does't have"})
            }
            else {
              res.json({message:"password incorrect"})
            }
          }

          //console.log("Login:"+result);
        })
     })
     ////////////////////////////////////////////////////////////////////////////////

  })
  .catch(function(error) {
      res.json({message:"This ID does't have"})
      console.log("This ID does't have");
  });
 }




})

module.exports = router;
