const express = require('express');
const emailExistence = require('email-existence');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const db = require('./firebaseApp.js');
const authenticate = require('./authenticate.js')

router.post('/',authenticate ,(req,res) => {
    res.status(201).json({ success: true});
    console.log(req.curentUserid);
});

module.exports = router;
