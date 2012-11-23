/**
 * Plugin Name: jquery.SimpleSlideShow
 * Description: シンプルなスライドショーを実装するjQueryプラグイン
 * Version: 0.4
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * Created : Sep 30, 2011
 * Modified : November 22, 2012
 * License: GPL2
 *
 * Copyright 2012 Takashi Kitajima (email : inc@2inc.org)
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
 * @param	Numeric	duration	アニメーション時間（ms）
 * 			Numeric	interval	次のアニメーションまでのインターバル（ms）
 * 			Boolean	showNav		ナビゲーションの表示
 */
( function( $ ) {
	$.fn.SimpleSlideShow = function( config ) {
		var canvas = $( this );
		canvas.find( 'img' ).hide();
		canvas.wrapInner( '<div class="simpleSlideShowWrapper"></div>' );
		var simpleSlideShow = canvas.find( '.simpleSlideShowWrapper' );
		var cnt = simpleSlideShow.find( 'img' ).length;
		var timer = null;
		var defaults = {
			duration : 1000,
			interval : 3000,
			showNav  : false
		};
		config = $.extend( defaults, config );
		
		var methods = {
			lotation: function( key ) {
				clearTimeout( timer );
				canvas.find( 'img' ).hide();
				simpleSlideShow.find( 'img' ).eq( key ).show();
				var fade = function() {
					simpleSlideShow.find( 'img' ).eq( key ).fadeOut( config.duration );
					key ++;
					if ( key >= cnt ) {
						key = 0;
					}
					simpleSlideShow.find( 'img' ).eq( key ).fadeIn( config.duration );
					methods.setCurrentClass( key );
					timer = setTimeout( fade, config.interval );
				};
				timer = setTimeout( fade, config.interval );
			},
			setCurrentClass: function( key ) {
				if ( config.showNav === true ) {
					$( '.simpleSlideShowNav ul li' ).removeClass( 'cur' );
					$( '.simpleSlideShowNav ul li' ).eq( key ).addClass( 'cur' );
				}
			},
			setSimpleSlideShowSize: function() {
				simpleSlideShow.css( {
					height : simpleSlideShow.find( 'img:first' ).height(),
					width  : simpleSlideShow.find( 'img:first' ).width()
				} );
			}
		};
				
		return this.each( function() {
			$( window ).load( function() {
				if ( cnt > 1 ) {
					methods.setSimpleSlideShowSize();
					methods.lotation( 0 );
				}
				
				if ( config.showNav === true ) {
					var nav = '';
					for ( i = 1; i <= cnt; i ++ ) {
						nav += '<li class="nav_' + i + '" data-key="' + i + '">' + i + '</li>';
					}
					if ( nav ) {
						nav = '<div class="simpleSlideShowNav"><ul>' + nav + '</ul></div>';
						canvas.append( nav );
						methods.setCurrentClass( 0 );
						$( '.simpleSlideShowNav ul li' ).live( 'click', function() {
							var key = $( this ).data( 'key' );
							methods.setSimpleSlideShowSize();
							methods.setCurrentClass( key - 1 );
							methods.lotation( key - 1 );
						} );
					}
				}
			} );
		} );
	};
})( jQuery );