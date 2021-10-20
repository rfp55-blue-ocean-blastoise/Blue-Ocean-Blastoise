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
  email: {
    type: String,
    unique: true,
  },
  books: [
    {
      link: String,
      title: String,
      cfi: String,
      remainingText: String,
    },
  ],
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

let updateBooksArrayForUniqueUser = (email, book, callback) => {
  const { link, title, cfi, remainingText } = book;
  // TODO : DOUBLE CHECK THE FUNCTION BELOW
  Brother.find({ email, "books.title": title })
    .then((results) => {
      if (results.length === 0) {
        Brother.findOneAndUpdate({ email }, { $push: { books: book } })
          .then((results) => callback(null, results))
          .catch((err) =>
            console.log(err, "err from updateBooksArrayForUniqueUser")
          );
      } else {
        callback(null, "This book already exists");
      }
    })
    .catch((err) => callback(err));
};

let updateTheCFIForUniqueBookForUniqueUser = (params, callback) => {
  const { email, title, cfi, remainingText } = params;
  Brother.findOneAndUpdate(
    { email: email, "books.title": title },
    { $set: { "books.$.cfi": cfi, "books.$.remainingText": remainingText } }
  )
    .then((results) => callback(null, results))
    .catch((err) =>
      console.log(err, "err from updateTheCFIForUniqueBookForUniqueUser")
    );
};

let deleteTheBrother = (body, callback) => {
  const { email, title} = body;
  // need to query by email

  // Brother.find({ email, "books.title": title })
  // .then((results) => {
  //   // console.log(results[0].books)
  //   const flamingo = results[0].books
  //   const lol = flamingo.filter((book) => book.title=== title)
  //   const id = lol[0]._id
  //   console.log('id of object to remove', id)
    Brother.updateOne({email}, { $pull: { books : {title: title}}})
      .then((results) => callback(results))
      .catch((err) => callback(err, 'lmao'))
  // })
  // .catch((err)=> console.log(err))


  // Brother.findOneAndUpdate(
  //   { email: email, "books.title": title },
  //   { $pull : {
  //     books : { $in:
  //     }
  //   }}
  // )
  // access books array
  // pull book where query = title

}



module.exports = {
  db,
  retrieveTheBrother,
  postTheBrother,
  updateBooksArrayForUniqueUser,
  updateTheCFIForUniqueBookForUniqueUser,
  deleteTheBrother,
};
