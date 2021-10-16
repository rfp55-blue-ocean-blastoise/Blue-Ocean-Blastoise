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
  Email: String,
  Books: [{ Link: String, Title: String, CFI: String }]
});

let Brother = mongoose.model('Brother', Brothers);


// REST API


let retrieveTheBrother = (email, callback) => {
  Brother.find({email})
  .then((results) => callback(null, results))
  .catch( err => callback(err));
}

// let postTheBrother = (, , callback) => {
 // Upload data to s3
 // get the link from s3
 // update mongodb with link
 // send
// }

// let postEpub = (, , callback) => {

// }

// let updateTheBrother = (, , callback) =>  {

// }

// let removeTheHomie = (condition, callback) => {

// }


module.exports = {
  db,
  retrieveTheBrother,
};
