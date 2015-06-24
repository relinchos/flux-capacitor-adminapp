angular.module('userManager').controller('UserListCtrl',function($scope, User ){

	var UserModel = User;

	$scope.testo = { oki: 'okikokioki' };


	$scope.userList = User.find();



});