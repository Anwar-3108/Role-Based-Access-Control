const Organization = require("../models/organizationModel");
const logger = require("../logs/logger");

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const superAdminId = req.user.id;  

    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Only superAdmins can create organizations" });
    }

    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization name already exists" });
    }


    const newOrg = new Organization({
      name,
      superAdmin: superAdminId,
    });

    await newOrg.save();

    logger.info(
      `Organization created - Name: ${name}, SuperAdmin: ${req.user.username}`
    );
    res.status(201).json({ message: "Organization created successfully", organization: newOrg });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createOrganization };
