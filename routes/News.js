const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
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

module.exports = router;