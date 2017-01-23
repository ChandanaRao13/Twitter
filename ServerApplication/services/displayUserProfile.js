
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var response;
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		coll.findOne({"emailId": msg.emailId},{"_id":0}, function(err, user){
			if (err) {
				throw err;
			} else{
				response={
						tweetCount:user.tweetCount,
						followingCount:user.followingCount,
						followerCount:user.followerCount
				};
				response.firstName=user.firstName;
				response.lastName = user.lastName;
				response.userName = user.userName;
				response.birthDate = user.birthDate;
				response.contactInfo = user.contactInfo;
				response.locationInfo = user.locationInfo;
				response.fullName= user.fullName;
				response.twitterHandle= user.twitterHandle;
				response.tweetCount=user.tweetCount;
				response.followerCount=user.followerCount;
				response.followingCount=user.followingCount;
				if (user && user.hasOwnProperty("whoToFollow")){
					var whoToFollowListArray=[];
					for(var u=0; u<user.whoToFollow.length; u++){
						whoToFollowListArray.push({"emailId":user.whoToFollow[u].emailId, "firstName":user.whoToFollow[u].firstName, "lastName":user.whoToFollow[u].lastName ,"twitterHandle":user.whoToFollow[u].twitterHandle});
					}	
					
					response.whoToFollowList= whoToFollowListArray;


					//mongo.connect(mongoURL, function(){
						var coll = mongo.collection('tweets');
						coll.find({"emailId": msg.emailId},{"_id":0}).sort({"tweetTime":-1}).toArray(function(err, tweetResult){
							if (err) {
								throw err;
							} else{
								if (tweetResult){
									response.tweetContent = tweetResult;
									res.code='200';
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