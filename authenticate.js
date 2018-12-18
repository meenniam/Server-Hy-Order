const jwt = require('jsonwebtoken');
const config = require('./config.js');
const admin = require('firebase-admin');

var a =  (req , res , next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if(authorizationHeader){
    token = authorizationHeader.split(' ')[1];
  }

  if(token){
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if(err){
        res.status(401).json({ error: 'Failed to authenticate'});
      }else {
        admin.auth().getUser(decoded.username)
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully authentucatin:", userRecord.uid);
          req.curentUserid = userRecord.uid;
          next();
        })
        .catch(function(error) {
          console.log("No such user");
          res.status(404).json({ error: "No such user"});
        });
      }
    });
  }else {
    res.status(403).json({
      error: 'No token provided'
    });
  }
}

module.exports = a;
