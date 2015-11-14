angular.module('userManager').controller('UserDetailsCtrl', function($scope, $rootScope, $stateParams, $state, _ , $modal, FcError, FcSession, $timeout, toaster, multiModelProcess, StateNavigator, resolvedRoleList, resolvedUserList, User  ){  //resolvedPeopleList


	$scope.userId = $stateParams.userId;

	//$scope.formData = $stateParams.formData;
	//$scope.userId = angular.fromJson( $scope.formData || { schema: {}} ); 

	var userFromResolved = _.find( resolvedUserList, { id: $stateParams.userId }) || {};

 	//$scope.user =  User.findOne({ filter: { where: { id: $scope.userId }} });

 	var filter = {

 		'filter[where][id]': $scope.userId,

 		'filter[include]': ['associatedPerson']

 	};

 	User.findOne( 
 		{ filter: { where: { id: $scope.userId }, include: 'associatedPerson' }}, 
 		function(user){
 			$scope.associatedPerson = user.associatedPerson;
 		});








 	var userRoleCreationPermissions = FcSession.user.roleCreationPermissions || [];
 	var roleCreationPermited = _.intersection(resolvedRoleList, userRoleCreationPermissions );



 	var peopleList = [];

 	var defaultRoles = userFromResolved.roles || [];


 	var addedSpecificProfiles = [];
 	if( $stateParams.filter === 'teacher' ) { 
 		addedSpecificProfiles = addedSpecificProfiles.concat(['teacherProfile']);
 		defaultRoles.push('teacher');
 	};
 	if( $stateParams.filter === 'student' ) { 
 		defaultRoles.push('student');
 	};

	// Context
	// =======

	$scope.context = {};
	$scope.context.stateAction = $state.current.data.stateAction || '';
	$scope.context.specificProfiles = _.uniq([].concat( userFromResolved.specificProfiles || [], $stateParams.specificProfiles || [], addedSpecificProfiles || [] ));
	$scope.context.userId = $stateParams.userId || '';
	$scope.context.stateEditable = false;
	
	

	$scope.context.SAVED_specificProfiles = _.clone($scope.context.specificProfiles);



	// Forms schemas & else
	// ====================

	formsGlobalOptions = {
		formDefaults: {
			
			feedback: "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-exclamation-sign':  hasError() }",
			updateOn: 'blur'
		}
	};

	var modulePath = $state.current.data.modulePath;

	var basicPersonSchema = 
	{
		"type": "object",
		"properties": {

			
			
			"email": {
				"type": "string",
				"title": "E-mail"	
			}

		},
		"required": [ 'email' ]
	};
	

	var basicPersonForm = [
	{
		type: "section",
		//readonly: !$scope.context.stateEditable,
		items: [
		
		{
			"key": "email",
			"placeholder": ""
		}
		
		]
	}
	];


	var rolesSchema = {
		"type": "object",
		"properties": {
			"roles": {
				"title": "Please select the Roles for this user",
				"type": "array",
				"items": {
					"type": "string",
					"enum": roleCreationPermited	
				},
				"default": defaultRoles
			}
		}
	};



	var rolesForm = [{
		type: "section",
		items: [
		"roles"
		]

	}];






	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------

	


	// Process Management
	// ==================

	

	var processConfig = [
	{	
		group: 'User',
		name: 'basic',
		title: 'Basic User Data',

		data: {
			editableModel: {},
		},

		callback: {
			// onBeforeSave: function(){ $scope.$broadcast('schemaFormValidate'); },
			// onAfterSave: function(){ alert('success save!')},
			// onSaveError: function(){ alert('error save!')}
		},
		connection: { 
			resourceName: 'User',
			resourceId: $scope.context.userId || '',
		},

		form: {
			name: 'form_basicPersonForm',

			sfSchema: basicPersonSchema,
			sfForm: basicPersonForm,
			sfOptions: formsGlobalOptions,
			formElement: { }
		},

	},
	{
		group: 'User',
		name: 'roleAtSchool',
		title: 'Role at school',

		data: {
			editableModel: {},
		},

		exposeEditableModel: function( exposedModel ) { $scope.personExposedModel = exposedModel },



		connection: { 
			resourceName: 'User',
			resourceId: $scope.context.userId || '',
		},

		form: {
			name: 'form_roleAtSchool',

			sfSchema: rolesSchema,
			sfForm: rolesForm,
			sfOptions: formsGlobalOptions,
			formElement: { }
		},
	}
	];

	
	



	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	// Scope publishing


	$scope.procSchema = [];

	var MMP = new multiModelProcess( processConfig, $scope.procSchema );
	
	MMP.runProcessSchema();
	$scope.canBeAddedList = MMP.canBeAddedList;

	$scope.areChangesToSave = function(){
		return !!MMP.areChangesToSave();
	};



	$scope.$watch('personExposedModel.roles.length', function(  ){ 

		var roleList = $scope.personExposedModel.roles;
		
		if( _.contains( roleList, 'teacher' ) && !_.contains( $scope.context.specificProfiles, 'teacherProfile' )){
			$scope.context.specificProfiles.push( 'teacherProfile' ); 
			MMP.runProcessSchema();

			// $modal.open({
			// 	resolve: 
			// 	{
			// 		content: function(){ 
			// 			return {
			// 				modalType: 'alert',
			// 				//title: 'Teacher role added',
			// 				body: 'This new role added a "Teacher Public Profile" to the person.'
			// 			};
			// 		}
			// 	}
			// });
};

});











	
	



	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------



	// Scope Functions
	// ===============


	$scope.procSave  = function( options ){

		if( $scope.areAllProcValid() ){ // Forms are valid, proceed...

			MMP.saveToServer( 
				function( sucCollector ){
					$scope.context.SAVED_specificProfiles = _.clone($scope.context.specificProfiles);
					if ( options && options.exit ){
						$scope.context.stateAction = 'details';
						$scope.procExit(); 
					};
				}, 
				function( errCollector ){
					toaster.pop('error', "Error while saving");
					console.error('there were some errors while saving:', errCollector);
				});

		}else{ // The forms are not valid

			// force validation highlighting:
			$scope.$broadcast('schemaFormValidate');

			var message = '<p>Check for errors in the fields in red';

			if($scope.procValidationReport.htmlVersion){
				message += ' on the following:</p>'+$scope.procValidationReport.htmlVersion;
			}else {
				message += '.</p>';
			}

			$modal.open({
				resolve: 
				{
					content: function(){ 
						return {
							title: 'Can\'t create yet',
							body: message
						};
					}
				}
			}).result.then(function(result){});
		};
	};



	$scope.setEditMode = function(boolValue){
		

		if(!!boolValue == false && MMP.areChangesToSave() ){

			$modal.open({
				resolve: 
				{
					content: function(){ 
						return {
							modalType: 'confirm',
							title: 'Unsaved data!',
							body: 'Sure to discard changes?'
						};
					}
				}
			}).result.then(function(result){
				if(result){
					// Rollback context:
					_.remove( $scope.context.specificProfiles, function(itm){
						return !_.contains( $scope.context.SAVED_specificProfiles, itm );
					});

					// Rollback data:
					MMP.rollbackToSavedSnapshot();
					// Update scope:
					MMP.runProcessSchema();

					$scope.context.stateAction = 'details';
					toaster.pop('info', "Changes discarded");
				};
			});	
		} else {
			$scope.context.stateAction = !!boolValue ? 'edit' : 'details';
		};
	};



	$scope.areAllProcValid = function(){
		var validCount = 0;
		$scope.procValidationReport.htmlVersion= '';
		_.forEach( $scope.procSchema, function( step ) { 
			if( step.form.formElement.$valid){
				validCount++;
			} else {
				$scope.procValidationReport.htmlVersion += '<p><strong>'+ step.title + '</strong></p>'
			};
		});
		var isValid = $scope.procSchema.length === validCount ? true : false;
		return isValid;
	};


	$scope.setProcStage = function( index ){
		$scope.procCurrentIndex = index;
		$scope.procCurrentStep = $scope.procSchema[index] ? $scope.procSchema[index] : $scope.procSchema[0];
		$scope.procStage = $scope.procCurrentStep.name;	
	};


	$scope.procGo = function(index){ 
		angular.element("body").animate({ scrollTop: 0 }, 700 );
		$timeout(function(){ $scope.setProcStage( index ) }, 700);
	};

	$scope.procExit = function(   ){

		// TODO: Implement a StateNavigator "goBack" method
		StateNavigator.goToPreviousState({ fallbackToParent: true });
		// var destiny = 'person.list', params = {};

		// if($rootScope.previousState && $rootScope.previousState.state.name){
		// 	destiny = $rootScope.previousState.state.name || destiny;
		// 	params = $rootScope.previousState.params || params;

		// };

		// $state.go( destiny, params );

	};




	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	
	// Page & State Settings
	// =====================

	

	$state.current.data = $state.current.data || {};
	$scope.pageTitle = {}; 



	$scope.$watch('context.stateAction', function() {
		

		switch( $scope.context.stateAction ){
			case 'create':
			$scope.pageTitle = 'creating person'
			$scope.context.stateEditable = true;
			WAformSetReadonly( false );
			
			break;

			case 'edit':
			$scope.pageTitle= 'editing person';
			$scope.context.stateEditable = true;
			WAformSetReadonly( false );
			
			break;

			default:
			//case 'details':
			$scope.pageTitle = 'person details';
			$scope.context.stateEditable = false;
			WAformSetReadonly( true );

		};
	});


	// to make Watch work...
	$scope.context.stateAction = $state.current.data.stateAction ;


	


	// -----------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------


	// State Navigation stuff
	var StateNavigator = StateNavigator;
	var stateNavigatorControls = [
	{
		conditional: function(){ return $scope.context.stateAction == 'details' },
		cssClass: 'btn-default',
		controlType: 'btn',
		caption: 'Edit',
		icon: 'fa fa-lock',
		onClick: function( $event ){ $scope.setEditMode(true); },

	},
	{
		conditional: function(){ return $scope.context.stateAction == 'edit' },
		cssClass: 'btn-danger',
		controlType: 'btn',
		caption: 'Cancel edition',
		icon: 'fa fa-unlock',
		onClick: function( $event ){ $scope.setEditMode(false); },

	},
	{
		conditional: function(){ return $scope.context.stateAction == 'edit' },
		cssClass: 'btn-success',
		controlType: 'btn',
		caption: 'Save',
		icon: 'fa fa-cloud-upload',
		disabled: function() { return !$scope.areChangesToSave() },
		onClick: function( $event ){ $scope.procSave(); },

	},
	{
		conditional: function(){ return $scope.context.stateAction == 'create' },
		cssClass: 'btn-danger',
		controlType: 'btn',
		caption: 'Cancel creation',
		icon: 'fa fa-times',
		onClick: function( $event ){ $scope.procExit(); },

	},
	{
		conditional: function(){ return $scope.context.stateAction == 'create' },
		cssClass: 'btn-success',
		controlType: 'btn',
		caption: 'Save',
		icon: 'fa fa-cloud-upload',
		onClick: function( $event ){ $scope.procSave({exit: true}); },

	},
	];
	StateNavigator.setControls(stateNavigatorControls);
	StateNavigator.lockState({
		conditional: function(){
			return $scope.areChangesToSave() && ( $scope.context.stateAction == 'edit' || $scope.context.stateAction == 'create')
		},
		reason: function(){
			return $scope.areChangesToSave() ? 'unsavedChanges' : '';
		},
		reasonText: function(){
			return $scope.areChangesToSave() ? 'There are unsaved changes.' : '';
		}
	}); 






	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	


	// Process init:




	// Scope inits
	// ===========

	$scope.procCurrentIndex = 0;
	$scope.procStage = $scope.procSchema[ $scope.procCurrentIndex ].name; // Holds Current Active Step
	$scope.procCurrentStep = $scope.procSchema[ $scope.procCurrentIndex ];


	
	$scope.procValidationReport = {
		htmlVersion: ''
	};




	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------



	// Work Arounds
	// ============


	// WA means "Work Around" and I should fix the real problem soon



	// WA: 'set a entire form disabled' begin...



	var WAformSetReadonly = function(boolValue){ 

		$timeout(function() {
			_.forEach($scope.procSchema, function(step){
				if(step && step.form && step.form.name){

					var elem = angular.element('form[intname="'+step.form.name+'"] input, form[intname="'+step.form.name+'"] textarea, form[intname="'+step.form.name+'"] button');


					if( !boolValue ){
						elem.removeAttr('disabled').removeClass('input-not-editable');
					}else{
						elem.attr('disabled','disabled').addClass('input-not-editable');

					};
				};
			});
		}, 0);
		
	};

	$scope.$on('sf-render-finished', function(event) { 
		
		WAformSetReadonly( !$scope.context.stateEditable );
	});

	 // WA 'set a entire form disabled' ends 





});