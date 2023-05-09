require("./config/database").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;
const expressLayouts = require("express-ejs-layouts");

// session used for cookies in details 
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
// used config section file 

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(bodyParser.urlencoded({ extended: false }));
// bodyParser session in the urlencoded

app.use(cookieParser());

app.use(expressLayouts);

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongodb used the session in the cookies 

app.use(
  session({
    name: "placement-cell",
    secret: SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
      // connect the mongoDB url for user 
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// the authenticated user in the response result 
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// using express router 
app.use("/", require("./routes"));

app.listen(PORT || 5000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`server is running on port: ${PORT}`);
});
