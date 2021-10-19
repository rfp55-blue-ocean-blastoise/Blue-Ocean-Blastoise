const express = require("express");
const path = require("path");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const app = express();
const PORT = 3000;

const {
  db,
  postTheBrother,
  retrieveTheBrother,
  updateBooksArrayForUniqueUser,
} = require("../database/index.js");
const upload = multer({ dest: "uploads/" });
const { getObject, uploadFile, getFileStream } = require("../aws/s3.js");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});

// Creates a user and post to MongoDB
app.post("/users", (req, res) => {
  // console.log(req.body);
  postTheBrother(req.body, (err, data) => {
    if (err) {
      res.status(418).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// gives back Book Array for unique user
app.get("/library", (req, res) => {
  const email = req.query.email;
  retrieveTheBrother(email, (err, data) => {
    if (err) {
      res.status(418).send(err);
    } else {
      res.status(200).send(data[0].books);
    }
  });
});

// Upload to S3 and Post Book Title to MongoDB
app.post("/upload", upload.single("epub"), async (req, res) => {
  const file = req.file;
  const { user } = req.body;

  console.log(user, "user");

  const result = await uploadFile(file, file.originalname);
  await unlinkFile(file.path);
  // TODO post to MONGO after successful S3 upload!!
  console.log({ result })

  const book = { link: result.Location, title: result.Key }

  updateBooksArrayForUniqueUser(user, book, (err, data) => {
    if (err) {
      res.status(418).send(err);
    } else {
      res.status(201).send(data);
    }
  })
});

// EXPERIMENTAL

// Retrieves specific EPUB
app.get("/epub", (req, res) => {
  getObject(req.body, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.status(200).send(data);
    }
  });
});

// app.get("/epub/:key", (req, res) => {
//   console.log(req.params);
//   const key = req.params.key;
//   const readStream = getFileStream(key);

//   readStream.pipe(res);
// });
