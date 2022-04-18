//port for app to listen
const port = process.env.PORT || 3000;

//require the needed npm packages
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const _ = require("lodash");

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
mongoose.connect("mongodb+srv://admin-kumargn:Gnk69%40Jay73@cluster0.vpzxn.mongodb.net/todolistDB");

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

const customListSchema = new mongoose.Schema({
	name: String,
	items:[listSchema]
});

const CustomToDoList = mongoose.model("customToDoList",customListSchema);

//route definitions for GET HTTP method
app.get("/",function(req,res){
	
	Item.find({},function(err,foundItems){
		//insert default items only if the array is empty
		if(foundItems.length == 0){
			Item.insertMany(defaultItems, function(err){
				if(err){
					console.log("Update to DB failed :-(");
				}else{
					console.log("Update to DB successful :-)!");
				}
			});
			res.redirect("/");
		}else{
			res.render("list",{listTitle:date.getDate(), newListItems:foundItems});	
		}
		
	});
	
	
});

//definitions for custom routes for GET HTTP method
app.get("/:customListName",function(req,res){
	
	//get the custom list name from the url parameters
	//use lodash capitalize method for Normalizing the naming conventions
	//and taking out case sensitivity based duplication
	const customListName = _.capitalize(req.params.customListName);
	
	//if the custom list name is not found in the DB create one else use existing
	CustomToDoList.findOne({name:customListName},function(err,foundList){
		if(!err){
			if(!foundList){
				
				const toDoList = new CustomToDoList({
					name:customListName,
					items:defaultItems
				});
				toDoList.save();
				res.redirect("/"+req.params.customListName);
			}else{
				
				res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
			}
		}
		});
	
	
});
//route definition for / POST route
app.post("/", function(req, res){
	
	const itemName = req.body.newItem;
	const listName = req.body.list;
	// console.log(itemName);
	// console.log(listName);
	
	const newItem = new Item({
		itemName:req.body.newItem
		});
	
	//If the ToDolist is default the same the added newItem
	//else find the relevant customList and push the new item onto that list
	if(req.body.list === date.getDate()){
		console.log("I am here!");
		newItem.save();
		res.redirect("/");	
	}else{
		CustomToDoList.findOne({name:req.body.list},function(err,foundList){
			console.log(foundList);
			foundList.items.push(newItem);
			foundList.save();
			res.redirect("/"+req.body.list);
		});
			
	}
	
	
});

app.post("/delete",function(req,res){
	// assigning the parsed values from EJS template to the variables
	const listName = req.body.listName;
	const itemName = req.body.newItem;
	
	
	//If the ToDolist is default the delete the checked item
	//else find the relevant customList and delete checked item from that list
	if(listName == date.getDate()){
		Item.findByIdAndDelete(req.body.checkbox,function(err){
		if(err){
			console.log("could not delete");
		}else{
			
			res.redirect("/");
		}
	});
	}else{
		const query = {name:listName};
		const options ={$pull:{items:{_id:req.body.checkbox}}};
		CustomToDoList.findOneAndUpdate(query ,options, function(err,foundList){
			if(!err){
				// redirect for rendering the custom list post updates. 
				res.redirect("/"+listName);
			}
			
		});
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