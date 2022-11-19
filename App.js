// module imports
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var mysql = require("mysql");
var fs = require("fs");
var path = require("path");
const multer = require("multer");
let alert = require("alert");
const crypto = require("crypto");


// for storing application backgrounds
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname + "\\public\\image");
	},
	filename: (req, file, cb) => {
		let suffix = path.extname(file.originalname);

		let new_name = "";
		if (req.query.page === "home") new_name = "homepage" + suffix;
		else if (req.query.page === "about") new_name = "aboutpage" + suffix;
		else if (req.query.page === "contact") new_name = "contactpage" + suffix;
		else if (req.query.page === "news") new_name = "newspage" + suffix;

		cb(null, new_name);
	},
});
const upload_background = multer({storage: storage});

const profile_picture_storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname + "\\public\\profile_pictures");
	},
	filename: (req, file, cb) => {
		const unique_hex = crypto.randomBytes(4).toString("hex");
		let new_name = unique_hex + file.originalname;

		try {
			fs.writeFileSync(__dirname + `\\server-side files\\temporary text files\\profile picture temporary data\\${req.session.user}.txt`, new_name);
		} catch (err) {
			console.error(err);
		}

		cb(null, new_name);
	},
});
const upload_profile_picture = multer({storage: profile_picture_storage});

const readFile = (filename) => fs.readFileSync(filename).toString("UTF8");

const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const { response } = require("express");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port = process.env.port || 3360;

const oneDay = 1000 * 60 * 60 * 24;
let sess = {
	secret: "Thisisasecret",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false, maxAge: oneDay},
};

// Set up middleware
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// create database connection
var pool = mysql.createPool({
	connectionLimit: 100,
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "wedddb",
});

function loadDefaultValues(req) {
	req.session.drivers = [];
	req.session.edit_employee_id = null;
	req.session.edit_name = null;
	req.session.edit_email = null;
	req.session.edit_role_id = null;
	req.session.edit_title = null;
	if (!(req.session.access)) {
		req.session.access = null; 
		req.session.user = null;
	}
}

function setPickupLocation(req,values) {
	req.session.startlat = values[0].lat,
	req.session.startlng = values[0].lon

}
function setDropLocation(req, values) {
	req.session.endlat = values[0].lat,
	req.session.endlng = values[0].lon

}

// --------------------------------- routes ---------------------------------------

// default route
app.get("/", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM background`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("home", {
				year: new Date().getFullYear(),
				title: "Homepage",
				image: result[0].home_page,
				user: sess.user,
			});
		});
	});
});

app.get("/profile", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM customer where email = '${sess.user}'`, function (err, account, fields) {
			con.release();
			if(err) throw err;

			return res.render("profile-customer", {customer_account: account[0], page: null});
		});
	});
});
app.get("/profile/account", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM customer where email = '${sess.user}'`, function (err, account, fields) {
			con.release();
			if(err) throw err;

			return res.render("profile-customer", {customer_account: account[0], page: "account"});
		});
	});
});
app.get("/profile/support", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM customer where email = '${sess.user}'`, function (err, account, fields) {
			con.release();
			if(err) throw err;

			return res.render("profile-customer", {customer_account: account[0], page: "support"});
		});
	});
});

