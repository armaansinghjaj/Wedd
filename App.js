// module imports
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var mysql = require('mysql');
const session = require('express-session')
app.set('view engine', 'ejs'); // uncomment when using ejs
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // uncomment when using CSS or images in the project
const port = process.env.port || 80;


var sess = {
    drivers:[],
    edit_driver_id:null,
    edit_admin_id:null,
    edit_f_name:null,
    edit_l_name:null,
    edit_email:null
};

var pool = mysql.createPool({
    connectionLimit:100,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "wedddb"
});

// Handling routes
// description: use the anyRoute.js file from routes folder to handle endpoints that startes with /anyRoute

// const anyRoute = require(__dirname+"/routes/anyROute");
// app.use("/anyRouter", anyRoute)

// route methods
app.get("/", (req, res)=>{
    // res.send("Hello World!");
    res.render("home", {year: new Date().getFullYear(), title: "Homepage"});
})

app.get("/ride", (req, res)=>{
    // res.send("Hello World!");
    res.render("ride", {year: new Date().getFullYear(), title: "Ride"});
})

app.get("/about", (req, res)=>{
    // res.send("Hello World!");
    res.render("about", {year: new Date().getFullYear(), title: "About us"});
})

app.get("/contact", (req, res)=>{
    // res.send("Hello World!");
    res.render("contact", {year: new Date().getFullYear(), title: "Contact us"});
})

app.get("/news", (req, res)=>{
    // res.send("Hello World!");
    res.render("news", {year: new Date().getFullYear(), title: "News"});
})

app.get("/login", (req, res)=>{
    // res.send("Hello World!");
    res.render("login", {year: new Date().getFullYear(), title: "Login"});
})
app.post("/login", (req, res)=>{
    
})

app.get("/admin", (req, res)=>{
    // res.send("Hello World!");
    res.render("admin");
})
app.get("/drivers", (req, res)=>{
    // res.send("Hello World!");

    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM driver `, function (err, result, fields) {
    
            con.release();
            sess.drivers=result;
            sess.edit_driver_id = null;
            sess.edit_email = null;
            sess.edit_f_name = null;
            sess.edit_l_name = null;
            res.render("drivers",sess);
        });
    });
    
})
app.post("/drivers", (req, res)=>{
    // res.send("Hello World!");
    let action = req.body.action;
    if (action==='edit') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM driver WHERE driver_id = '${req.body.selected}' `, function (err, result, fields) {
                con.release();
                sess.edit_driver_id = result[0].driver_id;
                sess.edit_email = result[0].email;
                sess.edit_f_name = result[0].first_name;
                sess.edit_l_name = result[0].last_name;

                res.render("drivers",sess);
                return;
                
            });
        });
    }
    if (action==='delete') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`DELETE FROM driver WHERE driver_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                res.redirect('/drivers');
                return;
            });
        });
        
        
    }
    if (action==='update') {
        if (req.body.edit_f_name===""||req.body.edit_l_name===""||req.body.edit_email==="")
        {
            res.send('error');
        }
        else
        {

        
            pool.getConnection((err, con)=>{
                if (err) throw err;
                con.query(`UPDATE driver set first_name = '${req.body.edit_f_name}', last_name = '${req.body.edit_l_name}', email = '${req.body.edit_email}' WHERE driver_id = '${req.body.edit_driver_id}' `, function (err, result, fields) {
            
                    con.release();
                    res.redirect('/drivers');
                    return;
                });
            });
        }
    }
    if (action==='add') {
        if (req.body.new_f_name===""||req.body.new_l_name===""||req.body.new_email===""||req.body.new_password==="")
        {
            res.send('error');
        }
        else
        {
            pool.getConnection((err, con)=>{
                if (err) throw err;
                con.query(`INSERT INTO driver (driver_id, email , first_name,last_name,password) VALUES (0,'${req.body.new_email}','${req.body.new_f_name}','${req.body.new_l_name}','${req.body.new_password}')`, function (err, result, fields) {
            
                    con.release();
                    res.redirect("/drivers");
                });
            });
        }
    }
})
app.get("/admins", (req, res)=>{
    // res.send("Hello World!");

    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM admin `, function (err, result, fields) {
    
            con.release();
            sess.admins=result;
            sess.edit_admin_id = null;
            sess.edit_email = null;
            sess.edit_f_name = null;
            sess.edit_l_name = null;
            res.render("admins",sess);
        });
    });
    
})
app.post("/admins", (req, res)=>{
    // res.send("Hello World!");
    let action = req.body.action;
    if (action==='edit') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM admin WHERE admin_id = '${req.body.selected}' `, function (err, result, fields) {
                con.release();
                sess.edit_admin_id = result[0].admin_id;
                sess.edit_email = result[0].email;
                sess.edit_f_name = result[0].first_name;
                sess.edit_l_name = result[0].last_name;

                res.render("admins",sess);
                return;
                
            });
        });
    }
    if (action==='delete') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`DELETE FROM admin WHERE admin_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                res.redirect('/admins');
                return;
            });
        });
        
        
    }
    if (action==='update') {
        if (req.body.edit_f_name===""||req.body.edit_l_name===""||req.body.edit_email==="")
        {
            res.send('error');
        }
        else
        {
            pool.getConnection((err, con)=>{
                if (err) throw err;
                con.query(`UPDATE admin set first_name = '${req.body.edit_f_name}', last_name = '${req.body.edit_l_name}', email = '${req.body.edit_email}' WHERE admin_id = '${req.body.edit_admin_id}' `, function (err, result, fields) {
            
                    con.release();
                    res.redirect('/admins');
                    return;
                });
            });
        }
    }
    if (action==='add') {
        if (req.body.new_f_name===""||req.body.new_l_name===""||req.body.new_email===""||req.body.new_password==="")
        {
            res.send('error');
        }
        else
        {
            pool.getConnection((err, con)=>{
                if (err) throw err;
                con.query(`INSERT INTO admin (admin_id, email , first_name,last_name,password) VALUES (0,'${req.body.new_email}','${req.body.new_f_name}','${req.body.new_l_name}','${req.body.new_password}')`, function (err, result, fields) {
            
                    con.release();
                    res.redirect("/admins");
                });
            });
        }
    }
})

// using shorthand to access '/contact' both for get and post request
// app
//     .route("/contact")
//     .get((req, res)=>{})
//     .pose((req, res)=>{});

// handling status errors
app.use((req, res)=>{
    res.status(404).send("Page not found.");
})

// app port listener
app.listen(port, (err)=>{
    if(err) return console.log(err);
    console.log(`Server up running at 'http://localhost:${port}/'`);
})