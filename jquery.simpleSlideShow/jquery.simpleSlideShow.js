/**
 * Plugin Name: jquery.SimpleSlideShow
 * Description: シンプルなスライドショーを実装するjQueryプラグイン
 * Version: 0.7.6
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * Created : Sep 30, 2011
 * Modified : September 17, 2013
 * License: GPL2
 *
 * Copyright 2013 Takashi Kitajima (email : inc@2inc.org)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @param	String		Type( fade, slide )			切り替えアニメーション
 * 			Numeric		duration					アニメーション時間（ms）
 * 			Numeric		interval					次のアニメーションまでのインターバル（ms）
 * 			Boolean		showNav						ナビゲーションの表示
 * 			String		navStyle( string, image )	ナビゲーション種別
 * 			Boolean		showCaption					キャプションの表示
 * 			Boolean		showPrevNextNav				前後ナビの表示
 * 			String		prev_text					前ナビの文字列
 * 			String		next_text					後ナビの文字列
 * 			Boolean		autoResize					自動リサイズ実行
 */
;( function( $ ) {
	$.fn.SimpleSlideShow = function( config ) {
		var defaults = {
			type           : 'fade',
			duration       : 1000,
			interval       : 3000,
			showNav        : false,
			navStyle       : 'string',
			showCaption    : false,
			showPrevNextNav: false,
			prev_text      : '&laquo;',
			next_text      : '&raquo;',
			autoResize     : false
		};
		config = $.extend( defaults, config );

		return this.each( function() {
			var canvas = $( this );
			canvas.removeClass( '_defaultSize' );
			canvas.wrapInner( '<div class="simpleSlideShowWrapper" />' );
			var simpleSlideShow = canvas.find( '.simpleSlideShowWrapper' );
			simpleSlideShow.wrapInner( '<div class="simpleSlideShowInner" />' );
			var simpleSlideShowInner = canvas.find( '.simpleSlideShowInner' );
			var cnt = simpleSlideShowInner.find( 'img, iframe' ).length;
			var images = simpleSlideShowInner.find( 'img, iframe' );
			var timer = null;
			var moving = false;
			var now = 0;
			var clickCount = 0;
			var slideDirection;
			images.hide();
			if ( config.showCaption === true ) {
				simpleSlideShowInner.after(
					$( '<div class="simpleSlideShowCaptionWrapper" />' )
				);
				var simpleSlideShowCaptionWrapper = canvas.find( '.simpleSlideShowCaptionWrapper' );
			}
			if ( config.showNav === true ) {
				canvas.append( '<div class="simpleSlideShowNav" />' );
				var simpleSlideShowNav = canvas.find( '.simpleSlideShowNav' );
			}
			if ( config.showPrevNextNav === true ) {
				canvas.append( '<div class="simpleSlideShowPrevNextNav" />' );
				var simpleSlideShowPrevNextNav = canvas.find( '.simpleSlideShowPrevNextNav' );
			}
			simpleSlideShow.addClass( config.type );

			$( window ).load( function() {
				if ( typeof simpleSlideShowNav !== 'undefined' ) {
					methods.createSimpleSlideShowNav();
					canvas.find( simpleSlideShowNav ).find( 'ul li' ).on( 'click', function() {
						if ( ! $( this ).hasClass( 'cur' ) && moving === false && cnt > 1 ) {
							var key = $( this ).data( 'key' );
							if ( key < now && config.type == 'slide' )
								slideDirection = 'right';
							methods.lotation( key );
						}
					} );
				}
				if ( typeof simpleSlideShowPrevNextNav !== 'undefined' ) {
					methods.createSimpleSlideShowPrevNextNav();
					canvas.find( simpleSlideShowPrevNextNav ).find( 'ul li' ).on( 'click', function() {
						if ( moving === false && cnt > 1 ) {
							var key = $( this ).data( 'key' );
							if ( $( this ).hasClass( 'nav_prev' ) && config.type == 'slide' )
								slideDirection = 'right';
							methods.lotation( key );
						}
					} );
				}

				methods.setSimpleSlideShowInnerSize();
				switch ( config.type ) {
					case 'slide' :
						slideDirection = 'left';
						images.show();
						images.each( function( i, e ) {
							$( e ).css( 'left', -i * simpleSlideShowInner.width() );
						} );
						break;
					case 'fade' :
					default :
						images.eq( 0 ).show();
				}
				methods.start( 1 );
			} );

			var methods = {
				start: function( key ) {
					methods.showCaption( key - 1 );
					methods.setCurrentClass( key - 1 );
					if ( cnt > 1 && config.interval > 0 ) {
						timer = setTimeout( function() {
							methods.lotation( key );
						}, config.interval );
					}
				},
				lotation: function( key ) {
					clearTimeout( timer );
					switch ( config.type ) {
						case 'slide' :
							switch ( slideDirection ) {
								case 'left' :
									methods.type.slideLeft( key );
									break;
								case 'right' :
									methods.type.slideRight( key );
									break;
							}
							break;
						case 'fade' :
						default :
							methods.type.fade( key );
					}
					key ++;
					var target = key % cnt;
					methods.start( target );
				},
				type: {
					fade: function( key ) {
						methods.processBeforeMove( key );
						moving = true;
						images.fadeOut( config.duration );
						images.eq( key ).fadeIn( config.duration, function() {
							methods.processAfterMove( key );
						} );
					},
					_slideBeforeInit: function( key ) {
						methods.processBeforeMove( key );
						clickCount ++;
						moving = true;
						images.eq( key ).css( 'z-index', clickCount );
					},
					slideLeft: function( key ) {
						methods.type._slideBeforeInit( key );
						images.eq( key ).css( 'left', -simpleSlideShowInner.width() );
						images.stop( true, true ).animate( {
							'left': '+=' + simpleSlideShowInner.width()
						}, config.duration, function() {
							methods.processAfterMove( key );
						} );
					},
					slideRight: function( key ) {
						methods.type._slideBeforeInit( key );
						slideDirection = 'left'
						images.eq( key ).css( 'left', +simpleSlideShowInner.width() );
						images.stop( true, true ).animate( {
							'left': '-=' + simpleSlideShowInner.width()
						}, config.duration, function() {
							methods.processAfterMove( key );
						} );
					}
				},
				processBeforeMove: function( key ) {
					if ( typeof simpleSlideShowCaptionWrapper !== 'undefined' ) {
						simpleSlideShowCaptionWrapper.css( 'z-index', clickCount + 2 );
					}
					if ( typeof simpleSlideShowNav !== 'undefined' ) {
						simpleSlideShowNav.css( 'z-index', clickCount + 2 );
					}
					if ( typeof simpleSlideShowPrevNextNav !== 'undefined' ) {
						simpleSlideShowPrevNextNav.css( 'z-index', clickCount + 2 );
					}
				},
				processAfterMove: function( key ) {
					moving = false;
					now = key;
					if ( typeof simpleSlideShowPrevNextNav !== 'undefined' ) {
						methods.setNavPrevKey();
						methods.setNavNextKey();
					}
				},
				setNavPrevKey: function( key ) {
					simpleSlideShowPrevNextNav.find( 'ul li.nav_prev' ).data( 'key', now % cnt - 1 );
				},
				setNavNextKey: function( key ) {
					simpleSlideShowPrevNextNav.find( 'ul li.nav_next' ).data( 'key', ( now + 1 ) % cnt );
				},
				setCurrentClass: function( key ) {
					if ( typeof simpleSlideShowNav !== 'undefined' ) {
						canvas.find( simpleSlideShowNav ).find( 'ul li' )
							.removeClass( 'cur' )
							.eq( key ).addClass( 'cur' );
					}
				},
				setSimpleSlideShowInnerSize: function() {
					simpleSlideShowInner.css( {
						height: simpleSlideShowInner.find( 'img:first' ).height(),
						width : simpleSlideShowInner.find( 'img:first' ).width()
					} );
					if ( config.autoResize === true ) {
						var simpleSlideShowTimer = setTimeout( function() {
							methods.setSimpleSlideShowInnerSize();
						}, 1000 );
					}
				},
				showCaption: function( key ) {
					if ( config.showCaption === true ) {
						simpleSlideShowCaptionWrapper.hide();
						var img = images.eq( key );
						var captionhtml = img.data( 'caption' );
						var _caption = ( captionhtml ) ? $( '#' + captionhtml ).html() : img.attr( 'title' );
						var caption = $( '<span />' ).append( _caption );
						if ( caption ) {
							simpleSlideShowCaptionWrapper.html( caption ).show();
						}
					}
				},
				createSimpleSlideShowNav: function() {
					simpleSlideShowNav.append( $( '<ul />' ) );
					images.each( function( i, e ) {
						if ( config.navStyle == 'string' ) {
							var navhtml = i;
						} else if ( config.navStyle == 'image' ) {
							var src = '';
							var thumbnail = $( e ).data( 'thumbnail' );
							if ( typeof thumbnail !== 'undefined' ) {
								if ( typeof $( '#' + thumbnail ).get( 0 ) !== 'undefined' ) {
									if ( $( '#' + thumbnail ).get( 0 ).nodeName == 'IMG' )
										src = $( '#' + thumbnail ).attr( 'src' );
								}
							}
							if ( !src ) {
								if ( e.nodeName == 'IFRAME' ) {
									var _id = $( e ).attr( 'src' ).match( '\/\/www.youtube.com\/embed\/([^&#]*)' );
									if ( _id !== null ) {
										var id = _id[1];
										src = 'http://img.youtube.com/vi/' + id + '/2.jpg';
									}
								} else {
									src = canvas.find( 'img' ).eq( i ).attr( 'src' );
								}
							}
							var navhtml = $( '<img />' ).attr( {
								src: src,
								alt: i + 1
							} );
						}
						if ( typeof navhtml !== 'undefined' ) {
							var nav = $( '<li />' )
									.addClass( 'nav_' + ( i + 1 ) )
									.data( 'key', ( i ) )
									.append( navhtml );
							simpleSlideShowNav.find( 'ul' ).append( nav );
							canvas.append( simpleSlideShowNav );
						}
					} );
				},
				createSimpleSlideShowPrevNextNav: function() {
					simpleSlideShowPrevNextNav.append( $( '<ul />' ) );
					var _array = [ 'prev', 'next' ];
					for ( i = 0; i < _array.length; i ++ ) {
						var navhtml = config[_array[i] + '_text'];
						var nav = $( '<li />' )
								.addClass( 'nav_' + _array[i] )
								.append( navhtml );
						simpleSlideShowPrevNextNav.find( 'ul' ).append( nav );
						methods.setNavPrevKey();
						methods.setNavNextKey();
					}
				}
			};

		} );
	};
} )( jQuery );
