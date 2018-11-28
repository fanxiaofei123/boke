/**
 * 下推服务代理
 *  WebMapData 为 临时 后台服务， 之后会与MapData 合并。
 */
YIUI.DataMapService = (function () {
	var Return = {
		/**
		 * 中间层批量下推
		 */
	    batchMidMap: function(mapKey, oids) {
            var paras = {
                service: "MapData",
                cmd: "BatchMidMap",
                MapKey: mapKey,
                OIDListStr: $.toJSON(oids)
            };
            // return Svr.Request.getData(paras);
	        Svr.Request.getSyncData(null, paras);
	        return true;
	    },

	    mapData: function(mapKey, srcFormKey, tgtFormKey, srcDoc, tgtDoc){
	    	var paras = {
	    		service: "WebMapData",
	    		cmd: "Map",
	    		mapKey: mapKey,
                tgFormKey: tgtFormKey,
                srcFormKey: srcFormKey,
                srcDoc: $.toJSON(srcDoc),
                trgDoc: $.toJSON(tgtDoc)
            };

            return Svr.Request.getData(paras);
	    },

	    midMap: function(mapKey, oid){
	    	var paras = {
	    		service: "MapData",
	    		cmd: "MidMap",
	    		mapKey: mapKey,
                srcOID: oid
            };

            return Svr.Request.getData(paras);
	    },

	    autoMap: function(mapKey, srcDoc){
	    	var paras = {
	    		service: "MapData",
	    		cmd: "MidMap",
	    		mapKey: mapKey,
	    		srcOrignalDocument: $.toJSON(srcDoc),
                saveTarget: true
            };

            return Svr.Request.getData(paras);
	    }
	}
	return Return;
})();