/**
 * Plugin Name: jquery.SimpleSlideShow
 * Description: シンプルなスライドショーを実装するjQueryプラグイン
 * Version: 0.6.1
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * Created : Sep 30, 2011
 * Modified : July 18, 2013
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
 */
;( function( $ ) {
	$.fn.SimpleSlideShow = function( config ) {
		var canvas = $( this );
		canvas.wrapInner( '<div class="simpleSlideShowWrapper"></div>' );
		var simpleSlideShow = canvas.find( '.simpleSlideShowWrapper' );
		var cnt = simpleSlideShow.find( 'img' ).length;
		var images = simpleSlideShow.find( 'img' );
		var timer = null;
		var moving = false;
		var now = 0;
		var defaults = {
			type       : 'fade',
			duration   : 1000,
			interval   : 3000,
			showNav    : false,
			navStyle   : 'string',
			showCaption: false
		};
		config = $.extend( defaults, config );
		simpleSlideShow.addClass( config.type );

		var methods = {
			start: function( key ) {
				methods.showCaption( key - 1 );
				methods.setCurrentClass( key - 1 );
				if ( cnt > 1 && config.interval > 0 ) {
					timer = setTimeout( function() {
						methods.lotation( key )
					}, config.interval );
				}
			},
			lotation: function( key ) {
				clearTimeout( timer );
				switch ( config.type ) {
					case 'slide' :
						methods.type.slide( key );
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
					moving = true;
					images.fadeOut( config.duration );
					images.eq( key ).fadeIn( config.duration, function() {
						moving = false;
						now = key;
					} );
				},
				slide: function( key ) {
					moving = true;
					images.eq( key ).css( 'left', -simpleSlideShow.width() );
					images.animate( {
						'left': '+=' + simpleSlideShow.width()
					}, config.duration, function() {
						moving = false;
						now = key;
					} );
				}
			},
			setCurrentClass: function( key ) {
				if ( config.showNav === true ) {
					canvas.find( '.simpleSlideShowNav ul li' )
						.removeClass( 'cur' )
						.eq( key ).addClass( 'cur' );
				}
			},
			setSimpleSlideShowSize: function() {
				simpleSlideShow.css( {
					height: simpleSlideShow.find( 'img:first' ).height(),
					width : simpleSlideShow.find( 'img:first' ).width()
				} );
			},
			showCaption: function( key ) {
				if ( config.showCaption === true ) {
					canvas.find( '.simpleSlideShowCaptionWrapper' ).remove();
					var img = images.eq( key );
					var captionhtml = img.data( 'caption' );
					if ( captionhtml ) {
						var caption = $( '#' + captionhtml ).html();
					} else {
						var caption = img.attr( 'title' );
					}
					if ( caption ) {
						simpleSlideShow.after(
							$( '<div class="simpleSlideShowCaptionWrapper" />' )
								.html( caption )
						);
					}
				}
			},
			createSimpleSlideShowNav: function() {
				var simpleSlideShowNav = $( '<div class="simpleSlideShowNav" />' ).append( $( '<ul />' ) );
				for ( i = 1; i <= cnt; i ++ ) {
					if ( config.navStyle == 'string' ) {
						var navhtml = i;
					} else if ( config.navStyle == 'image' ) {
						var navhtml = $( '<img />' ).attr( {
							src: canvas.find( 'img' ).eq( i - 1 ).attr( 'src' ),
							alt: i
						} );
					}
					if ( typeof navhtml !== 'undefined' ) {
						var nav = $( '<li />' )
								.addClass( 'nav_' + i )
								.data( 'key', ( i - 1 ) )
								.append( navhtml );
						simpleSlideShowNav.find( 'ul' ).append( nav );
						canvas.append( simpleSlideShowNav );
					}
				}
			}
		};

		return this.each( function() {
			$( window ).load( function() {
				if ( config.showNav === true ) {
					methods.createSimpleSlideShowNav();
					canvas.find( '.simpleSlideShowNav ul li' ).on( 'click', function() {
						if ( ! $( this ).hasClass( 'cur' ) && moving === false && cnt > 1 ) {
							var key = $( this ).data( 'key' );
							methods.lotation( key );
						}
					} );
				}

				methods.setSimpleSlideShowSize();
				switch ( config.type ) {
					case 'slide' :
						images.show();
						images.each( function( i, e ) {
							$( e ).css( 'left', -i * simpleSlideShow.width() );
						} );
						break;
					case 'fade' :
					default :
						images.eq( 0 ).show();
				}
				methods.start( 1 );
			} );
		} );
	};
} )( jQuery );
