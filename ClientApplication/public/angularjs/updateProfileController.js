//defining the login controller
twitterApp.controller('updateProfileController', function($scope, $http) {
	$scope.updateProfile=true;
	$scope.showProfile =false;	


	$scope.updateProfile= function(){
		alert("entered update profile controller");
		$scope.updateProfile=false;
		$scope.showProfile =true;
		$http({
			method : "POST",
			url : '/userProfile',
		}).success(function(data) {
			if(data.statusUpdateProfileForm === 200){
				
				$scope.updateProfile=false;
				$scope.showProfile =true;
				windows.location.assign('/userProfile');
			}
		}).error(function(error) {});
	};


	$scope.saveChanges =function (){
		$http({
			method : "POST",
			url : '/updateProfile',
			data : { "firstName" : $scope.firstName ,
				"lastName" : $scope.lastName,
				"userName" : $scope.userName,
				"birthDate" : $scope.birthDate,
				"contactInfo" : $scope.contactInfo,
				"locationInfo" : $scope.locationInfo
			}
		}).success(function(data) {
			if(data.status1 === 200){
				$scope.updateProfile=false;
				$scope.showProfile =true;
				window.location.assign('/userProfile');
			}
		}).error(function(error) {});
	};
	
	$scope.cancelChanges =function (){
		$scope.updateProfile=true;
		$scope.showProfile =false;
		$http({
			method : "GET",
			url : '/userProfile',
		}).success(function(data) {}).error(function(error) {});
	};
});