const mongoose = require('mongoose');
const config = require('../config.js');

mongoose.connect(
  `mongodb+srv://brother:${config.mongoPW}@bookbrother.s3z1y.mongodb.net/brotherdb?retryWrites=true&w=majority`,
);

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const Brothers = mongoose.Schema({
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

const Brother = mongoose.model('Brother', Brothers);

const createUser = async (body) => {
  try {
    const { email, books } = body;
    const result = await Brother.create({ email, books });
    return result;
  } catch (err) {
    return err;
  }
};

const retrieveUserDocument = async (email) => {
  try {
    const result = await Brother.find({ email });
    return result;
  } catch (err) {
    return err;
  }
};

const addBookForUser = async (email, book) => {
  try {
    const { title } = book;
    const result = await Brother.find({ email, 'books.title': title });
    if (result.length === 0) {
      const books = await Brother.findOneAndUpdate(
        { email },
        { $push: { books: book } },
      );
      return books;
    }
    return `Book: ${title} has already been uploaded`;
  } catch (err) {
    return err;
  }
};

const updateBookmark = async ({
  email, id, cfi, remainingText,
}) => {
  try {
    const result = await Brother.findOneAndUpdate(
      { email, 'books._id': id },
      { $set: { 'books.$.cfi': cfi, 'books.$.remainingText': remainingText } },
    );
    if (result === null) {
      return `Email ${email} does not have the book in their library. Results:${result}`;
    }
    const split = remainingText.split(' ');
    return `Email: ${email}
      UpdatedCFI: ${cfi}
      remainingText: ${split[0]}, ${split[1]}... ${split[split.length - 1]}`;
  } catch (err) {
    return err;
  }
};

const deleteBook = async ({ email, id }) => {
  try {
    // const { email, id } = body;
    const results = await Brother.updateOne(
      { email },
      { $pull: { books: { _id: id } } },
    );
    if (results.modifiedCount === 0) {
      return `modifiedCount = ${results.modifiedCount}`;
    }
    return `modifiedCount = ${results.modifiedCount}`;
  } catch (err) {
    return err;
  }
};

module.exports = {
  db,
  retrieveUserDocument,
  createUser,
  addBookForUser,
  updateBookmark,
  deleteBook,
};
