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
			res.render("about", {
				year: new Date().getFullYear(),
				title: "About us",
				about_image: result[0].about_page,
			});
		});
	});
});

module.exports = router;