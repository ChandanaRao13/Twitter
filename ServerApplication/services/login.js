
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	console.log("In handle request:"+ msg.reqType);
	
	var emailId=msg.emailId;
	var password=msg.password;
	var json_responses;
	
	var hashPassword = crypto.createHash("md5").update(password).digest('hex');
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		console.log("coll"+coll);
		coll.findOne({"emailId": emailId,"userPassword":hashPassword}, function(err, user){
			if (err) {
				throw err;
			} else{
				if (user && user.hasOwnProperty("emailId") && user.hasOwnProperty("userPassword")){
					 json_responses={
							firstName:user.firstName,
							lastName:user.lastName,
							twitterHandle:user.twitterHandle,
							followerCount:user.followerCount,
							followingCount:user.followingCount,
							tweetCount:user.tweetCount
							
					};
					 res.code='200';
					 res.value=json_responses;
					 callback(null, res);
				}
				else {
					res.code='401';
					mongo.close();
					callback(null, res);
				}
			}
		});
	//});
	
};

