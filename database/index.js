const mongoose = require("mongoose");
const config = require("../config.js");

mongoose.connect(
  `mongodb+srv://brother:${config.mongoPW}@bookbrother.s3z1y.mongodb.net/brotherdb?retryWrites=true&w=majority`
);

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongoose connection error");
});

db.once("open", () => {
  console.log("mongoose connected successfully");
});

let Brothers = mongoose.Schema({
  email: String,
  books: [{ Link: String, Title: String, CFI: String, remainingText: String }],
});

let Brother = mongoose.model("Brother", Brothers);

let retrieveTheBrother = (email, callback) => {
  Brother.find({ email })
    .then((results) => callback(null, results))
    .catch((err) => callback(err));
};

let postTheBrother = (body, callback) => {
  const { email, books } = body;
  Brother.create({ email, books })
    .then((results) => callback(null, results))
    .catch((err) => callback(err));
};

let postTheHomie = (email, book, callback) => {
  Brother.findOneAndUpdate({ email }, { $push: { books: book } })
    .then((results) => callback(null, results))
    .catch((err) => console.log(err, "err from posthomie"));
  //  update mongodb with link, title based on user context
  //  send
};

// let updateTheHomie = (, , callback) =>  {

// }

module.exports = {
  db,
  retrieveTheBrother,
  postTheBrother,
  postTheHomie,
};
