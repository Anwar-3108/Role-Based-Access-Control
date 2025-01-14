const Team = require("../models/teamModel");
const Organization = require("../models/organizationModel");
const logger = require("../logs/logger");

const createTeam = async (req, res) => {
  try {
    const { organizationName, teamName, adminId, managerIds, memberIds } =
      req.body;

    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const existingTeam = await Team.findOne({
      name: teamName,
      organization: organization._id,
    });
    if (existingTeam) {
      return res
        .status(400)
        .json({
          message: `Team ${teamName} already exists in this organization`,
        });
    }

    const newTeam = new Team({
      name: teamName,
      organization: organization._id,
      admin: adminId || null,
      managers: managerIds,
      members: memberIds,
    });

    await newTeam.save();

    organization.teams.push(newTeam._id);
    await organization.save();

    logger.info(
      `New team created - Team Name: ${teamName}, Organization: ${organization.name}`
    );

    res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Failed to create team" });
  }
};

module.exports = { createTeam };
