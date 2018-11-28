YIUI.ViewUtil = (function () {

    /**
     * 组件或者单元格是否数据源定义了访问控制
     */
    var accessControl = function (form, com) {
        if( !com.tableKey || !com.columnKey )
            return false;
        var doc = form.getDocument();
        if( doc ) {
            var table = doc.getByKey(com.tableKey);
            return table ? table.getColByKey(com.columnKey).getAccessControl() : false;
        }
        return false;
    }

    var Return = {
        findShadowBkmk: function(doc, tableKey){
            var sdt = doc.getShadow(tableKey);
            if(sdt == null){
                return -1;
            }

            var bookmark = -1;
            var dt = doc.getByKey(tableKey);
            var colIndex = sdt.indexByKey(YIUI.SystemField.OID_SYS_KEY);

            if(colIndex >= 0){
                var oid = dt.get(colIndex);

                if(sdt.first()){
                    while(!sdt.isAfterLast()){
                        if(oid == sdt.get(colIndex)){
                            bookmark = sdt.getBkmk();
                            break;
                        }
                        sdt.next();
                    }
                }
            }else{
                var multiKey = [];
                for(var i = 0, len = sdt.cols.length; i < len ; i ++){
                    if(sdt.cols[i].isPrimary){
                        multiKey.push(i);
                    }
                } 

                if(multiKey.length == 0){
                    YIUI.ViewException.throwException(YIUI.ViewException.PRIMARYKEYS_UNDEFINED);
                }

                if(sdt.first()){
                    while(!sdt.isAfterLast()){
                        for(var index in multiKey){
                            if(sdt.get(index) != dt.get(index)){
                                bookmark = -1;
                                break;
                            }
                            bookmark = sdt.getBkmk();
                        }

                        if(bookmark > -1){
                            break;
                        }
                        sdt.next();
                    }
                }
            }
            return bookmark;
        },
        checkComAccessControl: function (form,com) {
            if( !accessControl(form,com) )
                return true;
            var table = form.getDocument().getByKey(com.tableKey);
            var val = -1;
            if( table.first() ) {
                val = YIUI.TypeConvertor.toInt(table.getByKey(com.columnKey + "_CF"));
            }
            return ((val & YIUI.FormUIStatusMask.ENABLE) != 0) ? false : true;
        },
        checkCellAccessControl: function (form,grid,ri,key) {
            var rowData = grid.getRowDataAt(ri);

            var loc = form.getCellLocation(key);
            if( loc.expand || !rowData.bkmkRow ) {
                return true;
            }

            var metaCell = grid.getCellEditOpt(ri,loc.column);

            if( !accessControl(form,metaCell) )
                return true;

            var table = form.getDocument().getByKey(metaCell.tableKey);
            if( table.tableMode == YIUI.TableMode.HEAD ) {
                table.first();
            } else {
                table.setByBkmk(rowData.bkmkRow.getBookmark());
            }
            var val = YIUI.TypeConvertor.toInt(table.getByKey(metaCell.columnKey + "_CF"));
            return ((val & YIUI.FormUIStatusMask.ENABLE) != 0) ? false : true;
        },

        updateFormulaItemsIndex: function (form, grid) {

            var updateItem = function (item) {
                delete item.pos.index;
                delete item.pos.indexes;
                var loc = form.getCellLocation(item.target);
                if( loc.expand ) {
                    item.pos.indexes = loc.columns.concat();
                } else {
                    item.pos.index = loc.column;
                }
                item.pos.columnExpand = loc.expand;
            }

            var updateItems = function (allItems) {
                for( var i = 0,exp;exp = allItems[i];i++ ) {
                    if( grid.key && exp.source == grid.key ) {
                        if( exp.objectType == YIUI.ExprItem_Type.Set ) {
                            for( var k = 0,item;item = exp.items[k];k++ ) {
                                updateItem(item);
                            }
                        } else {
                            if( exp.target !== exp.source ) {
                                updateItem(exp);
                            }
                        }
                    }
                }
            }

            var updateAffectItems = function (affectItems) {
                for( var o in affectItems ) {
                    if( affectItems.hasOwnProperty(o) ) {
                        updateItems(affectItems[o]);
                    }
                }
            }

            var dp = form.dependency;

            updateItems(dp.calcTree.items);
            updateAffectItems(dp.calcTree.affectItems);

            updateItems(dp.enableTree.items);
            updateAffectItems(dp.enableTree.affectItems);

            updateItems(dp.visibleTree.items);
            updateAffectItems(dp.visibleTree.affectItems);

            updateItems(dp.checkRuleTree.items);
            updateAffectItems(dp.checkRuleTree.affectItems);
        }
    };
    return Return;
})();