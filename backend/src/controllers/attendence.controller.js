const Attendance = require("../models/Attendance.model");
const Employee = require("../models/employee.model");

const normalizeDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

exports.checkIn = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  const today = normalizeDate();
  const Attendance = await Attendance.findOne({
    employee: employee._id,
    date: today,
  });
  if (!attendance)
    return res.status(400).json({ message: "no check-in found" });

  attendance.checkOut = new Date();
  const hours = attendance.checkOut - (attendance.checkIn / 1000) * 60 * 60;

  if (hours < 4) attendance.status = "Half Day";

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
