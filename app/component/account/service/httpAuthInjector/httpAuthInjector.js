angular.module('account')


.factory('httpAuthInjector',  function ( $q, $injector ) {  

      var httpAuthInjector = {
            responseError: function(response) {

            // Check if status is 401 ('Unauthorized')

            if ( response.status === 401 ){

                  var FcSession = $injector.get('FcSession');
                  
                  if( FcSession.loggedIn ){

                        var WildcardModel = $injector.get('WildcardModel');

                        WildcardModel.checkSessionValidity(
                              null, 
                              function(value, responseHeaders){
                              // Success, it's a valid token so do nothing...
                        }, 
                        function(err){
                              // if error status is 401 is because the token has expired, so logout 
                              if( err && err.status === 401 ){
                                    FcSession.destroy( function(){
                                          var $state = $injector.get('$state');
                                          $state.go('account.login');
                                    });
                              }
                        });
                  };

                        // var SessionService = $injector.get('SessionService');
                        // var $http = $injector.get('$http');
                        // var deferred = $q.defer();

                         //    // Create a new session (recover the session)
                         //    // We use login method that logs the user in using the current credentials and
                         //    // returns a promise
                         //    SessionService.login().then(deferred.resolve, deferred.reject);

                         //    // When the session recovered, make the same backend call again and chain the request
                         //    return deferred.promise.then(function() {
                         //         return $http(response.config);
                         //    });

}


return $q.reject(response);
}
};
return httpAuthInjector;
})

.config(['$httpProvider', function($httpProvider) {  
      $httpProvider.interceptors.push('httpAuthInjector');
}]);