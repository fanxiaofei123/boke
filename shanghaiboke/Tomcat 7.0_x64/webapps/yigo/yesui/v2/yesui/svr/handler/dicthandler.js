YIUI.DictHandler = (function () {

    var Return = {
        doLostFocus: function (extParas) {

        },

        getMetaFilter: function(form, fieldKey, itemFilters, itemKey, cxt) {
            var filter = null;
            if (itemFilters) {
                var itemFilter = itemFilters[itemKey];
                if (itemFilter != null && itemFilter != undefined && itemFilter.length > 0) {
                    for (var i = 0, len = itemFilter.length; i < len; i++) {
                        var cond = itemFilter[i].cond;
                        if (cond && cond.length > 0) {
                            if(!cxt) {
                                cxt = new View.Context(form);
                            }
                            var ret = form.eval(cond, cxt, null);
                            if (ret == true) {
                                filter = itemFilter[i];
                                break;
                            }
                        } else {
                            filter = itemFilter[i];
                            break;
                        }
                    }
                }
            }
            return filter;
        },

        getColumnDictFilter:function (form, sourceKey, fieldKey, metaFilter, itemKey, cxt) {
            if ( metaFilter ) {
                var filterVal, paras = [];
                if (metaFilter.filterValues !== null && metaFilter.filterValues !== undefined && metaFilter.filterValues.length > 0) {
                    for (var j = 0, len = metaFilter.filterValues.length; j < len; j++) {
                        filterVal = metaFilter.filterValues[j];
                        switch (filterVal.type) {
                        case YIUI.FILTERVALUETYPE.CONST:
                            //paras += content;
                            paras.push(filterVal.refValue);
                            break;
                        case YIUI.FILTERVALUETYPE.FORMULA:
                        case YIUI.FILTERVALUETYPE.FIELD:
                            //paras += form.eval(content, cxt, null);
                            if(!cxt) {
                                cxt = new View.Context(form);
                            }
                            paras.push(form.eval(filterVal.refValue, cxt, null));
                            break;
                        }
                    }
                }
                var dictFilter = {};
                dictFilter.itemKey = itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.sourceKey = sourceKey;
                dictFilter.fieldKey = fieldKey;
                dictFilter.values = paras;
                return dictFilter;
            }
            return null;
        },

        getDictFilter: function (form, fieldKey, itemFilters, itemKey, cxt) {
            var filter = Return.getMetaFilter(form, fieldKey, itemFilters, itemKey);
            if (filter) {
                var filterVal, paras = [];
                if (filter.filterVals !== null && filter.filterVals !== undefined && filter.filterVals.length > 0) {
                    for (var j = 0, len = filter.filterVals.length; j < len; j++) {
                        filterVal = filter.filterVals[j];
                        switch (filterVal.type) {
                        case YIUI.FILTERVALUETYPE.CONST:
                            //paras += content;
                            paras.push(filterVal.refVal);
                            break;
                        case YIUI.FILTERVALUETYPE.FORMULA:
                        case YIUI.FILTERVALUETYPE.FIELD:
                            //paras += form.eval(content, cxt, null);
                            if(!cxt) {
                                cxt = new View.Context(form);
                            }
                            paras.push(form.eval(filterVal.refVal, cxt, null));
                            break;
                        }
                    }
                }
                var dictFilter = {};
                dictFilter.itemKey = itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.sourceKey = fieldKey;
                dictFilter.fieldKey = fieldKey;
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
                return dictFilter;
            }
            return null;
        },

        getItemKey: function(form, refKey, rowIndex){
            var cxt = new View.Context(form);
            if( rowIndex != null ) {
                cxt.rowIndex = rowIndex;
            }
            var itemKey = form.eval(refKey, cxt, null);
            return itemKey;
        },

        getRoot: function(form, itemKey, rootKey, cxt){

            var rootItem = {};

            if (rootKey && rootKey.length >= 0) {
                if( !cxt ) {
                    cxt = new View.Context(form);
                }

                rootItem = form.getValue(rootKey);

                if (rootItem == null) {
                    rootItem = {};
                    rootItem.oid = 0;
                    rootItem.itemKey = itemKey;
                }
            } else {
                rootItem.oid = 0;
                rootItem.itemKey = itemKey;
            }

            return new YIUI.ItemData(rootItem);
        },

        createRoot: function(form, itemKey, rootKey, cxt){
            var rootItem = Return.getRoot(form, itemKey, rootKey, cxt);

            return YIUI.MetaService.getDataObject(itemKey)
                                .then(function(dataObj){
                                    var ret = {};
                                    ret.root = rootItem;
                                    ret.secondaryType = dataObj.secondaryType;

                                    if(rootItem.getOID() == 0){
                                        ret.rootCaption = dataObj.caption;
                                    }else if(rootItem.hasCaption()){
                                       ret.rootCaption = rootItem.getCaption(); 
                                    }else{
                                        return YIUI.DictCacheProxy.getCaption(itemKey, rootItem.oid).then(function(caption){
                                            rootItem.caption = caption;
                                            ret.root = rootItem;
                                            ret.rootCaption = caption;
                                            return ret;
                                        });
                                    }
                                
                                    return ret;
                                });
        },

        getShowCaption: function(val, multiSelect, independent){
            var def = $.Deferred();

            var itemKey = null;
            if(val != null) {
                var oids, needCaption = false;
                if(multiSelect) {

                    oids = [];
                    var text = '';

                    for (var i = 0, len = val.length; i < len; i++) {
                        var v = val[i];

                        if(v.oid != 0){
                            oids.push(v.oid);
                            if(v.hasCaption()){
                                text = text + ','+v.getCaption();
                            }else{
                                needCaption = true;
                                itemKey = v.getItemKey();
                            }
                        } else {
                        	if (!independent) {
                        		text = text + ',' + YIUI.I18N.rightsset.selectAll;
                        	}
                        }
                    }


                    if(!needCaption){
                        if(text.length > 0){
                            text = text.substring(1);
                        }
                        def.resolve(text);
                        //this.setText(text);
                    }

                } else if(val.oid == 0){
                    def.resolve('');
                    //this.setText('');
                } else if(val instanceof YIUI.ItemData) {
                    //如果值中已含caption 则直接赋值
                    if(val.hasCaption()){
                        def.resolve(val.getCaption());
                        //this.setText(value.getCaption());
                    }else{
                        oids = val.oid;
                        itemKey = val.getItemKey();
                        needCaption = true;
                    }
                } else {
                    def.resolve('');
                }

                if(needCaption){
                       if(multiSelect) {
                            //TODO 之后做优化 不要循环调用多次
                            var args = [];
                            for(var i = 0 ; i < oids.length ; i++){
                                args.push(YIUI.DictCacheProxy.getCaption(itemKey, oids[i]));
                            }
                            def = $.when.apply($.when,args).then(function(){
                                var c = '';
                                for(var i = 0; i< arguments.length; i ++){
                                    c = c + ','+arguments[i];
                                }

                                if(c.length > 0){
                                    c = c.substring(1);
                                }

                                return c;

                            });
                       }else{
                            def = YIUI.DictCacheProxy.getCaption(itemKey, oids);
                       }
                }

            }else{
                def.resolve('');
            }

            return def.promise();
        },

        doSuggest: function (form, meta, text, dictFilter, root) {
            if (meta.multiSelect) {
                return;
            }
            var def = $.Deferred();
            
            YIUI.DictService.getSuggestData(meta.itemKey, text, meta.stateMask, dictFilter, root).then(function(viewItems) {
                def.resolve(viewItems);
            });

            return def.promise();
        }

    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();