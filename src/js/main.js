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
		// touchRatio: 0,
	});

	var swiperH = new Swiper('.swiper-container-h', {
		slidesPerView: 'auto',
		// autoHeight: true,
		// initialSlide: 1,
		// centeredSlides: true,
		loop: true,
		spaceBetween: 30,
		direction: 'horizontal',
		keyboardControl: true
	});

	swiperV.on('slideChangeStart', function(swiper) {
		$('.navigate-block').removeClass('active').eq(swiper.activeIndex).addClass('active');
	});

	var $slides = $('.swiper-container-v').eq(0).find('.swiper-slide');
	swiperV.on('onSlideChangeEnd', function(swiper) {
		$slides = $('.swiper-container-v').eq(swiper.activeIndex).find('.swiper-slide');

		swiperH[swiper.activeIndex].on('slideChangeStart', function(swiper) {
			$slides.filter('.swiper-slide-prev, .swiper-slide-next').addClass('close');
		});

		swiperH[swiper.activeIndex].on('slideChangeEnd', function(swiper) {
			$slides.filter('.swiper-slide-active').removeClass('close');
		});
	});

	swiperH[0].on('slideChangeStart', function(swiper) {
		$slides.filter('.swiper-slide-prev, .swiper-slide-next').addClass('close');
	});

	swiperH[0].on('slideChangeEnd', function(swiper) {
		$slides.filter('.swiper-slide-active').removeClass('close');
	});

});