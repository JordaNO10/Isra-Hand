const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const signIn = require("./database/signin");
const signUp = require("./database/signup");
const donationAll = require("./database/donations");
const donationAdd = require("./database/donationadd"); // Correct import for the donation route
const categories = require("./database/categories"); // Import categories route
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Use user, donation, and category routes
app.use("/signIn", signIn);
app.use("/signUp", signUp);
app.use("/donations", donationAll);
app.use("/donationadd", donationAdd); // Correctly use donationAdd route
app.use("/categories", categories); // Use categories route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
