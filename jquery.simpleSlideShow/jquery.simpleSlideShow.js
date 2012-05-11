/**
 * Plugin Name: jquery.SimpleSlideShow
 * Description: シンプルなスライドショーを実装するjQueryプラグイン
 * Version: 0.3
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * modified : May 12, 2012
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
 * @param	Numeric	height	高さ（初期値：1枚目の画像の高さ）
 * 			Numeric width	横幅（初期値：1枚目の画像の横幅）
 * 			Numeric duration	アニメーション時間（ms）
 * 			Numeric interval	次のアニメーションまでのインターバル（ms）
 */
( function( $ ) {
	$.fn.SimpleSlideShow = function( config ) {
		var canvas = $(this);
		canvas.find('img').hide();
		$(window).load( function() {
			canvas.wrapInner('<div class="simpleSlideShowWrapper"></div>');
			var simpleSlideShow = canvas.find('.simpleSlideShowWrapper');
			var defaults = {
				height : simpleSlideShow.find('img:first').height(),
				width  : simpleSlideShow.find('img:first').width(),
				duration : 1000,
				interval : 3000
			};
			config = $.extend( defaults, config );
			simpleSlideShow.find('img:first').show();
			simpleSlideShow.css({
				'height' : config.height,
				'width' : config.width
			});
			var cnt = simpleSlideShow.find('img').length;
			var i = 0;
			if ( cnt > 1 ) {
				setInterval( function() {
					var img = simpleSlideShow.find('img').eq( i );
					i ++;
					img.fadeOut(config.duration);
					if ( i >= cnt ) {
						i = 0;
					}
					simpleSlideShow.find('img').eq( i ).fadeIn( config.duration );
				}, config.interval );
			}
		});
	};
})( jQuery );