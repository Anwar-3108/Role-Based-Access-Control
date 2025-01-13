const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userModelRoutes = require("./routes/userRoutes");
dbConnect();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userModelRoutes);

// Routes

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} http://localhost:${process.env.PORT}`
  );
});
