YIUI.ButtonHandler = (function () {
    var Return = {
        doOnClick: function (formID, formula, key) {
            var form = YIUI.FormStack.getForm(formID);
            var cxt = new View.Context(form);
            var callback = form.getEvent(key);
            try {
            	if ( callback != null ) {
                	callback(key);
    			} else {
    	            if (formula) {
    	                form.eval(formula, cxt, null);
    	            }
    			}
			} catch (e) {
				YIUI.HeadInfoUtil.clear();
				$.error(e.message);
			}
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
