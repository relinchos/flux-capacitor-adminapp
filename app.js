angular.module('adminApp', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'main', 'account', 'lbServices', 'fg', 'formEdit', 'lodash', 'config', 'baseLayout', 'navbar', 'userManager', 'person', 'schemaForm', 'schemaForm-tinymce','fluxDocs', 'fui', 'toaster', 'menubar', 'statenav', 'slideToggle', 'omniFileManager', 'imageOmniFrame', 'imageOmniGallery', 'course', 'userProfile',   'ngImgCrop']);

angular.module('adminApp').config(function($stateProvider, $urlRouterProvider, $modalProvider, $provide ) {


    


    /* Add New States Above */
    $urlRouterProvider.otherwise('/');


    // modal config
    angular.extend( $modalProvider.options, {
        templateUrl: 'app/common/modal/standardModal/standardModal.html',
        controller: 'standardModalCtrl',
    });


    //$state allways reload decorator
    $provide.decorator('$state', function($delegate) {
        var originalTransitionTo = $delegate.transitionTo;
        $delegate.transitionTo = function(to, toParams, options) {
          var goOptions = to.goOptions || {};
          return originalTransitionTo(to, toParams, angular.extend(goOptions, options));
      };
      return $delegate;
  });

});

angular.module('adminApp').run(function($rootScope, $window ) {

    $window.onbeforeunload = function() {
        return '';
    }

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };



    

});
