angular.module('course').controller('CourseDetailsCtrl',function($scope, _, resolvedCoursesList, $stateParams, $state, multiModelProcess, StateNavigator, $timeout, FcError, $modal, toaster, resolvedTeachersList ){



	var coursesList = resolvedCoursesList;
	var teachersList = resolvedTeachersList;
	var courseFromResolved = _.find( coursesList, { id: $stateParams.courseId }) || {};


	// Context
	// =======

	$scope.context = {};
	//$scope.context.modulePath = $state.current.data.modulePath;
	$scope.context.stateAction = $state.current.data.stateAction || '';
	$scope.context.courseId = $stateParams.courseId || '';
	$scope.context.stateEditable = false;


		// Page & State Settings
	// =====================

	$state.current.data = $state.current.data || {};
	$scope.pageTitle = {}; 

	$scope.$watch('context.stateAction', function() {
		

		switch( $scope.context.stateAction ){
			case 'create':
			$scope.pageTitle = 'creating course'
			$scope.context.stateEditable = true;
			WAformSetReadonly( false );
			break;

			case 'edit':
			$scope.pageTitle= 'editing course';
			$scope.context.stateEditable = true;
			WAformSetReadonly( false );
			break;

			default:
			//case 'details':
			$scope.pageTitle = 'course details';
			$scope.context.stateEditable = false;
			WAformSetReadonly( true );

		};
	});

	// to make Watch work...
	$scope.context.stateAction = $state.current.data.stateAction ;





	// Forms schemas & else
	// ====================

	formsGlobalOptions = {
		formDefaults: {
			
			feedback: "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-exclamation-sign':  hasError() }",
			updateOn: 'blur'
		}
	};






	var courseSchema = {
		"type": "object",
		"properties": {

			"title": {
				type: "string",
					// format: "html",
					title: "Course Title"
				},
				"shortDescription": {
					type: "string",
					title: "Short Description"
				},
				"order": {
					type: "number",
					title: "Order"
				},
				"modality": {
					"type": "string",
					"title": "Modality",
					"enum": [
					"Particular",
					"Intensivo",
					"Regular",
					"Taller"
					]
				},
				"duration": {
					type: "string",
					title: "Duration"
				},
				"__seasons": {
					type: "array",
					title: "Seasons",
					"items": {
						"type": "string"
					}
				},
				"identity": {
					type: "string",
					title: "Identity"
				},
				"longDescription": {
					"title": "Long Description",
					"type": "array",
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
					}	
				},
				"schedule": {
					type: "array",
					items: {
						type: "string",
						title: "Schedule line"
					}
				},
				"courseImage": {
					"type": "string",
					"title": "Course Image"
				}


			}


		};




		var courseForm = [
		'title',
		{
			"key": "shortDescription",
			"type": "textarea"
		},
		{
			"key": "order" 
		},
		{
			"key": "modality",
			"type": "select"
		},
		{
			"key": "__seasons",
			"type": "checkboxes",
			"titleMap": [
			{
				"value": "55525e44a16dc783f75356c3",
				"name": "Marzo a Diciembre"
			},
			{
				"value": "555cf9aaa16dc700d7218b01",
				"name": "Todo el año"
			},
			{
				"value": "555cfa23a16dc700d7218b03",
				"name": "Verano"
			}
			]
		},

		//'identity',
		{
			"key": "longDescription",
			"add": "Add paragraph",
			//"notitle": true,
			ngModelOptions: { updateOnDefault: false },
			startEmpty: true,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			},
			"items": [
			"longDescription[].subTitle",
			{
				"key": "longDescription[].subBody",
				"title": "Sub body",

				"type": "textarea"
			},
			]
		},
		{
			"type": "help",
			"helpvalue": "<p>No scheduled yet</p>",
			"condition": "!model.schedule.length"
		},
		{
			"key": "schedule",
			"notitle": true,
			ngModelOptions: { updateOnDefault: false },
			startEmpty: true,
			"style": {
				"add": "btn-xs btn-default fs-form-add-btn-fix"
			},
			"add": "Add Schedule line"
		},
		'courseImage'

		
		];




	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------


	// Process Management
	// ==================

	var processConfig = [
	{	
		group: 'Course',
		name: 'basic',
		title: 'Course Data',

		data: {
			editableModel: {},
		},

		callback: {
			// onBeforeSave: function(){ $scope.$broadcast('schemaFormValidate'); },
			// onAfterSave: function(){ alert('success save!')},
			// onSaveError: function(){ alert('error save!')}
		},
		connection: { 
			resourceName: 'Course',
			resourceId: $scope.context.courseId || '',
		},

		form: {
			name: 'form_courseForm',

			sfSchema: courseSchema,
			sfForm: courseForm,
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

	$scope.procExit = function(){
		StateNavigator.goToPreviousState({ fallbackToParent: true });
	};





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




	// Scope inits
	// ===========

	$scope.procCurrentIndex = 0;
	$scope.procStage = $scope.procSchema[ $scope.procCurrentIndex ].name; // Holds Current Active Step
	$scope.procCurrentStep = $scope.procSchema[ $scope.procCurrentIndex ];
	$scope.savingForm = false;

	
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

					var elem = angular.element('form[intname="'+step.form.name+'"] input, form[intname="'+step.form.name+'"] textarea, form[intname="'+step.form.name+'"] button, form[intname="'+step.form.name+'"] select');


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







