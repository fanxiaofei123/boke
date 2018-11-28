YIUI.DictBehavior = (function () {
    var Return = {
    	isEqual: function(v1, v2) {
    		var equal = true;
    		if($.isArray(v1) && $.isArray(v2)) {
    			if(v1.length != v2.length) {
    				equal = false;
    			} else {
    				for (var i = 0, len1 = v1.length; i < len1; i++) {
    					for (var j = 0, len2 = v2.length; j < len2; j++) {
    						if(v1[i].oid != v2[i].oid) {
    							equal = false;
    							break;
    						}
    					}
    				}
    			}
    		} else if(v1 && v2) {
    			equal = v1.oid == v2.oid;
    		} else {
                if(v2 instanceof YIUI.ItemData && v2.oid == 0 && v1 == null){
                    equal = true;
                }else{
                    equal = v1 == v2; 
                }
    		}
    		return equal;
    	},
        
		checkAndSet: function(options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	if(newVal instanceof Decimal) {
        		newVal = newVal.toString();
        	}
        	var equal = this.isEqual(oldVal, newVal);
            if (equal) {
                return false;
            }

            if (newVal == null || newVal == '') {
            	if($.isFunction(callback)) {
                	callback(null);
                }
				return true;
			}

			var text = "", opts;
            if(options.dictCaption == null) {
                options.dictCaption = {};
            }
            if (options.allowMultiSelection) {
            	//多选字典的处理

                var vals = [];

                if(newVal instanceof YIUI.ItemData) {
                    vals.push(newVal);
                } else if ($.isArray(newVal)) {
                    vals = newVal;
                } else if ($.isNumeric(newVal)) {
                    var oid = YIUI.TypeConvertor.toLong(newVal);

                    var o = {
                                itemKey: options.itemKey,
                                oid: oid
                            };
                    vals.push( new YIUI.ItemData(o));
                } else if ($.isString(newVal)) {
					var oids = newVal.split(','), o;
                    for(var j=0;j<oids.length;j++){
                        o = oids[j].trim();
                        if($.isNumeric(o)){
                        	var oid = YIUI.TypeConvertor.toLong(o);
           
                            opts = {
        						oid : oid,
        						itemKey : options.itemKey
        					};

                            var val = new YIUI.ItemData(opts);
                            vals.push(val);
                        }
                    }
                
				} else {
                    console.error(YIUI.I18N.dict.unknown+newVal);
                }
                
                if(vals.length > 0){
                    newVal = vals; 
                }else{
                    newVal = null;
                }
                
			} else {
				if (oldVal && newVal) {
					if ((oldVal.itemKey + '_' + oldVal.oid) == (newVal.itemKey
							+ '_' + newVal.oid)) {
						return false;
					}
				}

				if ($.isNumeric(newVal)) {
					opts = {
						oid : newVal,
						itemKey : options.itemKey
					};
					newVal = new YIUI.ItemData(opts);
				} else if (YIUI.YesJSONUtil.isJsonObject(newVal)) {
					newVal = new YIUI.ItemData(JSON.parse(newVal));
				}
			}

            //类型转换完后再验证一次 新旧值是否一致，可能存在，传入的值为long 与itemData的oid一致
            var equal = this.isEqual(oldVal, newVal);
            if (equal) {
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
