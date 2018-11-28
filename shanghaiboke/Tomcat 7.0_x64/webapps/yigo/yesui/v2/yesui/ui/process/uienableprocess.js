/**
 * Created by 陈瑞 on 2017/3/2 use WebStorm.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.UIEnableProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        EnableItemType:{
            Head: 0,
            List: 1,
            Column: 2,
            Operation: 3
        },

        init:function (form) {
            this.base(form);
        },

        calcAll:function () {
            var items = this.enableTree.items,
                item,
                com,
                ctx = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || item.type == this.EnableItemType.Operation ) {
                    continue;
                }
                this.calcExprItemObject(com,ctx,item);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.enableTree.items,
                item,
                com,
                ctx = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form, com, gridKey) || item.type == this.EnableItemType.Operation ) {
                    continue;
                }
                this.calcExprItemObject(com,ctx,item);
            }
        },

        calcExprItemObject: function (com,ctx,item) {
            switch (item.objectType){
            case YIUI.ExprItem_Type.Item:
                if( item.type == this.EnableItemType.Operation ) {
                    this.form.setOperationEnable(item.target,this.form.eval(item.content,ctx));
                } else {
                    this.calcHeadItem(com,ctx,item);
                }
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,ctx,this.initTree(item));
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,ctx,this.initTree(item));
                    break;
                }
                break;
            }
        },

        calcHeadItem:function (com,ctx,item) {
            var enable = false;
            if( com.type == YIUI.CONTROLTYPE.GRID && item.source !== item.target ) {
                var loc = this.form.getCellLocation(item.target);
                var pos = item.pos,
                    rowIndex = loc.row;
                if( pos.columnExpand ) { // 列拓展计算多次
                    var indexes = pos.indexes;
                    for( var i = 0,length = indexes.length;i < length;i++ ) {
                        ctx.rowIndex = rowIndex,ctx.colIndex = indexes[i];
                        com.setCellEnable(rowIndex, indexes[i], this.calcEnable(item, ctx, this.getFormEnable()));
                    }
                } else { // 普通计算一次
                    ctx.rowIndex = rowIndex;
                    if( YIUI.ViewUtil.checkCellAccessControl(this.form,com,rowIndex,item.target) ) {
                        enable = this.calcEnable(item, ctx, this.getFormEnable());
                    }
                    com.setCellEnable(rowIndex, pos.index, enable);
                }
            } else {
                var defaultValue = this.getFormEnable();
                if( com.isSubDetail ) {
                    var cell = YIUI.SubDetailUtil.getBindingCellData(this.form,com);
                    if( cell ) {
                        defaultValue = cell[2];
                    }
                }

                if( YIUI.ViewUtil.checkComAccessControl(this.form,com) ) {
                    enable = this.calcEnable(item,ctx,defaultValue);
                }

                com.setEnable(enable);
            }
        },

        calcGrid: function (grid,ctx,itemSet) {
            for( var i = 0,size = grid.getRowCount(); i < size;i++ ) {
                var rowData = grid.getRowDataAt(i);

                if( rowData.rowType === 'Fix' ) {
                    continue;
                }

                if( rowData.rowType === 'Detail' ) {
                    this.impl_calcGridRow(grid,ctx,i,itemSet);
                } else {
                    var metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                        metaCell;
                    for( var k = 0,count = metaRow.cells.length;k < count;k++ ) {
                        metaCell = metaRow.cells[k];
                        if( metaCell.cellType !== YIUI.CONTROLTYPE.LABEL ) {
                            grid.setCellEnable(i,k,true);
                        } else {
                            grid.setCellEnable(i,k,this.getFormEnable());
                        }
                    }
                }
            }
        },

        impl_calcGridRow:function (grid,ctx,rowIndex,itemSet) {
            if( rowIndex == -1 )
                return;
            var enable = false,
                item,
                pos;
            for( var i = 0;item = itemSet.items[i];i++ ) {
                if( item.type != this.EnableItemType.List )
                    continue;
                pos = item.pos;
                if( pos.columnExpand ) {
                    for( var c = 0,size = pos.indexes.length;c < size;c++ ) {
                        ctx.rowIndex = rowIndex,ctx.colIndex = pos.indexes[c];
                        enable = this.calcEnable(item,ctx,this.getFormEnable());
                        grid.setCellEnable(rowIndex,pos.indexes[c],enable);
                    }
                } else {
                    ctx.rowIndex = rowIndex;
                    if( YIUI.ViewUtil.checkCellAccessControl(this.form,grid,rowIndex,item.target) ) {
                        enable = this.calcEnable(item,ctx,this.getFormEnable());
                    }

                    grid.setCellEnable(rowIndex,pos.index,enable);

                    if( grid.getFocusRowIndex() == rowIndex ) {
                        var coms = this.form.getCellSubDtlComps(grid.key,item.target);
                        if( coms ) {
                            for( var k = 0,length = coms.length;k < length;k++ ) {
                                if( !coms[k].getMetaObj().enable ) {
                                    coms[k].setEnable(enable);
                                }
                            }
                        }
                    }
                }
            }
        },

        calcListView:function (listView,ctx,itemSet) {
            for( var i = 0,item;item = itemSet.items[i];i++ ) {
                if( item.type != this.EnableItemType.Column )
                    continue;
                listView.setColumnEnable(item.target,this.calcEnable(item,ctx,this.getFormEnable()));
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var editOpt = grid.getCellEditOpt(rowIndex,colIndex),
                ctx = this.newContext(this.form,rowIndex,colIndex);

            this.impl_ValueChanged(grid,ctx,rowIndex,editOpt.key);
        },

        valueChanged:function (com) {
            var items = this.enableTree.affectItems[com.key];

            if( !items ) {
                return;
            }

            var item,
                com,
                ctx = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);

                this.calcExprItemObject(com,ctx,item);
            }
        },

        impl_ValueChanged:function (grid,ctx,rowIndex,srcKey) {
            var items = this.enableTree.affectItems[srcKey];

            if( !items ) {
                return;
            }

            var item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                switch ( item.objectType ){
                case YIUI.ExprItem_Type.Item:
                    if( item.type == this.EnableItemType.Operation ) {
                        this.form.setOperationEnable(item.target,this.form.eval(item.content,ctx));
                    } else {
                        this.calcHeadItem(com,ctx,item);
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( grid.key === com.key && srcKey.indexOf(":RowIndex") == -1 ) {
                        this.impl_calcGridRow(grid,ctx,rowIndex,item);
                    } else if ( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        this.impl_calcGridRow(com,ctx,com.getFocusRowIndex(),item);
                    } else {
                        this.calcGrid(com,ctx,item);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var ctx = this.newContext(this.form,-1,-1);

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_RowChanged(grid,ctx);
        },

        doCalcOneRow:function (component,rowIndex) {
            if( component.type != YIUI.CONTROLTYPE.GRID )
                return;
            var ctx = this.newContext(this.form,rowIndex,-1);
            this.calcGridRow(component,ctx,rowIndex);
        },

        doAfterRowChanged:function (grid) {
            var ctx = this.newContext(this.form,-1,-1);
            this.impl_RowChanged(grid,ctx);
        },

        impl_RowChanged:function (grid,ctx) {

            if( grid.getFocusRowIndex() == -1 ) {
                return;
            }

            var detailRow = grid.getDetailMetaRow(),
                item,
                com,
                items;

            if( !detailRow ) {
                return;
            }

            for( var i = 0,length = detailRow.cells.length;i < length;i++ ) {
                items = this.enableTree.affectItems[detailRow.cells[i].key];
                if( items ) {
                    for( var k = 0;item = items[k];k++ ) {
                        if( item.source !== grid.key ) {
                            com = this.form.getComponent(item.source);
                            this.calcExprItemObject(com,ctx,item);
                        }
                    }
                }
            }
        },

        calcGridRow:function (grid,ctx,rowIndex) {
            var items = this.enableTree.items;
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType !== YIUI.ExprItem_Type.Set || exp.source !== grid.key )
                    continue;

                this.impl_calcGridRow(grid,ctx,rowIndex,exp);
            }

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_RowChanged(grid,ctx);
        },

        reCalcComponent:function (com) {
            var items = this.enableTree.items,
                item,
                ctx = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

                this.calcExprItemObject(com,ctx,item);
            }
        }

    });
})();