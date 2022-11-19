const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
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

module.exports = router;