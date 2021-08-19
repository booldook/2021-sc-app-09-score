/*************** global init **************/


/************** user function *************/


/************** event callback ************/
function onResize() {
	var minHeight = $(this).outerHeight() - $('.header-wrapper').outerHeight(true) - $('.footer-wrapper').outerHeight() - $('.recent-wrapper').outerHeight(true) - 24;
	$('.list-wrapper').css('min-height', minHeight+'px');
}

/*************** event init ***************/
$(window).resize(onResize).trigger('resize');

/*************** start init ***************/

