
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "manager", "admin", "superAdmin"], required: true},
    teams: [
      {
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        role: { type: String, enum: ["admin", "manager", "member"] },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
