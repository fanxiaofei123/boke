/**
 * 当前为数值类型format，这个地方 不处理四舍五入
 */
YIUI.DecimalFormat = (function() {

    var def = {
        //组分割符
        aSep : ',',
        //组大小
        dGroup : '3',
        //小数点符号
        aDec : '.',
        //前缀或后缀符号
        aSign : '',
        //p是前缀 s是后缀
        pSign : '',
        //四舍五入方式
        mRound: YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP,
        //小数位数
        mDec : '2',
        //去尾零
        stripTrailingZeros : false
    };

	var Return = {
		checkEmpty: function(iv, settings, signOnEmpty) {
	        if (iv === '' || iv === settings.aNeg) {
	            // if(settings.vEmpty==='zero'){
	            // return iv +'0';
	            // }
	            // if(settings.vEmpty === 'sign' || signOnEmpty){
	            // return iv + settings.aSign;
	            //      }
	            return iv;
	        }
	        return null;
	    },

		format: function(value, settings){
			settings = $.extend(def, settings);
			value = YIUI.TypeConvertor.toString(value);
	        var empty = this.checkEmpty(value, settings, true);
	
	        if (empty !== null) {
	            return empty;
	        }

	        var ivSplit = value.split(settings.aDec);
	
	        var s = ivSplit[0];
	
	        if (settings.aSep && settings.useSeparator) {
                var digitalGroup = '';
                if (settings.dGroup === 2) {
                    digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
                } else if (settings.dGroup === 4) {
                    digitalGroup = /(\d)((\d{4}?)+)$/;
                } else {
                    digitalGroup = /(\d)((\d{3}?)+)$/;
                }
	            while (digitalGroup.test(s)) {
	                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
	            }
	        }
	
	        if (settings.mDec !== 0) {
	        	var dec = "000000000";
	        	//若value为整数，需要显示为小数格式
	        	if(ivSplit.length == 1) {
	        		ivSplit[1] = "000000000";
	        	}
	            if (ivSplit[1].length > settings.mDec) {
	                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
	            } else {
	            	ivSplit[1] = ivSplit[1] + dec.substring(ivSplit[1].length, settings.mDec);
	            }
	            
	            if (settings.stripTrailingZeros) {
	            	while (ivSplit[1].charAt(ivSplit[1].length - 1) == '0') {
						ivSplit[1] = ivSplit[1].substring(0, ivSplit[1].length - 1);
		            }
	            }

				if (ivSplit[1].length > 0) {
					value = s + settings.aDec + ivSplit[1];
				} else {
					value = s;
				}	            
	        } else {
	            value = s;
	        }	
	        
	        
	        if (settings.aSign) {
	            value = settings.pSign === 'p' ? settings.aSign + value : value
	                + settings.aSign;
	        }
	
	        return value;
	    }
    };
    return Return;
})();
