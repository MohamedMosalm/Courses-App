const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const {
  hashingPassword,
  matchedPassword,
} = require("../utils/passwordHashing");
const generateJWT = require("../utils/generateJWT");

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.createError(
      "User already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await hashingPassword(password);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUser },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.createError(
      "e-mail and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = appError.createError(
      "this e-mail doesn't exit",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const match = await matchedPassword(password, user.password);

  console.log(match);

  if (match) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  }

  const error = appError.createError(
    "incorrect password",
    500,
    httpStatusText.ERROR
  );
  return next(error);
});

module.exports = {
  register,
  login,
};
