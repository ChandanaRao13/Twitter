
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		coll.update({'emailId':msg.emailId},{$set: {userName: msg.userName, contactInfo : msg.contactInfo,locationInfo : msg.locationInfo,birthDate : msg.birthDate }}); 
		res.code='200';
		callback(null,res);
	//});
};