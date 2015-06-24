angular.module('adminApp').factory('FcError',function( $modal ) {

	var FcError = {};

	FcError.resource = function( httpResponse ){

		var message = 'Call the system admin for further help.';

		if(httpResponse){
			message += '<br><p><pre class="bg-danger text-danger">'+JSON.stringify(httpResponse)+'</pre></p>';
		};


		$modal.open({
				resolve: 
				{
					content: function(){ 
						return {
							title: '<p class="text-danger">Sory, received error from server...</p>',
							body: message
						};
					}
				}
			}).result.then(function(result){

			});

	};

	return FcError;
});