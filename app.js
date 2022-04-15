//port for app to listen
const port = process.env.PORT || 3000;

//require the needed npm packages
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// console.log(date());
//creating an instance of express app
const app = express();

//array to hold todo list items
const listItems = [];
const workItems = [];

//setting the ejs view engine options in the express app
app.set("view engine", "ejs");

//setting the use of different nodeJS packages to use
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//define the connection to mongoDB server
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB");

//define the DB schema for the collection of items
const listSchema = new mongoose.Schema(
	{
		itemName:String
	}
);

//define the collection
const Item = mongoose.model("Item",listSchema);

//define items for the collection
const item1 = new Item({
	itemName:"Welcome to do the Daily lIst"
});

const item2 = new Item({
	itemName:"Review plans for the day"
});

const item3 = new Item({
	itemName:"Create the list for the day!"
});

//define the defaulit items array
const defaultItems =[item1,item2,item3];

//define insert items to DB

Item.insertMany(defaultItems, function(err){
	if(err){
		console.log("Update to DB failed :-(");
	}else{
		console.log("Update to DB successful :-)!");
	}
});

//route definitions for GET HTTP method
app.get("/",function(req,res){
	
	Item.find({},function(err,foundItems){
		// console.log(foundItems);
		// res.render("list",{listTitle:date.getDate(), newListItems:listItems});
		res.render("list",{listTitle:date.getDate(), newListItems:foundItems});
	});
	
	
});

//route definition for / POST route
app.post("/", function(req, res){
	// console.log(req.body);
//implements conditional logic for checking the specific route or page/ layout
// uses the action element name for the conditional check
	if(req.body.list === "Work"){
		
		workItems.push(req.body.newItem);
		res.redirect("/work");	
	}else{
		
		listItems.push(req.body.newItem);
		res.redirect("/");	
	}
	
	
});

//event listener for work  GET route
app.get("/work", function(req, res){
	res.render("list",{listTitle:"Work List", newListItems:workItems});
});

//event listener for work  POST route
app.post("/work", function(req, res){
	
	// console.log(req.body.newItem);
	workItems.push(req.body.newItem);
	// console.log(listItem);
	res.redirect("/work");
});


//event listener of expresse server
app.listen(port, function(req,res){
	console.log("Server started at port 3000!");
});