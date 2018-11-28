YIUI.GridUtil = (function () {

    // 闭包方法
    var initRowData = function(grid, metaRow, bkmkRow, groupLevel){
            var rowData = {};
            rowData.key = metaRow.key;
            rowData.rowType = metaRow.rowType;
            rowData.metaRowIndex = grid.getMetaObj().rows.indexOf(metaRow);
            rowData.cellKeys = metaRow.cellKeys;
            rowData.isDetail = metaRow.rowType == 'Detail';
            rowData.isEditable = metaRow.rowType != 'Total' && metaRow.rowType != 'Group';
            rowData.rowHeight = metaRow.rowHeight;
            rowData.rowID = grid.randID();
            rowData.data = [];
            rowData.cellBkmks = [];
            rowData.backColor = "";

            if( bkmkRow ) {
                rowData.bkmkRow = bkmkRow;
                if (bkmkRow instanceof YIUI.ExpandRowBkmk) {
                    rowData.bookmark = [];
                    for (var h = 0, hLen = bkmkRow.size(); h < hLen; h++) {
                        rowData.bookmark.push(bkmkRow.getAt(h).getBookmark());
                    }
                } else {
                    rowData.bookmark = bkmkRow.getBookmark();
                }
            }

            if( groupLevel !== undefined ) {
                rowData.rowGroupLevel = groupLevel;
            }

            if(metaRow.rowType == 'Group'){
                rowData.isGroupHead = metaRow.isGroupHead;
                rowData.isGroupTail = metaRow.isGroupTail;
            }

            // 初始化单元格
            var metaCell,
                cells = metaRow.cells;
            for (var i = 0, len = cells.length; i < len; i++) {
                metaCell = cells[i];

                rowData.data.push(initCellData(metaCell.cellType,metaCell));
            }

            return rowData;
        },

        initCellData = function (cellType,metaCell) {
            var value = null,
                caption = '',
                options = metaCell.editOptions;
            switch (cellType) {
            case YIUI.CONTROLTYPE.LABEL:
            case YIUI.CONTROLTYPE.BUTTON:
            case YIUI.CONTROLTYPE.HYPERLINK:
                caption = metaCell.caption;
                break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                value = new Decimal(0);
                if ( options.zeroString ) {
                    caption = options.zeroString;
                } else if (options.showZero) {
                    var opt = {
                        mDec: $.isDefined(options.scale) ? options.scale : 2
                    };
                    caption = YIUI.DecimalFormat.format(0, opt) ;
                }
                break;
            case YIUI.CONTROLTYPE.TEXTEDITOR:
            case YIUI.CONTROLTYPE.TEXTBUTTON:
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                value = '';
                break;
            }
            return [value,caption,true];
        }

    var Return = {

        initRowData: function(grid, metaRow, bkmkRow, groupLevel) {

            return initRowData(grid, metaRow, bkmkRow, groupLevel);
        },

        buildGroupHeaders: function(grid) {

            var initLeafColumns = function (columns, leafColumns) {
                for (var i = 0,column; column = columns[i]; i++) {
                    if (column.columns != null && column.columns.length > 0) {
                        initLeafColumns(column.columns, leafColumns);
                    } else {
                        leafColumns.push(column);
                    }
                }
            }

            var initGroupHeaderArray = function (columns,groupHeaders) {
                var ghArray = [],groupHeader, nextColumns = [], _leafColumns;
                for (var i = 0,column;column = columns[i]; i++) {
                    if (column.columns == null || column.columns.length == 0)
                        continue;

                    _leafColumns = [];

                    initLeafColumns(column.columns, _leafColumns);

                    groupHeader = {
                        startColumnName: "column" + leafColumns.indexOf(_leafColumns[0]),
                        numberOfColumns: _leafColumns.length,
                        caption:column.caption,
                        formulaCaption:column.formulaCaption
                    };

                    ghArray.push(groupHeader);
                    nextColumns = nextColumns.concat(column.columns);
                }

                if (ghArray.length > 0) {
                    groupHeaders.push(ghArray);
                }

                if (nextColumns.length > 0) {
                    initGroupHeaderArray(nextColumns,groupHeaders);
                }
            }

            var groupHeaders = [],
                rootColumns = grid.getMetaObj().columns,
                leafColumns = grid.getMetaObj().leafColumns;

            initGroupHeaderArray(rootColumns,groupHeaders);

            grid.setGroupHeaders(groupHeaders);
        },

        // 根据类型和配置信息初始化一个单元格的值
        initCellData: function (cellType,options) {
            return initCellData(cellType,options);
        },

        // 先判断类型:rowData.rowType === "Detail" && !YIUI.GridUtil.isEmptyRow(rowData)
        isEmptyRow: function(rowData){
            if( rowData ) {
                return rowData.rowType == 'Detail' ? (rowData.bookmark == null && rowData.bkmkRow == null) : false;
            }
            return false;
        }
    };
    return Return;
})();