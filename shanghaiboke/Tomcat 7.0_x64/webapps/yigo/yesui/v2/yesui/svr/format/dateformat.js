YIUI.DateFormat = (function () {
    var Return = {
    	//日期 formatStr、onlyDate
        format: function(date, meta){
            var text = "";
            if(date) {
            	var formatStr = "yyyy-MM-dd HH:mm:ss";
            	if (meta) {
            		 if (meta.formatStr) {
            			 formatStr = meta.formatStr;
            		 } 
            		 if(meta.onlyDate){
                         formatStr = formatStr.split(" ")[0];
                     }
            	}
                

                var df = function(d,f){
                    var o = {         
                        "M+" : d.getMonth()+1, //月份         
                        "d+" : d.getDate(), //日         
                        "h+" : d.getHours()%12 == 0 ? 12 : d.getHours()%12, //小时         
                        "H+" : d.getHours(), //小时         
                        "m+" : d.getMinutes(), //分         
                        "s+" : d.getSeconds(), //秒         
                        "q+" : Math.floor((d.getMonth()+3)/3), //季度         
                        "S" : d.getMilliseconds() //毫秒         
                    };
                                 
                    if(/(y+)/.test(f)){         
                        f = f.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length));         
                    }

                    for(var k in o){         
                        if(new RegExp("("+ k +")").test(f)){         
                            f = f.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
                        }         
                    }

                    return f;   
                }

                text = df(date, formatStr);
            }
            return text;
        }



    };
    return Return;
})();