const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
    loadDefaultValues(req);
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

router.post("/", (req, res) => {
    loadDefaultValues(req);
    
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

module.exports = router;