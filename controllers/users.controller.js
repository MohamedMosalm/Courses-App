let User = require("../models/user.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = +query.limit || 10;
  const page = +query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { users },
  });
});

const getUser = asyncWrapper(async (req, res, next) => {
  const id = req.params.userId;
  const user = await User.findById(id, { __v: false, password: false });
  if (!user) {
    const error = appError.createError("User not found", 404, FAIL);
    return next(error);
  }
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const data = await User.deleteOne({ _id: req.params.userId });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

const updateUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.createError(
      result.array(),
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const id = req.params.userId;
  const updatedUser = await User.updateOne(
    { _id: id },
    { $set: { ...req.body } }
  );

  return res
    .status(200)
    .send({ status: httpStatusText.SUCCESS, data: { updatedUser } });
});

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
