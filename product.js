const express = require('express');
const emailExistence = require('email-existence');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const db = require('./firebaseApp.js');

router.get('/',function(req,res){

  db.collection('Product').get()
  .then((docs)=>{
    var data=[]
    //console.log(datas);
    docs.forEach((doc)=>{
      //console.log(doc.id);
      data.push(doc.data())
    })
    res.json(data)
  })

});
router.get('/admin',function(req,res){
  if(req.session.isLoggedin)
  {
    db.collection('Product').get()
    .then((docs)=>{
      var data=[]
      //console.log(datas);
      docs.forEach((doc)=>{
        //console.log(doc.id);
        data.push(doc.data())
      })
      res.render('product',{'data':data,'isLoggedin':true})
    })

  }
  else
    res.render('product',{'isLoggedin':false})


});
module.exports = router;
