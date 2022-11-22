const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");
const crypto = require("crypto");


router.get("/", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	if (sess.access != 3) {
		return res.redirect("/login");
	}
	else if(sess.customer_ride_session_id){
		return res.render("customer_ride_searching",{
			startlat: sess.startlat,
			startlng: sess.startlng,
			destlat: sess.destlat,
			destlng: sess.destlng,
			driver_available: false
		});
	}
	return res.render("ride");
});
router.post("/", (req, res) => {
	let sess = req.session;
	let action = req.body.action
	if (sess.access != 3) {
		res.redirect("login");
	} else {
		let name = req.body.name;
		let email = req.body.email;
		let phone = req.body.phone;
		let pick = req.body.pick;
		let destination = req.body.destination;
		let mode_of_payement = req.body.pay_mode;

		if (action == "request"){
			if (name === "" || email === "" || phone === "" || pick === "" || destination === "" || mode_of_payement === undefined) {
				res.send("error");
				return;
			}
			else {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`INSERT INTO rideRequests (name, email, phone, pickup, destination, payment) VALUES ('${name}','${email}','${phone}','${pick}','${destination}','${mode_of_payement}')`, function (err, result, fields) {
						con.release();
						if(err) throw err;

						// customer_ride_session_id = SESSION VARIABLE TO INDICATE THAT CUSTOMER IS IN RIDE CURRENTLY.
						

						let startlat = req.body.startlat;
						let startlng = req.body.startlng; 
						let destlat = req.body.destlat;
						let destlng = req.body.destlng;
						sess.startlat = startlat;
						sess.startlng = startlng;
						sess.destlat = destlat;
						sess.destlng = destlng;
						let details = "Name: " + name +"\nEmail: "+email+"\nPhone Number: "+phone+"\nPick-Up Address: "+pick+"\nDrop-Off Address: "+destination;
						res.render("customer_ride_confirm", {
							details: details,
							startlat: startlat,
							startlng: startlng,
							destlat: destlat,
							destlng: destlng
						});
					});
				});
			}
		}else if(action="confirm") {
			sess.customer_ride_session_id = crypto.randomBytes(8).toString("hex");
			return res.render("customer_ride_searching",{
				startlat: sess.startlat,
				startlng: sess.startlng,
				destlat: sess.destlat,
				destlng: sess.destlng,
				driver_available: false});
		}
	}
});

module.exports = router;