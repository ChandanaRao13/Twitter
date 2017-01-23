//defining the login controller
twitterApp.controller('reTweetController', function($scope, $http) {
	$scope.followingFlag = true;
	$scope.myTweets=false;
	$scope.followerFlag=true;
	$scope.retweet= function(tweetText,tweeterFirstName,tweeterLastName,tweeterTwitterHandle) {
		$http({
			method : "POST",
			url : '/doReTweet',
			data : {

				"tweetText":tweetText,
				"tweeterFirstName":tweeterFirstName,
				"tweeterLastName":tweeterLastName,
				"tweeterTwitterHandle":tweeterTwitterHandle
			}
		}).success(function(data) {
			window.location.assign("/userHome");

		}).error(function(error) {

		});
	};

	$scope.getFollowingList= function (){
		$http({
			method : "GET",
			url : '/displayFollowingList',
		}).success(function(data) {
			if(data.statusDisplayFollowingList !== 404){
				
				$scope.followingFlag = false;
				$scope.myTweets=true;
				$scope.followerFlag=true;
				$scope.followingList = data.followingList;
			}
		}).error(function(error) {

		});
	};
	
	$scope.getFollowerList= function (){
		$http({
			method : "GET",
			url : '/displayFollowerList',
		}).success(function(data) {
			if(data.statusDisplayFollowerList !== 404){
				$scope.followingFlag = true;
				$scope.myTweets=true;
				$scope.followerFlag=false;
				$scope.followerList = data.followerList;
			}
		}).error(function(error) {

		});
	};
	
	$scope.getGetTweets =function(){
		$scope.followingFlag = true;
		$scope.myTweets=false;
		$scope.followerFlag=true;
		$http({
			method : "GET",
			url : '/userProfile',
		}).success(function(data) {}		
		).error(function(error) {

		});
		
	};
	
	
});