const express = require("express");
const { getEntityValidationMW } = require("../validators/index");
const { blogController } = require("../controllers");

const blogRouter = express.Router();

blogRouter.get("/", blogController.getPublishedArticles);

blogRouter.get("/:articleId", getEntityValidationMW, blogController.getArticle);

module.exports = blogRouter;
