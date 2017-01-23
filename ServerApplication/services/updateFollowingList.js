
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var toFollowEmailId = msg.toFollowEmailId;
	var toFollowFirstName = msg.toFollowFirstName;
	var toFollowLastName = msg.toFollowLastName;
	var toFollowTwitterHandle = msg.toFollowTwitterHandle;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userProfile');
		coll.update({'emailId':msg.emailId},{$push: {"following": {"emailId":toFollowEmailId,"firstName":toFollowFirstName,"lastName":toFollowLastName,"twitterHandle":toFollowTwitterHandle}}});
		coll.update({'emailId':toFollowEmailId},{$push: {"follower":{"emailId":msg.emailId,"firstName":msg.firstName,"lastName":msg.lastName,"twitterHandle":msg.twitterHandle}}});
		coll.update({"emailId":msg.emailId},{$pull:{ "whoToFollow":{"emailId":toFollowEmailId}}});
		coll.findOne({"emailId":msg.emailId},{"followingCount":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				if(user && user.hasOwnProperty("followingCount")){
					var fc = parseInt(user.followingCount);
					fc= fc+1;
					
					coll.update({'emailId':msg.emailId},{$set: {"followingCount": fc}});
					coll.findOne({"emailId":toFollowEmailId},{"followerCount":1,"_id":0},function(err, user){
						if (err) {
							throw err;
						} else{
							if(user && user.hasOwnProperty("followerCount")){
								var flc = parseInt(user.followerCount);
								flc= flc+1;
								coll.update({'emailId':toFollowEmailId},{$set: {"followerCount": flc}});
								res.code='200';
								callback(null,res);
							}
						}
					});
				}
			}
		});
	//});	
};