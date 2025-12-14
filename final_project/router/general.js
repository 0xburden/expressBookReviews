const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  function doesExist(username) {
    if (!users.length) {
      return false;
    }
    return users.map((user) => user.username).includes(username);
  }

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(500).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const bookPromise = new Promise((resolve, _reject) => {
    resolve(books);
  });
  const bookResponse = await bookPromise;
  res.json(bookResponse);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const bookPromise = new Promise((resolve, _reject) => resolve(books));
  const bookResponse = await bookPromise;
  res.send(JSON.stringify(bookResponse[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let foundBook;
  const author = req.params.author.trim().toLowerCase();
  const bookPromise = new Promise((resolve, _reject) => resolve(books));
  const bookResponse = await bookPromise;
  const foundBooks = Object.values(bookResponse).filter(
    (book) => book.author.toLowerCase() === author
  );
  res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.trim().toLowerCase();
  const bookPromise = new Promise((resolve, _reject) => resolve(books));
  const bookResponse = await bookPromise;
  const foundBooks = Object.values(bookResponse).filter(
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
