$(function() {

	var swiperV = new Swiper('.swiper-container-v', {
		// pagination: '.swiper-pagination-v',
		// paginationClickable: true,
		direction: 'vertical',
		keyboardControl: true,
		// touchRatio: 0
	});

	var swiperH = new Swiper('.swiper-container-h', {
		// pagination: '.swiper-pagination-h',
		// paginationClickable: true,
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

	$(document)
		.on('keydown', function(event) {
			if (event.which == 40) $('.navigate-button.down').addClass('active');
			if (event.which == 38) $('.navigate-button.up').addClass('active');
			if (event.which == 37) $('.navigate-button.left').addClass('active');
			if (event.which == 39) $('.navigate-button.right').addClass('active');
		})
		.on('keyup', function(event) {
			$('.navigate-button').removeClass('active');
		});

});