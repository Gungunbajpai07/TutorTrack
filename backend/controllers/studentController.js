const Student = require("../models/Student");

// Get all students for logged-in tutor
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ tutor: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("COLLECTION NAME:", Student.collection.name);
    console.log("TOTAL STUDENTS (for tutor):", students.length);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student by ID (for logged-in tutor)
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      tutor: req.user._id,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create new student for logged-in tutor
exports.createStudent = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      tutor: req.user._id,
    };
    const student = new Student(payload);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student (only if owned by tutor)
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { _id: req.params.id, tutor: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student (only if owned by tutor)
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({
      _id: req.params.id,
      tutor: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update attendance (increment by 1, only if owned by tutor)
exports.updateAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      tutor: req.user._id,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.attendance = (student.attendance || 0) + 1;
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
