const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  upsertPayroll,
  getMyPayroll,
  getAllPayrolls,
} = require("../controllers/payroll.controller");

router.get("/me", auth, getMyPayroll);

router.post("/", auth, role("ADMIN"), upsertPayroll);
router.get("/", auth, role("ADMIN"), getAllPayrolls);

module.exports = router;
