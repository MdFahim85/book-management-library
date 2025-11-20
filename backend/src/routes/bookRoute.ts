import {
  addBook,
  deleteBook,
  editBook,
  getBooks,
} from "../controllers/booksController";

const express = require("express");
const router = express.Router();

router.route("/").get(getBooks).post(addBook);
router.route("/:bookId").put(editBook).delete(deleteBook);

module.exports = router;
