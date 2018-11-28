/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
 var YIUI = YIUI || {};
(function () {
    YIUI.UICalcProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        init:function (form) {
            this.base(form);
        },

        calcAlling: false,

        calcAll:function () {

            this.calcAlling = true;

            var calcAll = this.form.operationState == YIUI.Form_OperationState.New;

            this.calcAllItems(this.calcTree.items,calcAll);

            var gm = this.form.getGridInfoMap(),grid;
            for( var i = 0,size = gm.length;i < size;i++ ) {
                grid = this.form.getComponent(gm[i].key);

                YIUI.GridSumUtil.evalSum(this.form,grid);

                grid.refreshSelectAll();
            }

            var lvm = this.form.getListViewMap(),listview;
            for( var i = 0,size = lvm.length;i < size;i++ ) {
                listview = this.form.getComponent(lvm[i].key);

                listview.refreshSelectAll();
            }

            this.form.removeSysExpVals("IgnoreKeys");

            this.calcAlling = false;
        },

        calcAllItems:function (items,calcAll) {
            var ctx = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || com.isSubDetail )
                    continue;

                this.calcExprItemObject(com,item,ctx,calcAll);
            }
        },

        calcExprItemObject: function (com,item,ctx,calcAll) {
            switch (item.objectType) {
            case YIUI.ExprItem_Type.Item:
                this.calcHeadItem(com,item,ctx,calcAll);
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,ctx,this.initTree(item),calcAll);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,ctx,this.initTree(item),calcAll);
                    break;
                }
            }
        },

        calcHeadItem:function (com,item,ctx,calcAll) {
            if( item.empty )
                return;
            if( com.type == YIUI.CONTROLTYPE.GRID ){
                var loc = this.form.getCellLocation(item.target),
                    rowIndex = loc.row,
                    rowData = com.getRowDataAt(rowIndex),
                    colIndex,
                    metaCell,
                    cellData,
                    pos = item.pos;

                ctx.inSide = true;

                if( pos.columnExpand ) {
                    var indexes = item.pos.indexes;
                    for( var i = 0,length = indexes.length;i < length;i++ ) {
                        colIndex = indexes[i];
                        cellData = rowData.data[colIndex];
                        metaCell = com.getCellEditOpt(rowIndex,colIndex);
                        if( this.needCalc_Cell(com,rowIndex,colIndex,metaCell,cellData,calcAll) ) {
                            ctx.rowIndex = rowIndex,ctx.colIndex = colIndex;
                            com.setValueAt(rowIndex,colIndex,this.calcFormulaValue(item,ctx,metaCell.cellType),cellData.bkmkRow != null,false);
                        }
                    }
                } else {
                    colIndex = item.pos.index;
                    cellData = rowData.data[colIndex];
                    metaCell = com.getCellEditOpt(rowIndex,colIndex);
                    if( this.needCalc_Cell(com,rowIndex,colIndex,metaCell,cellData,calcAll) ) {
                        ctx.rowIndex = rowIndex,ctx.colIndex = colIndex;
                        com.setValueAt(rowIndex,colIndex,this.calcFormulaValue(item,ctx,metaCell.cellType),true,false);
                    }
                }

                ctx.inSide = false;
            } else {
                if( this.needCalc_Com(com,calcAll) ) {
                    com.setValue(this.calcFormulaValue(item,ctx,com.type),true,false);
                }
            }
        },

        calcListView:function (listView,context,item,calcAll) {
            for( var i = 0,count = listView.getRowCount();i < count;i++ ) {
                this.impl_calcListViewRow(listView,context,i,item,calcAll);
            }
        },

        impl_calcListViewRow:function (listView,ctx,rowIndex,itemSet,calcAll) {
            if( !itemSet.items )
                return;
            var columnInfo,
                item,
                result;

            ctx.rowIndex = rowIndex;

            for( var i = 0;item = itemSet.items[i];i++ ) {
                if( (!item.defaultValue && !item.formulaValue) || !item.target )
                    continue;
                columnInfo = listView.getColumnInfo(item.target);
                if( this.needCalc_listView(columnInfo,calcAll) ) {
                    result = this.calcFormulaValue(item,ctx,columnInfo.columnType);
                    if( result != null ) {
                        listView.setValByKey(rowIndex,item.target,result,false);
                    }
                }
            }
        },

        calcGrid:function (grid,context,item,calcAll) {
            for( var i = 0,rowData,count = grid.getRowCount();i < count;i++ ) {
                rowData = grid.getRowDataAt(i);
                if( rowData.rowType === 'Detail' ) {
                    this.impl_calcGridRow(grid,context,i,item,calcAll);
                }
            }
        },

        impl_calcGridRow:function (grid,ctx,rowIndex,itemSet,calcAll) {
            if( !itemSet.items || rowIndex == -1 )
                return;
            var item,
                pos,
                rowData = grid.getRowDataAt(rowIndex),
                metaCell,
                cellData,
                colIndex;

            ctx.rowIndex = rowIndex;

            for( var i = 0;item = itemSet.items[i];i++ ) {
                if( item.empty || item.treeSum )
                    continue;
                pos = item.pos;
                if( pos.columnExpand ) {
                    for( var c = 0,length = pos.indexes.length;c < length;c++ ) {
                        colIndex = pos.indexes[i];
                        cellData = rowData.data[colIndex];
                        metaCell = grid.getCellEditOpt(rowIndex,colIndex);
                        if( this.needCalc_Cell(grid,rowIndex,colIndex,metaCell,cellData,calcAll) ) {
                            ctx.colIndex = colIndex;
                            grid.setValueAt(rowIndex,colIndex,this.calcFormulaValue(item,ctx,metaCell.cellType),rowData.bkmkRow != null,false);
                        }
                    }
                } else {
                    colIndex = pos.index;
                    cellData = rowData.data[colIndex];
                    metaCell = grid.getCellEditOpt(rowIndex,colIndex);
                    if( this.needCalc_Cell(grid,rowIndex,colIndex,metaCell,cellData,calcAll) ) {
                        grid.setValueAt(rowIndex,colIndex,this.calcFormulaValue(item,ctx,metaCell.cellType),rowData.bkmkRow != null,false);
                    }
                }
            }
        },

        calcGridRow:function (grid,rowIndex,calcAll) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,rowIndex,-1),
                item;
            for( var i = 0;item = items[i];i++ ) {
                if( item.objectType !== YIUI.ExprItem_Type.Set || item.source !== grid.key )
                    continue;
                this.impl_calcGridRow(grid,context,rowIndex,item,calcAll);
            }
        },

        needCalc_Cell:function(grid,ri,ci,metaCell,cellData,calcAll){

            // 1.如果有忽略字段(下推,copyNew),根据忽略字段判断
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            if( ignoreKeys  ) {
                return ignoreKeys.indexOf(metaCell.key) == -1;
            }

            // 2.常规判断,列出不需要计算的情况
            if( calcAll ) {
                if( this.calcAlling && !grid.isNullValue(cellData[0]) ) {
                    return false;
                }
            } else {
                if( metaCell.columnKey ) {
                    return false;
                }
            }

            return true;
        },

        needCalc_Com:function (com,calcAll) {

            // 1.如果有忽略字段(下推,copyNew),根据忽略字段判断
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            if( ignoreKeys && ignoreKeys.indexOf(com.key) != -1 ) {
                return false;
            }

            // 2.如果是查询字段,根据是否初始化值判断
            if( com.getMetaObj().condition ) {
                return !com.initValue;
            }

            // 3.常规判断,列出不需要计算的情况
            if( calcAll ) {
                if( this.calcAlling && !com.isNull() ) {
                    return false;
                }
            } else {
                if( com.hasDataBinding() || com.bindingCellKey ) {
                    return false;
                }
            }

            return true;
        },

        needCalc_listView:function (columnInfo,calcAll) {

            // 1.如果有忽略字段(下推,copyNew),根据忽略字段判断
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            if( ignoreKeys && ignoreKeys.indexOf(columnInfo.key) != -1 ) {
                return false;
            }

            // 2.常规判断,不计算全部的情况下,有数据绑定,不计算
            if( !calcAll ) {
                if( columnInfo.columnKey ) {
                    return false;
                }
            }
            return true;
        },

        doCalcOneRow:function (com,rowIndex) {
            if( com.type === YIUI.CONTROLTYPE.GRID ) {
                var rowData = com.getRowDataAt(rowIndex);
                this.calcGridRow(com,rowIndex,rowData.bkmkRow == null);
            } else {
                this.calcListViewRow(com,rowIndex,false);// ListView没有空行,只计算没有数据绑定的
            }
        },

        calcListViewRow:function (listView,rowIndex,calcAll) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,rowIndex,-1);
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType !== YIUI.ExprItem_Type.Set || exp.source !== listView.key )
                    continue;
                this.impl_calcListViewRow(listView,context,rowIndex,exp,calcAll);
            }
        },

        valueChanged:function (comp) {
            var items = this.calcTree.affectItems[comp.key];

            if( !items )
                return;

            var context = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;

                this.calcExprItemObject(com,item,context,true);
            }
        },

        reCalcComponent:function (com) {

            this.calcAllItems(this.getGridItems(com),false);

            if( com.type === YIUI.CONTROLTYPE.GRID ) {
                YIUI.GridSumUtil.evalSum(this.form,com);
            }

            this.form.removeSysExpVals("IgnoreKeys");
        },

        getGridItems:function (com) {
            var items = this.calcTree.items,
                item,
                _items = [];

            for( var i = 0;item = items[i];i++ ) {
                if( item.source == com.key &&
                    item.objectType == YIUI.ExprItem_Type.Set )
                _items.push(item);
            }

            if( com.type === YIUI.CONTROLTYPE.GRID ) {
                _items = _items.concat(this.getGridAffectItems(com));
            }

            _items.sort(function (o1,o2) {
                return o1.order - o2.order;
            });

            return _items;
        },

        getGridAffectItems:function (grid) {
            var items;
            if( this.calcTree.gridAffectItems ) {
                items = this.calcTree.gridAffectItems[grid.key];
            }

            if( items ) {
                return items;
            }

            items = [];

            if( !this.calcTree.gridAffectItems ) {
                this.calcTree.gridAffectItems = {};
            }

            this.calcTree.gridAffectItems[grid.key] = items;

            var metaRow = grid.getDetailMetaRow();
            if( !metaRow ) {
                return items;
            }

            var cells = metaRow.cells,
                metaCell,
                _items,
                _item,
                affectItems = this.calcTree.affectItems;

            for( var i = 0;metaCell = cells[i];i++ ) {
                _items = affectItems[metaCell.key];
                if( _items ) {
                    for( var k = 0;_item = _items[k];k++ ) {
                        if( _item.source == grid.key &&
                                _item.objectType == YIUI.ExprItem_Type.Set )
                            continue;

                        items.push(_item);
                    }
                }
            }

            items.sort(function (o1,o2) {
                return o1.order - o2.order;
            });

            return items;
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {

            var indexes;
            if( grid.hasTree ) {
                indexes = YIUI.GridSumUtil.evalAffectTreeSum(this.form,grid,rowIndex,colIndex);
            }

            var editOpt = grid.getCellEditOpt(rowIndex,colIndex),
                items = this.calcTree.affectItems[editOpt.key];

            if( !items )
                return;

            var ctx = this.newContext(this.form,rowIndex,colIndex),
                item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                switch (item.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,item,ctx,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( com.key === grid.key ) {
                        // 当前行
                        this.impl_calcGridRow(com,ctx,rowIndex,item,true);

                        // 向上计算
                        if( indexes ) {
                            for( var k = 0,size = indexes.length;k < size;k++ ) {
                                this.impl_calcGridRow(com,ctx,indexes[k],item,true);
                            }
                        }
                    } else if ( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        this.impl_calcGridRow(com,ctx,com.getFocusRowIndex(),item,true);
                    } else {
                        this.calcGrid(com,ctx,this.initTree(item),true);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var items = this.getGridAffectItems(grid);

            var ctx = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;
                switch (item.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,item,ctx,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        this.impl_calcGridRow(com,ctx,com.getFocusRowIndex(),item,true);
                    }
                    break;
                }
            }
            YIUI.GridSumUtil.evalSum(this.form,grid);
        },

        calcSubDetail:function (gridKey) {
            var items = this.calcTree.items,
                ctx = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;

                this.calcExprItemObject(com,item,ctx,false);
            }

            var gm = this.form.getGridInfoMap(),
                grid;
            for( var i = 0,size = gm.length;i < size;i++ ) {
                grid = this.form.getComponent(gm[i].key);

                if( !YIUI.SubDetailUtil.isSubDetail(this.form,grid,gridKey))
                    continue;

                YIUI.GridSumUtil.evalSum(this.form,grid);

                grid.refreshSelectAll();
            }
        }
    });
})();