//port for app to listen
const port = process.env.PORT || 3000;

//require the needed npm packages
const express = require("express");
const bodyParser = require("body-parser");

//creting an instance of express app
const app = express();

//array to hold todo list items
var listItems = [];

//setting the ejs view engine options in the express app
app.set("view engine", "ejs");

//setting the use of different nodeJS packages to use
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//route definitions for GET HTTP method
app.get("/",function(req,res){
	
	var today = new Date();
	
	var options ={
		weekDay:"long",
		day:"numeric",
		month:"long",
		year:"numeric"
	};
	
	var day = today.toLocaleDateString("en-US",options);
	// console.log(day);
	
	res.render("list",{kindOfDay:day, newListItems:listItems});
});

//route definition for POSt HTTP method
app.post("/", function(req, res){
	
	listItems.push(req.body.newItem);
	// console.log(listItem);
	res.redirect("/");
});
//event listener of expresse server
app.listen(port, function(req,res){
	console.log("Server started at port 3000!");
});