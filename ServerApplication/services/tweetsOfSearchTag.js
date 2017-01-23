var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";



exports.handle_request =function handle_request(msg, callback){
	var res = {};
	var phone = msg.phone;
	var emailId = msg.emailId;
	console.log("In handle request:"+ msg.reqType);
	var searchTag = msg.searchTag;
	var regexValue='\.*'+searchTag+'\.';
	var searchResults = [];
	console.log("entered searchTag node::"+searchTag);

	//mongo.connect(mongoURL, function(){
		var coll = mongo.collection('tweets');
		coll.find({"twitterText": new RegExp(searchTag,'i')},{"emailId":1,"twitterText":1,"tweetOwnerIdFirstName":1,"tweetOwnerIdLastName":1,"tweetOwnerIdTwitterHandle":1,"_id":0}).toArray(function(err,searchres){
			if(searchres){
				for (var u=0; u<searchres.length; u++){
					searchResults.push({"twitterHandle":searchres[u].tweetOwnerIdTwitterHandle,"tweetOwnerEmail":searchres[u].emailId, "tweetText":searchres[u].twitterText,"firstName":searchres[u].tweetOwnerIdFirstName,"lastName":searchres[u].tweetOwnerIdLastName});
				}
				res.value = {"searchTagTweets":searchResults};
				res.code='200';
				callback(null,res);
			}
		});
	//});
};