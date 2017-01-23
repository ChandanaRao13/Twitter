twitterApp.controller('signupController', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.empty_userName = true;
	$scope.existing_userName = true;
	$scope.missingDetails = true;
	$scope.existingEmail = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checkUserName',
			data : {
				"username" : $scope.username
			}
		}).success(function(data) {
			//checking the response data for statusCode
			
			if (data.status === 401) {
				$scope.empty_userName = false;
				$scope.existing_userName = true;
			}
			else if (data.status === 403) {
				$scope.existing_userName = false;
				$scope.empty_userName = true;				
			}
			else {
				window.location.assign("/userHome"); 
			}
		}).error(function(error) {

		});
	};
	
	$scope.signUp = function() {
		$http({
			method : "POST",
			url : '/afterSignUp',
			data : {
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName,
				"emailId" : $scope.emailId,
				"password" : $scope.password,
			}
		}).success(function(data) {
			//checking the response data for statusCode
			
			if (data.statusAfterSignUp === 1) {
				$scope.missingDetails = true;
				$scope.existingEmail = false;
			}
			else if (data.statusAfterSignUp === 2) {
				$scope.missingDetails = true;
				$scope.existingEmail = false;				
			}
			else {
				window.location.assign("/contact"); 
			}
		}).error(function(error) {});
	};
});
