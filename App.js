// module imports
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs'); // uncomment when using ejs
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static("public")); // uncomment when using CSS or images in the project
const port = process.env.port || 80;

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