/**
 * New node file
 */
var request = require("request")
, express = require("express")
,assert = require("assert")
,http = require("http");

describe('http tests', function(){
	

	it('should return profile page if the url is correct', function(done){
		http.get('http://localhost:3000/userProfile', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	
	it('should signup a new user', function(done) {
		request.post(
			    'http://localhost:3000/contactInfo',
			    { form: { fname: 'Ram',lname : 'Kashyap' , emailID : 'ram@bt.com' , passwd:'asdf'} },
			    function (error, response, body) {
			    	assert.equal(202, response.statusCode);
			    	done();
			    }
			);
	  });

	
	it('should not return the login page if the url is wrong', function(done){
		http.get('http://localhost:3000/dologin', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});  

	it('should login existing user', function(done) {
		request.post(
			    'http://localhost:3000/checkLogin',
			    { form: { emailID: 'ram@bt.com',password:'asdf' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	
	it('should return the tweets with hashtag', function(done) {
		request.post(
			    'http://localhost:3000/getSearch',
			    { form: { searchKey: '#this', emailID : 'ram@bt.com' , passwd:'asdf'},
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});
