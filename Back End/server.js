const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./database/users");
const donationRoutes = require("./database/donations");
const categoryRoutes = require("./database/categories"); // Import categories route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Configure CORS if needed
app.use(helmet()); // Secure HTTP headers
app.use(morgan("combined")); // Logging
app.use(bodyParser.json()); // for parsing application/json

// Use user, donation, and category routes
app.use("/api", userRoutes);
app.use("/api", donationRoutes);
app.use("/api", categoryRoutes); // Use categories route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
