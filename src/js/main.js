$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var banner_timeout = null;
	var navigate_timeout = null;

	var reload_interval = setInterval(function() {
		location.reload();
	}, 1000 * 60 * 20);

	var $navigate_blocks = $('.navigate-blocks');

	var swiperV = new Swiper('.swiper-container-v', {
		slidesPerView: 1,
		direction: 'vertical',
		loop: true,
		runCallbacksOnInit: false,
		// touchRatio: 0,
		// keyboardControl: true,
		onSlideChangeStart: function(swiper) {
			$navigate_blocks.addClass('active').children('.navigate-block').removeClass('active').eq(swiper.realIndex).addClass('active');

			clearTimeout(navigate_timeout);
			navigate_timeout = setTimeout(function() {
				$navigate_blocks.removeClass('active');
			}, 1600);
		}
	});

	var swiperH = new Swiper('.swiper-container-h', {
		slidesPerView: 1,
		direction: 'horizontal',
		// spaceBetween: 30,
		// autoHeight: true,
		// initialSlide: 1,
		// centeredSlides: true,
		// keyboardControl: true,
		loop: true,
		runCallbacksOnInit: false,

		preloadImages: false,
		lazyLoading: true,
		lazyLoadingInPrevNext: true,
		lazyLoadingInPrevNextAmount: 2,

		onInit: function(swiper) {
			swiper.slides.filter('.swiper-slide-prev, .swiper-slide-next').addClass('close');
		},
		onSlideChangeStart: function(swiper) {
			swiper.slides.filter('.swiper-slide-prev, .swiper-slide-active, .swiper-slide-next').addClass('close');
		},
		onSlideChangeEnd: function(swiper) {
			swiper.slides.filter('.swiper-slide-active').removeClass('close');
		}
	});

	$(document)
		.on('keydown', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				if (!$('.banner-block').hasClass('out')) {
					$('.navigate-button.' + buttons[event.which]).addClass('active');
					$navigate_blocks.addClass('force').removeClass('active');
				}

				if (!banner_timeout) $('.banner-block').addClass(buttons[event.which]);
			}
		})
		.on('keyup', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				if (!$('.banner-block').hasClass('out')) {
					$navigate_blocks.removeClass('force');
				}

				if (!banner_timeout) {
					swiperH.forEach(function(swiper) { swiper.enableKeyboardControl(); });
					swiperV.enableKeyboardControl();
					$('.navigate-button').removeClass('active');
					$('.banner-block, .navigate-buttons').addClass('out');
				}

				clearTimeout(banner_timeout);
				clearInterval(reload_interval);

				reload_interval = setInterval(function() {
					location.reload();
				}, 1000 * 60 * 20);

				banner_timeout = setTimeout(function() {
					$('.banner-block, .navigate-buttons').removeClass('left right down up out');
					$navigate_blocks.addClass('active');

					swiperH.forEach(function(swiper) { swiper.disableKeyboardControl(); });
					swiperV.disableKeyboardControl();
					banner_timeout = null;
				}, 1000 * 40);

			}
		});

});