const User = require("../models/userModel");
const Team = require("../models/teamModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");


const signup = async (req, res) => {
  try {
    const { username, email, password, role, teamName } = req.body;

  // Validate input fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "superAdmin") {
      const existingSuperAdmin = await User.findOne({ role: "superAdmin" });
      if (existingSuperAdmin) {
        return res
          .status(400)
          .json({ message: "A superadmin is already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newSuperAdmin = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newSuperAdmin.save();

      logger.info(`Superadmin registered - Username: ${username}, Email: ${email}`);
      return res.status(201).json({ message: "Superadmin registered successfully" });

    } else if (role === "admin" || role === "manager") {
   
      if (!teamName) {
        return res
          .status(400)
          .json({ message: "Team name is required for admin or manager" });
      }

      const team = await Team.findOne({ name: teamName });
      if (!team) {
        return res
          .status(404)
          .json({ message: "Team not found. Please provide a valid team name" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdminOrManager = new User({
        username,
        email,
        password: hashedPassword,
        role,
        teams: [{ teamId: team._id, role }], 
      });
      await newAdminOrManager.save();

      logger.info(
        `${role.toUpperCase()} registered - Username: ${username}, Email: ${email}, Team: ${teamName}`
      );
      return res.status(201).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      });

    } else if (role === "user") {
     
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();

      logger.info(`User registered - Username: ${username}, Email: ${email}`);
      return res.status(201).json({ message: "User registered successfully" });

    } else {
     
      return res.status(400).json({ message: "Invalid role specified" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const signin = async (req, res) => {
  try {
    const { username, email, password, teamName, organizationName, role } = req.body;

    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Username, email, password, and role are required" });
    }

    let user;

    if (role === "superAdmin") {
      
      user = await User.findOne({ username, role: "superAdmin" });
      if (!user) {
        logger.info(`Failed signin attempt - SuperAdmin Username: ${username}`);
        return res.status(401).json({ message: "Invalid username or role for SuperAdmin" });
      }
    } else if (role === "admin" || role === "manager") {
      
      if (!teamName || !organizationName) {
        return res
          .status(400)
          .json({ message: "Team name and organization name are required for Admin/Manager" });
      }


      const organization = await Organization.findOne({ name: organizationName });
      if (!organization) {
        logger.info(`Failed signin attempt - Organization not found: ${organizationName}`);
        return res.status(404).json({ message: "Organization not found" });
      }

     
      const team = await Team.findOne({ name: teamName, organization: organization._id });
      if (!team) {
        logger.info(`Failed signin attempt - Team not found: ${teamName}`);
        return res.status(404).json({ message: "Team not found" });
      }

   
      user = await User.findOne({ username, email, teams: { $elemMatch: { teamId: team._id } } });
      if (!user) {
        logger.info(`Failed signin attempt - User not found in team: ${teamName}`);
        return res.status(401).json({ message: "Invalid username or email for the team" });
      }
    } else if (role === "user") {
      
      user = await User.findOne({ username, role: "user" });
      if (!user) {
        logger.info(`Failed signin attempt - User Username: ${username}`);
        return res.status(401).json({ message: "Invalid username for general user" });
      }
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }


    if (user.email !== email) {
      logger.info(`Failed signin attempt - Email mismatch for Username: ${username}`);
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info(`Failed signin attempt - Password mismatch for Username: ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }


    const tokenPayload = { id: user._id, role: user.role };
    if (user.teams && user.teams.length > 0) {
      tokenPayload.teamId = user.teams[0].teamId; 
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    logger.info(
      `Successful signin - Username: ${username}, Email: ${email}, Role: ${role}`
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signin:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};



module.exports = { signup, signin };
