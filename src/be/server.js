const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const sessionMiddleware = require("./config/session");
const dotenv = require("dotenv");
const cors = require("cors");
require("./controllers/schedule/cron");

//  Route imports
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const ratingRoutes = require("./routes/ratingsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Load environment variables
dotenv.config();

//  Security & Logging
app.use(helmet());
app.use(morgan("combined"));

//  JSON parsing
app.use(express.json());

//  CORS setup

//  Session middleware
sessionMiddleware(app);

//  Serve static uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

//  Routes
app.use("/users", userRoutes); // login, register, logout
app.use("/donations", donationRoutes); // add, get, update, delete donations
app.use("/categories", categoryRoutes);
app.use("/ratings", ratingRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//  Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
