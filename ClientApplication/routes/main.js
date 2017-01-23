var ejs = require("ejs");
var mq_client = require('../rpc/client');



var fname,lname,pwd,email,phone,userName;
var signupLogin=false;


exports.displayTwitterHome = function (req, res) {
	ejs.renderFile('../views/twitterHome.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.displaySignUp = function(req,res){
	ejs.renderFile('../views/SignUp.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.afterSignUp = function(req,res){
	var fname = req.body.firstName;
	var lname = req.body.lastName;
	var emailId = req.body.emailId;
	var password = req.body.password;
	var msg_payload = { "firstName": fname, "lastName": lname, "emailId":emailId,"password":password, "reqType": "signup" };

	//check if user already exists
	if(fname.length > 0  && lname.length > 0 && emailId.length > 0 && password.length > 0){
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.value == 'ExistingEmail'){
					ejs.renderFile('../views/SignUp.ejs',{errorMessage:"EmailID already registered"}, function(err, result) {
						//render on success
						if (!err) {
							res.end(result);
						}
						//render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
				}
				else if(results.value == 'Success'){  
					req.session.emailId = emailId;
					req.session.firstName = fname;
					req.session.lastName = lname;
					req.session.fullName = fname+" "+lname;			
					ejs.renderFile('../views/contact.ejs', function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}});
				}
			}  
		});
	}else{
		ejs.renderFile('../views/SignUp.ejs',{errorMessage:"Please enter all the fields"}, function(err, result) {
			//render on success
			if (!err) {
				res.end(result);
			}
			//render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}
};


exports.afterContact = function (req,res){
	var phone = req.body.phone;
	var emailId = req.session.emailId;
	var msg_payload = { "phone": phone, "emailId": emailId,"reqType": "contact" };
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.value === 'ExistingPhone'){
				ejs.renderFile('../views/contact.ejs',{errorMessage:"Phone number already registered"}, function(err, result) {
					//render on success
					if (!err) {
						res.end(result);
					}
					//render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
			else if(results.value === 'SuccessPhone'){  
				ejs.renderFile('../views/userName.ejs', function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		}  
	});
};

exports.checkUserName = function(req,res){
	var username;
	var json_responses;
	username = req.body.username;
	signupLogin = true;
	req.session.tweetCount=0;
	req.session.followerCount=0;
	req.session.followingCount=0;
	var msg_payload={"firstName":req.session.firstName,"lastName":req.session.lastName,"emailId":req.session.emailId,"username":username};
	if(username !== '')	{
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else{
				res.send(results.value);
			}  
		});
	}
	else{
		json_responses = {"status" : 401};
		res.send(json_responses);
	}
};



exports.displayLogin =function(req,res){
	ejs.renderFile('../views/login.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};



exports.checklogin = function(req,res){
	var emailId, password;
	emailId = req.body.email;
	password = req.body.password;
	var json_responses;
	signupLogin=false;
	var msg_payload={"emailId":emailId,"password":password,"reqType":"login"};
	if(emailId!== null && password!== null ){
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{
				if(results.code === '200'){
					req.session.emailId=emailId;
					req.session.firstName =results.value.firstName;
					req.session.lastName =results.value.lastName;
					req.session.fullName=results.value.firstName+" "+results.value.lastName;
					req.session.twitterHandle= results.value.twitterHandle;
					req.session.followerCount=results.value.followerCount;
					req.session.followingCount=results.value.followingCount;
					req.session.tweetCount=results.value.tweetCount;
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
				}
				else if(results.code === '401'){
					console.log("enterrring");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			}
		});
	}
	else{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
};

exports.displayUserHome = function(req,res){
	var result;
	var whoToFollowList='';
	var tweetContent='';
	var msg_payload={"emailId":req.session.emailId,"reqType":"displayUserHome"};
	if(req.session.emailId){
		mq_client.make_request('userHome_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{

				result = {
						fullName: req.session.fullName,
						twitterHandle: req.session.twitterHandle,
						tweetCount:results.value.tweetCount,
						followerCount:results.value.followerCount,
						followingCount:results.value.followingCount,
						whoToFollowList : results.value.whoToFollowList,
						tweetContent:results.value.tweetContent
				};


				req.session.tweetCount=results.tweetCount;
				req.session.followingCount=results.followingCount;
				req.session.followerCount=results.followerCount;
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("userHome", result);
			}
		});
	}
	else
	{
		res.redirect('/twitterHome');
	}
};


exports.displayUserProfile=function(req,res){
	var result;
	var whoToFollowList='';
	var tweetContent='';
	var msg_payload = {"reqType":"displayUserProfile","emailId":req.session.emailId};
	if(req.session.emailId){
		mq_client.make_request('userProfile_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{
				if(results.code==='200'){
					req.session.tweetCount=results.valuetweetCount;
					req.session.followingCount=results.value.followingCount;
					req.session.followerCount=results.value.followerCount;
					results.value.fullName=req.session.fullName;
					req.session.birthDate=results.value.birthDate;
					req.session.locationInfo=results.value.locationInfo;
					req.session.contactInfo=results.value.contactInfo;
					res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render("userProfile", results.value);
				}
			}
		});
	}
	else{
		res.redirect('/twitterHome');
	}
};

