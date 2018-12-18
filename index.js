const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
const app = express();
const regist = require('./regist.js');
const login = require('./login.js');
const product = require('./product.js');
const getlocation = require('./getlocation.js');
const order = require('./order.js');
const cookieSession =require('cookie-session')
const bodyParser = require('body-parser')
const serviceAccountKey = require('./serviceAccountKey.json')
const UUID = require("uuid-v4");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views','./views')
app.set('view engine','jade')
// Automatically allow cross-origin requests
app.use(cors());
app.use(cookieSession({
  name:'session',
  keys:['secret_key1','secret_key2']
}))


const projectId = 'ezycashbag';

const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
  projectId: projectId,
  keyFilename: serviceAccountKey.json
});


const {
    fileParser
} = require('express-multipart-file-parser');  //
app.use(fileParser({
    rawBodyOptions: {
        limit: '15mb',  //file size limit
    },
    busboyOptions: {
        limits: {
            fields: 20   //Number text fields allowed
        }
    },
}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

const bucket = storage.bucket("ezycashbag.appspot.com");
app.post('/upload', function(req, res, next) {
    let file = req.files[0];
    if (file) {
      uploadImageToStorage(file).then((success) => {
        res.status(200).send({
          status: 'success'
        });
        console.log(success);
      }).catch((error) => {
        console.error(error);
      });
    }


});

const uploadImageToStorage = (file) => {
  let uuid = UUID();
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
            firebaseStorageDownloadTokens: uuid
          }
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(fileUpload.name) + "?alt=media&token=" + uuid
      //console.log(fileUpload.metadata );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
  return prom;
}

// Add middleware to authenticate requests
// build multiple CRUD interfaces:
////////////HOME PAGE///////////
app.get('/',function(req,res){
  if(req.session.isLoggedin){

    res.render('index',{'isLoggedin':true})
  }
  else {
    res.render('index',{'isLoggedin':false})
  }
});

app.get('/maps',function(req,res){
  res.render('maps',{'maps':[{'lat':'77.77','lon':'73.77'},{'lat':'87.77','lon':'73.77'},{'lat':'97.77','lon':'73.77'}]})
});

app.get('/test',function(req,res){
  res.json([{'lat':'55.65','lon':'55.55'},{'lat':'55.75','lon':'55.55'},{'lat':'55.85','lon':'55.55'}])
});

app.get('/home',function(req,res){
  if(req.session.isLoggedin){

    res.render('home',{'isLoggedin':true})
  }
  else {
    res.render('home',{'isLoggedin':false})
  }
});

/////////REGIS USER////

app.use('/regist',regist);
app.use('/login',login);
app.use('/product',product);
app.use('/getlocation',getlocation);
app.use('/order',order);


app.use(express.static('./public'))

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
