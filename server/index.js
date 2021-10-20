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

const upload = multer({ dest: "uploads/" });
const {
  db,
  postTheBrother,
  retrieveTheBrother,
  deleteTheBrother,
  updateBooksArrayForUniqueUser,
  updateTheCFIForUniqueBookForUniqueUser,
} = require("../database/index.js");
const { uploadFile, listObjectsFromBucket } = require("../aws/s3.js");
const {aws_bucket_name, aws_bucket_region} = require("../config.js");


app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});

// Post to MongoDB after successful account sign up
app.post("/users", async (req, res) => {
  try {
    const result = await postTheBrother(req.body);
    res.status(201).send(result);
  } catch (err) {
    res.status(418).send(err);
  }
});

// gives back Book Array for unique user
// req.query = {email}
// returns book array for user if exists.
app.get("/library", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await retrieveTheBrother(email);
    res.status(200).send(result[0].books);
  } catch (err) {
    res.status(418).send(err);
  }
});

// Upload to S3 and Post Book Title to MongoDB
// req.file = {file}
// req.body = {user}
// returns user obj prior to post success
/*
          {
              _id: new ObjectId("616f60bf69ef4a3f8dda2469"),
              email: 'test@test.com',
              books: [ [Object], [Object] ],
              __v: 0
            }
          }
*/
app.post("/upload", upload.single("epub"), async (req, res) => {
  try {
    const file = req.file;
    const { user } = req.body;
    const result = await uploadFile(file, file.originalname);
    await unlinkFile(file.path);
    const book = {
      link: result.Location,
      title: result.Key,
      cfi: "",
      remainingText: "",
    };
    const update = await updateBooksArrayForUniqueUser(user, book);
    res.status(201).send(update);
  } catch (err) {
    res.status(418).send(err);
  }
});

// update CFI and remainingText for book
// req.body = { email, title, cfi, remainingText }
/* returns:
  User:test@test.com
  Book:alice.epub
  UpdatedCFI: epubcfi(/6/14[chap05ref]!/4[body01]/10/2/1:3[2^[1^]])
  remainingText:"These,are...words"
 */
app.put("/library", async (req, res) => {
  try {
    const params = req.body;
    const update = await updateTheCFIForUniqueBookForUniqueUser(params);
    res.status(201).send(update);
  } catch (err) {
    res.status(418).send(err);
  }
});

// delete book from library
// req.body = { email , title}
// returns modifiedCount = <num>
app.delete("/library", async (req, res) => {
  try {
    const result = await deleteTheBrother(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(418).send(err);
  }
});


// Get all Objects in S3
// req.query = { "Bucket": <s3 bucket name>}
// response =
/*
    {
        "Key": "09dc6a71a2bd87b6fb2a79a112a971d2.epub",
        "Etag": "\"a0e1a481a9d2cd4a14444e3bc7ca3320\"",
        "size": 500133,
        "URL": "https://blueocean.s3.us-west-1.amazonaws.com/09dc6a71a2bd87b6fb2a79a112a971d2.epub"
    }
*/
app.get("/listObjects", async (req, res) => {
  try {
    const objects = await listObjectsFromBucket(req.query);
    const list = objects.Contents.map((epub) => {
      return {
        Key: epub.Key,
        Etag: epub.ETag,
        size: epub.Size,
        URL: `https://${aws_bucket_name}.s3.${aws_bucket_region}.amazonaws.com/${epub.Key}`,
      };
    });
    res.status(200).send(list);
  } catch (err) {
    res.status(418).send(err);
  }
});
