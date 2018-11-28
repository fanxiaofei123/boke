var Svr = Svr || {};
Svr.Request = (function () {
	var transData = function(data){
		if(data == null){
			return data;
		}
	       
        data.mode = 1;
		data.isYES2 = true;


		var json = $.toJSON(data);
		
		//传送数据 长度 大于 20000 开启压缩   20000长度的数据传输在30K 左右
		if(json.length < 20000){
			return data;
		}
	    var postData = {};
        postData.yigoData = YIUI.Base64.encode64(pako.gzip(json));
        return postData;
	};

    var convertResult = function(msg){
        var ret = msg.data;
        if(msg.type === YIUI.JavaDataType.STR_USER_DATATABLE){
            ret = YIUI.DataUtil.fromJSONDataTable(ret);
        }else if(msg.type === YIUI.JavaDataType.STR_USER_DOCUMENT){
            ret = YIUI.DataUtil.fromJSONDoc(ret);
        }
        return ret;
    }

    var Return = {
        getData: function(params, url, notConvert){
            //TODO local　timezone 放至登录，存放session中 
            // var locale = window.navigator.language || window.navigator.browserLanguage;
            // var tz = jstz.determine();
            // var timezone = tz.name();
            // params.locale = locale;
            // params.timezone = timezone;
        	if (!YIUI.HeadInfos.empty()) {
        		params.headinfos = YIUI.HeadInfos.toJSON();
        	}
			if(!url){
				url = Svr.SvrMgr.ServletURL;
			}

            var timeout = 0;
            if(window.timeout > 0) {
                timeout = window.timeout;
            }

            var req = $.ajax({
                            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                            type: "post",
                            url: url,
                            data: transData(params),
                            async: true,
                            dataType: 'json',
                            timeout: timeout
                        }).then(function(data){
                                if(notConvert){
                                    return data.data;
                                }

								var ret = convertResult(data);
                                    //defer.resolve(ret);
								return ret;
							},function(err){
                                if(YIUI.LoadingUtil){
                                    YIUI.LoadingUtil.hide();  
                                }
			
                                setTimeout(function(){
                                    if(err.readyState == 0) {
                                        $.error(YIUI.I18N.request.check);
                                    }else{
                                        $.error(err.responseJSON.error.error_info);
    //                                  return err.responseJSON;        
                                    }
                                },10);
                                return err;
							});
								
							
							
							//.then(function(data){
                             //       var ret = convertResult(data);
                                    //defer.resolve(ret);
                              //      return ret;
                               // },
                                //function(xhr){
                                 //   if(xhr.readyState == 0) {
                                  //      $.error("请求状态未初始化，检查服务器连接！");
                                   // }else{
                                   //    return xhr.responseJSON;        
                                    //}
                             //   }
                       // );
            return req;
        },

        getSyncData: function (url, params, sucCallback, errorCallback) {
            params.mode = 1;

            if(!url){
                url = Svr.SvrMgr.ServletURL;
            }

            if (!YIUI.HeadInfos.empty()) {
        		params.headinfos = YIUI.HeadInfos.toJSON();
        	}
            var returnObj = null;
        
            var tz = jstz.determine();
            var timezone = tz.name();
            //var locale = window.navigator.language || window.navigator.browserLanguage;
            //params.locale = locale;
            params.timezone = timezone;
            var timeout = 0;
            if(window.timeout > 0) {
            	timeout = window.timeout;
            }
            
            //var syncData;
            $.ajax({
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                type: "post",
                url: url,
                data: transData(params),
                async: false,
                dataType: 'json',
                timeout: timeout,
                success: function (msg) {
                    returnObj = convertResult(msg);
                    if ($.isFunction(sucCallback)) {
                        returnObj = sucCallback(returnObj);
                    } 
                },
                complete: function (xhr, ts) {
                    xhr = null;
                },
                error: function (xhr, textStatus, exception) {
                	if(xhr.readyState == 0) {
                		$.error(YIUI.I18N.request.check);
                		return;
                	}
                    if ($.isFunction(errorCallback)) {
                        //重载错误提示方法
                    } else {
                        var error = xhr.responseJSON.error;
                        var showMessage = error.error_info;
                        $.error(showMessage);
                        return;
                    }
                }
            });
            return returnObj;
        },

        getAsyncData: function (url, params, sucCallback, errorCallback) {
            params.mode = 1;
            if (!YIUI.HeadInfos.empty()) {
        		params.headinfos = YIUI.HeadInfos.toJSON();
        	}
            var returnObj = null;
            var tz = jstz.determine();
            var timezone = tz.name();
            //var locale = window.navigator.language || window.navigator.browserLanguage;
            //params.locale = locale;
            params.timezone = timezone;
            var timeout = 0;
            if(window.timeout > 0) {
            	timeout = window.timeout;
            }
       
            $.ajax({
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                type: "post",
                url: url,
                data: transData(params),
                async: true,
                dataType: 'json',
                timeout: timeout,
                beforeSend: function () {
                	YIUI.LoadingUtil.show();
                },
                success: function (msg) {
                    returnObj = convertResult(msg);
                    if ($.isFunction(sucCallback)) {
                        returnObj = sucCallback(returnObj);
                    } 
                },
                complete: function (xhr) {
                    xhr = null;
                    YIUI.LoadingUtil.hide();
                },
                error: function (xhr, textStatus, exception) {
                	YIUI.LoadingUtil.hide();
                	if(xhr.readyState == 0) {
                		$.error(YIUI.I18N.request.check);
                		return;
                	}
                    if ($.isFunction(errorCallback)) {
                        //重载错误提示方法
                    } else {
                        var error = xhr.responseJSON.error;
                        var showMessage = error.error_info;
                        $.error(showMessage);
                        return;
                    }
                }
            });
            return returnObj;
        }
    };
    return Return;
})();