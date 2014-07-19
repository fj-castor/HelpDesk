var args = arguments[0] || {};

var index = args.index;

$.start.addEventListener('click', function(){ 

	$.phoneBtn.animate({
		opacity: 100,
	});
	
	$.compBtn.animate({
		opacity: 100,
	});
	
	$.tvBtn.animate({
		opacity: 100,
	}, function(){
		// $.start.animate({
			// opacity: 0
		// });
		$.start.touchEnabled = false;
	});
	
	$.start.animate({
		opacity: 0,
	});

});


$.phoneBtn.addEventListener('click', function(){
	if(OS_IOS) {
		$.navwin.openWindow(index);
	}else{
		index.open();
	}
	Ti.API.info("fired");
	Ti.App.fireEvent('from', {title: 'Telus', img: 'prof2.jpg'});
	//index.open();
});

$.compBtn.addEventListener('click', function(){
	if(OS_IOS) {
		$.navwin.openWindow(index);
	}else{
		index.open();
	}
	Ti.App.fireEvent('from', {title: 'Dell', img: 'prof3.jpg'});
	//index.open();
});

$.tvBtn.addEventListener('click', function(){
	if(OS_IOS) {
		$.navwin.openWindow(index);
	}else{
		index.open();
	}
	Ti.App.fireEvent('from', {title: 'Rogers', img: 'prof4.jpg'});
	//index.open();
});
