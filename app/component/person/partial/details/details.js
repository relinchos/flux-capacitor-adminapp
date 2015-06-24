angular.module('person').controller('PersonDetailsCtrl',function($scope, $rootScope, $stateParams, $state, _ , $modal, FcError, FcSession, $timeout, toaster, multiModelProcess, StateNavigator, resolvedRoleList, resolvedPeopleList  ){

	$scope.changeImg = function( newImg ){
		console.log('hola image nueva:', newImg);
		$scope.src = newImg.url;
	};


	var personFromResolved = _.find( peopleList, { id: $stateParams.personId }) || {};


	var userRoleCreationPermissions = FcSession.user.roleCreationPermissions || [];
	var roleCreationPermited = _.intersection(resolvedRoleList, userRoleCreationPermissions );
	
	

	var peopleList = resolvedPeopleList;

	var defaultRoles = [];


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
	$scope.context.specificProfiles = _.uniq([].concat( personFromResolved.specificProfiles || [], $stateParams.specificProfiles || [], addedSpecificProfiles || [] ));
	$scope.context.personId = $stateParams.personId || '';
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

			
			
			"fullName": {
				"type": "string",
				"title": "Full Name"	
			},

			// "firstName": {
			// 	"type": "string",
			// 	"title": "First Name"
			// },
			// "secondaryNames": {
			// 	"type": "string",
			// 	"title": "Secondary Name(s)"
			// },

			"nickName": {
				"type":"string",
				"title": "Nickname",
				"placeholder": "E.g. Marty",
				"description": "How people refeer to him/her."
			},
			// "lastNames": {
			// 	"type":"string",
			// 	"title": "Last Name(s)"
			// },
			"sex": {
				"title": "Sex",
				"type": "string",
				"enum": [
				"Female",
				"Male",
				"Other"
				]
			},
			"birthDate": {
				"type": "string",
				"title": "Birth Date",
				"format": "date"
			},

			"dni": {
				"type": "string",
				"title": "DNI"
			},
			"nationalities": {
				"title": "Nationality",
				"type": "array",
				"items": 
				{
					"type": "object",
					"properties": {
						"country": { 
							"type": "string",
							"title": "Nationality (Country name)",
							"default": "Argentina"
						}
					}
				}	
			}

		},
		"required": [ 'fullName' ]
	};
	

	var basicPersonForm = [
	{
		type: "section",
		//readonly: !$scope.context.stateEditable,
		items: [
		
		{
			"key": "fullName",
			"placeholder": "Martin McFly"
		},
		//'firstName', 'secondaryNames', 
		
		{
			"key": "nickName",
			"placeholder": "Marty"
		},

		//'lastNames', 
		
		{
			"key": "birthDate",
			"minDate": "1940-01-01",
			"maxDate": new Date(),
			"format": "yyyy-mm-dd",
			"datepickerOptions": {
				selectYears: true,
				selectMonths: true, 
				selectYears: 100,
				today: ''
			}
		},
		{
			"key": "sex",
			"type": "radios-inline"
		},
		'dni', 
		{
			"key": "nationalities",
			"add": "Add Nationality",
			notitle: true,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			},
			"items": [ 'nationalities[].country' ]
		}
		
		]
	}
	];


	//,"required": [  'secondaryEmails' ]
	var contactPersonSchema = {
		"type": "object",
		"properties": {

			"email": {
				"type": "string",
				"title": "Primary e-mail"
			},
			
			"secondaryEmails": {
				"type": "array",
				"items": 
				{
					"type": "string",
					"title": "Extra e-mail",
					"pattern": "^\\S+@\\S+$"
				}

			},
			"phone": {
				"type": "string",
				"title": "Main Phone Number"
			},
			"secondaryPhones": {
				"type": "array",
				"items": 
				{
					"type": "string",
					"title": "Extra Phone Number"
				}	
			},
			"address": {
				"type": "string",
				"title": "Main Address"
			},
			"secondaryAddresses": {
				"type": "array",
				"items": 
				{
					"type": "string",
					"title": "Other Address"
				}	
			}
		},
		"required": [ 'email'  ]
	};

	var contactPersonForm = [
	{
		type: "section",
		items: [

		"email",
		
		{
			"key": "secondaryEmails",
			ngModelOptions: { updateOnDefault: false },
			"add": "Add extra e-mail",
			startEmpty: true,
			notitle: true,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			} 
		},
		"phone",
		{
			"key": "secondaryPhones",
			"add": "Add Phone Number",
			startEmpty: true,
			notitle: true,
			feedback: false,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			}
		},
		"address",
		{
			"key": "secondaryAddresses",
			"add": "Add Address",
			startEmpty: true,
			notitle: true,
			feedback: false,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			}
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



	// Teacher Profile

	var teacherProfileSchema = {
		"type": "object",
		"properties": {

			"publishingKeys": {
				"type": "object",
				"properties": {
					"publishingMain": {
						"title": "Visible to public",
						"type": "boolean",
						"default": true
					},
					"listAsTeacher": {
						"title": "Just Photo visible in web",
						"type": "boolean",
						"default": false
					},
					"profileIsVisible": {
						"title": "Just Profile info page available",
						"type": "boolean",
						"default": false
					}
				},
			},

			"teacherPhoto": {
				"type": "string",
				"default": "http://www.in-geniousclub.com/image_server/repo/ing_web_img_"	
			},
			
			"titles": {
				"type": "array",
				"items": 
				{
					"type": "string",
					"title": "Academic title"
				}	
			},

			"publicBackground": {
				"type": "array",
				"title": "Public Background",
				"items": 
				{
					"type": "object",
					"properties": {
						"subTitle": {
							"type": "string",
							"title": "Sub-Title"
						},
						"subBody": {
							"type": "string",
							"title": "Sub-Body"
						}
					}
				},
				"default": [
				{ "subTitle": "Antecedentes académicos", "subBody": "" },
				{ "subTitle": "Intereses", "subBody": "" },
				{ "subTitle": "¿Qué te gusta de trabajar en In-genious Idiomas?", "subBody": "" }
				]	
			},
			"addresses": {
				"type": "array",
				"items": 
				{
					"type": "string",
					"title": "Address"
				}	
			},


		} 
	};

	var teacherProfileForm = [
	{
		type: "section",
		items: [

		{
			"key": "publishingKeys",
			"title": "Publishing Keys",
			feedback: false,
		},

		{
			"key": "teacherPhoto",
			"title": "Teacher Public Photo"
		},
		
		{
			"key": "titles",
			
			"add": "Add Title",
			notitle: true,
			feedback: false,
			"style": {
				"add": "btn-xs btn-default"
			}
		},
		{
			"key": "publicBackground",
			"add": "Add Sub Section",
			title: 'Background Data',
			//notitle: true,
			feedback: false,
			"style": {
				"add": "btn-xs btn-default"
			},
			items: [
			'publicBackground[].subTitle', {
				key: 'publicBackground[].subBody',
				type: 'textarea'
			}
			]
		}
		
		]
	}
	];



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
		group: 'Person',
		name: 'basic',
		title: 'Basic Person Data',

		data: {
			editableModel: {},
		},

		callback: {
			// onBeforeSave: function(){ $scope.$broadcast('schemaFormValidate'); },
			// onAfterSave: function(){ alert('success save!')},
			// onSaveError: function(){ alert('error save!')}
		},
		connection: { 
			resourceName: 'Person',
			resourceId: $scope.context.personId || '',
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
		group: 'Person',
		name: 'contact',
		title: 'Contact Data',

		data: {
			editableModel: {},
		},



		connection: { 
			resourceName: 'Person',
			resourceId: $scope.context.personId || '',
		},

		form: {
			name: 'form_contactPersonForm',

			sfSchema: contactPersonSchema,
			sfForm: contactPersonForm,
			sfOptions: formsGlobalOptions,
			formElement: { }
		},
	},
	{
		group: 'Person',
		name: 'roleAtSchool',
		title: 'Role at school',

		data: {
			editableModel: {},
		},

		exposeEditableModel: function( exposedModel ) { $scope.personExposedModel = exposedModel },



		connection: { 
			resourceName: 'Person',
			resourceId: $scope.context.personId || '',
		},

		form: {
			name: 'form_roleAtSchool',

			sfSchema: rolesSchema,
			sfForm: rolesForm,
			sfOptions: formsGlobalOptions,
			formElement: { }
		},
	},
	{
		skipProcess: false,

		isAvailable: function(){ return _.contains( $scope.context.specificProfiles, 'teacherProfile' ) },
		canBeAdded: 'Give Teacher',

		group: 'Person',
		name: 'teacherProfile',
		title: 'Teacher Public Profile',

		data: {
			editableModel: {},
		},



		resolve: {

		},

		connection: { 
			resourceName: 'TeacherProfile',
			resourceId: '',

			relatedConnection: { 
				relationType: 'belongsTo',
				resourceName: 'Person',
				relationForeignKey: 'personId',
				resourceId: $scope.context.personId || ''
			}
		},

		form: {
			name: 'form_teacherProfile',

			sfSchema: teacherProfileSchema,
			sfForm: teacherProfileForm,
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



	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------



	// Recyclable garbage
	// ==================



/*



	


*/




});