const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
} = require("../controllers/employee.controller");

router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);

router.get("/", auth, role("ADMIN"), getAllEmployees);

module.exports = router;
