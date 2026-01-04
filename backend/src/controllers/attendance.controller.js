const Attendance = require("../models/Attendance.model");
const Employee = require("../models/employee.model");

// Normalize date to midnight
const normalizeDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

exports.checkIn = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const today = normalizeDate();

  const existing = await Attendance.findOne({
    employee: employee._id,
    date: today,
  });

  if (existing)
    return res.status(400).json({ message: "Already checked in today" });

  const attendance = await Attendance.create({
    employee: employee._id,
    date: today,
    checkIn: new Date(),
    status: "PRESENT",
  });

  res.status(201).json(attendance);
};

exports.checkOut = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const today = normalizeDate();

  const attendance = await Attendance.findOne({
    employee: employee._id,
    date: today,
  });

  if (!attendance)
    return res.status(400).json({ message: "No check-in found" });

  attendance.checkOut = new Date();

  const hoursWorked =
    (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);

  if (hoursWorked < 4) {
    attendance.status = "HALF_DAY";
  }

  await attendance.save();
  res.json(attendance);
};

exports.getMyAttendance = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });

  const records = await Attendance.find({ employee: employee._id }).sort({
    date: -1,
  });

  res.json(records);
};

exports.getAllAttendance = async (req, res) => {
  const records = await Attendance.find()
    .populate({
      path: "employee",
      populate: { path: "user", select: "email role" },
    })
    .sort({ date: -1 });

  res.json(records);
};
