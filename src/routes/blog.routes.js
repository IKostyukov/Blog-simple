const express = require("express");
const { blogController } = require("../controllers");

const blogRouter = express.Router();

blogRouter.get("/", blogController.getPublishedArticles);

blogRouter.get("/:articleId", blogController.getArticle);

module.exports = blogRouter;
