
var crypto = require('crypto');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	//mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('tweets');
		var userProfileColl = mongo.collection('userProfile');
		coll.insert({"emailId":msg.emailId,"originalTweetFirstName":msg.tweeterFirstName,"originalTweetLastName":msg.tweeterLastName,"originalTweetTwitterHandle":msg.tweeterTwitterHandle,"twitterText":msg.tweetText,"tweetTime":new Date(),"tweetOwnerIdFirstName":msg.firstName,"tweetOwnerIdLastName":msg.lastName,"tweetOwnerIdTwitterHandle":msg.twitterHandle});
		userProfileColl.findOne({"emailId":msg.emailId},{"tweetCount":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				if(user && user.hasOwnProperty("tweetCount")){
					coll.update({'emailId':msg.emailId},{$set: {"tweetCount": parseInt(user.tweetCount)+1}});
					res.code='200';
					callback(null,res);
				}
			}
		});
	//});
};