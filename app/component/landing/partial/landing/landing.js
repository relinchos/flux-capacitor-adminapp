angular.module('landing').controller('LandingCtrl',function($scope, FcSession, Person, $timeout ){


	// DATA

	$scope.session = FcSession;
	$scope.personData = {};
	var personId = FcSession.user.person.id;

	$scope.loadingInfo = true;

	Person.findById({ id: personId }, function(thePerson){
		
		$scope.personData.fullName = thePerson.fullName;
		//$scope.personData.firstName = thePerson.firstName;
		//$scope.personData.lastName = thePerson.lastName;
		//$scope.personData.email = thePerson.email;
		//$scope.personData.dni = thePerson.dni;
		//$scope.personData.avatar = thePerson.avatar;
		$scope.personData.marks = thePerson.marks;

		$timeout( function(){
			$scope.loadingInfo = false;
		}, 700);

	});

	
});