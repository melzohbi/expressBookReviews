const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully" });
    }
  } else {
    return res.status(400).json({ message: "Username or password missing" });
  }
});

// Task 1: Add a book review
// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   //stringify the books object and send it as a response
//   return res.status(200).send(JSON.stringify(Object.values(books)));
// });

// Task 10: Add a book review using axios
public_users.get("/", async function (req, res) {
  //stringify the books object and send it as a response
  try {
    const books_response = await axios.get("http://api_link/books");
    // check if found
    if (!books_response.data) {
      return res.status(404).json({ message: "Books not found" });
    }
    // return the books
    return res.status(200).send(books_response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   // Retrieve the ISBN from the request parameters
//   const isbn = req.params.isbn;
//   // Search the book in the database given the ISBN
//   if (books.hasOwnProperty(isbn)) {
//     // If valid, return the book details
//     return res.status(200).json(books[isbn]);
//   }
//   // If invalid, return an error message
//   return res.status(400).json({ message: "ISBN not found" });
// });

// Task 11: Get book details based on ISBN using axios
public_users.get("/isbn/:isbn", async function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Search the book in the database given the ISBN
  try {
    const isbn_response = await axios.get("http://api_link/books/isbn/" + isbn);
    // check if found
    if (!isbn_response.data) {
      return res.status(400).json({ message: "ISBN not found" });
    }
    // If found, return the book details
    return res.status(200).json(isbn_response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   //retrieve the author from the request parameters
//   const author = req.params.author;

//   const book_array = Object.entries(books)
//     .filter(([, book]) => book.author === author)
//     .map(([isbn, { author, ...rest }]) => ({ isbn: isbn, ...rest }));

//   if (book_array && book_array.length > 0) {
//     // If valid, return the book details
//     return res.status(200).json({ booksbyauthor: book_array });
//   }
//   // If invalid, return an error message
//   return res.status(400).json({ message: "Author not found" });
// });

// Task 12: Get book details based on author using axios
public_users.get("/author/:author", async function (req, res) {
  //retrieve the author from the request parameters
  const author = req.params.author;

  try {
    const book_author_response = await axios.get(
      "http://api_link/books/author/" + author
    );

    if (!book_author_response.data) {
      return res.status(400).json({ message: "Author not found" });
    }
    // If found, return the book details
    return res.status(200).json(book_author_response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   //retrieve the title from the request parameters
//   const title = req.params.title;
//   const book_array = Object.entries(books)
//     .filter(([, book]) => book.title === title)
//     .map(([isbn, { title, ...rest }]) => ({ isbn: isbn, ...rest }));

//   if (book_array && book_array.length > 0) {
//     // If valid, return the book details
//     return res.status(200).json(book_array);
//   }
//   // If invalid, return an error message
//   return res.status(400).json({ message: "Title not found" });
// });

// Task 13: Get all books based on title using axios
public_users.get("/title/:title", async function (req, res) {
  //retrieve the title from the request parameters
  const title = req.params.title;

  try {
    const book_title_response = await axios.get(
      "http://api_link/books/title/" + title
    );

    if (!book_title_response.data) {
      return res.status(400).json({ message: "Title not found" });
    }
    // If found, return the book details
    return res.status(200).json(book_title_response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //retrieve the isbn from the request parameters
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    // If valid, return the book details
    return res.status(200).json(books[isbn].reviews);
  }
  // If invalid, return an error message
  return res.status(400).json({ message: "ISBN not found" });
});

module.exports.general = public_users;
