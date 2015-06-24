angular.module('adminApp').factory('multiModelProcess',function( $injector, _, $timeout, FcError ) {


	return function ( configObj,  preparedPS ) {

		var preparedPS = preparedPS;

		var public = this;
		var private = {};

		private.processSchema = configObj || [];

		private.dataModelStack = {};
		private.watchingRepoStack = {};

		private.processedSchemaList = [];
		private.canBeAddedList = [];

		private.connections = [];


		// Make internal step names
		var cont = 0;
		_.forEach( private.processSchema, function( step ){
			cont++;
			step.internal = { 
				stepId: cont
			};
		});


		private.makeRepoName = function( connection ){ 
			var name = 'modelRepo_'; 
			name += connection.resourceName || '';
			name += connection.resourceId || '';

			if( connection.relatedConnection ){
				name += connection.relatedConnection.relationType || '';
				name += connection.relatedConnection.resourceName || '';
				name += connection.relatedConnection.relationForeignKey || '';
				name += connection.relatedConnection.resourceId || '';
			};

			return name;
		};



		private.runProcessSchema = function(){

			var canBeAddedListPS = [];

			_.forEach( private.processSchema, function( step ){
				
				step.callback = step.callback || {};
				step.connection = step.connection || {};

				step.internal.procCount = step.internal.procCount || 0;
				step.internal.procCount++;


				var isAvailable;

				if ( step.isAvailable !== undefined ) {
					if(_.isFunction( step.isAvailable )){
						isAvailable = step.isAvailable( step );
					} else {
						isAvailable = step.isAvailable;
					};
				} else {
					isAvailable = true;
				};

				step.internal.resolvedAvailability = isAvailable;


				if( !!step.skipProcess || !isAvailable ) {

					_.remove( preparedPS, function( existingStep ){
						return existingStep.internal.stepId === step.internal.stepId
					});
					
					step.internal.skipped = true; 
					if( step.canBeAdded ){
						//console.log( step.title + ' can be added ')
						canBeAddedListPS.push( step );
					}
					return true; 
				} else {
					step.internal.skipped = false; 
				};

				var alreadyExistingStep = _.find( preparedPS, function( existingStep ){
					return existingStep.internal.stepId === step.internal.stepId
				});

				if( !alreadyExistingStep ){
					preparedPS.push(step);
				};


				var modelRepoName = private.makeRepoName( step.connection );
				var modelInstanceId = _.clone(step.connection.resourceId); 

				var relatedConnection = step.connection.relatedConnection;



				var dataModelRepo;

				var runCurrStepAssignations = function( dataModelRepo ){

					step.internal.currRepo =  dataModelRepo;
					step.data.editableModel =  dataModelRepo.editableModel;

					// exposeEditableModel
					if( _.isFunction(step.exposeEditableModel) ){
						//step.exposeEditableModel = dataModelRepo.editableModel;
						step.exposeEditableModel( dataModelRepo.editableModel );
					};
				};


				if( private.dataModelStack[ modelRepoName ])
				{ 

				// Done...
				runCurrStepAssignations( private.dataModelStack[ modelRepoName ] );

			} else { 

				private.dataModelStack[ modelRepoName ] = {};

				// Init the repomodelInstanceId
				dataModelRepo = private.dataModelStack[ modelRepoName ];

				dataModelRepo.repoName = modelRepoName;
				dataModelRepo.resourceId = modelInstanceId || '';

				dataModelRepo.parentStep = step;
				
				// Init Snapshots
				dataModelRepo.editableModel = {};
				dataModelRepo.originalSnapshot = {};
				dataModelRepo.savedSnapshot = {};

				// Init Angular Resource 
				dataModelRepo.resourceModel = $injector.get( step.connection.resourceName );


				// Done...
				runCurrStepAssignations( private.dataModelStack[ modelRepoName ] );


				// Asynch tasks...


				if ( ( !dataModelRepo.resourceId && !relatedConnection ) || 
					( !dataModelRepo.resourceId && relatedConnection && !relatedConnection.resourceId ) )
				{ 

					 // We are creating a new instance
					//console.log( modelRepoName  + '__yes');

				} else { // we are viewing/editing an exisitng object by getting an instance from server
						//console.log( modelRepoName  + '__no');

					// Defaults...
					var searchMethod = 'findById';
					var searchParams = { id: dataModelRepo.resourceId  };

					// In case of relatedConnection
					if(  relatedConnection )
					{ 

						var setSearchForRelatedConnection = function( connection ){ 

							if ( _.contains( ['belongsTo'],connection.relationType))
							{
								searchMethod = 'findOne';
							}else{
								searchMethod = 'find';
							};

							searchParams = { filter: { where: {} } };
							searchParams.filter.where[connection.relationForeignKey] = connection.resourceId;

						};

						var repoToWatchName = private.makeRepoName( relatedConnection );

						private.watchRepo(repoToWatchName, '', function( watchedDataModelRepo ){
							setSearchForRelatedConnection( relatedConnection );


							relatedConnection.resourceInstance = watchedDataModelRepo.resourceInstance;

							private.loadRepo( dataModelRepo, searchMethod, searchParams, null, function( err ){

								if( err.status == 404 ){
									console.log('It doesn\'t exists. No problem, it will be created upon first save.');
									return true; 
								};
							} );
						});
						//return true;
					} else {
						private.loadRepo( dataModelRepo, searchMethod, searchParams );
					};
				};
			};
		});

	// Repopulate canBeAddedList
	private.canBeAddedList.length = 0;
	_.forEach( canBeAddedListPS, function( step ){ private.canBeAddedList.push( step )});

	// Repopulate processedSchemaList
	private.processedSchemaList.length = 0;
	_.forEach( preparedPS, function( step ){ private.processedSchemaList.push( step )});

	return preparedPS;

};


private.loadRepo = function( dataModelRepo, searchMethod, searchParams, sucCb, errCb ){
	dataModelRepo.resourceInstance = dataModelRepo.resourceModel[searchMethod](

		searchParams
		, 
		function(value, response ){  

			if(_.isFunction(sucCb)){
				if(sucCb( value, response )){
					return;
				};
			};

			dataModelRepo.resourceId = dataModelRepo.resourceId || value.id;
			dataModelRepo.id = dataModelRepo.id || value.id;

			private.updateSnapshots( dataModelRepo, value);
			private.broadcastRepo( dataModelRepo );
		}, 
		function( response ){
			if(_.isFunction(errCb)){
				if(errCb( response )){
					return;
				};
			};
			FcError.resource( response );
		}

		);
};


private.watchRepo = function(repoToWatchName, eventToWatch, cb ){

	if( _.isFunction(cb) ){


		if( private.dataModelStack[repoToWatchName] &&
			private.dataModelStack[repoToWatchName].resourceInstance &&
			private.dataModelStack[repoToWatchName].resourceInstance.$resolved )
		{ 
			//console.log('watch 1')
			cb( private.dataModelStack[repoToWatchName] );
		}else{ 
			//console.log('watch 2', private.dataModelStack[repoToWatchName] )
			private.watchingRepoStack[repoToWatchName] = cb
		};
	};
	window.wrepo = private.watchingRepoStack;
};

private.broadcastRepo = function (dataModelRepo){ 

	var repoToWatchName = dataModelRepo.repoName; 

	if( _.isFunction( private.watchingRepoStack[repoToWatchName] ) )
	{ 
		if( private.dataModelStack[repoToWatchName] )
		{ 
			$timeout( function(){
				private.watchingRepoStack[repoToWatchName]( private.dataModelStack[repoToWatchName] );
			}, 0);
		};
	};
};





// Main functions
	// ==============


	private.saveToServer = function( sucCb, failCb ){


		var  stepInternals = [];

		_.forEach( private.processedSchemaList, function( step ) { 
			stepInternals.push(  step.internal.currRepo );
			if(_.isFunction( step.callback.onBeforeSave )){
				step.callback.onBeforeSave( step );
			};
		});

		stepsInternalsCurrRepos = _.uniq( stepInternals );


		var stepsInternalsCurrRepos_LEN = stepsInternalsCurrRepos.length;
		var procesedRepos = 0;
		var sucCollector = [];
		var errCollector = [];

		function onSuccess(value, cR ){ //console.log( 'saved:', value ); 

		private.updateSnapshots( cR, value);

		sucCollector.push(value);

		_.forEach( private.processedSchemaList, function( step ) { 
			if(  step.internal.currRepo.repoName === cR.repoName ){
				if(_.isFunction( step.callback.onAfterSave )){
					step.callback.onAfterSave( step, value );
				};
			};
		});

		doProcessModel( sucCb, failCb );

	};

	function onError(response, cR ){
		errCollector.push(response);	

		_.forEach( private.processedSchemaList, function( step ) { 
			if(  step.internal.currRepo.repoName === cR.repoName ){
				if(_.isFunction( step.callback.onSaveError )){
					step.callback.onSaveError( step, response );
				};
			};
		});

		doProcessModel( sucCb, failCb );
	};

	function doProcessModel( sucCb, failCb ){

		procesedRepos++;
		if( procesedRepos === stepsInternalsCurrRepos_LEN ){
			if(errCollector.length && _.isFunction( failCb )){
				failCb( errCollector, sucCollector );
			};

			if(sucCollector.length && _.isFunction( sucCb ) ){
				sucCb( sucCollector, errCollector );
			};
		}
	};


	_.forEach(  stepsInternalsCurrRepos, function( cR ) {  

		var changesToSave = private.getChanged( cR.editableModel, cR.savedSnapshot );

		if( changesToSave  ){ 
			//console.log('+ There are hangesto save now in: ' + cR.repoName, cR );

			if( cR.resourceModel ){ 

				if( cR.resourceInstance && cR.resourceId ){ 
						// Already exist, just update

						//console.log( 'save op 1' );

						cR.resourceModel.prototype$updateAttributes({ id: cR.resourceId }, changesToSave, function( value ){onSuccess( value, cR);}, 
							function( value ){onError( value, cR);}
							);

					}else{ 
						//console.log( 'save op 2' );
						// Doesn't exist, create the instance

						var creationFunc = function(){
							//console.log( 'creationFunc called 1' );
							cR.resourceInstance = cR.resourceModel.create( changesToSave, 
								function( value ){ 
									cR.resourceId = cR.resourceId || value.id;
									cR.id = cR.id || value.id; 
									private.broadcastRepo( cR ); 
									onSuccess( value, cR);
								}, 
								function( value ){ onError( value, cR);}
								);
						};

						var parentStepConnection = cR.parentStep.connection;

						if( parentStepConnection && parentStepConnection.relatedConnection ){

							// Depends on parente connection

							//console.log('---> creating deferred');

							var pRc = parentStepConnection.relatedConnection;						
							var repoToWatchName = private.makeRepoName( pRc );
							//console.log( 'related one', pRc, repoToWatchName);

							private.watchRepo(repoToWatchName, '', function( watchedDataModelRepo ){ 
								//console.log('runnign watch')
								changesToSave[ pRc.relationForeignKey ] = watchedDataModelRepo.resourceId;
								//console.log( ' inside watch' );
								creationFunc();
								
								//console.log( changesToSave, watchedDataModelRepo );
							});
							
						}else{
							//console.log('---> creating directly')
							creationFunc();
						};
						
					}; 	
				} else{ 
					// Doesn't exist a resourceModel or has no ID, it means it has to be resolved right now 
					//console.warning('Resolve lack of model in: ' + cR.repoName );
				};
			} else {
				//console.log('- No changes to save now in: ' + cR.repoName );
			};
		});
};

private.getChanged = function( editableModel, savedSnapshot ){ 

	var changedHolder = {};
	_.forEach( editableModel, function( value, key, obj ){
		var p_edit = JSON.stringify(editableModel[key]);
		var p_save = JSON.stringify(savedSnapshot[key]);
		//console.log( p_edit +'==='+ p_save  );
				if(  p_edit === p_save ) {  // Didn't changed		
				}else{ // changed
					changedHolder[key] = value === undefined ? '' : value;
				};
			});

	return _.isEmpty(changedHolder) ? false : changedHolder;	
};


private.areChangesToSave = function(  ) { 
	var changes = false;
	_.forEach( private.processedSchemaList, function( step ) { 
		changes = private.getChanged(step.internal.currRepo.editableModel, step.internal.currRepo.savedSnapshot);
		if(changes){
			return false;
		};
	});
	return !!changes;
};


private.rollbackToSavedSnapshot = function( step ){
	if( step === undefined ){
		_.forEach( private.processedSchemaList, rollbackStep );
	}

	function rollbackStep( step ){
		_.assign(step.internal.currRepo.editableModel, private.cleanPickData(step.internal.currRepo.savedSnapshot));
	};
};


private.cleanPickData = function( obj ){
	return  _.cloneDeep(_.pick( obj, function(value, key) {

		if(_.isArray( value )){
				//value.filter(function(e){ return e === 0 || e === false || e }); // removes all falsey values but 0
				value = _.compact( value );
			};
			return key.charAt(0) != '$' && value !== null;
		}));
};

private.updateSnapshots = function( cR, value ){

	_.assign( cR.editableModel, private.cleanPickData( value ));
	_.assign( cR.originalSnapshot, private.cleanPickData( value ));
	_.assign( cR.savedSnapshot, private.cleanPickData( value ));

};



	// Publish API

	// Methods

	public.runProcessSchema = private.runProcessSchema;
	public.saveToServer = private.saveToServer;
	public.areChangesToSave = private.areChangesToSave;
	public.rollbackToSavedSnapshot = private.rollbackToSavedSnapshot;

	// Properties
	public.canBeAddedList = private.canBeAddedList;

}

});