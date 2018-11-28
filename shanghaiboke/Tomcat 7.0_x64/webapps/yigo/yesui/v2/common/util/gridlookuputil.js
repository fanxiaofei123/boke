/**
 * Created by 陈瑞 on 2017/3/14 use WebStorm.
 */
YIUI.GridLookupUtil = (function () {
    var Return = {

        /**
         * 建立单元格查找
         */
        buildCellLookup:function (form,com) {
            switch (com.type) {
            case YIUI.CONTROLTYPE.GRID:
                var metaRows = com.getMetaObj().rows,metaRow,key,keys = [];
                for( var i = 0; metaRow = metaRows[i]; i++ ) {
                    var rowIndex = metaRow.rowType === 'Fix' ? i : -1;
                    for (var k = 0,metaCell; metaCell = metaRow.cells[k]; k++) {
                        key = metaCell.key;
                        if( key ) {
                            var tableKey = metaRow.rowType === 'Fix' ? metaCell.tableKey : com.tableKey,
                                columnKey = metaCell.columnKey;
                            var loc = form.formAdapt.getCellLocation(key);
                            if( !loc ) {
                                loc = {
                                    key: com.key,
                                    column: -1,
                                    columns: [],
                                    row: rowIndex,
                                    tableKey: tableKey,
                                    columnKey: columnKey,
                                    expand: true
                                };
                                form.formAdapt.addCellLocation(key,loc);
                            }
                            if( keys.indexOf(key) == -1  ) {
                                loc.columns.length = 0;
                                loc.column = -1;
                                keys.push(key);
                            }
                            if( metaCell.isColExpand ) {
                                loc.columns.push(k);
                            } else {
                                loc.column = k;
                            }
                            loc.expand = metaCell.isColExpand;
                        }
                    }
                }
                break;
            case YIUI.CONTROLTYPE.LISTVIEW:
                for (var i = 0,column;column = com.columnInfo[i];i++) {
                    column.tableKey = com.tableKey;
                    loc = {
                        key: com.key,
                        column: i,
                        row: -1,
                        tableKey: com.tableKey,
                        columnKey: column.columnKey
                    };
                    form.formAdapt.addCellLocation(column.key, loc);
                }
                break;
            }
        },

        /**
         * 更新固定行位置
         */
        updateFixPos:function (form,grid) {
            if( grid.hasFixRow ) {
                for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                    var rowData = grid.getRowDataAt(i);
                    if( rowData.rowType !== "Fix" )
                        continue;
                    for( var j = 0,length = rowData.cellKeys.length;j < length;j++ ) {
                        var cellKey = rowData.cellKeys[j];
                        if( cellKey ) {
                            form.getCellLocation(cellKey).row = i;
                        }
                    }
                }
            }
        }
    };
    return Return;
})();

