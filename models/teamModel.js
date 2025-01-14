const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Creates a compound unique index on the name and organization fields, I was getting error while creating same name team in different org.
teamSchema.index({ name: 1, organization: 1 }, { unique: true });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
