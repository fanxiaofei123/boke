YIUI.PositionUtil = (function (options) {
    var Return = {
    		
    	settings: {
    		resetWidth: true
    	},
    	
		// setViewPos: function($dom, $view, resetWidth) {
		// 	this.setViewTop($dom, $view);
		// 	this.setViewLeft($dom, $view, resetWidth);
		// },

		setViewPos: function($dom, $view, resetWidth) {
			var cityOffset = $dom.offset();

	        var top = "auto", bottom = "auto",
	        	left = "auto", right = "auto";
	
	        var w = $(window).width();
	        var h = $(window).height();
	        var dom_h = $dom.outerHeight();
	        if (h - cityOffset.top - dom_h < $view.outerHeight()) {
	            $view.addClass("toplst");
	            bottom = h - cityOffset.top;
	        } else {
	            $view.removeClass("toplst");
	         	top = cityOffset.top + dom_h;
	        }

	        var d_w = $dom.outerWidth();
	        if(resetWidth) {
            	$view[0].style.cssText += "; width: " + d_w + "px;";

	        }
	        if (w - cityOffset.left < $view.outerWidth()) {
	          //  right = w - cityOffset.left - d_w;
				left = w - $view.outerWidth();
	        } else {
	            left = cityOffset.left;
	        }

            var style = "left: " + left +"px; right: " +  right + "px; bottom: " + bottom + "px; top: " + top + "px;";
            $view[0].style.cssText += "; " + style;

		},

	    setViewTop: function ($dom, $view) {
	        var cityOffset = $dom.offset();

	        var top = "auto", bottom = "auto";
	
	        if ($(window).height() - cityOffset.top - $dom.height() < $view.outerHeight()) {
	            $view.addClass("toplst");
	            bottom = $(window).height() - $($dom).offset().top;
	        } else {
	            $view.removeClass("toplst");
	         	top = cityOffset.top + $dom.outerHeight();
	        }
            $view.css({
            	"top": top + "px",
            	"bottom": bottom + "px"
            });
	    },
	
	    setViewLeft: function ($dom, $view, resetWidth) {
	        var cityOffset = $dom.offset();
	
	        var left = "auto", right = "auto";

	        var w = $(window).width();
	        var d_w = $dom.outerWidth();
	        if (w - $($dom).offset().left < $view.outerWidth()) {
	           // right = w - cityOffset.left - d_w;
                left = w - $view.outerWidth();
	        } else {
	            left = cityOffset.left;
	        }
            $view.css({
            	"left": left + "px",
            	"right": right + "px"
            });
	    }

    };
    return Return;
})();