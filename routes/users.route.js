const express = require("express");

const usersController = require("../controllers/users.controller");

const {
  userValidationSchema,
  loginValidationSchema,
} = require("../middlewares/validationSchema");

const auth = require("../controllers/auth");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/:userId")
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

router.route("/register").post(userValidationSchema(), auth.register);

router.route("/login").post(loginValidationSchema(), auth.login);

module.exports = router;
