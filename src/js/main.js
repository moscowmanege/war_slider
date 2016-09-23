$(function() {

	var swiperV = new Swiper('.swiper-container-v', {
		pagination: '.swiper-pagination-v',
		paginationClickable: true,
		direction: 'vertical',
		keyboardControl: true,
		// touchRatio: 0
	});

	var swiperH = new Swiper('.swiper-container-h', {
		pagination: '.swiper-pagination-h',
		paginationClickable: true,
		slidesPerView: 'auto',
		// autoHeight: true,
		// initialSlide: 1,
		// centeredSlides: true,
		spaceBetween: 30,
		direction: 'horizontal',
		keyboardControl: true
	});

});