$(function() {
	var TOPIC_CHANGE_INTERVALL = 30000;

/*  -- DISABLED due to not working with slow connections

	$('.js-nav-link').on('click', function(event){
		event.preventDefault();
		var url = $(this).attr('href');


		$('body').removeClass('menu-open');
		setTimeout( function(){
			window.location.href = url;
		}, 450);

	});
	*/

	// To track elements visible in viewport
	function isElementInViewport (el) {
		var rect = el.getBoundingClientRect();
		return (
			Math.abs(rect.top) < ( window.innerHeight/2 ) &&
			Math.abs(rect.bottom) >=  ( window.innerHeight/2 ) // (window.innerHeight || document.documentElement.clientHeight)
		);
	}
	// Destroy non-js elements and loader and stuff
	$('.js-destroy').remove();
	/*
		****************************************
		-- Section/viewport anchor formats
		****************************************
	*/
	// Function to show anchors. Called only if anchor links exist on the page.
	/*function showAnchors(scrolling){
		if( scrolling ){
			$('.js-section-anchor').stop().fadeOut(100);
		}
		if( !scrolling ){
			$('.js-section-anchor').stop().fadeIn(300);
		}
	}*/
	// Call on if exists.
	/*
	if( $('.js-section-anchor').length ){
		// Destroy the last anchor
		//$('.js-section-anchor').last().remove();
		// Show anchors with 2s delay once.

		// Watch the scroll and hide if scrolling, but show after 2s idle.
		var newtimer = null;
		$(window).scroll(function(){
			$('.js-section-anchor').stop().fadeOut(100);
			if( newtimer !== null ) {
				clearTimeout( newtimer );
			}
			newtimer = setTimeout(function() {
				$('.js-section-anchor').stop().fadeIn(100);
			}, 750 );
		});

	}*/
	// Menu actions
	$('#mobile').on('click', function(){

		if( $('body').hasClass('menu-open') ){
			// Closing menu.
			//document.cookie = 'menu_open=false';
		}/*else{
			// Opening menu.
			document.cookie = 'menu_open=true';
		}*/

		$('.icon-menu').removeClass('paused'); // Animation starts paused.
		$('body').toggleClass('menu-open');
	});
	// Variables
	var resizeid,
			changeid,
			windowheight,
			navheight,
			real_height,
			vph,
			viewports = $(".viewport"),
			images_to_replace = $(".js-replace-image"),
			placeholder_img = $('.placeholder-content-image');

		if( $('#js-first-content').length > 0 ){
			var el_top = $('#js-first-content').offset().top;
		}

	// Lazyload people images. Important to load before any player scripts are called.
	if( $('.people-wrapper').length ){
		$('.js-ll-person').each( function(){
			$(this).attr("src", $(this).attr('data-src') );
		});
		$('.js-ll-video').each(function(){
			$(this).attr("src", $(this).attr('data-src') );
		});
	}
	/*
		****************************************
		-- Resize listener and set viewport size
		****************************************
	*/
	window.onresize = function(){
		//sets the height of .viewport elements
		clearTimeout(resizeid);
		resizeid = setTimeout(setViewportHeight, 500);

		//changes case images when resizing on desktop
		clearTimeout(changeid);
		if(device.desktop()){
			if( $('.single-case').length > 0 ){
				changeDesktopCaseImage();
				setPlaceholderImagePosition();
				changeCaseImage();
			}

			// And then remove unnecessary load-more-notes -buttons if they exist.

			if( $('.notes-wrapper').length > 0 && $('.js-load-notes').length > 1 ){

				$('.js-load-notes').each( function(){
					if( $(this).parent().css('display') == 'block' && $(this).parent().next('.viewport').css('display') != 'none' ){
						$(this).remove();
					}
				});
			}
		}
	}
	function setViewportHeight(){
		navheight = $(".nav-header").outerHeight();
		windowheight = window.innerHeight;
		real_height = windowheight - navheight;
		var it = 0;
		// if it's mobile, we only wanna affect video viewports. Catch it with .viewport.video-wrapper-outer
		if( device.mobile() ){
			if( $('.video-wrapper-outer').length ){
				$('.video-wrapper-outer').each(function(){
					$(this).css({ 'height': real_height+'px'});
				});
			}
		}else{
			//if viewport content is too long, we set the height to be min-height instead of height
			viewports.each(function(){
				// This is the height of .viewport element.
				vph = $(this)[0].scrollHeight;

				// If viewport's height is bigger than window's height...
				if(vph > real_height && it != 0){
					// Give it only minimum height and unset height
					$(this).css({ 'min-height': real_height+'px', 'height': ''});
				
				}else if(vph > real_height && it==0){
					$(this).css({ 'min-height': real_height+'px', 'height': ''});

				// This is quite... mainly use is to hide the bug described in the comment ahead
				}else if ( window.innerWidth < 768 ){
					$(this).css('height','auto').css({ 'min-height': '400px'});
				}
				else{	
					// If it's not first element and it's height is less than window height.
					// Bug at 676px height, while win.h=756 and navheight = 80, so real.h=676
					$(this).css({ 'height': real_height+'px'});
					
				}
				it++;
			});
		}
	}
	/*
		*******************
		-- Hide extra notes
		*******************
	*/
	var current = 1;
	$('.notes-wrapper .viewport').slice(current).hide();

	//show a new group of notes

	$('.js-load-notes').on('click', function(){
		if( device.mobile() || device.tablet() || window.innerWidth < 768 ){
			current++;
			$('.notes-wrapper .viewport:nth-child('+current+')').fadeIn('slow');
			$('html, body').animate({
					scrollTop: $('.notes-wrapper .viewport:nth-child('+current+')').offset().top - $(".nav-header").outerHeight()
			}, 100 );
			$(this).remove();
		}
	});

	$(window).scroll(function(){
		if( device.desktop() && window.innerWidth >= 768 ){
			var win = $(window);
			var doc = $(document);
			if( $('.notes-wrapper').length > 0 && win.scrollTop() == doc.height() - win.height() ) {
				current++;
				$('.notes-wrapper .viewport:nth-child('+current+')').fadeIn('slow');
			}
			// If cases page and have cases. Would suck if there were none.
			if( $('.single-case').length > 0 ){
				changeCaseImage();

				setPlaceholderImagePosition();
				// Breakpoint is

			}
			// Calculate nav here.
			if( $('body').hasClass('menu-open') && ( $(window).scrollTop() + $(".nav-header").outerHeight() ) > ( $('#js-first-content').offset().top/2 ) ){ // && if cookie[override_navigation] etc
				// Do cookie checks here.
				$('body').removeClass('menu-open');
			}
		}
	});

	function simpleValidateEmail(addr){
		var re = /\S+@\S+\.\S+/;
		return re.test(addr);
	}

	function isPage(path){
		return topics.hasOwnProperty(path);
	}

	

	// Add anchor link scroll if page has more .viewports than 1 (so there's actually something to scroll to) and it's not notes-page.
	if( $('.viewport').length > 1 && !$('.viewport--notes').length ){
		var scroll_target;

		$('.page-aside').find('a').on('click', function(event){
			event.preventDefault();
			scroll_target = $(this).attr('href');
			$('html, body').animate({
				scrollTop: $(scroll_target).find('.flex-wrap').offset().top - $(".nav-header").outerHeight()
			}, 500 );
		});
	}
	// Scroll to top for breadcrumbs.
	$('.js-scroll-to-top').on('click', function(){
		$('html, body').animate({
			scrollTop: 0
		}, 500 );
	});
	// Scroll to next viewport-element
	/*
	$('.js-section-anchor').on('click', function(){
		var el;
		viewports.each(function(){
			if( isElementInViewport( $(this)[0] ) ){
				el = $(this);
			}
		});
		if(el.length > 0){
			pressToScroll( el.next() );
		}
	});
	*/
	// On keypress events
	document.onkeydown = checkKey;

	function pressToScroll(target){
		$('html, body').animate({
			scrollTop: target.offset().top - $(".nav-header").outerHeight()
		}, 250 );
	}

	function checkKey(e) {
		var el;
		viewports.each(function(){
			if( isElementInViewport( $(this)[0] ) ){
				el = $(this);
			}
		});
		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			pressToScroll( el.prev() );
		}
		else if (e.keyCode == '40') {
			// down arrow
			pressToScroll( el.next() );
		}
	}

	setViewportHeight();

	// Mobile swipes on single note pages.
	/*
	if( $('.single').length ){
		var back_to_notes = $('#js-notes-link').attr('href');
		var to_next_note = $('.teaser-title:first-of-type').attr('href');

		$('body').on('swipe', function(){ console.log('event'); })

		$('body').on('swipeleft', function(event){
			window.location.href = back_to_notes;
		});
		$('body').on('swiperight', function(event){
			window.location.href = to_next_note;
		});
	}*/
});