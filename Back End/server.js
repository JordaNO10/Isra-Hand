const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const sessionMiddleware = require("./config/session"); // Import session middleware
const dotenv = require("dotenv"); // Require dotenv

const signIn = require("./database/signin");
const signUp = require("./database/signup");
const logoutRoute = require("./database/logout");
const usersRouter = require("./database/users");
const donationAll = require("./database/donations");
const donationAdd = require("./database/donationadd");
const categories = require("./database/categories");
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Middleware
dotenv.config({ path: "../config/session.env" });
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.json());

sessionMiddleware(app); // Apply session middleware

// Serve static files from the uploads directory
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/signIn", signIn);
app.use("/signUp", signUp);
app.use("/logout", logoutRoute);
app.use("/users", usersRouter);
app.use("/donations", donationAll);
app.use("/donationadd", donationAdd);
app.use("/categories", categories);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
