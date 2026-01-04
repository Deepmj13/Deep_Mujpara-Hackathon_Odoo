const Payroll = require("../models/Payroll.model");
const Employee = require("../models/employee.model");
const Attendance = require("../models/Attendance.model");

exports.upsertPayroll = async (req, res) => {
  const { employeeId, basicSalary, allowances, deductions } = req.body;

  const employee = await Employee.findById(employeeId);
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const netSalary = basicSalary + (allowances || 0) - (deductions || 0);

  const payroll = await Payroll.findOneAndUpdate(
    { employee: employeeId },
    {
      employee: employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary,
    },
    { new: true, upsert: true }
  );

  res.json(payroll);
};

exports.getMyPayroll = async (req, res) => {
  const employee = await Employee.findOne({ user: req.user.id });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const payroll = await Payroll.findOne({ employee: employee._id });
  if (!payroll)
    return res.status(404).json({ message: "Payroll not assigned yet" });

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();

  const attendance = await Attendance.find({
    employee: employee._id,
    date: { $gte: start, $lte: end },
  });

  const dailySalary = payroll.netSalary / 30;

  let deduction = 0;

  attendance.forEach((a) => {
    if (a.status === "ABSENT") deduction += dailySalary;
    if (a.status === "HALF_DAY") deduction += dailySalary / 2;
  });

  res.json({
    ...payroll.toObject(),
    attendanceDeduction: Math.round(deduction),
    finalPayable: Math.round(payroll.netSalary - deduction),
  });
};

exports.getAllPayrolls = async (req, res) => {
  const payrolls = await Payroll.find().populate({
    path: "employee",
    populate: { path: "user", select: "email role" },
  });
  res.json(payrolls);
};
