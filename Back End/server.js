// server.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./database/users");
const donationRoutes = require("./database/donations");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // for parsing application/json

// Use user and donation routes
const cors = require("cors");
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", donationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

