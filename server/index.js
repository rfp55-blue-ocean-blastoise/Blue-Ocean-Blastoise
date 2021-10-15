const express = require('express');
const path = require('path');
const axios = require('axios');
const { db } = require('../database/index.js');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});
