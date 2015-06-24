angular.module('person').controller('PersonListCtrl',function($scope, Person, toaster, $modal, $stateParams, StateNavigator, $state, resolvedPeopleList ){



	$scope.listFilter = $stateParams.filter;

	// var findWhere = {};
	// if( $scope.listFilter ){
	// 	findWhere = { filter: { where: { "roleAtSchool.teacher": true } } };
	// };
	$scope.personList = resolvedPeopleList;

	

	$scope.person_delete = function( personId ){
		$modal.open({
			resolve: 
			{
				content: function(){ 
					return {
						modalType: 'confirm',
						title: 'You are about to delete a person!',
						body: 'This action can\'t be undone. <br> Are you sure?'
					};
				}
			}
		}).result.then(function(result){
			if(result){
				Person.deleteById(
					{ id: personId },
					function(values, response){
						toaster.pop('success', "Person deleted");
						$scope.personList = Person.find();
					},
					function(response){
						toaster.pop('error', "Error while deleting");
					}
				);
			};
		});
	};

	$scope.inspectJSON = function( person ){
		$modal.open({
			resolve: 
			{
				content: function(){ 
					return {
						title: '<h5>Ispecting person ID '+ person.id+'</h5>',
						body: '<br><p><pre class="text-left">'+JSON.stringify( person, null, 2 )+'</pre></p>'
					};
				}
			}
		});
	};



// State Navigation stuff
	var StateNavigator = StateNavigator;
	var stateNavigatorControls = [
		{
			conditional: function(){ return !$stateParams.filter },
			cssClass: 'btn-default',
			controlType: 'btn',
			caption: 'Add person',
			icon: 'fa fa-user-plus',
			onClick: function( $event ){ $state.go('person.create') },

		},
		{
			conditional: function(){ return $stateParams.filter == 'student' },
			cssClass: 'btn-default',
			controlType: 'btn',
			caption: 'Add student',
			icon: 'fa fa-user-plus',
			onClick: function( $event ){ $state.go('person.create', { specificProfiles: ['studentProfile']}) }, 

		},
		{
			conditional: function(){ return $stateParams.filter == 'teacher' },
			cssClass: 'btn-default',
			controlType: 'btn',
			caption: 'Add teacher',
			icon: 'fa fa-user-plus',
			onClick: function( $event ){ $state.go('person.create', { specificProfiles: ['teacherProfile']}) }, 

		}
		];
	StateNavigator.setControls(stateNavigatorControls);



});