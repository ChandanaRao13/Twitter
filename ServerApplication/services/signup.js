
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userProfile');
		coll.findOne({emailId: msg.emailId}, function(err, user){
			if (err) {
				throw err;
			} else{
				if (user && user.hasOwnProperty("emailId")) {
					res.value='ExistingEmail';
					callback(null, res);
				} else{
					//inserting the user's entry in database
					var newPassword = crypto.createHash("md5").update(msg.password)
					.digest('hex');
					var addFollowList=[];
					coll.find({ 'emailId': { $ne: msg.emailId}},{"emailId":1,"firstName":1,"lastName":1,"twitterHandle":1,"_id":0}).toArray(function(err, userWhoToFollow){
						if(userWhoToFollow){
							for(var u=0; u<userWhoToFollow.length; u++){
								addFollowList.push({"emailId":userWhoToFollow[u].emailId, "firstName":userWhoToFollow[u].firstName, "lastName":userWhoToFollow[u].lastName ,"twitterHandle":userWhoToFollow[u].twitterHandle});
							}
							// insert new user into userProfile record
							coll.insert({"emailId":msg.emailId,"userPassword":newPassword,"firstName":msg.firstName,"lastName":msg.lastName, "userName":"","twitterHandle" : "", "followingCount" : 0, "followerCount" : 0, "tweetCount" : 0,"birthDate" : "", "contactInfo": "","locationInfo" : "", "follower" : [], "following" : [],"whoToFollow":addFollowList});
						}else{
							coll.insert({"emailId":msg.emailId,"userPassword":newPassword,"firstName":msg.firstName,"lastName":msg.lastName, "userName":"","twitterHandle" : "", "followingCount" : 0, "followerCount" : 0, "tweetCount" : 0,"birthDate" : "", "contactInfo": "","locationInfo" : "", "follower" : [], "following" : [],"whoToFollow":[]});
						}
					});
					res.value='Success';
					callback(null, res);

				}
				
			}
		});
	//});
	
};