exports.addTweet=function(req,res){
	var json_response;
	var tweetText =req.body.tweetText;

	var msg_payload={"emailId":req.session.emailId,"reqType":"addTweet","tweetText":tweetText,"firstName":req.session.firstName,"lastName":req.session.lastName,"twitterHandle":req.session.twitterHandle};
	if(req.session.emailId){
		mq_client.make_request('tweet_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{
				if(results.code==='200'){
					json_response = {"tweetStatus":200};
					res.send(json_response);
				}

			}
		});

	}else{
		res.redirect('/twitterHome');
	}
};

exports.updateFollowingList= function(req,res){
	var toFollowEmailId = req.body.toFollowEmailId;
	var toFollowFirstName = req.body.toFollowFirstName;
	var toFollowLastName = req.body.toFollowLastName;
	var toFollowTwitterHandle = req.body.toFollowTwitterHandle;
	var msg_payload = {"reqType":"updateFollowingList","emailId":req.session.emailId,"firstName":req.session.firstName,"lastName":req.session.lastName,"twitterHandle":req.session.twitterHandle,"toFollowEmailId":toFollowEmailId,"toFollowFirstName":toFollowFirstName,"toFollowLastName":toFollowLastName,"toFollowTwitterHandle":toFollowTwitterHandle};
	if(req.session.emailId){
		//add a row into following table (M,dash)
		mq_client.make_request('userHome_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{
				if(results.code==='200'){
					var json_response = {"updateFollowingList":200};
					res.send(json_response);
				}
			}
		});

	}
};

exports.doReTweet = function(req,res){
	var tweetText = req.body.tweetText;
	var tweeterFirstName=req.body.tweeterFirstName;
	var tweeterLastName=req.body.tweeterLastName;
	var tweeterTwitterHandle =req.body.tweeterTwitterHandle;
	var msg_payload={"reqType":"doReTweet","emailId":req.session.emailId,"firstName":req.session.firstName,"lastName":req.session.lastName,"twitterHandle":req.session.twitterHandle,"tweetText":tweetText,"tweeterFirstName":tweeterFirstName,"tweeterLastName":tweeterLastName,"tweeterTwitterHandle":tweeterTwitterHandle};
	mq_client.make_request('tweet_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}else{
			if(results.code==='200'){
				var json_response = {"retweetStatus":200};
				res.send(json_response);
			}
		}
	});
};

exports.displayFollowingList =function(req,res){
	var msg_payload={"reqType":"displayFollowingList","emailId":req.session.emailId};
	mq_client.make_request('userProfile_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}else{
			if(results.code==='200'){
				var json_response = {"followingList" : results.value.followingList , "statusDisplayFollowerList": 200};
				res.send(json_response);
			}
		}
	});
};

exports.displayFollowerList =function(req,res){
	var msg_payload={"reqType":"displayFollowerList","emailId":req.session.emailId};
	mq_client.make_request('userProfile_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}else{
			if(results.code==='200'){
				var json_response = {"followerList" : results.value.followerList , "statusDisplayFollowerList": 200};
				res.send(json_response);
			}
		}
	});
};

exports.tweetsOfSearchTag=function(req,res){
	var msg_payload={"reqType":"tweetsOfSearchTag","emailId":req.session.emailId,"searchTag":req.body.searchTag};
	mq_client.make_request('tweet_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}else{
			if(results.code==='200'){
				var json_response = {"searchTagTweets":results.value.searchTagTweets,"statusTweetsOfSearchTag":200};
				res.send(json_response);
			}
		}
	});
	

};

exports.logOut = function(req,res){
	req.session.destroy();
	res.redirect('/twitterHome');

};


exports.updateProfile = function(req,res){
	var msg_payload={"reqType":"updateProfile","emailId":req.session.emailId,"userName": req.body.userName, "contactInfo" : req.body.contactInfo,"locationInfo" : req.body.locationInfo,"birthDate" : req.body.birthDate};
	if(req.session.emailId)
	{
		mq_client.make_request('userProfile_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}else{
				if(results.code==='200'){
					var json_responses = {"status1" : 200};
					res.send(json_responses);
				}
			}
		});
	}
	else
	{
		res.redirect('/');
	}
};

