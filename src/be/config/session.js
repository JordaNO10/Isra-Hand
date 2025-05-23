const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

// MySQL session storage options
const options = {
  host: "localhost", // Database host
  user: "root", // Database user
  password: "", // Database password (leave blank if none)
  database: "israhand", // Database name
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 1 day (24 hours)
};

// Create session store
const sessionStore = new MySQLStore(options);

const sessionMiddleware = (app) => {
  app.use(cookieParser());

  app.use(
    session({
      key: "session_id",
      secret: "yourSuperSecretKey", // Set your session secret directly here
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS in production
        maxAge: 86400000, // 1 day
      },
    })
  );
};

module.exports = sessionMiddleware;
