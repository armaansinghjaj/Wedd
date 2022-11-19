const express = require("express");
const router = express.Router();
const loadDefaultValues = require("../modules/loadDefaultValues");
const pool = require("../modules/SQLconnectionpool");

router.get("/", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
    if(sess.access === 3){
        return res.redirect("/profile");
    }

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM employees where email = '${sess.user}'`, function (err, account, fields) {
			con.release();
			if(err) throw err;

			return res.render("profile-employee", {employee_account: account[0], page: null});
		});
	});
});

router.get("/account", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
    if(sess.access === 3){
        return res.redirect("/profile");
    }

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM employees where email = '${sess.user}'`, function (err, account, fields) {
			con.release();
			if(err) throw err;

			return res.render("profile-employee", {employee_account: account[0], page: "account"});
		});
	});
});

router.post("/account", (req, res) => {
	loadDefaultValues(req);
	let sess = req.session;
    if(sess.access === 3){
        return res.redirect("/profile");
    }

	if (req.query.option === "details") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`UPDATE employees SET name = '${req.body.customer_name}', email = '${req.body.customer_email}' where email = '${sess.user}'`, function (err, result, fields) {
				con.release();
				if (err) throw err;

				return res.redirect("/employeeprofile/account");
			});
		});
	} else if (req.query.option === "password") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT password FROM employees where email = '${sess.user}'`, function (err, user_password, fields) {
				con.release();
				if(err) throw err;
	
				if(req.body.employee_password.old === user_password[0].password){
					if(req.body.employee_password.new === req.body.employee_password.confirm){
						pool.getConnection((err, con) => {
							if (err) throw err;
							con.query(`UPDATE employees SET password = '${req.body.employee_password.new}' where email = '${sess.user}'`, function (err, result, fields) {
								con.release();
								if (err) throw err;

								return res.redirect("/employeeprofile/account");
							});
						});
					} else {
						res.send("Values didn't matched!");
					}
				} else {
					res.send("Values didn't matched!");
				}
			});
		});
	}
});

module.exports = router;