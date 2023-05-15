const userValidator = require("./user.validator");
const {
  newArticleValidationMW,
  updateArticleValidationMW,
  getEntityValidationMW,
} = require("./author.validator");

module.exports = {
  userValidator,
  newArticleValidationMW,
  updateArticleValidationMW,
  getEntityValidationMW,
};
