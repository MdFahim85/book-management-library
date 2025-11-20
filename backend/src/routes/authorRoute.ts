import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  getAuthorBooks,
  getAuthors,
} from "../controllers/authorController";

const express = require("express");
const router = express.Router();

router.route("/").get(getAuthors).post(addAuthor);
router
  .route("/:authorId")
  .get(getAuthorBooks)
  .put(editAuthor)
  .delete(deleteAuthor);

module.exports = router;