app.post("/profile/account", upload_profile_picture.single("image"), (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;

	if (req.query.option === "details") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE customer SET customer_pp = '', name = '${req.body.customer_name}', email = '${req.body.customer_email}', home_address = '${req.body.home_address}', customer_car = '${req.body.customer_car}' where email = '${sess.user}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;

				return res.redirect("/profile/account");
			});
		});
	} else if (req.query.option === "password") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT password FROM customer where email = '${sess.user}'`, function (err, user_password, fields) {
				con.release();
				if(err) throw err;
	
				if(req.body.customer_password.old === user_password[0].password){
					if(req.body.customer_password.new === req.body.customer_password.confirm){
						pool.getConnection((err, con) => {
							if (err) throw err;
							con.query(`UPDATE customer SET password = '${req.body.customer.new_password}' where email = '${sess.user}'`, function (err, result, fields) {
								con.release();
								if (err) throw err;

								return res.redirect("/profile/account");
							});
						});
					} else {
						res.send("Values didn't matched!");
					}
				} else {
					res.send("Values didn't matched!");
				}
			});
		});
	} else if (req.query.option === "profilepicture") {
		let imageName = "/profile_pictures/" + readFile(__dirname + `\\server-side files\\temporary text files\\profile picture temporary data\\${sess.user}.txt`);

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT customer_pp FROM customer where email = '${sess.user}'`, function (err, profile_picture_data, fields) {
				con.release();
				if (err) throw err;
				else if (profile_picture_data[0].customer_pp != null) {
					let full_path = __dirname + "/public/" + profile_picture_data[0].customer_pp;
					try {
						fs.unlinkSync(full_path);
					} catch (exception) {}
				}
			});
		});

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE customer SET customer_pp = '${imageName}' where email = '${sess.user}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;

				fs.unlinkSync(__dirname + `\\server-side files\\temporary text files\\profile picture temporary data\\${sess.user}.txt`);
				return res.redirect("/profile/account");
			});
		});
	} else if (req.query.option === "delete") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`DELETE FROM customer where email = '${sess.user}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;

				return res.redirect("/");
			});
		});
	}
});
app.post("/profile/support", (req, res) => {
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`INSERT INTO supportRequests (email, reason, description, comments) VALUES ('${req.body.customer_email}', '${req.body.problem.reason}', '${req.body.problem.brief_description}', '${req.body.problem.comments}')`, function (err, result, fields) {
			con.release();
			if (err) throw err;

			return res.redirect("/profile");
		});
	});
});

app.get("/ride", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	if (sess.access != 3) {
		return res.redirect("/login");
	}
	return res.render("ride");
});
app.post("/ride", (req, res) => {
	let sess = req.session;
	if (sess.access != 3) {
		res.redirect("login");
	} else {
		let name = req.body.name;
		let email = req.body.email;
		let phone = req.body.phone;
		let pick = req.body.pick;
		let destination = req.body.destination;
		let schedule = req.body.schedule_trip;
		let mode_of_payement = req.body.pay_mode;

		if (name === "" || email === "" || phone === "" || pick === "" || destination === "" || mode_of_payement === undefined) {
			res.send("error");
			return;
		}
		else{
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`INSERT INTO rideRequests (name, email, phone, pickup, destination, payment) VALUES ('${name}','${email}','${phone}','${pick}','${destination}','${mode_of_payement}')`, function (err, result, fields) {
					con.release();
					if(err) throw err;
				});
			});
		}

		let startlat = req.body.startlat;
		let startlng = req.body.startlng; 
		let destlat = req.body.destlat;
		let destlng = req.body.destlng;
		let h3tags = req.body.h3tags;
		let distance = h3tags.slice(0,h3tags.indexOf('km'));
		let time = h3tags.slice(h3tags.indexOf('km')+2,h3tags.indexOf('min'));

		console.log(h3tags,distance,time,'here');
		res.render("customer_ride_searching",{startlat:startlat,startlng:startlng,destlat:destlat,destlng:destlng} );
	}
});

app.get("/about", (req, res) => {
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM background`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("about", {
				year: new Date().getFullYear(),
				title: "About us",
				about_image: result[0].about_page,
			});
		});
	});
});

app.get("/contact", (req, res) => {
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM background`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("contact", {
				year: new Date().getFullYear(),
				title: "Contact us",
				contact_image: result[0].contact_page,
			});
		});
	});
});

app.post("/contact", (req, res) => {
	let name = req.body.name;
	let address = req.body.address;
	let phone = req.body.phone;
	let service_id = req.body.services;
	let email = req.body.email;
	let comments = req.body.comments;
	let updates = req.body.consent == 1 ? req.body.consent : 0;

	if (name === "" || address === "" || phone === "" || service_id === "" || email === "" || comments === "" || updates === "") {
		res.send("error");
		return;
	}

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`INSERT INTO requests (request_id,name,address,phone,service_id,email,comments,updates) VALUES (0,'${name}','${address}','${phone}','${service_id}','${email}','${comments}','${updates}') `, function (err, result, fields) {
			con.release();
			if(err) throw err;
		});
	});

	res.redirect("/contact");
});

app.get("/news", (req, res) => {
	// pool.getConnection((err, con)=>{
	//     if (err) throw err;
	//     con.query(`SELECT * FROM background`, function (err, result, fields) {

	//         con.release();
	// 		if(err) throw err;
	//         res.render("news", {year: new Date().getFullYear(), title: "News", news_image: result[0].news_page});
	//     });
	// });

	let sess = req.session;

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM news`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			sess.newslist = result;
			res.render("news", sess);
		});
	});
});

