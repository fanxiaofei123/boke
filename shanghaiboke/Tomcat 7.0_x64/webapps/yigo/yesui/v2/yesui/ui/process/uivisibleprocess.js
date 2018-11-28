/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
(function () {
    YIUI.UIVisibleProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        VisibleItemType : { Head: 0,
                           Column: 1,
                           Operation: 2 },
        init:function (form) {
            this.base(form);
        },

        calcAll:function () {

            var self = this;

            var calcComponent = function () {
                var items = self.visibleTree.items,
                    context = self.newContext(self.form,-1,-1);
                for( var i = 0,exp,com;exp = items[i];i++ ) {
                    com = self.form.getComponent(exp.source);
                    if( !com || exp.type == self.VisibleItemType.Operation )
                        continue;

                    self.calcExprItemObject(com,context,exp);
                }
            }

            var calcGridRows = function () {
                var rowItems = self.visibleTree.rowItems;

                if( !rowItems )
                    return;

                var gm = self.form.getGridInfoMap(),
                    grid,
                    row,
                    item,
                    ctx,
                    items;

                for( var i = 0,size = gm.length;i < size;i++ ) {
                    grid = self.form.getComponent(gm[i].key);
                    items = rowItems[grid.key];
                    if( !items )
                        continue;
                    for( var k = 0,count = grid.getRowCount();k < count;k++ ) {
                        row = grid.getRowDataAt(k);
                        if( row.rowType === 'Detail' )
                            continue;
                        item = items[row.key];
                        if( !item )
                            continue;
                        if( !ctx ) {
                            ctx = self.newContext(self.form,-1,-1);
                        }
                        ctx.rowIndex = k;
                        grid.setRowVisible(k,self.form.eval(item.content, ctx));
                    }
                }
            }

            calcComponent();

            calcGridRows();
        },

        calcSubDetail:function (gridKey) {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey)|| exp.type == this.VisibleItemType.Operation );
                    continue;

                this.calcExprItemObject(com,context,exp);
            }
        },

        calcExprItemObject:function (com,ctx,item) {
            switch (item.objectType){
            case YIUI.ExprItem_Type.Item:
                if( item.type == this.VisibleItemType.Operation ) {
                    this.form.setOperationVisible(item.target,this.form.eval(item.content, ctx, null));
                } else {
                    this.calcHeadItem(com,item,ctx);
                }
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,this.initTree(item),ctx);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,this.initTree(item),ctx);
                    break;
                }
                break;
            }
        },

        calcHeadItem:function (com,item,ctx) {

            if( com.extend ) {
                return com.setVisible(false);
            }

            if( $.inArray(item.source,this.form.buddyKeys) !== -1 )
                return;

            var defaultValue = true;
            if( com.isSubDetail ) {
                var column = YIUI.SubDetailUtil.getBindingColumn(this.form,com);
                if( column ) {
                    defaultValue = !column.hidden;
                }
            }

            var visible = com.isVisible();

            com.setVisible(this.calcVisible(item,ctx,defaultValue));

            if(this.form.rendered && com.isPanel && com.isVisible() && !com.rendered && (!com.ownerCt || com.ownerCt.rendered)){
                com.render();
            }

            if( visible != com.isVisible() ) {
                this.moveError(com);
            }
        },

        calcListView:function (listView,item,ctx) {
            if( !item.items )
                return;
            for(var i = 0,exp;exp = item.items[i];i++){
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                listView.setColumnVisible(exp.target, this.calcVisible(exp,ctx,true));
            }
        },

        calcGrid:function (grid,item,ctx) {
            if( !item.items )
                return;

            var unVisible = this.form.dependency.unVisibleKeys,
                visible,
                exp,
                pos;

            for( var i = 0;(exp = item.items[i]) && (pos = exp.pos);i++ ){
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                if( pos.columnExpand ) {
                    var visible = [];
                    for( var k = 0,length = pos.indexes.length;k < length;k++ ) {
                        ctx.colIndex = pos.indexes[k];
                        if( unVisible && $.inArray(exp.target,unVisible) != -1 ){
                            visible.push(false);
                        } else {
                            visible.push(this.calcVisible(exp,ctx,true));
                        }
                    }
                    grid.setColumnVisible(pos.indexes, visible);
                } else {
                    if( unVisible && $.inArray(exp.target,unVisible) != -1 ){
                        visible = false;
                    } else {
                        visible = this.calcVisible(exp,ctx,true);
                    }

                    // 列的可见性改变,移除或者添加行的错误
                    var change = grid.setColumnVisible(pos.index, visible);
                    if( change ) {
                        for( var k = 0,size = grid.getRowCount();k < size;k++ ) {
                            var rowData = grid.getRowDataAt(k);
                            if( rowData.rowType == 'Detail' ) {
                                this.moveCellError(grid,rowData,k,pos.index);
                            }
                        }

                        // 添加,算完refresh
                        if( this.form.rendered ) {
                            if( this.form.grids.indexOf(grid) == -1 ) {
                                this.form.grids.push(grid);
                            }
                        }
                    }

                    var coms = this.form.getCellSubDtlComps(grid.key,exp.target),meta;
                    if( coms ) {
                        for( var j = 0,length = coms.length;j < length;j++ ) {
                            meta = coms[j].getMetaObj();
                            if( !meta.visible ) {
                                coms[j].setVisible(visible);
                            }
                        }
                    }
                }
            }
        },

        valueChanged:function (comp) {
            var items = this.visibleTree.affectItems[comp.key];

            if( !items )
                return;

            var item,
                com;

            var context = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);

                this.calcExprItemObject(com,context,item);
            }

            // 算完统一刷新
            var grids = this.form.grids;
            for( var i = 0,size = grids.length;i < size;i++ ){
                grids[i].refreshGrid();
            }
            this.form.grids.length = 0;
        },

        reCalcComponent:function (com) {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1),
                item;
            for( var i = 0;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

                this.calcExprItemObject(com,context,item);
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var editOpt = grid.getCellEditOpt(rowIndex,colIndex),
                items = this.visibleTree.affectItems[editOpt.key];

            if( !items )
                return;

            var ctx = this.newContext(this.form,rowIndex,colIndex),
                item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);

                this.calcExprItemObject(com,ctx,item);
            }
        },

        doAfterDeleteRow:function (grid) {
            this.impl_RowChanged(grid);
        },

        doCalcOneRow:function (com,rowIndex) {
            if( com.type !== YIUI.CONTROLTYPE.GRID )
                return;
            this.impl_RowChanged(com);
        },

        doAfterRowChanged:function (grid) {
            this.impl_RowChanged(grid);
        },

        impl_RowChanged: function (grid) {
            var detailRow = grid.getDetailMetaRow(),
                item,
                com,
                items;

            if( !detailRow ) {
                return;
            }

            var ctx = this.newContext(this.form,-1,-1);

            for( var i = 0,length = detailRow.cells.length;i < length;i++ ) {
                items = this.visibleTree.affectItems[detailRow.cells[i].key];
                if( items ) {
                    for( var j = 0;item = items[j];j++ ) {
                        com = this.form.getComponent(item.source);

                        if( com.key != grid.key ) {
                            this.calcExprItemObject(com,ctx,item);
                        }
                    }
                }
            }
        }

    });
})();