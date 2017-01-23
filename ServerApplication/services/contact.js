
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var phone = msg.phone;
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		coll.findOne({"contactInfo": phone}, function(err, user){
			if (err) {
				throw err;
			} else{
				if (user && user.hasOwnProperty("contactInfo")) {
					console.log("Phone number already registered");
					res.value='ExistingPhone';
					callback(null, res);
				} else {
					//updating the user's entry in database
					coll.update({'emailId':emailId},{$set: {contactInfo: phone }}); 
					res.value='SuccessPhone';
					callback(null, res);
				}
			}
		});
	//});
};