app.get("/roles", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	
	if (sess.access != 1){
		res.redirect("/");
	} else {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT * FROM user_roles`, function (err, result, fields) {
				con.release();
				if(err) throw err;
				sess.roles = result;
				res.render("admin_roles", sess);
			});
		});
	}
});

// Login routes
app.get("/login", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	if (sess.access) {
		res.redirect("/profile");
	} else {
		res.render("login", {year: new Date().getFullYear(), title: "Login"});
	}
});
app.post("/login", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	if (sess.access) {
		res.redirect("/profile");
	} else if (req.body.email === "" || req.body.password === "") {
		res.send("error");
	} else {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT email, password, role, name FROM customer WHERE email = '${req.body.email}' union all SELECT email, password, role, name FROM employees WHERE email = '${req.body.email}'`, function (err, result, fields) {
				con.release();

				if (err) res.send("backend error");

				if (result.length > 0) {
					if (result[0].password === req.body.password) {
						sess.useremail = req.body.email;
						sess.user = result[0].email;
						if (result[0].role === 3) {
							sess.access = 3;
							res.redirect("/");
							return;
						} else if (result[0].role === 2) {
							sess.access = 2;
							res.redirect("/driver");
							return;
						} else if (result[0].role === 1) {
							sess.access = 1;
							res.redirect("/admin");
							return;
						}
					} else {
						res.send("invalid password");
					}
				} else {
					res.send("invalid email");
				}
			});
		});
	}
});

// Signup routes
app.get("/signup", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access) {
		return res.redirect("/profile");
	}

	return res.render("signup", {year: new Date().getFullYear(), title: "Signup"});
});
app.post("/signup", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access) {
		res.redirect("/profile");
		return;
	}
	if (req.body.email === "" || req.body.name === "" || req.body.password === "") {
		alert("Sorry, try again!");
		// res.redirect("/signup");
		return;
	}

	pool.getConnection((err, con) => {
		if (err) throw err;

		con.query(`INSERT INTO customer (customer_id, email, name, password) VALUES (0, '${req.body.email}','${req.body.name}','${req.body.password}')`, function (err, result, fields) {
			con.release();
			if(err) throw err;

			res.redirect("/");
		});
	});
});

app.get("/admin", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}

	res.render("admin_home");
});

