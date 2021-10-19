const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const fsPromises = require('fs').promises;
// const { db } = require('../database/index.js');
const gTTS = require('gtts');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
var file = 1;

app.post('/audio', (req, res) => {
  console.log(req.body);
  var gtts = new gTTS(req.body.data, 'en');
  // let audioFile = new `./public/TextToAudio/Voice${file}.mp3`);
  // console.log('CHECKING', audioFile.exists());
  fs.readFile(`./public/TextToAudio/Voice${file}.mp3`, (err, results) => {
     if (err)  {
      gtts.save(`./public/TextToAudio/Voice${file}.mp3`, function (err, result) {
        if (err) { console.log(err); }
        file === 1 ? file++ : file--
        console.log("Text to speech converted in else!");
      });
     } else {
      fsPromises.rm(`./public/TextToAudio/Voice${file}.mp3`)
      .then(() => {
        gtts.save(`./public/TextToAudio/Voice${file}.mp3`, function (err, result) {
          if (err) { console.log(err); }
          file === 1 ? file++ : file--
          console.log("Text to speech converted in if statement!");
        });
      })
      .then(() => res.sendStatus(200))
      .catch((error) => console.log(error))
     }
  })
  // if (audioFile.exists()) {
  //   fsPromises.rm(`./public/TextToAudio/Voice${file}.mp3`)
  //     .then(() => {
  //       gtts.save(`./public/TextToAudio/Voice${file}.mp3`, function (err, result) {
  //         if (err) { console.log(err); }
  //         file === 1 ? file++ : file--
  //         console.log("Text to speech converted in if statement!");
  //       });
  //     })
  //     .then(() => res.sendStatus(200))
  //     .catch((error) => console.log(error))
  // } else {
  //   gtts.save(`./public/TextToAudio/Voice${file}.mp3`, function (err, result) {
  //     if (err) { console.log(err); }
  //     file === 1 ? file++ : file--
  //     console.log("Text to speech converted in else!");
  //   })
  //   res.sendStatus(200)
  // }
});

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});
