const Employee = require("../models/employee.model");

exports.getMyProfile = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id }).populate(
    "user",
    "email role"
  );

  if (!employee)
    return res.status(404).json({ message: "Employee profile not found" });
  res.json(employee);
};

exports.updateMyProfile = async (req, res) => {
  const allowedFields = ["phone", "department"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) updates[field] = req.body[field];
  });

  const employee = await Employee.findOneAndUpdate(
    {
      user: req.user.id,
    },
    updates,
    { new: true }
  );

  res.json(employee);
};

exports.getAllEmployees = async (req, res) => {
  const employee = await Employee.find().populate("user", "email role");
  res.json(employee);
};
