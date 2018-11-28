YIUI.LoadingUtil = (function() {
    var html = "<div class='loading mask'></div>" + 
                "<div class='loading image'>" + 
                    "<img alt='loading' src='yesui/v2/yesui/ui/res/css/default/images/loading.gif'>" +
                "</div>";
    var el = $(html);
    $(document.body).append(html);
	
	var mask = $(".loading.mask");
	var img = $(".loading.image");
	var isShow = false;
	var rt = {
			setZIndex: function(index) {
//				 var index = $.getZindex(ct) + 1;
				 mask.css("z-index", index);
				 img.css("z-index", index);
			},
			show: function() {
				isShow = true;
	        	mask.show();
//				setTimeout(function() {
					if(isShow && img.is(":hidden")) {
						img.css({
		                    top: $(window).height() / 2,
		                    left: $(window).width() / 2
		                });
			        	mask.show();
			        	img.show();
					}
//				}, 300);
		        
			},
			hide: function() {
				isShow = false;
				if(img.is(":hidden")) {
					mask.hide();
				}
				setTimeout(function() {
					if(!isShow) {
						mask.hide();
						img.hide();
					}
				}, 300);
			}
	};
	return rt;
})();