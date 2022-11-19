const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/LoadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access) {
		return res.redirect("/profile");
	}

	return res.render("signup", {year: new Date().getFullYear(), title: "Signup"});
});
router.post("/", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;
	if (sess.access) {
		res.redirect("/profile");
		return;
	}
	if (req.body.email === "" || req.body.name === "" || req.body.password === "") {
		alert("Sorry, try again!");
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

module.exports = router;