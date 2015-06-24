angular.module('formEdit').controller('ListCtrl',function($scope, $http, $state ){

	$scope.listOfForms = null;

    $http.get('app/component/form-edit/built-in-forms/built-in-forms.json')
         .success(function (data) {
             $scope.listOfForms = data;
         })
         .error(function (data, status, headers, config) {
             //  Do some error handling here
             console.error('Couldn\'t get Json of built-in forms');
         });


         $scope.openForm = function( formData ){
         	$state.go('formEdit.edit', { formData: angular.toJson(formData) });
         };


});