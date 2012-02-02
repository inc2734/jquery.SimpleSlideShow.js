/*
* シンプルなスライドショー
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