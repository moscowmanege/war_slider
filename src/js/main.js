$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var banner_timeout = null;
	var navigate_timeout = null;

	var swiperV = new Swiper('.swiper-container-v', {
		slidesPerView: 1,
		direction: 'vertical',
		loop: true,
		runCallbacksOnInit: false,
		// touchRatio: 0,
		// keyboardControl: true,
		pagination: true,
		paginationType: 'custom',
		paginationCustomRender: function(swiper, current, total) {
			$('.navigate-block').removeClass('active').eq(current - 1).addClass('active');
		},
		onSlideChangeStart: function(swiper) {
			$('.navigate-blocks').addClass('active');

			clearTimeout(navigate_timeout);
			navigate_timeout = setTimeout(function() {
				$('.navigate-blocks').removeClass('active');
			}, 300);
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
		// preloadImages: false,
		// lazyLoading: true,
		// lazyLoadingInPrevNext: true,
		// lazyLoadingInPrevNextAmount: 3,
		onInit: function(swiper) {
			$(swiper.slides).filter('.swiper-slide-prev, .swiper-slide-next').addClass('close');
		},
		onSlideChangeStart: function(swiper) {
			$(swiper.slides).filter('.swiper-slide-prev, .swiper-slide-active, .swiper-slide-next').addClass('close');
		},
		onSlideChangeEnd: function(swiper) {
			$(swiper.slides).filter('.swiper-slide-active').removeClass('close');
		}
	});

	$(document)
		.on('keydown', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				$('.navigate-button.' + buttons[event.which]).addClass('active');

				if (!banner_timeout) $('.banner-block').addClass(buttons[event.which]);
			}
		})
		.on('keyup', function(event) {
			if (Object.keys(buttons).indexOf('' + event.which) != -1) {
				$('.navigate-button.' + buttons[event.which]).removeClass('active');

				if (!banner_timeout) {
					swiperH.forEach(function(swiper) { swiper.enableKeyboardControl(); });
					swiperV.enableKeyboardControl();
					$('.banner-block').addClass('out');
				}

				clearTimeout(banner_timeout);
				banner_timeout = setTimeout(function() {
					$('.banner-block').removeClass('left right down up out');

					swiperH.forEach(function(swiper) { swiper.disableKeyboardControl(); });
					swiperV.disableKeyboardControl();
					banner_timeout = null;
				}, 6000);

			}
		});

});