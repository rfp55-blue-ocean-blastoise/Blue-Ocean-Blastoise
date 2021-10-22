const express = require("express");
const path = require("path");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const app = express();
const PORT = 3001;

const upload = multer({ dest: "uploads/" });
const {
  db,
  createUser,
  retrieveUserDocument,
  deleteBook,
  addBookForUser,
  updateBookmark,
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

// app.get('/signup', (req, res) => {
//   res.redirect('/');
// });
// app.get('/home', (req, res) => {
//   res.redirect('/');
// });
// app.get('/freelibrary', (req, res) => {
//   res.redirect('/');
// });
// app.get('/player', (req, res) => {
//   res.redirect('/');
// });

app.get("/home", async (req, res) => {
  // try {
    // const result = await createUser(req.body);
    // res.status(201).send(result);
  // } catch (err) {
    res.send('hello');
  // }
});
app.post("/account", async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.status(201).send(result);
  } catch (err) {
    res.status(418).send(err);
  }
});


app.get("/account/library", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await retrieveUserDocument(email);
    res.status(200).send(result[0].books);
  } catch (err) {
    res.status(418).send(err);
  }
});


app.post("/account/upload", upload.single("epub"), async (req, res) => {
  try {
    const file = req.file;
    const { email } = req.body;
    const result = await uploadFile(file, file.originalname);
    await unlinkFile(file.path);
    const book = {
      link: result.Location,
      title: result.Key,
      cfi: "",
      remainingText: "",
    };
    const update = await addBookForUser(email, book);
    res.status(201).send(update);
  } catch (err) {
    res.status(418).send(err);
  }
});


app.put("/account/bookmark", async (req, res) => {
  try {
    const update = await updateBookmark(req.body);
    res.status(201).send(update);
  } catch (err) {
    res.status(418).send(err);
  }
});


app.delete("/account/library", async (req, res) => {
  try {
    const result = await deleteBook(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(418).send(err);
  }
});


app.get("/library", async (req, res) => {
  try {
    const objects = await listObjectsFromBucket({"Bucket": aws_bucket_name});
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

app.post("/account/library", async (req, res) => {
  try {
    const { email } = req.body;
    const book = {
      link: req.body.link,
      title: req.body.title,
      cfi: "",
      remainingText: "",
    };
    const update = await addBookForUser(email, book);
    res.status(201).send(update);
  } catch (err) {
    res.status(418).send(err);
  }
})
