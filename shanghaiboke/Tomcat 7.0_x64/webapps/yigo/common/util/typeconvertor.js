var YIUI = YIUI || {};
YIUI.TypeConvertor = (function () {
	var Return = {
		toString: function (v) {
            return v != null ? v.toString() : "";
        },
        toInt: function(v) {
        	var r;
        	if(v == null || v == "") {
        		r = 0;
        	} else if($.isNumeric(v)) {
        		r = parseInt(v);
        	} else if(typeof v == "boolean") {
        		r = v ? 1 : 0;;
        	} else if(v instanceof Decimal) {
            	//decimal >9 则不作处理
        		if(v.toString().length > 9) {
        			r = v;
        		} else {
        			r = parseInt(v.toString());
        		}
        	} else if(typeof v == "string") {
        		if(v.toLowerCase() == "true") {
        			r = 1;
        		}
        	}
        	return r;
        },
        toLong: function(v) {
        	var l = this.toInt(v);
        	return l;
        },
        toDecimal: function(v) {
        	var r;
        	if(v == null || v == "") {
        		r = new Decimal(0);
        	} else if($.isNumeric(v)) {
        		r = new Decimal(v);
        	} else if(typeof v == "boolean") {
        		v = v ? 1 : 0;;
        		r = new Decimal(v);
        	} else if(v instanceof Decimal) {
            	r = v;
        	} else if (typeof v == "string") {
				r = v == "" ? new Decimal(0) : new Decimal(v);
			}
        	return r;
        },
        toBoolean: function (v) {
            var bl = false;
            if (v != null) {
                if (typeof(v) == "boolean") {
                    bl = v;
                } else if (typeof(v) == "string") {
                    if (v.toLowerCase() == "true") {
                        bl = true;
                    } else if (v.toLowerCase() == "false" || v == "0") {
                        bl = false;
                    } else {
                        bl = v.length != 0;
                    }
                } else if (v instanceof Decimal) {
                    bl = Boolean(v.toNumber());
                } else {
                    bl = Boolean(v);
                }
            }
            return bl;
        },
        toDate: function(v) {
        	var d = null;
    		if (v != null) {
    			if (v instanceof Date) {
    				d = v;
    			} else if($.isNumeric(v)) {
    				d = new Date(parseInt(value));
    			} else if (typeof v == "string") {
					v = v.replace(/-/g, "/");
					d = new Date(v);
    			}
    		}
    		return d;
        },
        toDataType: function(dataType, val){
            switch(dataType){
                case YIUI.DataType.INT:
                    return this.toInt(val);
                case YIUI.DataType.LONG:
                    return this.toLong(val);
                case YIUI.DataType.STRING:
                    return this.toString(val);
                case YIUI.DataType.DATE:
                case YIUI.DataType.DATETIME:
                    return this.toDate(val);
                case YIUI.DataType.NUMERIC:
                    return this.toDecimal(val);
                case YIUI.DataType.BOOLEAN:
                    return this.toBoolean(val);
            }
            return val;
        }
	};
	return Return;
})();