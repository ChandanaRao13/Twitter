//defining the login controller
twitterApp.controller('whoToFollowController', function($scope, $http) {
	$scope.followSubmit = function(toFollowEmailId,toFollowFirstName,toFollowLastName,toFollowTwitterHandle) {
	
		$http({
			method : "POST",
			url : '/updateFollowingList',
			data : {
				"toFollowEmailId" : toFollowEmailId,
				"toFollowFirstName":toFollowFirstName,
				"toFollowLastName":toFollowLastName,
				"toFollowTwitterHandle":toFollowTwitterHandle
			}
		}).success(function(data) {
			if(data !== 404){			
				window.location.assign("/userHome");
			}
		}).error(function(error) {});
};
});