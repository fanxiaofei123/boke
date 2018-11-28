var YIUI = YIUI || {};
YIUI.DictCacheProxy = (function () {
    var cache = new YIUI.DictCache();
    var reqMap = {};

    var Return = {
        getItem: function(itemKey, oid) {

            if(itemKey == null || itemKey.isEmpty()){
                console.error('error itemKey and oid:['+itemKey + "   "+oid+"]");
                return $.Deferred(function(def){
                            def.resolve(null);
                        });
            }
            
            oid = parseInt(oid);

            var key = itemKey + "_" + oid;

            if(!reqMap[key]){
                reqMap[key] = cache.get(key)
                                .then(function(data){
                                        if(data){
                                            return data;
                                        }else{
                                            //不存在；
                                            return YIUI.DictService.getItem(itemKey, oid).then(function(item){
                                 
                                                if(item){
                                                    cache.put(key, item);
                                                }else{
                                                    console.log('dict service not find ......'+itemKey + "  "+oid);    
                                                }

                                                return item;
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

        getCaption: function(itemKey, oid) {
            if(itemKey == null || itemKey.isEmpty()){
                console.error('error itemKey and oid:['+itemKey + "   "+oid+"]");
                return $.Deferred(function(def){
                            def.resolve('');
                        });
            }
            
            return this.getItem(itemKey, oid)
                        .then(function(item){
                            if(item == null){
                                return '';
                            }
                            return item.caption;
                        });
        },
        
        /*
         * 删除字典缓存
         */
        removeCache: function(itemKey, oid) {
            var key = itemKey + "_" + oid;
            cache.put(key, null);  
        }


	};
	return Return;
})();
