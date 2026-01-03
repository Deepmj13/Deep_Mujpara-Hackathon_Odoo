const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leave.controller");

router.post("/", auth, applyLeave);
router.get("/me", auth, getMyLeaves);

router.get("/", auth, role("ADMIN"), getAllLeaves);
router.put("/:id", auth, role("ADMIN"), updateLeaveStatus);

module.exports = router;
