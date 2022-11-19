const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/LoadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM background`, function (err, result, fields) {
			con.release();
			if(err) throw err;
			res.render("home", {
				image: result[0].home_page,
				user: sess.user,
			});
		});
	});
});

module.exports = router;