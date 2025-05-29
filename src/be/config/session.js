const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

const options = {
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
  clearExpired: true,
  rolling: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 3600000, // ✅ 1 hour (used for server-side session expiration)
};

const sessionStore = new MySQLStore(options);

const sessionMiddleware = (app) => {
  app.use(cookieParser());

  app.use(
    session({
      key: "session_id",
      secret: "yourSuperSecretKey",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600000, // ✅ 1 hour (used for client-side cookie expiration)
      },
    })
  );
};

module.exports = sessionMiddleware;
