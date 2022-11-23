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
		// let startlat = req.body.startlat;
		// let startlng = req.body.startlng; 
		// let destlat = req.body.destlat;
		// let destlng = req.body.destlng;
		// let h3tags = req.body.h3tags;
		
		// TO-DO (Vaibhav)
		// let distance = h3tags.slice(0,h3tags.indexOf('km'));
		// let time = h3tags.slice(h3tags.indexOf('km')+2,h3tags.indexOf('min'));
		// console.log(h3tags,distance,time,'here');

		return res.render("customer_ride_searching", {
			startlat: sess.startlat,
			startlng: sess.startlng,
			destlat: sess.destlat,
			destlng: sess.destlng,
			h3tags: sess.h3tags
		});
	}
	return res.render("ride");
});
router.post("/", (req, res) => {
	let sess = req.session;
	if (sess.access != 3) {
		res.redirect("login");
	} else {
		let name = req.body.name;
		let email = req.body.email;
		let phone = req.body.phone;
		let pick = req.body.pick;
		let destination = req.body.destination;
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

					// customer_ride_session_id = SESSION VARIABLE TO INDICATE THAT CUSTOMER IS IN RIDE CURRENTLY.
					sess.customer_ride_session_id = crypto.randomBytes(8).toString("hex");

					let startlat = req.body.startlat;
					let startlng = req.body.startlng; 
					let destlat = req.body.destlat;
					let destlng = req.body.destlng;
					let h3tags = req.body.h3tags;
					sess.startlat = startlat;
					sess.startlng = startlng;
					sess.destlat = destlat;
					sess.destlng = destlng;
					sess.h3tags = h3tags;
					// console.log(h3tags);
					let distance = h3tags.slice(0,h3tags.indexOf('km'));
					let time = h3tags.slice(h3tags.indexOf('km')+2,h3tags.indexOf('min'));
					// console.log(h3tags,distance,time,'here');

					res.render("customer_ride_searching", {
						startlat: startlat,
						startlng: startlng,
						destlat: destlat,
						destlng: destlng,
						h3tags: h3tags,
						driver_available: false
					});
				});
			});
		}
	}
});

module.exports = router;