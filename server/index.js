const express = require('express');
const path = require('path');
const axios = require('axios');
const { db, postTheBrother, retrieveTheBrother } = require('../database/index.js');
const { upload } = require('../aws/s3.js');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
// console.log('single', s3.upload.single)
// console.log({upload})

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});

app.post('/users', (req, res)=> {
  console.log(req.body)
  postTheBrother(req.body, (err, data)=> {
    if (err) {
      res.status(418).send(err)
    } else {
      res.status(201).send(data)
    }
  })
})

app.get('/library', (req, res)=> {
  const email = req.query.email
  retrieveTheBrother(email, (err, data) => {
    if (err) {
      res.status(418).send(err)
    } else {
      res.status(200).send(data[0].books)
    }
  })
})

app.get('/epub', (req, res) => {
  s3.getObject(req.body, (err, data) => {
    if (err){
      res.sendStatus(500)
    } else {
      res.status(200).send(data)
    }
  })
})

app.post('/upload', upload.array('epub'), (req, res)=> {
  console.log({res})
  // console.log(req.body)
  //upload to s3

  // get link from s3
  // post link into db where email
  //
})





// testing
app.get('/users:email', (req, res)=> {
  console.log(req.params)
  retrieveTheBrother(req.params, (err, data)=> {
    if (err) {
      res.status(418).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})
