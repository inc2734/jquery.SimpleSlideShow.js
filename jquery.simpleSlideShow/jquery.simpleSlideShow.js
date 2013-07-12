/**
 * Plugin Name: jquery.SimpleSlideShow
 * Description: シンプルなスライドショーを実装するjQueryプラグイン
 * Version: 0.6
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * Created : Sep 30, 2011
 * Modified : July 12, 2013
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
 * @param	Numeric		duration		アニメーション時間（ms）
 * 			Numeric		interval		次のアニメーションまでのインターバル（ms）
 * 			Boolean		showNav			ナビゲーションの表示
 * 			String		navStyle( string, image )	ナビゲーション種別
 * 			Boolean		showCaption		キャプションの表示
 */
;( function( $ ) {
	$.fn.SimpleSlideShow = function( config ) {
		var canvas = $( this );
		canvas.find( 'img' ).hide();
		canvas.wrapInner( '<div class="simpleSlideShowWrapper"></div>' );
		var simpleSlideShow = canvas.find( '.simpleSlideShowWrapper' );
		var cnt = simpleSlideShow.find( 'img' ).length;
		var images = simpleSlideShow.find( 'img' );
		var timer = null;
		var fading = false;
		var defaults = {
			type        : 'fade',
			duration    : 1000,
			interval    : 3000,
			showNav     : false,
			navStyle    : 'string',
			showCaption : false
		};
		config = $.extend( defaults, config );

		var methods = {
			lotation: function( key ) {
				if ( typeof key === 'undefined' ) {
					key = 1;
				}
				clearTimeout( timer );

				var slide = function() {
					fading = true;
					images.css( 'left', 0 );
					images.eq( key ).css( 'left', -simpleSlideShow.width() );
					images.animate( {
						'left': simpleSlideShow.width()
					}, config.duration, function() {
						fading = false;
					} );
				}

				var fade = function() {
					fading = true;
					images.fadeOut( config.duration );
					images.eq( key ).fadeIn( config.duration, function() {
						fading = false;
					} );
					methods.showCaption( key );
					methods.setCurrentClass( key );
					key ++;
					if ( key >= cnt ) {
						key = 0;
					}
					if ( cnt > 1 && config.interval > 0 ) {
						timer = setTimeout( fade, config.interval );
					}
				}

				switch ( config.type ) {
					case 'slide' :
						slide();
					case 'fade' :
					default :
						fade();
				}
			},
			setCurrentClass: function( key ) {
				if ( config.showNav === true ) {
					canvas.find( '.simpleSlideShowNav ul li' ).removeClass( 'cur' );
					canvas.find( '.simpleSlideShowNav ul li' ).eq( key ).addClass( 'cur' );
				}
			},
			setSimpleSlideShowSize: function() {
				simpleSlideShow.css( {
					height : simpleSlideShow.find( 'img:first' ).height(),
					width  : simpleSlideShow.find( 'img:first' ).width()
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
						simpleSlideShow.after( '<div class="simpleSlideShowCaptionWrapper"></div>' );
						canvas.find( '.simpleSlideShowCaptionWrapper' ).html( caption );
					}
				}
			},
			createSimpleSlideShowNav: function() {
				var nav = '';
				for ( i = 1; i <= cnt; i ++ ) {
					if ( config.navStyle == 'string' ) {
						var navhtml = i;
					} else if ( config.navStyle == 'image' ) {
						var navhtml = '<img src="' + canvas.find( 'img' ).eq( i - 1 ).attr( 'src' ) + '" alt="' + i + '" />';
					}
					if ( typeof navhtml !== 'undefined' ) {
						nav += '<li class="nav_' + i + '" data-key="' + i + '">' + navhtml + '</li>';
					}
				}
				if ( nav ) {
					nav = '<div class="simpleSlideShowNav"><ul>' + nav + '</ul></div>';
					canvas.append( nav );
				}
			}
		};

		return this.each( function() {
			$( window ).load( function() {
				if ( config.showNav === true ) {
					methods.createSimpleSlideShowNav();
					canvas.find( '.simpleSlideShowNav ul li' ).live( 'click', function() {
						if ( ! $( this ).hasClass( 'cur' ) && fading === false && cnt > 1 ) {
							var key = $( this ).data( 'key' );
							methods.lotation( key - 1 );
						}
					} );
				}

				methods.setSimpleSlideShowSize();
				images.hide();
				images.eq( 0 ).show();
				methods.showCaption( 0 );
				methods.setCurrentClass( 0 );
				if ( cnt > 1 && config.interval > 0 ) {
					timer = setTimeout( methods.lotation, config.interval );
				}
			} );
		} );
	};
} )( jQuery );
