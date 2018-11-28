(function () {

    var DB_NAME = "YigoCache",
        DICT_TABLE_NAME = 'DictCache',
        META_TABLE_NAME = 'MetaCache',
        DOC_TABLE_NAME = 'DocCache',
        DATAOBJ_TABLE_NAME = 'DataObjCache',
        RIGHTS_TABLE_NAME = 'RightsCache';

    var tables = [DICT_TABLE_NAME, META_TABLE_NAME, DOC_TABLE_NAME, DATAOBJ_TABLE_NAME, RIGHTS_TABLE_NAME];
    var _indexedDB = null;

    var supportIndexedDB = "indexedDB" in window;
    //var supportIndexedDB = false;
    if(supportIndexedDB){
        console.log('support index db');

        var upgrade = function (evt) {

            for(var i = 0, len = tables.length; i < len; i++){
                if(evt.currentTarget.result.objectStoreNames.contains(tables[i])){
                    evt.currentTarget.result.deleteObjectStore(tables[i]);
                }

                var store = evt.currentTarget.result.createObjectStore(
                    tables[i],{keyPath: 'key'});

                store.createIndex('index_keypath', 'key', { unique: true });

            }

            console.debug("initDb.onupgradeneeded");
        };

        _indexedDB = new IndexedDBProxy(DB_NAME);
        _indexedDB.open(upgrade, 5).then(function(d){
            for(var i = 0, len = tables.length; i < len; i++){
                if(_indexedDB.exists(tables[i])){
                    _indexedDB.clear(tables[i]);
                } 
            }

            indexedDB.deleteDatabase('YigoDictDB');
        },function(e){
            console.debug("open error");
            indexedDB.deleteDatabase(DB_NAME);
            _indexedDB.open(upgrade, 5).then(function(d){
                for(var i = 0, len = tables.length; i < len; i++){
                    if(_indexedDB.exists(tables[i])){
                        _indexedDB.clear(tables[i]);
                    }
                }

                indexedDB.deleteDatabase('YigoDictDB');
            },function(e){
                console.debug("open error");
            });
        });
    }

    var IndexedDBCache = function(){

        function _indexedDBCache(tableName){
            this.tableName = tableName;
        };

        _indexedDBCache.prototype.get = function(key){
            return _indexedDB.get(this.tableName, key).then(function(data){
                        if(data){
                            // console.log('cache...............');
                            return data.value;
                        }else{
                            // console.log('cache...............not find'+oid);
                            return null;
                        }
                    });
        };

        _indexedDBCache.prototype.put = function(key, value){
            var o = {};
            o.key = key;
            o.value = value;
            _indexedDB.put(this.tableName, o);
        };

        return _indexedDBCache;
    }();

    var TempCache = function(){

        function _tempCache(size){
            this.cache = new LRUCache(size);
        };

        _tempCache.prototype.get = function(key){
            var self = this;
            return $.Deferred(function(def){
                        def.resolve(self.cache.get(key));
                    }).promise();
        };

        _tempCache.prototype.put = function(key, value){
            this.cache.set(key, value);
        };

        return _tempCache;
    }();



    // var DictLRUCache = function(){

    //     var cache = new LRUCache(200);

    //     function _dictLRUCache(){
    //     };

    //     _dictLRUCache.prototype.getItem = function(itemKey, oid){
    //         return $.Deferred(function(def){
    //                     var key = itemKey + "_"+oid;
    //                     def.resolve(cache.get(key));
    //                 }).promise();
    //     };

    //     _dictLRUCache.prototype.addItem = function(itemKey, oid, item){
    //         var key = itemKey + "_"+oid;
            
    //         cache.set(key, item);
    //         console.log('lrucache add item ......'+itemKey + "  "+oid);    
    //     };

    //     return _dictLRUCache;
    // }();


    // var cache = null;

    // if("indexedDB" in window){
    //     console.log('support index db');
    //     cache = new DictIndexedDB2();
    // }else{
    //     console.log('not support index db');
    //     cache = new DictLRUCache();
    // }

    // YIUI.DataCache = function(){
    //      function _cache(tableName, size){
    //         this.tableName = tableName || 'OtherCache';
    //         this.size = size || 10;

    //         if("indexedDB" in window){
    //             this.cache = new IndexedDBCache(this.tableName);
    //         }else{
    //             this.cache = new TempCache(this.size);
    //         }
    //     }

    //     _cache.get = function(key){
    //         return cache.get(key);
    //     };

    //     _cache.put = function(key, doc){
    //         return cache.put(key, doc);
    //     };

    //     return _cache;
    // }();


    YIUI.DictCache = function(){
        var cache = null;

        if(_indexedDB && _indexedDB.isOpen()){
            cache = new IndexedDBCache(DICT_TABLE_NAME);
        }else{
            cache = new TempCache(200);
        }

        var ret = {
            get : function(key){
                return cache.get(key);
            },
            put : function(key, item){
                return cache.put(key, item);
            }
        }

        return ret;
    };

    YIUI.RightsCache = function(){
        var cache = null;

        if(_indexedDB && _indexedDB.isOpen()){
            cache = new IndexedDBCache(RIGHTS_TABLE_NAME);
        }else{
            cache = new TempCache(10);
        }

        var ret = {
            get : function(key){
                return cache.get(key);
            },
            put : function(key, doc){
                return cache.put(key, doc);
            }
        }

        return ret;
    };

    YIUI.MetaCache = function(){
        var cache = null;

        if(_indexedDB && _indexedDB.isOpen()){
            cache = new IndexedDBCache(META_TABLE_NAME);
        }else{
            cache = new TempCache(10);
        }

        var ret = {
            get : function(key){
                return cache.get(key);
            },
            put : function(key, doc){
                return cache.put(key, doc);
            }
        }

        return ret;    
    };

    YIUI.DocCache = function(){
        var cache = null;

        if(_indexedDB && _indexedDB.isOpen()){
            cache = new IndexedDBCache(DOC_TABLE_NAME);
        }else{
            cache = new TempCache(30);
        }

        var ret = {
            get : function(key){
                return cache.get(key);
            },
            put : function(key, doc){
                return cache.put(key, doc);
            }
        }

        return ret;
    };


    YIUI.DataObjCache = function(){
        var cache = null;

        if(_indexedDB && _indexedDB.isOpen()){
            cache = new IndexedDBCache(DATAOBJ_TABLE_NAME);
        }else{
            cache = new TempCache(30);
        }

        var ret = {
            get : function(key){
                return cache.get(key);
            },
            put : function(key, doc){
                return cache.put(key, doc);
            }
        }

        return ret;
    };
})();