// driver dashboard
app.get("/driver", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 2) {
		return res.redirect("/");
	}

	if(sess.ride_allocated_session_id){ // if driver is active and is currently driving
		return pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT * FROM current_rides WHERE ride_allocated_session_id = '${sess.ride_allocated_session_id}'`, function (err, result, fields) {
				con.release();

				if (err) throw err; // remove on build
				return res.render("driver_dash-drive", {driver: "Driver", pickup_address: "46 Taravista", drop_address: "52 Del ray"});
			});
		});
	}
	else if(sess.driver_session_id){ // if driver is active, but has not rides
		let result = {
			rides: undefined
		};
		return pool.getConnection( (err, con) => {
			if (err) throw err;

			con.query(`SELECT * FROM riderequests`, function (err, d_ride_requests, fields) {
				con.release();

				if (err) throw err; // remove on build

				result.rides = d_ride_requests;
				return res.render("driver_dash-avail_requests", result);
			});
		});
	} else {
		return res.render("driver_dashboard");
	}
});
app.post("/driver", (req, res) => {
	let sess = req.session;

	if (sess.access != 2) {
		return res.redirect("/");
	}

	if (req.query.daction === "startdata") {
		pool.getConnection((err, con) => {
			if (err) throw err;

			const driver_session_id = crypto.randomBytes(8).toString("hex"); // 16 character long random value
			con.query(`INSERT INTO available_drivers (active_driver_session_id, driver_1_id, driver_2_id, car_id) VALUES ('${driver_session_id}', '${req.body.driver_1_id}','${req.body.driver_2_id}','${req.body.car_id}')`, function (err, result, fields) {
				con.release();

				if (err) throw err; // remove on build
				sess.driver_session_id = driver_session_id;
				return res.redirect("/driver");
			});
		});
	} else if (req.query.daction === "end") {
		pool.getConnection((err, con) => {
			if (err) throw err;

			con.query(`DELETE FROM available_drivers WHERE active_driver_session_id = '${sess.driver_session_id}'`, function (err, result, fields) {
				con.release();

				if (err) throw err; // remove on build
				sess.driver_session_id = undefined;
				res.redirect("/driver");
				return;
			});
		});
	} else if (req.query.daction === "racc") {
		if (sess.ride_allocated_session_id) {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`SELECT * FROM current_rides WHERE ride_allocated_session_id = '${sess.ride_allocated_session_id}'`, function (err, result, fields) {
					con.release();

					if (err) throw err; // remove on build
					return res.render("driver_dash-drive", {driver: "Driver", pickup_address: "46 Taravista", drop_address: "52 Del ray"});
				});
			});
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;

				let ride_allocated_session_id = crypto.randomBytes(8).toString("hex");
				con.query(`INSERT INTO current_rides (ride_allocated_session_id, driver_1_id, driver_2_id, car_id, customer_id, pickup_location, drop_location, distance, est_time, est_cost) VALUES ('${ride_allocated_session_id}', ${req.query.did1}, ${req.query.did2}, ${req.query.dcid}, ${req.query.cid}, '${req.query.pic}', '${req.query.drp}', ${req.query.dst}, ${req.query.etd}, ${req.query.ect})`, function (err, result, fields) {
					con.release();

					if (err) throw err; // remove on build

					// If driver successfully accepts the request, remove the drivers from available drivers
					pool.getConnection((err, con) => {
						if (err) throw err;

						con.query(`DELETE FROM available_drivers WHERE active_driver_session_id = '${sess.driver_session_id}'`, function (err, result, fields) {
							con.release();
							if (err) throw err; // remove on build

							sess.ride_allocated_session_id = ride_allocated_session_id;
							return res.render("driver_dash-drive", {driver: "Driver", pickup_address: "46 Taravista", drop_address: "52 Del ray"});
						});
					});
				});
			});
		}
	} else if (req.query.daction === "rdec") {
		// TO-DO, YET TO IMPLEMENT
	}
});

app.get("/addnews", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}

	res.render("admin_news");
});

app.post("/addnews", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`INSERT INTO news (start_date, end_date, headline, message, color) VALUES ('${req.body.start_date}', '${req.body.end_date}','${req.body.headline}','${req.body.message}','${req.body.color}')`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.redirect("/admin");
		});
	});
});

app.get("/drivers", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 3) {
		res.redirect("/");
		return;
	}

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM employees WHERE role = 2 `, function (err, result, fields) {
			con.release();
			if(err) throw err;

			sess.drivers = result;

			res.render("drivers", sess);
		});
	});
});
app.post("/drivers", (req, res) => {
	let sess = req.session;

	if (sess.access != 3) {
		res.redirect("/");
		return;
	}
	let action = req.body.action;

	if (action === "edit") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT * FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;

				sess.edit_employee_id = result[0].employee_id;
				sess.edit_email = result[0].email;
				sess.edit_name = result[0].name;

				res.render("drivers", sess);
				return;
			});
		});
	}
	if (action === "delete") {
		pool.getConnection((err, con) => {
			if (err) throw err;

			con.query(`DELETE FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;
				res.redirect("/drivers");
				return;
			});
		});
	}
	if (action === "update") {
		if (req.body.edit_f_name === "" || req.body.edit_l_name === "" || req.body.edit_email === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`UPDATE employees set name = '${req.body.edit_name}', email = '${req.body.edit_email}' WHERE employee_id = '${req.body.edit_employee_id}' `, function (err, result, fields) {
					con.release();
					if(err) throw err;

					res.redirect("/drivers");
					return;
				});
			});
		}
	}
	if (action === "add") {
		if (req.body.new_name === "" || req.body.new_email === "" || req.body.new_password === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`INSERT INTO employees (employee_id, email , name, password, role) VALUES (0,'${req.body.new_email}','${req.body.new_name}','${req.body.new_password}', 2)`, function (err, result, fields) {
					con.release();
					if(err) throw err;
					res.redirect("/drivers");
				});
			});
		}
	}
});

app.get("/admins", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 1){
		res.redirect("/");
		return;
	}

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM employees WHERE role = 1 `, function (err, result, fields) {
			con.release();
			if(err) throw err;

			sess.admins = result;

			res.render("admins", sess);
		});
	});
});
app.post("/admins", (req, res) => {
	let sess = req.session;
	
	if (sess.access != 1){
		res.redirect("/");
		return;
	}
	let action = req.body.action;

	if (action === "edit") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT * FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;

				sess.edit_employee_id = result[0].employee_id;
				sess.edit_email = result[0].email;
				sess.edit_name = result[0].name;

				res.render("admins", sess);
				return;
			});
		});
	}
	if (action === "delete") {
		pool.getConnection((err, con) => {
			if (err) throw err;

			con.query(`DELETE FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;
				res.redirect("/admins");
				return;
			});
		});
	}
	if (action === "update") {
		if (req.body.edit_f_name === "" || req.body.edit_l_name === "" || req.body.edit_email === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`UPDATE employees set name = '${req.body.edit_name}', email = '${req.body.edit_email}' WHERE employee_id = '${req.body.edit_employee_id}' `, function (err, result, fields) {
					con.release();
					if(err) throw err;

					res.redirect("/admins");
					return;
				});
			});
		}
	}
	if (action === "add") {
		if (req.body.new_name === "" || req.body.new_email === "" || req.body.new_password === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`INSERT INTO employees (employee_id, email , name, password, role) VALUES (0,'${req.body.new_email}','${req.body.new_name}','${req.body.new_password}', 1)`, function (err, result, fields) {
					con.release();
					if(err) throw err;
					res.redirect("/admins");
				});
			});
		}
	}
});

app.get("/rides", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	
	if (sess.access != 1){
		res.redirect("/");
		return;
	}
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM rideRequests`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("ride_requests", {rides: result});
		});
	});
});

