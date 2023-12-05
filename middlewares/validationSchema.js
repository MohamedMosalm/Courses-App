const { body } = require("express-validator");

const coursesValidationSchema = () => [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title should be at least 2 chars"),
  body("price").notEmpty().withMessage("Price is required"),
];

const userValidationSchema = () => [
  body("firstName")
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 3 })
    .withMessage("first name must be at least 4 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ min: 3 })
    .withMessage("last name should be at least 4 characters"),
  body("email").notEmpty().withMessage("e-mail is required").isEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const loginValidationSchema = () => [
  body("email").notEmpty().withMessage("e-mail is required").isEmail(),
  body("password").notEmpty().withMessage("Password cannot be empty."),
];

module.exports = {
  coursesValidationSchema,
  userValidationSchema,
  loginValidationSchema,
};
