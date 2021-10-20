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
  books: [{ Link: String, Title: String, CFI: String }]
});

let Brother = mongoose.model('Brother', Brothers);


let retrieveTheBrother = (email, callback) => {
  Brother.find({email})
  .then((results) => callback(null, results))
  .catch( err => callback(err));
}

let postTheBrother = (body, callback) => {
  const { email, books } = body;
  Brother.create({ email, books }, (err, data) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  })
}

// let postEpub = (, , callback) => {
  //  Upload data to s3
  //  get the link from s3
  //  update mongodb with link
  //  send
// }

// let updateTheBrother = (, , callback) =>  {

// }

// let removeTheHomie = (condition, callback) => {

// }


module.exports = {
  db,
  retrieveTheBrother,
  postTheBrother
};
