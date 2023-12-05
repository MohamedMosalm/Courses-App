let Course = require("../models/course.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = +query.limit || 10;
  const page = +query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { courses },
  });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    return res.json({ status: SUCCESS, data: { course } });
  } else {
    const error = appError.createError(
      "Course not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.createError(
      errors.array(),
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { course: newCourse },
  });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = appError.createError(result.array(), 400, FAIL);
    return next(error);
  }
  const updatedCourse = await Course.updateOne(
    { _id: req.params.id },
    { $set: { ...req.body } }
  );
  return res.status(200).send({ status: SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const data = await Course.deleteOne({ _id: req.params.courseId });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
