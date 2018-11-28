YIUI.UTCDatePickerBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if(oldVal instanceof Date && $.isNumeric(newVal)){
                oldVal = oldVal.getTime();
            }
            newVal = YIUI.UTCDateFormat.format(newVal, options);
            if (oldVal == newVal) {
                return false;
            }

            if($.isFunction(callback)) {
            	callback(newVal);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
