const express = require('express');
const path = require('path');
const axios = require('axios');
const { db } = require('../database/index.js');
const gTTS = require('gtts');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/audio', (req, res) => {
  console.log(req.body);
  res.status(200).send('pasta');
  var gtts = new gTTS(req.body.data, 'en');
  var gtts2 = new gTTS('“The Indian Sea breedeth the most and the biggest fishes that are: among which the Whales and Whirlpooles called Balaene, take up as much in length as four acres or arpens of land.”\n' +
  '—HOLLAND’S PLINY.\n', 'en');

  gtts2.save('Voice.mp3', function (err, result){
      if(err) { throw new Error(err); }
      console.log("Text to speech converted!");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});
