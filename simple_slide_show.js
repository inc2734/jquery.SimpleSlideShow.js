/*
* Author : http://2inc.org
* created: 2011/09/29
* creative commons 表示 - 継承 3.0 (CC BY-SA 3.0)
* http://creativecommons.org/licenses/by-sa/3.0/deed.ja
*
* シンプルなスライドショー
* @param	Numeric	height	高さ（初期値：1枚目の画像の高さ）
* 			Numeric width	横幅（初期値：1枚目の画像の横幅）
* 			Numeric duration	アニメーション時間（ms）
* 			Numeric interval	次のアニメーションまでのインターバル（ms）
*/
( function( jQuery ) {
	$.fn.SimpleSlideShow = function( config ) {
		var canvas = $(this);
		canvas.children( 'img' ).wrapAll( '<div id="simpleSlideShow"></div>' );
		var simpleSlideShow = $('#simpleSlideShow');
		var defaults = {
			'height' : simpleSlideShow.children( 'img:first' ).height(),
			'width'  : simpleSlideShow.children( 'img:first' ).width(),
			'duration' : 1000,
			'interval' : 3000
		};
		var config = $.extend( defaults, config );
		simpleSlideShow.children( 'img' ).hide();
		simpleSlideShow.children( 'img:first' ).show();
		simpleSlideShow.css({
			'height' : config['height'],
			'width' : config['width']
		});
		var cnt = simpleSlideShow.children( 'img' ).length;
		var i = 0;
		setInterval( function() {
			var img = simpleSlideShow.children( 'img' ).eq( i );
			i ++;
			img.fadeOut( config['duration'] );
			if ( i >= cnt ) {
				i = 0;
				simpleSlideShow.children( 'img' ).eq( i ).fadeIn( config['duration'] );
			} else {
				img.next().fadeIn( config['duration'] );
			}
		}, config['interval'] );
	};
} )( jQuery );