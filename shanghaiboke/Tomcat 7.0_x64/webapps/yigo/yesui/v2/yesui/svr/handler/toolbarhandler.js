YIUI.ToolBarHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (formID, item) {
        	var id = formID;
            if(item.formID) {
            	id = item.formID;
            }
            var form = YIUI.FormStack.getForm(id);
            var cxt = {form: form, optKey: item.key, tag: item.tag};
            var excpAction = item.excpAction;
           try {
            	var action = item.action;
                var preAction = item.preAction;
    			if (preAction) {
    				form.eval(preAction, cxt, null);
    			}
                if (action) {
                    form.eval(action, cxt, null);
                }

                var _form = YIUI.FormStack.getForm(formID);
                if (_form && _form.getUIProcess())
                	_form.getUIProcess().addOperation();
			} catch (e) {
				if(excpAction) {
					try {
						form.eval(excpAction, cxt);
					} catch (t) {
					}
				}
				YIUI.HeadInfoUtil.clear();
				$.error(e.message);
			}
            
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
