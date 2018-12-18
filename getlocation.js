const express = require('express');
const emailExistence = require('email-existence');
const router = express.Router();
const admin = require('firebase-admin');
const db = require('./firebaseApp.js');
var where = require('node-where');

router.post('/', function(req,res){

  var data = {
    "lat": req.body.lat,
    "long": req.body.long,
    "address": req.body.address
  }

  db.collection('Location').doc(req.body.uid).set(data);



});
module.exports = router;
