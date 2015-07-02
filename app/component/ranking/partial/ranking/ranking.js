angular.module('ranking').controller('RankingCtrl',function($scope, Ranking, $timeout ){

	$scope.users = [];
	$scope.loadingInfo = true;

	 Ranking.list(null, function( theList){

		//console.log( theList );

		$scope.users = theList;

		$timeout( function(){
			$scope.loadingInfo = false;
		}, 700);


	});







	$scope.rankingData = [
	{ name: 'Nivel', value: '+12' },
	{ name: 'Jugado', value: '15 jugados' },
	{ name: 'Ganado', value: '4 ganados' },
	{ name: 'Perdido', value: '1 perdido' }
	];

	$scope.selectedUser = false;


	$scope.userSelected = function(evt, theUser){
		//console.log('usr:', theUser);
		$scope.selectedUser = theUser;
	};

});