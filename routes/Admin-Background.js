const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");
const SetBackgroundImages = require("../modules/SetBackgroundImages");
var fs = require("fs");

router.get("/", (req, res) => {
	loadDefaultValues(req);

	let sess = req.session;

	if (sess.access != 1) {
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
			case "services": {
				pool.getConnection((err, con) => {
					if (err) throw err;
					con.query(`SELECT * FROM background`, function (err, result, fields) {
						con.release();
						if(err) throw err;
						res.render("bg-services", {images: result});
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
router.post("/", SetBackgroundImages.single("image"), (req, res) => {
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

module.exports = router;