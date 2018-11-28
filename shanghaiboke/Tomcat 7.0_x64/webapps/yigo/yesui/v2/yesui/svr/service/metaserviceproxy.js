YIUI.MetaService = (function () {

	var cache = new YIUI.MetaCache();
	var dataObjCache = new YIUI.DataObjCache();
    var reqMap = {};

	var Return = {
		/**
		 * 获取web配置对象
		 */
	    getMetaForm: function(formKey, templateKey) {
			// var params = {
			// 	cmd: "GetForm",
			// 	service: "WebMetaService",
			//     formKey: formKey
			// };
			// return Svr.Request.getData(params);

	        var key = "getMetaForm_"+formKey+"_"+templateKey;

	       	if(!reqMap[key]){
                reqMap[key] = cache.get(key)
	                                .then(function(metaForm){
	                                        if(metaForm){
	                                            return metaForm;
	                                        }else{
						             	        var params = {
										    		cmd: "GetForm",
										    		service: "WebMetaService",
										            formKey: formKey,
										            templateKey: templateKey
										        };

	                                            return Svr.Request.getData(params).then(function(data){
	                                                cache.put(key, data);
	                                                return data;
	                                            },function(err){
	                                            	console.log('error ......'+err);
	                                            	setTimeout(function(){
				                                        delete reqMap[key];
				                                    },100);
	                                            }); 
	                                        }
	                                },function(error){
	                                    console.log('error ......'+error);
	                                }).always(function(){
	                                    setTimeout(function(){
	                                        delete reqMap[key];
	                                    },100);
	                                });
            }

            return reqMap[key];  


	    },

	    /**
		 * 根据EntryPath获取web配置对象
		 */
	    getMetaFormByEntry: function(entryPath) {
			var params = {
				cmd: "GetFormByEntry",
				service: "WebMetaService",
			    path: entryPath
			};
			return Svr.Request.getData(params);

			// var key = "getMetaFormByEntry_"+entryPath;
			
			// if(!reqMap[key]){
			//     reqMap[key] = cache.get(key)
			//                         .then(function(metaForm){
			//                                 if(metaForm){
			//                                     return metaForm;
			//                                 }else{
			// 									var params = {
			// 										cmd: "GetFormByEntry",
			// 										service: "WebMetaService",
			// 									    path: entryPath
			// 									};

			//                                     return Svr.Request.getData(params).then(function(data){
			//                                         cache.put(key, data);
			//                                         return data;
			//                                     }); 
			//                                 }
			//                         },function(error){
			//                             console.log('error ......'+error);
			//                         }).always(function(){
			//                             setTimeout(function(){
			//                                 delete reqMap[key];
			//                             },100);
			//                         });
			// }

			// return reqMap[key];  

	    },

	    /**
		 * 获取预加载表单列表
		 */
	    getPreLoadItems: function() {
	        var params = {
	    		service: "GetPreLoadForm"
	        };
	        return Svr.Request.getData(params);
	    },

	   	/**
		 * 获取菜单
		 */
	    getEntry: function(rootEntry, appKey) {
	        var params = {
	    		cmd: "GetEntry",
	    		service: "WebMetaService",
	    		rootEntry: rootEntry,
	    		appKey: appKey
	        };
	        return Svr.Request.getData(params);
	    },

	   	/**
		 * 获取ParaGroup
		 */ 
	    getParaGroup: function(groupKey, formKey){
	        var paras = {
	                service: "WebMetaService",
	                cmd: "GetParaGroup",
	                formKey: formKey,
	                groupKey: groupKey
	            };
	        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
	    },

	    /**
		 * 获取web配置对象
		 */
	    getDataObject: function(dataObjectKey) {
	        var key = "getDataObject_"+dataObjectKey;

	       	if(!reqMap[key]){
                reqMap[key] = dataObjCache.get(key)
	                                .then(function(dataObj){
	                                        if(dataObj){
	                                            return dataObj;
	                                        }else{
										        var paras = {
									                service: "WebMetaService",
									                cmd: "GetDataObject",
									                key: dataObjectKey
									            };

	                                            return Svr.Request.getData(paras).then(function(data){
	                                                dataObjCache.put(key, data);
	                                                return data;
	                                            }); 
	                                        }
	                                },function(error){
	                                    console.log('error ......'+error);
	                                }).always(function(){
	                                    setTimeout(function(){
	                                        delete reqMap[key];
	                                    },100);
	                                });
            }
            return reqMap[key];  
	    },

	    getClientAppStatusInfo: function(){
	    	var params = {
	    		cmd: "GetClientAppStatusInfo",
	    		service: "WebMetaService"
	        };
	        return Svr.Request.getData(params);
	    },

//	    getServerList: function(){
//	    	var params = {
//	    		service: "GetServerList"
//	        };
//	        return Svr.Request.getData(params);
//	    },
	    
	    getAppList: function(){
	    	var params = {
	    		service: "GetAppList"
	        };
	        return Svr.Request.getData(params);
	    },
	    
	    getAliasKey: function(platform, formkey) {
	    	var params = {
	    		cmd:"GetAliasKey",
	    		service:"WebMetaService",
	    		PlatForm:platform,
	    		FormKey:formkey
	    	}
	    	return Svr.Request.getData(params);
	    },

	    getBPMProcess: function(formKey){
    	    var paras = {
                service: "WebMetaService",
                cmd: "GetBPMProcess",
                formKey: formKey
            };
	        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
	    }
	}
	return Return;
})(); 