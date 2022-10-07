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
app.set('view engine', 'ejs'); // uncomment when using ejs
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // uncomment when using CSS or images in the project
const port = process.env.port || 80;

var pool = mysql.createPool({
    connectionLimit:100,
    host: "localhost",
    port: 3307,
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
    var resultobj;
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM driver `, function (err, result, fields) {
    
            con.release();
            //console.log(result)
            resultobj = {
                drivers:result
            }
            res.render("drivers",resultobj);
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
            });
        });
        
    }
    if (action==='delete') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM driver WHERE driver_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    drivers:result
                }
                res.render("drivers",resultobj);
            });
        });
        
    }
    if (action==='update') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM driver WHERE driver_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    drivers:result
                }
                res.render("drivers",resultobj);
            });
        });
        
    }
    if (action==='add') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM driver WHERE driver_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    drivers:result
                }
                res.render("drivers",resultobj);
            });
        });
        
    }
})
app.get("/admins", (req, res)=>{
    // res.send("Hello World!");
    var resultobj;
    pool.getConnection((err, con)=>{
        if (err) throw err;
        con.query(`SELECT * FROM admin `, function (err, result, fields) {
    
            con.release();
            //console.log(result)
            resultobj = {
                admins:result
            }
            res.render("admins",resultobj);
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
            });
        });
        
    }
    if (action==='delete') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM admin WHERE admin_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    admins:result
                }
                res.render("admins",resultobj);
            });
        });
        
    }
    if (action==='update') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM admin WHERE admin_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    admins:result
                }
                res.render("admins",resultobj);
            });
        });
        
    }
    if (action==='add') {
        pool.getConnection((err, con)=>{
            if (err) throw err;
            con.query(`SELECT * FROM admin WHERE admin_id = '${req.body.selected}' `, function (err, result, fields) {
        
                con.release();
                //console.log(result)
                resultobj = {
                    admins:result
                }
                res.render("admins",resultobj);
            });
        });
        
    }
})

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