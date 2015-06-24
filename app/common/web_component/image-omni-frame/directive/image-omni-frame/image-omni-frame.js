angular.module('imageOmniFrame').directive('imgOFrame', function( $window, $timeout, _, $injector, omniFileManager ) {
	return {
		restrict: 'EA',
		replace: false,
		scope: {
			src: '=',
			width: '=', 
			height: '=',
			aspectRatio: '=',
			imgChangeable: '&',
			imagePurposeTitle: '@',
			onChangeImage: '=', // [ fn ] Default: Default file manager
			onUploadImage: '=',
			state: '='
		},
		templateUrl: 'app/common/web_component/image-omni-frame/directive/image-omni-frame/image-omni-frame.html',
		link: function(scope, element, attrs, fn) {

			var 
			elem = angular.element(element),
			imgBox = elem.find('.image-omni-frame-imgBox'),
			width = 0, 
			height = 0,
			aspectRatio = 1,
			oldSrcPseudoHash,
			newSrcPseudoHash,
			oldSizePseudoHash,
			newSizePseudoHash,
			currImageObject,
			needResizeWrapperFittingLoadedImage = false;

			elem.addClass('image-omni-frame-wrapper');

			scope.state = {
				inited: false,
				srcExist: false,
				isLoading: false,
				imgIsReady: false,
				imgSrc: ''
			};

			scope.imgChangeable = attrs.imgChangeable;

			

		


			// Src
			// ===

			function imageExists(url, callback) { 
				var img = new Image();

				scope.state.srcError = false;
				var callbackCalled = false;
				
				img.onload = function() { callback(true, url, this); callbackCalled = true; };
				img.onerror = function() { callback(false, url, this); callbackCalled = true; };
				
				$timeout(function(){
					if( oldSrcPseudoHash !== url || callbackCalled ){
						return;
					};

					scope.state.isLoading = true;
				},150);

				img.src = url;
			};

			function loadImage( srcToLoad ){
				newSrcPseudoHash = srcToLoad;
				if( oldSrcPseudoHash === newSrcPseudoHash ){
					return;
				};
				oldSrcPseudoHash = newSrcPseudoHash;
				imageExists( srcToLoad, function ( exists, url, imageObject ) {
					$timeout(function(){
						scope.state.isLoading = false;
						scope.state.inited = true;
						scope.state.imgSrc = _.trim(url);

						if ( exists ){

							scope.state.srcError = false;

							resizeFittingLoadedImg( imageObject );

							$timeout(function(){
								if( oldSrcPseudoHash !== url ){
									return;
								};

								scope.state.srcExist = true;
								scope.state.imgIsReady = true; 
								currImageObject = imageObject;
							},1200);

						}else{

							scope.state.srcExist = false;
							scope.state.imgIsReady = false;	
							currImageObject = false;
							
							$timeout(function(){
								if( oldSrcPseudoHash !== url ){
									return;
								};

								scope.state.srcError = true;
							},1200);	
						};
					},0);
					

				});
			};


			// Init loadImage
			loadImage();


			// Watch src attribute
			scope.$watch('src', function( newSrc ){ 
				loadImage( newSrc );
			});


			
			// resizeFittingLoadedImg

			function resizeFittingLoadedImg( imageObject ){
				if(!needResizeWrapperFittingLoadedImage || !imageObject ){
					return;
				};

				var imgWidth = imageObject.width;
				var imgHeight = imageObject.height;

				elem.width('auto');

				var newWidth = elem.width();
				var newHeight = ( newWidth / imgWidth ) * imgHeight  

				elem.animate({
					width: newWidth,
					height: newHeight
				}, 650);

			};


			// Size 
			// ====

			function calculateWrapperSize(){
				var newWidth, newHeight;
				if( width && height ){		
					assignWrapperSize( width, height );
				}else {
					if( scope.aspectRatio && height){
						newWidth = height * scope.aspectRatio;
						assignWrapperSize( newWidth, height );
					} 
					else if ( scope.aspectRatio && width ){
						newHeight = width / scope.aspectRatio;
						assignWrapperSize( width, newHeight );
					}
					else if ( scope.aspectRatio ){
						elem.width('auto');
						newHeight = elem.width() / scope.aspectRatio;
						assignWrapperSize( null, newHeight );
					} 
					else if ( scope.aspectRatio === 0){
						elem.width('auto');
						// resize acording to loaded image
						needResizeWrapperFittingLoadedImage;
						resizeFittingLoadedImg();
					}
					else {

						if ( height ){ 
							elem.width('auto');
							assignWrapperSize( null, height );
						}
						else if ( width ) {
							elem.height('auto');
							assignWrapperSize( width, null );
						} else {
							elem.width('auto');
							elem.height('auto');
							assignWrapperSize( null, null );
						};
					};		
				};
			};


			function assignWrapperSize( width, height ){

				newSizePseudoHash = width + '-' + height;
				if( newSizePseudoHash===oldSizePseudoHash){ 
					// no changes so exit
					return;
				}; 
				oldSizePseudoHash=newSizePseudoHash;
				if( width ){
					elem.width( width );
				};
				if ( height ){
					elem.height( height );
				};
			};



			// Init calculateWrapperSize()
			calculateWrapperSize();


			// On variables change
			scope.$watchGroup(['width', 'height', 'aspectRatio', 'imgChangeable'], function(newValues, oldValues, scope) {


				width = parseInt(newValues[0]) ;
				height = parseInt(newValues[1]);
				aspectRatio = parseFloat(newValues [2]);

				calculateWrapperSize();

				scope.imgChangeable = attrs.imgChangeable;

			});



			// On window resize

			var noResizeStress = false;
			angular.element($window).bind('resize', function () {

				if( noResizeStress ){
					return;
				};
				noResizeStress = true;
				timeoutHolder = window.setTimeout( function(){ 
					noResizeStress = false;
					calculateWrapperSize();
				}, 50);

			});



		// Buttons Actions
		// ===============


		scope.doChangeImage = function( event ){ 
			if( _.isFunction( scope.onChangeImage) ){
				scope.onChangeImage( event );
			}else{
				console.log('call default file manager');
				
				var fileManagerService = new omniFileManager({
					//baseUrl: 'baseDelaApp',
					imageProperties: {
						aspectRatio: scope.aspectRatio
					}
				});


				fileManagerService.pickAFile(function( newImg){
					console.log( 'listo:',  newImg );

					scope.onUploadImage( newImg );
				});
				
			};
		};








		} // link
	};
});
