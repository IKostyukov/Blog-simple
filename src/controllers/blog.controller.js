const BlogModel = require("../models/blog.model");

// Get all published articles
exports.getPublishedArticles = async (req, res, next) => {
  try {
    const { author, title, page = 1, per_page = 20 } = req.query;

    // filter
    const findQuery = { state: "published" };

    if (author) {
      findQuery.author = author;
    }
    if (title) {
      findQuery.title = title;
    }

    // get all published articles from the database
    const articles = await BlogModel.find(findQuery)
      .populate("author", "firstname lastname email")
      .skip(page)
      .limit(per_page);

    return res.status(200).json({
      message: "Request successful",
      articles: articles,
    });
  } catch (error) {
    return next(error);
  }
};

// Get article by ID
exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    const article = await BlogModel.findById(articleId).populate(
      "author",
      "firstname lastname email"
    );
    if (!article) {
      return res.status(404).json({ message: "Not found" });
    }
    article.readCount += 1; // increment read count
    await article.save();

    return res.status(200).json({
      message: "Request successful",
      article: article,
    });
  } catch (error) {
    return next(error);
  }
};
