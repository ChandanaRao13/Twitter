
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
		coll.findOne({"emailId":msg.emailId},{"following":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				var followingList=[];
				for(var j=0; j<user.following.length; j++){
					followingList.push({"emailId":user.following[j].emailId,"firstName":user.following[j].firstName,"lastName":user.following[j].lastName,"twitterHandle":user.following[j].twitterHandle});
				}
				res.value={"followingList" : followingList};
				res.code='200';
				callback(null,res);
			}
		});
	//});
};