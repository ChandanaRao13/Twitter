var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	console.log("In handle request:"+ msg.reqType);
	var username=msg.username;
	var emailId=msg.emailId;
	var firstName=msg.firstName;
	var lastName=msg.lastName;
	var json_responses;
	
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		coll.findOne({"userName": username}, function(err, user){
			if (err) {
				throw err;
			} else {
				if (user && user.hasOwnProperty("userName")) {
					console.log("UserName already exists");
					json_responses = {"status" : 403};
					res.value=json_responses;
					callback(null, res);
					
				} else {
					var twitterHandle;
					if(username !== undefined){
						twitterHandle = '@'+username;
					}
					coll.update({"emailId":emailId},{$set: {userName: username,twitterHandle:twitterHandle }}); 
					coll.update({ 'emailId': { $ne: emailId}},{$push:{whoToFollow:{"emailId":emailId,"firstName":firstName,"lastName":lastName,"twitterHandle":twitterHandle}}},{w:1, multi: true},function(err,updateWhoToFollow){});

					json_responses = {"status" : 200};
					res.value=json_responses;
					callback(null, res);
					
				}
			}
		});
	//});
};