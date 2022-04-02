module.exports.getDate = function (){
	const today = new Date();
	
	const options ={
		weekDay:"long",
		day:"numeric",
		month:"long",
		year:"numeric"
	};
	
	return today.toLocaleDateString("en-US",options);
		
}

module.exports.getDay = function (){
	
	const today = new Date();
	
	const options ={
		weekDay:"long",
		
	};
	
	return today.toLocaleDateString("en-US",options);
	
}
// console.log(module.exports);