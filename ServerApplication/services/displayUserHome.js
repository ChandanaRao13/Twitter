var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		console.log("coll::dislpl::"+coll);
		coll.findOne({"emailId": msg.emailId},{"whoToFollow":1,"following":1,"_id":0,"tweetCount":1,"followingCount":1,"followerCount":1}, function(err, user){
			if (err) {
				throw err;
			} else{
				var response={
						tweetCount:user.tweetCount,
						followingCount:user.followingCount,
						followerCount:user.followerCount
				};
				if (user && user.hasOwnProperty("whoToFollow")){
					var whoToFollowListArray=[];
					for(var u=0; u<user.whoToFollow.length; u++){
						whoToFollowListArray.push({"emailId":user.whoToFollow[u].emailId, "firstName":user.whoToFollow[u].firstName, "lastName":user.whoToFollow[u].lastName ,"twitterHandle":user.whoToFollow[u].twitterHandle});
					}	

					var followingEmailIds=[];
					for(var j=0; j<user.following.length; j++){
						followingEmailIds.push(user.following[j].emailId);
					}
					followingEmailIds.push(msg.emailId);					
					response.whoToFollowList=whoToFollowListArray;
					
					//mongo.connect(mongoURL, function(){
						var coll = mongo.collection('tweets');
						coll.find({"emailId":{ $in: followingEmailIds}},{"_id":0}).sort({"tweetTime":-1}).toArray(function(err, tweetResult){
							if (err) {
								throw err;
							} else{
								if (tweetResult){
									response.tweetContent = tweetResult;
									res.value=response;
									callback(null,res);
								}
							}
						});
					//});
				}
			}
		});
	//});
};