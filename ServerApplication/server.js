//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login');
var signup = require('./services/signup');
var contact = require('./services/contact');
var userName = require('./services/userName');
var displayUserHome= require('./services/displayUserHome');
var addTweet = require('./services/addTweet');
var updateFollowingList=require('./services/updateFollowingList');
var doReTweet = require('./services/doReTweet');
var displayUserProfile=require('./services/displayUserProfile');
var displayFollowingList=require('./services/displayFollowingList');
var displayFollowerList=require('./services/displayFollowerList');
var updateProfile = require('./services/updateProfile');
var tweetsOfSearchTag = require('./services/tweetsOfSearchTag');

var mongo = require("./services/mongo");
var cnn = amqp.createConnection({host:'127.0.0.1'});
var mongoURL = "mongodb://localhost:27017/twitter";
mongo.connect(mongoURL, function(){

});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.reqType){

			case "signup":
				signup.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;

			case "login":
				login.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "contact":
				contact.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "userName":
				userName.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			}
		});
	});

	cnn.queue('userHome_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.reqType){

			case "displayUserHome":
				displayUserHome.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "updateFollowingList":
				updateFollowingList.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;

			
			}
		});
	});

	cnn.queue('userProfile_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.reqType){

			case "displayUserProfile":
				displayUserProfile.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "displayFollowingList":
				displayFollowingList.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "displayFollowerList":
				displayFollowerList.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "updateProfile":
				updateProfile.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			}
		});
	});
	
	
	cnn.queue('tweet_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.reqType){
			case "tweetsOfSearchTag":
				tweetsOfSearchTag.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
				
			case "doReTweet":
				doReTweet.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			case "addTweet":
				addTweet.handle_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				break;
			}
		});
	});
	
	



});