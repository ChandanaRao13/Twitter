
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userProfile');
		coll.findOne({"emailId":msg.emailId},{"follower":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				var followerList=[];
				for(var j=0; j<user.follower.length; j++){
					followerList.push({"emailId":user.follower[j].emailId,"firstName":user.follower[j].firstName,"lastName":user.follower[j].lastName,"twitterHandle":user.follower[j].twitterHandle});
				}
				res.value = {"followerList" : followerList};
				res.code='200';
				callback(null,res);
			}
		});
	//});
};