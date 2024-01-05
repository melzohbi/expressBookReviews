const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //check is the username is valid
  let user = users.find((user) => user.username === username);
  if (user) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, "ASecretKey", {
        expiresIn: 60 * 60,
      });
      req.session.authorization = { accessToken, username };
      return res.status(200).json({ message: "User logged in successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }
  } else {
    return res.status(400).json({ message: "Username or password missing" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (isbn && review) {
    if (req.session.authorization) {
      const username = req.session.authorization["username"];

      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.reviews && book.reviews.length > 0) {
          let review_index = book.reviews.findIndex(
            (review) => review.username === username
          );
          if (review_index >= 0) {
            book.reviews[review_index].review = review;
          } else {
            book.reviews.push({ username: username, review: review });
          }
        } else {
          book.reviews = [{ username: username, review: review }];
        }
        return res.status(200).json({ message: "Review added successfully" });
      } else {
        return res.status(404).json({ message: "ISBN not found" });
      }
    } else {
      return res.status(401).json({ message: "User not logged in" });
    }
  } else {
    return res.status(422).json({ message: "ISBN or review missing" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
    if (req.session.authorization) {
      const username = req.session.authorization["username"];

      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.reviews && book.reviews.length > 0) {
          let review_index = book.reviews.findIndex(
            (review) => review.username === username
          );
          if (review_index >= 0) {
            book.reviews.splice(review_index, 1);
            return res
              .status(200)
              .json({ message: "Review deleted successfully" });
          } else {
            return res.status(404).json({ message: "Review not found" });
          }
        } else {
          return res.status(404).json({ message: "Review not found" });
        }
      } else {
        return res.status(404).json({ message: "ISBN not found" });
      }
    } else {
      return res.status(401).json({ message: "User not logged in" });
    }
  } else {
    return res.status(422).json({ message: "ISBN missing" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
