const { UserModel } = require("../models/user.model");
const { BlogModel } = require("../models/blog.model");
// Get all published articles
exports.getPublishedArticles = async (req, res, next) => {
  try {
    const {
      author,
      title,
      tags,
      order = "asc",
      order_by = "timestamp,reading_time,read_count",
      page = 1,
      per_page = 20,
    } = req.query;

    // filter
    const findQuery = { state: "published" };

    if (author) {
      findQuery.author = author;
    }
    if (title) {
      findQuery.title = title;
    }
    if (tags) {
      const searchTags = tags.split(",");
      findQuery.tags = { $in: searchTags };
    }

    // sort
    const sortQuery = {};
    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      if (order === "asc") {
        sortQuery[attribute] = 1;
      }
      if (order === "desc" && order_by) {
        sortQuery[attribute] = -1;
      }
    }

    // get all published articles from the database
    const articles = await BlogModel.find(findQuery)
      .populate("author", "firstname lastname email")
      .sort(sortQuery)
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
