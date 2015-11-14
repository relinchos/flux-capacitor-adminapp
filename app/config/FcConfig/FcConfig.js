angular.module('config').factory('FcConfig',function() {

	var FcConfig = {

		app: {
			mainState: 'main',
			auth: {
				role: ['admin','principal','coordinator']
			},
			unauthorizedAppRedirect: ''
		}
		
	};

	return FcConfig;
});