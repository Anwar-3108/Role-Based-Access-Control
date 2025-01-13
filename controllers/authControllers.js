const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    logger.info(
      `New ${role} signed up - Username: ${username}, Email: ${email}`
    );

    res
      .status(201)
      .json({ message: `${role} saved successfully with name ${username}` });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      logger.info(`Failed signin attempt - Username: ${username}`);
      return res.status(401).json({ message: "Invalid username" });
    }

    if (user.email !== email) {
      logger.info(
        `Failed signin attempt - Username: ${username}, Email: ${email}`
      );
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info(
        `Failed signin attempt - Username: ${username}, Email: ${email}`
      );
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    logger.info(
      `Successful signin - Username: ${username}, Email: ${email}, Role: ${user.role}`
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signin:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signup, signin };
