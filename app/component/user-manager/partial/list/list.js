angular.module('userManager').controller('UserListCtrl',function($scope, User ){

	var UserModel = User;


	$scope.userList = User.find();



});