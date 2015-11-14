angular.module( 'userProfile' ).controller( 'UserprofileCtrl', function( $scope, _, $modal, FcError, Person, FcSession, toaster ){

	



	// DATA

	$scope.session = FcSession;
	$scope.personData = {};
	var personId = FcSession.user.person.id;

	var originalData = '';
	var currentData = '';
	function takeSnapShot( obj ){
		var pickedObj = _.pick( obj, ['firstName', 'lastName', 'email', 'dni' ])
		return JSON.stringify( pickedObj );
	};

	var personData = Person.findById({ id: personId }, function(thePerson){
		
		$scope.personData.fullName = thePerson.firstName + ' ' + thePerson.lastName;
		$scope.personData.firstName = thePerson.firstName;
		$scope.personData.lastName = thePerson.lastName;
		$scope.personData.email = thePerson.email;
		$scope.personData.dni = thePerson.dni;
		$scope.personData.avatar = thePerson.avatar;

		originalData = takeSnapShot( $scope.personData );
		currentData = originalData + '';
	});



	$scope.dataNotChanged = function(){
		currentData = takeSnapShot( $scope.personData );
		return originalData === currentData;
	};




	//$scope.personData = _.pick( resolvedPerson, ['firstName', 'lastName', 'email', 'dni', 'avatar' ]);

	
	

	// UI

	$scope.dropdownActive = {
		userProfile: true,
		passChange: false,
		suscriptions: false
	};


	// FUNCTIONS

	$scope.profileItmClicked = function( $event, item ){
		$scope.dropdownActive[ item ] = !$scope.dropdownActive[ item ];
	};


	$scope.resetPassword = function(){
		alert('envío de email - password');
	};

	$scope.saveChanges = function(){

		Person.prototype$updateAttributes(
			{ id: personId }, 
			$scope.personData, 
			function( value ){

				FcSession.user.completeName = $scope.personData.fullName;
				FcSession.user.username = $scope.personData.firstName;
				FcSession.user.firstName = $scope.personData.firstName;
				FcSession.user.lastName = $scope.personData.lastName; 

				FcSession.save();

				originalData = takeSnapShot( $scope.personData );
				toaster.pop('success', "Cambios guardados");

			}, 
			function( value ){
				toaster.pop('error', "Error al guardar los cambios recientes");
			}
			);



	};



	// IMAGE CROP

	$scope.myImage='';
	$scope.myCroppedImage='';

	var context = {
		myCroppedImage: ''
	};

	var handleFileSelect=function(evt) {
		var file=evt.currentTarget.files[0];
		var reader = new FileReader();
		reader.onload = function (evt) {
			$scope.$apply(function($scope){
				$scope.myImage=evt.target.result;


				var modalInstance = $modal.open({
					size: 'lg',
					resolve: {
						myImage: function(){ return evt.target.result },
						context: function(){ return context },
					},
					templateUrl: 'app/component/user-profile/partial/img-crop-modal/img-crop-modal.html',
					controller: 'userProfileImgCropModalCtrl'
				}).result.then(function(result){

					console.log('file modal closed with OK', result );


					var changesToSave = { avatar: result };


					Person.prototype$updateAttributes(
						{ id: personId }, 
						changesToSave, 
						function( value ){

							$scope.personData.avatar = FcSession.user.person.avatar = result;
							FcSession.save();

							toaster.pop('success', "Imagen de perfil actualizada");

						}, 
						function( value ){
							toaster.pop('error', "Error cambiando la imagen de perfil");
						}
						);
				});
			});
		};
		reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#CropFileInput')).on('change',handleFileSelect);


});