/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.UICheckRuleProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        init:function (form) {
            this.base(form);
        },

        calcAll:function () {

            this.calcAllComponents();

            this.checkGridRows();

            this.checkGlobal();
        },

        checkGlobal:function () {
            if( this.form.operationState == YIUI.Form_OperationState.Default ) {
                return;
            }

            var items = this.checkRuleTree.globalItems;
            if ( !items ) {
                return;
            }

            var context = this.newContext(this.form,-1,-1),
                formKey = this.form.formKey,
                result;
            for( var i = 0,item;item = items[i];i++ ) {
                if( !item.content ) {
                    continue;
                }
                result = this.form.eval(item.content,context);
                if( typeof result === 'string' ) {
                    if( result ) {
                        this.form.setError(true,result,formKey);
                        break;
                    } else {
                        this.form.setError(false,null,null);
                    }
                } else {
                    if( result ) {
                        this.form.setError(false,null,null);
                    } else {
                        this.form.setError(true,item.errorMsg,formKey);
                        break;
                    }
                }
            }
        },

        calcAllComponents:function () {
            var items = this.checkRuleTree.items,
                ctx = this.newContext(this.form,-1,-1),
                com,
                item;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( com.isSubDetail )
                    continue;

                this.calcExprItemObject(com,ctx,item);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.checkRuleTree.items,
                ctx = this.newContext(this.form,-1,-1),
                com,
                item;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;

                this.calcExprItemObject(com,ctx,item);
            }
        },

        calcExprItemObject: function (com,ctx,item) {
            switch (item.objectType) {
            case YIUI.ExprItem_Type.Item:
                this.checkHead(com,ctx,item);
                break;
            case YIUI.ExprItem_Type.Set:
                this.checkGrid(com,ctx,this.initTree(item));
                break;
            default:
                break;
            }
        },
        
        checkHead:function (com,ctx,item) {
            if( com.type == YIUI.CONTROLTYPE.GRID ){
                var loc = this.form.getCellLocation(item.target);
                var rowIndex = loc.row,
                    pos = item.pos;
                if( pos.columnExpand ) {
                    for( var i = 0,length = pos.indexes.length;i < length;i++ ) {
                        ctx.rowIndex = rowIndex,ctx.colIndex = pos.indexes[i];
                        this.checkCellItem(com,rowIndex,pos.indexes[i],ctx,item);
                    }
                } else {
                    ctx.rowIndex = rowIndex;
                    this.checkCellItem(com,rowIndex,pos.index,ctx,item);
                }
            } else {
                if( this.form.operationState != YIUI.Form_OperationState.Default || com.isEnable() ) {
                    if( item.required ) {
                        com.setRequired(com.isNull());
                    }
                    if( item.content ) {
                        var result = this.calcCheckRule(item,ctx);
                        if( typeof result === 'string' ) {
                            com.setError(result,result);
                        } else {
                            com.setError(!result,result ? null : item.errorMsg);
                        }
                    }
                } else {
                    com.setRequired(false);
                    com.setError(false,null);
                }
                this.moveError(com);
            }
        },

        checkGrid:function (grid,ctx,item) {
            for( var i = 0,row,size = grid.getRowCount();i < size;i++ ) {
                row = grid.getRowDataAt(i);
                if( row.rowType == 'Detail' ) {
                    this.checkGridRowCell(grid,ctx,i,null,item);
                }
            }
        },

        checkCellItem: function (grid,ri,ci,cxt,item) {
            var rowData = grid.getRowDataAt(ri),
                cellData = rowData.data[ci];

            if( this.form.operationState != YIUI.Form_OperationState.Default || cellData[2] ) {
                if( item.required ) {
                    grid.setCellRequired(ri, ci, grid.isNullValue(cellData[0]));
                }
                if( item.content ) {
                    var result = this.calcCheckRule(item,cxt);
                    if( typeof result === 'string' ) {
                        grid.setCellError(ri,ci,result,result);
                    } else {
                        grid.setCellError(ri,ci,!result,result ? null : item.errorMsg);
                    }
                }
            } else {
                grid.setCellRequired(ri, ci, false);
                grid.setCellError(ri, ci, false, null);
            }

            this.moveCellError(grid,rowData,ri,ci);

            if( grid.getFocusRowIndex() == ri ) {
                var coms = this.form.getCellSubDtlComps(grid.key, item.target),meta;
                if (coms && coms.length > 0) {
                    for (var c = 0, count = coms.length; c < count; c++) {
                        meta = coms[c].getMetaObj();
                        if( !meta.checkRule ) {
                            coms[c].setError(cellData[4], cellData[5]);
                        }
                    }
                }
            }
        },

        checkGridRowCell:function (grid,ctx,rowIndex,specialInfo,exp) {
            if( !exp.items )
                return;

            ctx.rowIndex = rowIndex;

            var specialLoc = (specialInfo && specialInfo.specialLoc) || -1,
                specialKey = (specialInfo && specialInfo.specialKey) || null,
                item,pos;
            for( var i = 0;item = exp.items[i];i++ ) {
                pos = item.pos;
                if( pos.columnExpand ) {
                    for( var p = 0,length = pos.indexes.length;p < length;p++ ) {
                        if( specialLoc != -1 && item.target === specialKey && p !== specialLoc )
                            continue;
                        ctx.colIndex = pos.indexes[p];
                        this.checkCellItem(grid,rowIndex,pos.indexes[p],ctx,item);
                    }
                } else {
                    this.checkCellItem(grid,rowIndex,pos.index,ctx,item);
                }
            }
        },

        doCalcOneRow:function (com,rowIndex) {
            if( com.type != YIUI.CONTROLTYPE.GRID ) {
                return;
            }
            var row = com.getRowDataAt(rowIndex);
            if( row.rowType !== 'Detail' ) {
                return;
            }
            var items = this.checkRuleTree.items,
                context = this.newContext(this.form,rowIndex,-1);
            for( var i = 0,item;item = items[i];i++ ) {
                if( item.objectType !== YIUI.ExprItem_Type.Set || item.source !== com.key )
                    continue;
                this.checkGridRowCell(com,context,rowIndex,null,item);
            }

            this.checkGridRowCheckRule(com,context,rowIndex);

            this.impl_valueChanged(com,com.key + ":RowCount");

            this.checkGlobal();
        },

        doAfterDeleteRow: function (grid){
            this.impl_valueChanged(grid,grid.key + ":RowCount");

            this.checkGlobal();
        },

        checkGridRows:function () {
            var gridMap = this.form.getGridInfoMap(),grid,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,gridInfo;gridInfo = gridMap[i];i++ ) {
                grid = this.form.getComponent(gridInfo.key);
                for( var ri = 0,length = grid.getRowCount();ri < length;ri++ ) {
                    this.checkGridRowCheckRule(grid,context,ri);
                }
            }
        },

        checkGridRowCheckRule:function (grid,ctx,rowIndex) {
            var rowCheckRules = this.checkRuleTree.rowCheckRules[grid.key],
                rowData = grid.getRowDataAt(rowIndex),result;
            if ( !rowCheckRules || rowData.rowType !== 'Detail' )
                return;

            ctx.rowIndex = rowIndex;

            if( grid.isEnable() ) {
                for (var k = 0,item;item = rowCheckRules[k]; k++) {
                    if( !item.content.trim() )
                        continue;
                    result = this.calcCheckRule(item,ctx);
                    if( typeof result === 'string' ) {
                        grid.setRowError(rowIndex,result,result,rowData.key);
                        if( result ) break;
                    } else {
                        grid.setRowError(rowIndex,!result,result ? null : item.errorMsg,rowData.key);
                        if( !result ) break;
                    }
                }
            } else {
                grid.setRowError(rowIndex,false,null,null);
            }
        },

        reCalcComponent:function (com) {
            var items = this.checkRuleTree.items,
                item,
                ctx = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

               this.calcExprItemObject(com,ctx,item);
            }

            if( com.type == YIUI.CONTROLTYPE.GRID ) {
                for( var i = 0,size = com.getRowCount();i < size;i++ ){
                    this.checkGridRowCheckRule(com,ctx,i);
                }
            }

            this.checkGlobal();
        },

        valueChanged:function (com) {

            this.impl_valueChanged(com,com.key);

            if( com.isSubDetail && !com.bindingCellKey ) {
                var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,com);
                if( grid ) {
                    var ctx = this.newContext(this.form,grid.getFocusRowIndex(),-1);
                    this.checkGridRowCheckRule(grid,ctx,grid.getFocusRowIndex());
                }
            }

            this.checkGlobal();
        },

        impl_valueChanged:function (comp,key) {
            var items = this.checkRuleTree.affectItems[key];

            if( !items )
                return;

            var item,
                com,
                context = this.newContext(this.form,-1,-1);

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;

                switch (item.type) {
                case YIUI.ExprItem_Type.Item:
                    this.checkHead(com,context,item);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,comp,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.checkGridRowCell(com,context,com.getFocusRowIndex(),null,this.initTree(item));
                    } else {
                        this.checkGrid(com,context,this.initTree(item));
                    }
                    break;
                default:
                    break;
                }
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex);
            if ( rowData.rowType !== "Detail" && rowData.rowType !== "Fix" ) {
                return;
            }

            var editOpt = grid.getCellEditOpt(rowIndex,colIndex);

            var items = this.checkRuleTree.affectItems[editOpt.key],
                ctx = this.newContext(this.form,rowIndex,-1),
                com,
                item;

            if ( items ) {
                for (var i = 0;item = items[i];i++) {
                    com = this.form.getComponent(item.source);
                    if( !com )
                        continue;

                    switch (item.objectType) {
                    case YIUI.ExprItem_Type.Item:
                        this.checkHead(com,ctx,item);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        if( rowData.isDetail && com.key == grid.key ) {
                            this.checkGridRowCell(com,ctx,rowIndex,{specialLoc:colIndex,specialKey:editOpt.key},item);
                        } else {
                            this.checkGrid(com, ctx, this.initTree(item));
                        }
                        break;
                    default:
                        break;
                    }
                }
            }

            this.checkGridRowCheckRule(grid,ctx,rowIndex);

            this.checkGlobal();
        }

    });
})();
