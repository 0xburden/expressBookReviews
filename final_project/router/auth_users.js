const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  console.log("made it to this route");
  const isbn = req.params.isbn;
  const review = req.body.review;
  const book = books[isbn];
  if (book && req.session.authorization.username) {
    books[isbn].reviews[req.session.authorization.username] = review;
    res.status(201).json({ message: "review added" });
    return;
  }
  res.status(500).json({ message: "Unable to add or modify review" });
});

regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && req.session.authorization.username) {
    delete books[isbn].reviews[req.session.authorization.username];
    res.status(200).json({ message: "review deleted" });
    return;
  }
  res.status(500).json({ message: "unable to delete review" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
