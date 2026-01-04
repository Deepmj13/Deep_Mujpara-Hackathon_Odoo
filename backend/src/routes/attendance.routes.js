const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendance.controller");

// Employee
router.post("/check-in", auth, checkIn);
router.post("/check-out", auth, checkOut);
router.get("/me", auth, getMyAttendance);

// Admin
router.get("/", auth, role("ADMIN"), getAllAttendance);

module.exports = router;
