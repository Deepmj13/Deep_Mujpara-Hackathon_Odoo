const Leave = require("../models/Leave.model");
const Employee = require("../models/employee.model");

exports.applyLeave = async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;

  const employee = await Employee.findOne({ user: req.user.id });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const leave = await Leave.create({
    employee: employee._id,
    type,
    fromDate,
    toDate,
    reason,
  });

  res.status(201).json(leave);
};

exports.getMyLeaves = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });

  const leaves = await Leave.find({ employee: employee._id }).sort({
    createdAt: -1,
  });

  res.json(leaves);
};

exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate({
      path: "employee",
      populate: { path: "user", select: "email role" },
    })
    .sort({ createdAt: -1 });

  res.json(leaves);
};

exports.updateLeaveStatus = async (req, res) => {
  const { status, adminComment } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const leave = await Leave.findById(req.params.id);
  if (!leave)
    return res.status(404).json({ message: "Leave request not found" });

  leave.status = status;
  leave.adminComment = adminComment;
  await leave.save();

  res.json(leave);
};
