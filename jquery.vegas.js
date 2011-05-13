// ----------------------------------------------------------------------------
// Vegas - jQuery plugin 
// Add awesome fullscreen backgrounds to your webpages.
// v 1.0 beta
// Dual licensed under the MIT and GPL licenses.
// http://vegas.jaysalvat.com/
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
( function( $ ){
	var $background = $( '<img />' ).addClass( 'vegas-background' ),
		$overlay 	= $( '<div />' ).addClass( 'vegas-overlay' ),
		$loading 	= $( '<div />' ).addClass( 'vegas-loading' ),
		$current,
		timer,
		step = 0,
		methods = {
			
		// Init plugin
		init : function( settings ) {
			var options = {
				src:		getBackground(),
				align: 		'center',
				valign: 	'center',
				fade:		0,
				load:		function() {},
				complete: 	function() {}
			};
			$.extend( true, options, settings );

			loading();
			
			$new = $background.clone();
			$new.css( {
					'position':	'fixed',
					'left':		'0px',
					'top':		'0px'
				})
				.load( function() {
					$( window ).bind( 'resize.vegas', function( e ) {
						resize( $new, options );
					});
					
					if ( $current ) {
						$current.stop();
						$new.hide()
							.insertAfter( $current )
							.fadeIn( options.fade, function() {
								$('.vegas-background')
									.not(this)
										.remove();
								$( 'body' ).trigger( 'backgroundcomplete', [ this ] );
								options.complete.apply( $new );
							});
					} else {
						$new.hide()
							.prependTo( 'body' )
							.fadeIn( options.fade, function() {
								$( 'body' ).trigger( 'backgroundcomplete', [ this ] );
								options.complete.apply( this );	
							});
					}

					$current = $new;

					resize( $current, options );

					loaded();

					$( 'body' ).trigger( 'backgroundload', [ $current.get(0) ] );
					options.load.apply( $current.get(0) );
				})
				.attr( 'src', options.src );
				
			return $.vegas;
		},

		// Destroy background
		destroy: function( what ) {
			if ( !what || what == 'background') {
				$('.vegas-background').remove();
				$('.vegas-loading').remove();
				$( window ).unbind( 'resize.vegas' );
				$current = null;
			}

			if ( !what || what == 'overlay') {
				$('.vegas-overlay').remove();
			}
		
			return $.vegas;
		},
		
		overlay:function( settings ) {
			var options = {
				src:		null,
				opacity:	null
			};
			$.extend( options, settings );
			
			$overlay.remove();
			
			$overlay
				.css( {
					'margin':	'0',
					'padding':	'0',
					'position':	'fixed',
					'left':		'0px',
					'top':		'0px',
					'width':	'100%',
					'height':	'100%'
			});
			
			if ( options.src ) {
				$overlay.css( 'backgroundImage', 'url(' + options.src + ')' );
			}

			if ( options.opacity ) {
				$overlay.css( 'opacity', options.opacity );
			}
	
			$overlay.prependTo( 'body' );
			
			return $.vegas;
		},

		// Start slideshow
		slideshow: function( settings ) {
			var options = {
				delay:		 5000,
				backgrounds: []
			};
			$.extend( options, settings );

			clearInterval( timer );

			var doSlideshow = function() {		
				$.vegas( options.backgrounds[ step++ ] );

				if ( step >= options.backgrounds.length ) {
					step = 0;
				}
			}
			
			doSlideshow();
			timer = setInterval( doSlideshow, options.delay );
			
			return $.vegas;
		},
		
		// Stop slideshow
		stop: function( settings ) {
			step = 0;
			clearInterval( timer );
			
			return $.vegas;
		},
		
		// Pause SlideShow
		pause: function( settings ) {
			clearInterval( timer );
		}
	}		

	// Resize the background
	function resize( $img, settings ) {	
		var options =  {
			align: 	'center',
			valign: 'center'
		}
		$.extend( options, settings );

		var ww = $( window ).width(),
			wh = $( window ).height(),
			iw = $img.width(),
			ih = $img.height(),
			rw = wh / ww,
			ri = ih / iw,
			newWidth, newHeight,
			newLeft, newTop,
			properties;
			
		if ( rw > ri ) {
			newWidth = wh / ri;
			newHeight = wh;
		} else {
			newWidth = ww;
			newHeight = ww * ri;
		}

		properties = {
			'width':	newWidth + 'px',
			'height': 	newHeight + 'px',
			'left':		( ww - newWidth ) / 2 + 'px',
			'top':		( wh - newHeight ) / 2 + 'px'
		}
		
		if ( options.valign == 'top' ) {
			properties[ 'top' ] 	= 0;
			properties[ 'bottom' ] 	= 'auto';
		}

		if ( options.valign == 'bottom' ) {
			properties[ 'top' ] 	= 'auto';
			properties[ 'bottom' ] 	= 0;
		}

		if ( options.align == 'left' ) {
			properties[ 'left' ] 	= 0;
			properties[ 'right' ] 	= 'auto';
		}

		if ( options.align == 'right' ) {
			properties[ 'left' ] 	= 'auto';
			properties[ 'right' ] 	= 0;				
		}

		$img.css( properties );
	}

	function loading() {
		$loading.prependTo( 'body' ).fadeIn();
	}

	function loaded() {
		$loading.fadeOut( 'fast', function() {
			$( this ).remove();
		});
	}

	// Get the background image from the body
	function getBackground() {
		if ( $( 'body' ).css( 'backgroundImage' ) ) {
			return $( 'body' ).css( 'backgroundImage' ).replace( /url\("?(.*?)"?\)/i, '$1' );
		}
	}

	// The plugin
	$.vegas = function( method ) {
		if ( methods[ method ] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};
})( jQuery );