const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userModelRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
dbConnect();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userModelRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/org", organizationRoutes)
app.use("/api/team", teamRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} http://localhost:${process.env.PORT}`
  );
});
