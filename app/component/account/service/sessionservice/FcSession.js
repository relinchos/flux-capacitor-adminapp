angular.module('account')

.service('FcSession', function ( _, $localstorage ) {

  var session = this;

  session.create = function (sessionId, user, rememberMe, callback ) {

    //console.log('create session:', session, user);
    session.destroy( function(){

      session.loggedIn = true;
      session.id = session.authorization = sessionId;
      session.created = _.now();

      _.assign(session.user, user);

      session.user.username = session.user.firstName;

      if ( rememberMe ){
        session.save( user );
      };

      if(_.isFunction( callback)){
        callback( session );
      };
    });
  };




  session.save = function( data ){
    if(_.isUndefined( data )){
      if( session.loggedIn && session.user ){
        $localstorage.setObject( 'FcSession__userData', session.user ); 
      };
    }else{
      $localstorage.setObject( 'FcSession__userData', data ); 
    };  
  };
  
  
  session.reset = function ( callback ) {

    session.loggedIn = false;
    session.id = '';
    session.authorization = '';
    session.created = '';
    session.reseted = _.now();
    session.destroyed = '';

    session.user = {
      id: '',
      username: '',
      completeName: '',
      firstName: '',
      lastName: '',
      roles: [],
      
    };

    if(_.isFunction( callback)){
      callback();
    };
  };

  session.destroy = function ( callback ) {
    session.reset(function(){
      session.save( '' );
      if(_.isFunction( callback)){
        callback();
      };
    }); 
  };


  session.userHasRole = function( role ){
    return _.contains(session.user.roles, role);
  };

  // Initialization

  var localToken = $localstorage.get('$LoopBack$accessTokenId');
  var localUser  = $localstorage.getObject('FcSession__userData');
  
  if( localToken && !!localUser ){
    session.create( localToken, localUser, true  ); 
  }else{
    session.destroy();
  };

  return session;
})