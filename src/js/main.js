$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var banner_interval;
	var swiper_interval;

	$(document)
		.on('keydown', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) $('.navigate-button.' + buttons[event.which]).addClass('active');
		})
		.on('keyup', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) $('.navigate-button.' + buttons[event.which]).removeClass('active');
		});

	$(document)
		.on('keydown', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				$('.banner-block').addClass(buttons[event.which]);
			}
		})
		.on('keyup', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				$('.banner-block').addClass('out');

				clearInterval(banner_interval);
				banner_interval = setInterval(function() {
					$('.banner-block').removeClass('left right down up out');
				}, 3000);
			}
		});

	var swiperV = new Swiper('.swiper-container-v', {
		direction: 'vertical',
		keyboardControl: true,
		// loop: true,
		// touchRatio: 0,
	});

	var swiperH = new Swiper('.swiper-container-h', {
		slidesPerView: 'auto',
		// autoHeight: true,
		// initialSlide: 1,
		// centeredSlides: true,
		// loop: true,
		spaceBetween: 30,
		direction: 'horizontal',
		keyboardControl: true
	});

	swiperV.on('slideChangeStart', function(swiper) {
		$('.navigate-block').removeClass('active').eq(swiper.activeIndex).addClass('active');

		$('.navigate-blocks').addClass('active');

		clearInterval(swiper_interval);
		swiper_interval = setInterval(function() {
			$('.navigate-blocks').removeClass('active');
		}, 300);
	});

	swiperH.forEach(function(item, index) {
		var $slides = $('.swiper-container-h').eq(index).find('.swiper-slide');

		item.on('slideChangeStart', function(swiper) {
			$slides.filter('.swiper-slide-prev, .swiper-slide-next').addClass('close');
		});

		item.on('slideChangeEnd', function(swiper) {
			$slides.filter('.swiper-slide-active').removeClass('close');
		});
	});

});