twitterApp.controller('tweetTextController', function($scope, $http) {
	$scope.tweetSuccess = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/addTweet',
			data : {
				"tweetText" : $scope.tweetText,
			}
		}).success(function(data) {
			$scope.tweetSuccess =false;
			//checking the response data for statusCode
			window.location.assign("/userHome");
		}).error();
	};

	
	
	$scope.userProfileTweetSubmit = function() {
		$http({
			method : "POST",
			url : '/addTweet',
			data : {
				"tweetText" : $scope.tweetText,
			}
		}).success(function(data) {
			$scope.tweetSuccess =false;
			//checking the response data for statusCode
			window.location.assign("/userProfile");
		}).error();
	};
});