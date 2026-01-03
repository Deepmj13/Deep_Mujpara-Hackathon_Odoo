const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enumn: ["ADMIN", "EMPLOYE"],
      default: "EMPLOYEE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
