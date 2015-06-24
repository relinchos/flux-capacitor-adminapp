angular.module('course').controller('CourseListCtrl',function($scope, resolvedCoursesList, StateNavigator, $stateParams, $state, Course, $modal, toaster ){


$scope.courseList = resolvedCoursesList;




$scope.course_delete = function( courseId ){
		$modal.open({
			resolve: 
			{
				content: function(){ 
					return {
						modalType: 'confirm',
						title: 'You are about to delete a course!',
						body: 'This action can\'t be undone. <br> Are you sure?'
					};
				}
			}
		}).result.then(function(result){
			if(result){
				Course.deleteById(
					{ id: courseId },
					function(values, response){
						toaster.pop('success', "Course deleted");
						$scope.courseList = Course.find();
					},
					function(response){
						toaster.pop('error', "Error while deleting");
					}
				);
			};
		});
	};



// State Navigation stuff
	var StateNavigator = StateNavigator;
	var stateNavigatorControls = [
		{
			conditional: function(){ return !$stateParams.filter },
			cssClass: 'btn-default',
			controlType: 'btn',
			caption: 'Add course',
			icon: 'fa fa-cube',
			onClick: function( $event ){ $state.go('course.create') },

		}
		];
	StateNavigator.setControls(stateNavigatorControls);

});