$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};

	$(document)
		.on('keydown', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) $('.navigate-button.' + buttons[event.which]).addClass('active');
		})
		.on('keyup', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) $('.navigate-button.' + buttons[event.which]).removeClass('active');
		});

	var swiperV = new Swiper('.swiper-container-v', {
		direction: 'vertical',
		keyboardControl: true,
		// touchRatio: 0
	});

	var swiperH = new Swiper('.swiper-container-h', {
		slidesPerView: 'auto',
		// autoHeight: true,
		// initialSlide: 1,
		// centeredSlides: true,
		spaceBetween: 30,
		direction: 'horizontal',
		keyboardControl: true
	});

	swiperV.on('slideChangeStart', function(swiper) {
		$('.navigate-block').removeClass('active').eq(swiper.activeIndex).addClass('active');
	});

});