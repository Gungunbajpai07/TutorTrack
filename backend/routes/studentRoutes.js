const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Student routes
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

// Attendance route
router.put("/:id/attendance", studentController.updateAttendance);

module.exports = router;
