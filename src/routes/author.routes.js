const express = require("express");
const { authorController } = require("../controllers");
const {
  newArticleValidationMW,
  updateArticleValidationMW,
  getEntityValidationMW,
} = require("../validators");

const authorRouter = express.Router();

// create a new article
authorRouter.post("/", newArticleValidationMW, authorController.createArticle);

// change state
authorRouter.patch(
  "/edit/state/:articleId",
  getEntityValidationMW,
  updateArticleValidationMW,
  authorController.editState
);

// edit article
authorRouter.patch(
  "/edit/:articleId",
  getEntityValidationMW,
  updateArticleValidationMW,
  authorController.editArticle
);

// delete article
authorRouter.delete(
  "/:articleId",
  getEntityValidationMW,
  authorController.deleteArticle
);

// get all articles created by the author
authorRouter.get("/", authorController.getArticlesByAuthor);

module.exports = authorRouter;