app.get("/requests", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 3) {
		res.redirect("/");
		return;
	}
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM requests`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("contact_requests", {requests: result});
		});
	});
});

// to change the images
app.get("/background", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 3) {
		res.redirect("/");
		return;
	}
	if (req.query.option) {
		switch (req.query.option) {
			case "home": {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`SELECT * FROM background`, function (err, result, fields) {
						con.release();
						if(err) throw err;
						res.render("bg-home", {images: result});
					});
				});
				break;
			}
			case "about": {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`SELECT * FROM background`, function (err, result, fields) {
						con.release();
						if(err) throw err;
						res.render("bg-about", {images: result});
					});
				});
				break;
			}
			case "contact": {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`SELECT * FROM background`, function (err, result, fields) {
						con.release();
						if(err) throw err;
						res.render("bg-contact", {images: result});
					});
				});
				break;
			}
			case "news": {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`SELECT * FROM background`, function (err, result, fields) {
						con.release();
						if(err) throw err;
						res.render("bg-news", {images: result});
					});
				});
				break;
			}
		}
	} else {
		res.render("background");
	}
});
app.post("/background", upload_background.single("image"), (req, res) => {
	let sess = req.session;

	if (sess.access != 3) {
		res.redirect("/");
		return;
	}
	// let background_placeholder_path =  __dirname+"\\public\\backgroundPlaceholder\\Placeholder.png";

	// for home page
	if (req.body.action && req.body.action === "for_home") {
		let originalname = req.file.originalname;
		let imageName = "image/homepage" + path.extname(originalname);

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT home_page FROM background`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else {
					let full_path = __dirname + "/public/" + result[0].home_page;

					// let files = fs.readdirSync(__dirname+"/public/image");
					// console.log(files.includes("homepage"+path.extname(result[0].home_page)));
					fs.unlinkSync(full_path);
					// try {
					//     fs.unlinkSync(full_path);
					// } catch(fileRemoveError) {

					//     pool.getConnection((err, con)=>{
					//         if (err) throw err;
					//         con.query(`UPDATE background SET home_page = '${background_placeholder_path}'`, function (err, result, fields) {
					//             con.release();

					//             if(err) throw err;
					//             else res.redirect("/background");
					//         });
					//     });
					// }
				}
			});
		});

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE background SET home_page = '${imageName}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else res.redirect("/background");
			});
		});
	}

	// for about page
	else if (req.body.action && req.body.action === "for_about") {
		let originalname = req.file.originalname;
		let imageName = "image/aboutpage" + path.extname(originalname);

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT about_page FROM background`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else {
					let full_path = __dirname + "/public/" + result[0].about_page;
					fs.unlinkSync(full_path);
				}
			});
		});

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE background SET about_page = '${imageName}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else res.redirect("/background");
			});
		});
	}
	// for contact page
	else if (req.body.action && req.body.action === "for_contact") {
		let originalname = req.file.originalname;
		let imageName = "image/contactpage" + path.extname(originalname);

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT contact_page FROM background`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else {
					let full_path = __dirname + "/public/" + result[0].contact_page;
					fs.unlinkSync(full_path);
				}
			});
		});

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE background SET contact_page = '${imageName}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else res.redirect("/background");
			});
		});
	}

	// for news page
	else if (req.body.action && req.body.action === "for_news") {
		let originalname = req.file.originalname;
		let imageName = "image/newspage" + path.extname(originalname);

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT news_page FROM background`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else {
					let full_path = __dirname + "/public/" + result[0].news_page;
					fs.unlinkSync(full_path);
				}
			});
		});

		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE background SET news_page = '${imageName}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;
				else res.redirect("/background");
			});
		});
	}
});

// handling status errors
app.use((req, res) => {
	res.status(404).send("Page not found.");
});

// app port listener
app.listen(port, (err) => {
	if (err) return console.log(err);
	console.log(`Server up running at 'http://localhost:${port}/'`);
});
