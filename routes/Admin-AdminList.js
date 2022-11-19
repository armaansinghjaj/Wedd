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

	pool.getConnection((err, con) => {
		if (err) throw err;
		con.query(`SELECT * FROM employees WHERE role = 1 `, function (err, result, fields) {
			con.release();
			if(err) throw err;

			sess.admins = result;

			res.render("admins", sess);
		});
	});
});
router.post("/", (req, res) => {
	let sess = req.session;
	
	if (sess.access != 1){
		res.redirect("/");
		return;
	}
	let action = req.body.action;

	if (action === "edit") {
		pool.getConnection((err, con) => {
			if (err) throw err;
			con.query(`SELECT * FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;

				sess.edit_employee_id = result[0].employee_id;
				sess.edit_email = result[0].email;
				sess.edit_name = result[0].name;

				res.render("admins", sess);
				return;
			});
		});
	}
	if (action === "delete") {
		pool.getConnection((err, con) => {
			if (err) throw err;

			con.query(`DELETE FROM employees WHERE employee_id = '${req.body.selected}' `, function (err, result, fields) {
				con.release();
				if(err) throw err;
				res.redirect("/admins");
				return;
			});
		});
	}
	if (action === "update") {
		if (req.body.edit_f_name === "" || req.body.edit_l_name === "" || req.body.edit_email === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`UPDATE employees set name = '${req.body.edit_name}', email = '${req.body.edit_email}' WHERE employee_id = '${req.body.edit_employee_id}' `, function (err, result, fields) {
					con.release();
					if(err) throw err;

					res.redirect("/admins");
					return;
				});
			});
		}
	}
	if (action === "add") {
		if (req.body.new_name === "" || req.body.new_email === "" || req.body.new_password === "") {
			res.send("error");
		} else {
			pool.getConnection((err, con) => {
				if (err) throw err;
				con.query(`INSERT INTO employees (employee_id, email , name, password, role) VALUES (0,'${req.body.new_email}','${req.body.new_name}','${req.body.new_password}', 1)`, function (err, result, fields) {
					con.release();
					if(err) throw err;
					res.redirect("/admins");
				});
			});
		}
	}
});

module.exports = router;