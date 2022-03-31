//port for app to listen
const port = process.env.PORT || 3000;

//require the needed npm packages
const express = require("express");
const bodyParser = require("body-parser");

//creting an instance of express app
const app = express();

//setting the ejs view engine options in the express app
app.set("view engine", "ejs");

//setting the use of different nodeJS packages to use
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))


var today = new Date();
var currDay= today.getDay();
// console.log(currDay);

//route definitions for GET HTTP method
app.get("/",function(req,res){
	// console.log("Hello World!");
	var day = "";
	
	switch(currDay){
		case 0:
			day = "Sunday";
			break;
		case 1:
			day = "Monday";
			break;
		case 2:
			day = "Tuesday";
			break;	
		case 3:
			day = "Wednesday";
			break;
		case 4:
			day = "Thursday";
			// console.log("Hello "+day);
			break;
		case 5:
			day = "Friday";
			break;
		case 6:
			day = "Saturday";
			break;
		default:
			console.log("CurrentDay: "+currDay+ "??. Error! There are no more than 7 days in a week");
		 	break;
		}
	// render method for using the ejs file
	res.render("list",{kindOfDay:day});
});

//event listener of expresse server
app.listen(port, function(req,res){
	console.log("Server started at port 3000!");
});