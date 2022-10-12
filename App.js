// module imports
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var mysql = require('mysql');
var fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, __dirname+"/public/image")
    },
    filename: (req, file, cb) =>{
        // console.log(file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length))
        let originalname = file.originalname;
        cb(null, "homepage" + originalname.substring(originalname.lastIndexOf("."), originalname.length))
    }
})
// const upload = multer({dest: __dirname + '/public/image'});
const upload = multer({storage: storage});
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
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM background`, function (err, result, fields) {
    
            con.release();
            // console.log(result[0].home_page)
            res.render("home", {year: new Date().getFullYear(), title: "Homepage", image: result[0].home_page});
        });
    });
})

app.get("/ride", (req, res)=>{
    // res.send("Hello World!");
    res.render("ride", {year: new Date().getFullYear(), title: "Ride"});
})

app.post("/ride", (req, res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let pick = req.body.pick;
    let destination = req.body.destination;

    if (name===""||email===""||phone===""||pick===""||destination===""){
        res.send('error');
    }

    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`INSERT INTO rideRequests (request_id,name,email,phone,pickup_address,destination) VALUES (0,'${name}','${email}','${phone}','${pick}','${destination}') `, function (err, result, fields) {
    
            con.release();
            
        });
    });

    res.redirect('/ride')
})

app.get("/about", (req, res)=>{
    // res.send("Hello World!");
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM background`, function (err, result, fields) {
    
            con.release();
            // console.log(result[0].home_page)
            res.render("about", {year: new Date().getFullYear(), title: "About us", about_image: result[0].about_page});
        });
    });
})

app.get("/contact", (req, res)=>{
    // res.send("Hello World!");
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM background`, function (err, result, fields) {
    
            con.release();
            // console.log(result[0].home_page)
            res.render("contact", {year: new Date().getFullYear(), title: "Contact us", contact_image: result[0].contact_page});
        });
    });
})

app.post("/contact", (req, res)=>{
    let name = req.body.name;
    let address = req.body.address;
    let phone = req.body.phone;
    let service_id = req.body.services;
    let email = req.body.email;
    let comments = req.body.comments;
    let updates = (req.body.consent==1)?req.body.consent:0;

    if (name===""||address===""||phone===""||service_id===""||email===""||comments===""||updates===""){
        res.send('error');
    }

    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`INSERT INTO requests (request_id,name,address,phone,service_id,email,comments,updates) VALUES (0,'${name}','${address}','${phone}','${service_id}','${email}','${comments}','${updates}') `, function (err, result, fields) {
    
            con.release();
            
        });
    });

    res.redirect("/contact");
})

app.get("/news", (req, res)=>{
    // res.send("Hello World!");
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM background`, function (err, result, fields) {
    
            con.release();
            // console.log(result[0].home_page)
            res.render("news", {year: new Date().getFullYear(), title: "News", news_image: result[0].news_page});
        });
    });
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
            //console.log(result)
            resultobj = {
                drivers:result
            }
            res.render("drivers",resultobj);
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
                //console.log(result)
                resultobj = {
                    drivers:result
                }
                res.render("drivers",resultobj);
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
        if (req.body.edit_f_name===""||req.body.edit_l_name===""||req.body.edit_email===""){
            res.send('error');
        }
        else{
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
        if (req.body.new_f_name===""||req.body.new_l_name===""||req.body.new_email===""||req.body.new_password===""){
            res.send('error');
        }
        else{
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
            //console.log(result)
            resultobj = {
                admins:result
            }
            res.render("admins",resultobj);
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
                //console.log(result)
                resultobj = {
                    admins:result
                }
                res.render("admins",resultobj);
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
        if (req.body.edit_f_name===""||req.body.edit_l_name===""||req.body.edit_email===""){
            res.send('error');
        }
        else{
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
        if (req.body.new_f_name===""||req.body.new_l_name===""||req.body.new_email===""||req.body.new_password===""){
            res.send('error');
        }
        else{
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

// to change the images
app.get("/background", (req, res)=>{
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM background`, function (err, result, fields) {
    
            con.release();
            // console.log(result)
            res.render("background", {images:result})
        });
    });
})
app.post("/background", upload.single('image'), (req, res)=>{
    // console.log(imageName);
    // console.log(req.body.action);
    
    if(req.body.action && req.body.action === "for_home"){
        // console.log(req.body.action);
        let originalname = req.file.originalname;
        let imageName = "image/homepage"+originalname.substring(originalname.lastIndexOf("."), originalname.length);
        
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT home_page FROM background`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else {
                    // console.log(result[0].home_page.substring(result[0].home_page.lastIndexOf("/")+1, result[0].home_page.length));
                    // console.log(result[0].home_page);
                    let full_path = __dirname+"/public/"+result[0].home_page;
                    fs.unlinkSync(full_path);
                }
            });
        });

        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`UPDATE background SET home_page = '${imageName}'`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else res.redirect("/background");
            });
        });
    }
    /*else if(req.body.action && req.body.action === "for_about"){
        // console.log(req.body.action);
        let originalname = req.file.originalname;
        let imageName = "image/homepage"+originalname.substring(originalname.lastIndexOf("."), originalname.length);
        
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT home_page FROM background`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else {
                    // console.log(result[0].home_page.substring(result[0].home_page.lastIndexOf("/")+1, result[0].home_page.length));
                    // console.log(result[0].home_page);
                    let full_path = __dirname+"/public/"+result[0].home_page;
                    fs.unlinkSync(full_path);
                }
            });
        });

        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`UPDATE background SET home_page = '${imageName}'`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else res.redirect("/background");
            });
        });
    }
    else if(req.body.action && req.body.action === "for_contact"){
        // console.log(req.body.action);
        let originalname = req.file.originalname;
        let imageName = "image/homepage"+originalname.substring(originalname.lastIndexOf("."), originalname.length);
        
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT home_page FROM background`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else {
                    // console.log(result[0].home_page.substring(result[0].home_page.lastIndexOf("/")+1, result[0].home_page.length));
                    // console.log(result[0].home_page);
                    let full_path = __dirname+"/public/"+result[0].home_page;
                    fs.unlinkSync(full_path);
                }
            });
        });

        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`UPDATE background SET home_page = '${imageName}'`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else res.redirect("/background");
            });
        });
    }
    else if(req.body.action && req.body.action === "for_news"){
        // console.log(req.body.action);
        let originalname = req.file.originalname;
        let imageName = "image/homepage"+originalname.substring(originalname.lastIndexOf("."), originalname.length);
        
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT home_page FROM background`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else {
                    // console.log(result[0].home_page.substring(result[0].home_page.lastIndexOf("/")+1, result[0].home_page.length));
                    // console.log(result[0].home_page);
                    let full_path = __dirname+"/public/"+result[0].home_page;
                    fs.unlinkSync(full_path);
                }
            });
        });

        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`UPDATE background SET home_page = '${imageName}'`, function (err, result, fields) {
                con.release();
                if(err) throw err;
                else res.redirect("/background");
            });
        });
    }*/
})

// handling status errors
app.use((req, res)=>{
    res.status(404).send("Page not found.");
})

// app port listener
app.listen(port, (err)=>{
    if(err) return console.log(err);
    console.log(`Server up running at 'http://localhost:${port}/'`);
})