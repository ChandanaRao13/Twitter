//defining the login controller
twitterApp.controller('searchController', function($scope, $http) {

	$scope.userhomeFlag=false;
	$scope.searchView=true;

	$scope.getSearchTag= function(){
		$http({
			method : "POST",
			url : '/tweetsOfSearchTag',
			data : {
				"searchTag" : $scope.searchTag
			}
		}).success(function(data) {
			console.log("entered searchTag");
			if(data.statusTweetsOfSearchTag !== 404){
				$scope.searchView=false;
				$scope.userhomeFlag=true;
				$scope.searchTagTweets = data.searchTagTweets;
				
			}
		}).error(function(error) {

		});
	};


});