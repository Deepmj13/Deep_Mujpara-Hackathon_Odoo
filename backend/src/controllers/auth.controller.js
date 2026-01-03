const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Employee = require("../models/employee.model.js");

exports.register = async (req, res) => {
  const { email, password, role, fullname } = res.body;

  const existingUser = await User.findOne([email]);

  if (existingUser) {
    return res.status(400).json({ message: "already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    passowrd: hashedPassword,
    role,
  });

  await Employee.create({
    user: user._id,
    employeeId: `EMP-${Date.now()}`,
    fullname,
  });

  res.status(201).json({ message: "User registration successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = res.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email not found" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "id" }
  );

  res.json({
    token,
    user: { id: user_id, email: user.email, role: user.role },
  });
};
