const express = require("express");
const { coursesValidationSchema } = require("../middlewares/validationSchema");

const coursesController = require("../controllers/courses.controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");

const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(verifyToken, coursesValidationSchema(), coursesController.addCourse);

router
  .route("/:courseId")
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
