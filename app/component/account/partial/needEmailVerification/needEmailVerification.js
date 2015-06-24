angular.module('account').controller('NeedemailverificationCtrl',function($scope){

	$scope.showEmailForm = false;


	$scope.formData = {};

	$scope.formSchema = { 
		"fields": [
		{
			"type": "email",
			"name": "email",
			"displayName": "Email",
			"validation": {
				"messages": {
					"pattern": "Please input a valid e-mail address",
					"required": "Required field"
				},
				"required": true,
				"pattern": "^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$"
			}
		}
		]
	};

	$scope.submit= function( formData ){



	}

});