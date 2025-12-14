const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let foundBook;
  const author = req.params.author.trim().toLowerCase();
  console.log("author", author);
  const foundBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );
  res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.trim().toLowerCase();
  const foundBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );
  res.send(JSON.stringify(foundBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn.trim();
  const book = books[isbn];
  res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
