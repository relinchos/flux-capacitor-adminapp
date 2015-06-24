angular.module('adminApp').factory('StateNavigator',function( _, $state, $rootScope, $modal, $window, $timeout ) {


	// Init

	var public = {}; // <-- Service Object
	var private = {};




	// Public properties
	
	public.baseTitle = 'adminApp';
	public.pageTitle =  '';
	public.windowTitle = public.baseTitle;

	public.controlList = [];
	



	// Private Properties

	private.controlListSchema = [];
	private.controlsOpened = true;
	private.previousState = false;


	


	// public methods

	public.setControls = function( controlListSchema ){ 
		
		if ( controlListSchema ){
			if(_.isArray( controlListSchema )){ 
				private.controlListSchema = controlListSchema;
			} else {
				private.controlListSchema = [ controlListSchema ];
			}
		}else {
			private.controlListSchema = [];
		};
	};


	public.renderControls = function( ){ 
		return private.controlListSchema;
	};


	public.lockState = function( options, specificState ){

		var theState = specificState || $state.current;
		
		theState.data.changeBlocker = options || false;

		var windowUnloadMsg = '';

		if( theState.data.changeBlocker && theState.data.changeBlocker.reasonText ){

			windowUnloadMsg = theState.data.changeBlocker.reasonText;
		};


		$window.onbeforeunload = function() {	
			if( _.isFunction( windowUnloadMsg )){
				return windowUnloadMsg();
			} else {
				return windowUnloadMsg;
			};
		};
	};


	public.unlockState = function( specificState ){

		var theState = specificState || $state.current;

		theState.data.changeBlocker = false;

		$window.onbeforeunload = function() {
			return '';
		};
	};



	public.setPageTitle = function( newTitle ){
		
		var baseTitle_part = public.baseTitle || '';
		var newTitle_part = '';
		var finalTitle = baseTitle_part;

		public.pageTitle = newTitle;

		if ( newTitle ){
			newTitle_part = newTitle;
			if ( baseTitle_part ){
				newTitle_part = ' | '+newTitle;
			};
			finalTitle += newTitle_part;		
		}

		public.windowTitle = finalTitle;
		$window.document.title = finalTitle;
	};


	public.getPageTitle = function(){
		return public.pageTitle;
	};


	public.goToPreviousState = function( options ){
		var previousState = private.previousState; 
		if ( previousState && previousState.state ){
			$state.go( previousState.state.name, previousState.params || {}, previousState.state.goOptions || {} );
		}else{
			if( options.fallbackToParent ){
				var currArr = $state.current.name.split('.');
				var parent = currArr.length > 1 ? currArr[ currArr.length - 2 ] : currArr[0];
				$state.go ( parent );
			};
		};
	};

	public.getPreviousState = function(){

		if ( !private.previousState || !private.previousState.state ){
			return false;
		};

		return private.previousState;
	};



	// Private methods

	private.setPreviousState = function( state, params ){
		if(!state){
			private.previousState = false;
		}else{
			private.previousState = { state: state, params: params || {} };
		};
	};

	

	





	// Event listeners

	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
		
		//console.log('from state:', fromState.get());

		

		// Reset Controls
		public.setControls([]);


		// Set previous state
		if ( toState.data.allowGoBack ){
			private.setPreviousState( fromState, fromParams );
		}else{
			private.previousState = false;
		};
		

		// Update window title
		var newTitle = toState.data.title || toState.data.pageTitle || '';
		public.setPageTitle ( newTitle );

	});

	
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

		// Data init
		toState.data = toState.data || {};
		fromState.data = fromState.data || {};


		// State change blocker
		if( fromState.data.changeBlocker ){

			if( !_.isObject( fromState.data.changeBlocker )){
				fromState.data.changeBlocker = {};
			};

			if( _.isFunction( fromState.data.changeBlocker.conditional )){
				if(!fromState.data.changeBlocker.conditional(event, toState, toParams, fromState, fromParams)){

					

					return;	
			};
		}

			//Proceed to lock
			event.preventDefault(); 

			var defaultSign = {
				title: 'Please confirm...', 
				body: 'Are you sure you want to leave the page?', 
				modalType: 'confirm'
			};

			var customSign = {};

			var blockReason = fromState.data.changeBlocker.reason;
			if( _.isFunction( blockReason )){
				blockReason = fromState.data.changeBlocker.reason();
			}
			switch( blockReason ){

				case "unsavedChanges":
				customSign.title = fromState.data.changeBlocker.title || 'Unsaved changes!';
				customSign.body = fromState.data.changeBlocker.body || 
				"Sure to leave without saving?";
				break;

				case "saving":
				break;

			};

			var finalSign = _.defaults(  customSign, defaultSign );

			$modal.open({
				resolve: 
				{
					content: function(){ 
						return finalSign;
					}
				}
			}).result.then(function(result){ 
				if(result){
					public.unlockState();
					$state.go( toState, toParams, toState.goOptions || {} );
				}	
			});

		} 
	});



	// Set initial page names
	public.setPageTitle( $state.current.data.pageTitle || $state.current.data.title || '' );


// Publishing API
return public;

});