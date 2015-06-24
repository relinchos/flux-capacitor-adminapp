angular.module('adminApp').controller('standardModalCtrl',function($scope, content ){


	var customContent = content || {}; // Note: "content" come from resolved call
	
	var defaultContent = {
		title: '',
		body: '',
		modalType: 'alert',
		footerButtons: []
	};


	var modalTypeDefinitions = {
		'alert': {
			title: '',
			body: '',
			modalType: 'alert',
			footerButtons: [

			]
		},

		'confirm': {
			title: 'Please confirm:',
			body: 'Are you sure?',
			modalType: 'confirm',
			closeTopBtn: false,
			footerButtons: [
			{
				caption: 'No',
				closeReason: false
			},
			{
				caption: 'Yes',
				customStyleClasses: 'btn-danger',
				closeReason: 'confirmCanceled'
			}
			]

		}
	};

	var modalDef = modalTypeDefinitions[ customContent.modalType || defaultContent.modalType || 'alert' ];


	$scope.content = angular.extend( 
		defaultContent, 
		modalDef, 
		customContent  
		);

	defaultContent.footerButtons = defaultContent.footerButtons || [];
	modalDef.footerButtons = modalDef.footerButtons || [];
	customContent.footerButtons = customContent.footerButtons || [];

	$scope.content.footerButtons = _.compact(_.uniq(_.union( 
		defaultContent.footerButtons.length ? defaultContent.footerButtons : [], 
		modalDef.footerButtons.length ? modalDef.footerButtons : [], 
		customContent.footerButtons.length ? customContent.footerButtons : [] 
		)));






});


/*

Ussage example
==============

$modal.open({
				resolve: 
				{
					content: function(){ 
						return {
							title: '<em>titul</em>ar :D',
							footerButtons: [
							{ 
								caption: 'okidoki',
								customStyleClasses: 'btn-warning',
								action: 
									function(){ alert('yeeeh')}

								,
							}
							]
						};
					}
				}
			}).result.then(function(result){

				alert('ok');
				console.log(result);

			});

*/