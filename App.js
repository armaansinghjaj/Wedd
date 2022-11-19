// IMPORT NODE_MODULE
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

// SET VIEW ENGINE FOR USING 'EJS' FILES.
app.set("view engine", "ejs"); // DELETE ON BUILD

// SET-UP COOKIE SETTINGS
const oneDay = 1000 * 60 * 60 * 24;
let sess = {
	secret: "Thisisasecret",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false, maxAge: oneDay},
};

// SET UP MIDDLEWARE
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// SET-UP HOST SERVER PORT
const port = process.env.port || 3360;

// COMMON IMPORTS
const { v4: uuidv4 } = require('uuid');

function setPickupLocation(req,values) {
	req.session.startlat = values[0].lat,
	req.session.startlng = values[0].lon

}
function setDropLocation(req, values) {
	req.session.endlat = values[0].lat,
	req.session.endlng = values[0].lon

}

// IMPORT ROUTE MODULE -----------------------------------------------

const homeRoute = require("./routes/Home");
const loginRoute = require("./routes/Login");
const signupRoute = require("./routes/Signup");
const profileRoute = require("./routes/Profile");
const aboutPageRoute = require("./routes/About");
const servicesRoute = require("./routes/Services");
const rideRoute = require("./routes/Ride");
const newsRoute = require("./routes/News");
const driverRoute = require("./routes/Driver");
const adminRoute = require("./routes/Admin");
const adminBackgroundRoute = require("./routes/Admin-Background");
const adminAdminListRoute = require("./routes/Admin-AdminList");
const adminDriverListRoute = require("./routes/Admin-DriverList");

// SET-UP ROUTES USING MODULE------------------------------------------

app.use("/", homeRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/profile", profileRoute);
app.use("/about", aboutPageRoute);
app.use("/services", servicesRoute);
app.use("/ride", rideRoute);
app.use("/news", newsRoute);
app.use("/driver", driverRoute);
app.use("/admin", adminRoute);
app.use("/admin/background", adminBackgroundRoute);
app.use("/admin/adminlist", adminAdminListRoute);
app.use("/admin/driverlist", adminDriverListRoute);

// handling status errors
app.use((req, res) => {
	res.status(404).send("Page not found.");
});

// app port listener
app.listen(port, (err) => {
	if (err) return console.log(err);
	console.log(`Server up running at 'http://localhost:${port}/'`);
});
