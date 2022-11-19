const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}

	res.render("admin_home");
});

router.get("/roles", (req, res) => {
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

router.get("/news", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}

	res.render("admin_news");
});

router.post("/news", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access != 1){
		res.redirect("/");
		return;
	}
	console.log(req.body.start_date);
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`INSERT INTO news (start_date, end_date, headline, message, color) VALUES ('${req.body.start_date}', '${req.body.end_date}','${req.body.headline}','${req.body.message}','${req.body.color}')`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.redirect("/admin");
		});
	});
});

router.get("/rides", (req, res) => {
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

router.get("/services", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 1) {
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



module.exports = router;