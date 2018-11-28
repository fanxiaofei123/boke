YIUI.GridHandler = (function () {
    var Return = {
        /**
         * 单元格单击事件,用于表格的button , hyperlink等
         */
        doOnCellClick: function (grid, rowIndex, colIndex, value) {
            var editOpt = grid.getCellEditOpt(rowIndex,colIndex);

            switch (editOpt.cellType) {
            case YIUI.CONTROLTYPE.BUTTON:
            case YIUI.CONTROLTYPE.HYPERLINK:
            case YIUI.CONTROLTYPE.IMAGE:
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                if (editOpt.editOptions.onClick) {
                    var form = YIUI.FormStack.getForm(grid.ofFormID);
                    var cxt = new View.Context(form);
                    cxt.setRowIndex(rowIndex);
                    form.eval($.trim(editOpt.editOptions.onClick), cxt, null);
                }
                break;
            }
        },

        /**
         * 表格行点击
         */
        doOnRowClick: function (grid, rowIndex) {

            var rowClick = grid.getMetaObj().rowClick;

            if ( rowClick ) {
                var form = YIUI.FormStack.getForm(grid.ofFormID),
                    cxt = new View.Context(form);
                
                cxt.setRowIndex(rowIndex);

                form.eval(rowClick, cxt, null);
            }
        },

        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (grid, rowIndex) {

            var rowDblClick = grid.getMetaObj().rowDblClick;

            if( rowDblClick ) {
                var form = YIUI.FormStack.getForm(grid.ofFormID),
                    cxt = new View.Context(form);
                
                cxt.setRowIndex(rowIndex);

                form.eval(rowDblClick, cxt, null);
            }

        },

        /**
         * 单元格双击事件
         */
        doOnCellDblClick: function (grid, rowIndex, colIndex) {

            var editOpt = grid.getCellEditOpt(rowIndex,colIndex);

            var cellDblClick = editOpt.cellDblClick;

            if( cellDblClick ) {
                var form = YIUI.FormStack.getForm(grid.ofFormID),
                    cxt = new View.Context(form);

                cxt.setRowIndex(rowIndex);
                cxt.setColIndex(colIndex);

                form.eval(cellDblClick, cxt, null);
            }

        },

        rowChange: function (grid, newRowIndex, oldRowIndex) {

            grid.loadSubDetail();

            var form = YIUI.FormStack.getForm(grid.ofFormID);

            form.getUIProcess().doAfterRowChanged(grid);

            var rowChanged = grid.getMetaObj().focusRowChanged;

            if( rowChanged ) {
                var cxt = new View.Context(form);
                cxt.setRowIndex(newRowIndex);
                form.eval(rowChanged, cxt, null);
            }
        },

        /**
         * 表格排序事件
         */
        doOnSortClick: function (grid, colIndex, sortType) {
            var detailRow = grid.getDetailMetaRow();
            if( !detailRow ) {
                return;
            }

            var editOpt = detailRow.cells[colIndex];

            grid.dataModel.data.sort(function (row1, row2) {
                if (row1.rowType == "Fix" || row1.rowType == "Total" || row2.rowType == "Fix" || row2.rowType == "Total") {
                    return row1.metaRowIndex - row2.metaRowIndex;
                }
                var value1 = row1.data[colIndex][0], value2 = row2.data[colIndex][0];
                if (row2.bookmark === undefined) return -1;
                if (row1.bookmark === undefined) return 1;
                if (value1 == undefined && value2 == undefined) return 0;
                if (value1 !== undefined && value2 == undefined) return sortType === "asc" ? -1 : 1;
                if (value1 == undefined && value2 !== undefined) return sortType === "asc" ? 1 : -1;

                switch (editOpt.cellType) {
                case YIUI.CONTROLTYPE.DATEPICKER:
                case YIUI.CONTROLTYPE.UTCDATEPICKER:
                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                    return sortType === "desc" ? value2 - value1 : value1 - value2;
                case YIUI.CONTROLTYPE.TEXTEDITOR:
                    return sortType === "desc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                default:
                    value1 = row1.data[colIndex][1],value2 = row2.data[colIndex][1];
                    return sortType === "desc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                }
                return 1;
            });
            grid.refreshGrid();
        },

        /**
         * 单元格选中事件
         */
        doGridCellSelect: function (control, rowID, colIndex) {

        },

        doShiftUpRow: function (control, rowIndex) {
            if(rowIndex <= 0){
                return;
            }

            var rowData = control.getRowDataAt(rowIndex);

            if(rowData.bookmark == null ||rowData.rowType != "Detail"){
                return;
            }

            rowData = control.getRowDataAt(rowIndex - 1);

            if (rowData.bookmark == null || rowData.rowType != "Detail"){
                return;
            }
            this.doExchangeRow(control, rowIndex, rowIndex - 1);
        },

        doShiftDownRow: function (control, rowIndex) {
            if(rowIndex < 0 || rowIndex == control.getRowCount() - 1){
                return;
            }

            var rowData = control.getRowDataAt(rowIndex);

            if(rowData.bookmark == null ||rowData.rowType != "Detail"){
                return;
            }

            if(rowIndex + 1 == control.getRowCount() - 1){
                rowData = control.getRowDataAt(rowIndex + 1);
                if(rowData.bookmark == null || rowData.rowType != "Detail"){
                    return; 
                }
            }

            this.doExchangeRow(control, rowIndex, rowIndex + 1);
        },

        doExchangeRow: function (grid, rowIndex, excIndex) {
            var row = grid.getRowDataAt(rowIndex),
                excRow = grid.getRowDataAt(excIndex);

            grid.dataModel.data.splice(rowIndex, 1, excRow);
            grid.dataModel.data.splice(excIndex, 1, row);

            this.exchangeRowSequence(grid,rowIndex,excIndex);

            grid.el.exchangeRow(rowIndex,excIndex);
        },

        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var def = $.Deferred();

            control.pageInfo.curPageIndex = pageIndex;

            if (control.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                def.resolve(control.load(false));
            } else {
                var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                    filterMap = form.getFilterMap(), pageRowCount = control.pageInfo.pageRowCount,
                    startRi = pageIndex * pageRowCount, tableKey = control.tableKey;
                filterMap.setOID(form.getDocument().oid == undefined ? -1 : form.getDocument().oid);
                filterMap.getTblFilter(tableKey).startRow = startRi;
                filterMap.getTblFilter(tableKey).maxRows = pageRowCount;
                def = YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
                        .then(function(doc){

                            var dataTable = doc.getByKey(tableKey);

                            form.getDocument().setByKey(tableKey, dataTable);

                            var totalRowCount = startRi + YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
                            YIUI.TotalRowCountUtil.setRowCount(form.getDocument(), tableKey, totalRowCount);
                            control.load(false);
                        });
            }
            return def.promise();
        },
        /**
         * 跳转到首页
         */
        doGoToFirstPage: function (control, pageInfo) {
        },
        /**
         * 跳转到末页
         */
        doGoToLastPage: function (control, pageInfo) {
        },
        /**
         * 跳转到上一页
         */
        doGoToPrevPage: function (control, pageInfo) {
        },
        /**
         * 跳转到下一页
         */
        doGoToNextPage: function (control, pageInfo) {
        },

        /**
         * 表格中新增行事件
         */
        rowInsert: function (grid, rowIndex, fireEvent) {
            if( !fireEvent ) {
                return;
            }

            var form = YIUI.FormStack.getForm(grid.ofFormID);

            YIUI.GridLookupUtil.updateFixPos(form,grid);

            var focusIndex = grid.getFocusRowIndex();
            if( rowIndex == focusIndex ) {
                grid.loadSubDetail();
            }

            form.getUIProcess().doCalcOneRow(grid, rowIndex);

            var rowInsert = grid.getMetaObj().rowInsert;
            if ( rowInsert ) {
                var cxt = new View.Context(form);
                cxt.setRowIndex(rowIndex);
                form.eval(rowInsert, cxt, null);
            }
        },

        /**
         * 表格中删除行事件
         */
        rowDelete: function (form, grid, rowIndex, fireEvent) {
            if( !fireEvent ) {
                return;
            }

            YIUI.GridLookupUtil.updateFixPos(form,grid);

            grid.loadSubDetail();

            grid.refreshSelectAll();

            form.getUIProcess().doPostDeleteRow(grid);

            if(grid.serialSeq) {
                this.dealWithSequence(form, grid, rowIndex);
            }

            var metaObj = grid.getMetaObj();
            if (metaObj.rowDelete) {
                var cxt = new View.Context(form);
                form.eval(metaObj.rowDelete, cxt, null);
            }
        },

        rowDeleteAll:function (form,grid,fireEvent) {
            if( !fireEvent ) {
                return;
            }

            grid.refreshSelectAll();

            YIUI.GridLookupUtil.updateFixPos(form,grid);

            form.getUIProcess().doPostDeleteRow(grid);
        },

        setCellValueToDocument: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex];
            switch (row.rowType) {
            case "Fix":
                this.setFixValueToDoc(form, grid, rowIndex, colIndex);
                break;
            case "Detail":
                this.setDtlValueToDoc(form, grid, rowIndex, colIndex);
                break;
            }
        },
        setCellValueToDataTable: function (form, grid, table, editOpt, cellData) {
            var columnKey = editOpt.columnKey;

            if ( !columnKey )
                return;

            var cellType = editOpt.cellType;

            var newValue = cellData[0];

            switch (cellType) {
            case YIUI.CONTROLTYPE.DYNAMICDICT:
            case YIUI.CONTROLTYPE.DICT:
                var editOptions = editOpt.editOptions;
                if ( newValue == null ) {
                    if (editOptions.allowMultiSelection) {
                        table.setByKey(columnKey, null);
                    } else {
                        table.setByKey(columnKey, 0);
                    }
                    break;
                }
                if (editOptions.allowMultiSelection) {
                    var oids = [], itemKey = "";
                    if (editOptions.isCompDict) {
                        $.error($.ygrid.formatString($.ygrid.compDictNotDataBinding, editOpt.key))
                    }
                    for (var i = 0, len = newValue.length; i < len; i++) {
                        oids.push(newValue[i].oid);
                        oids.push(",");
                    }
                    if (oids && oids.length > 0) {
                        oids.pop();
                        itemKey = newValue[0].itemKey;
                    }
                    table.setByKey(columnKey, oids.join(""));
                    if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        table.setByKey(columnKey + "ItemKey", itemKey);
                    }
                } else {
                    table.setByKey(columnKey, newValue.oid);
                    if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT || cellType == YIUI.CONTROLTYPE.COMPDICT ) {
                        table.setByKey(columnKey + "ItemKey", newValue.itemKey);
                    }
                }
                break;
            case YIUI.CONTROLTYPE.DYNAMIC:
                this.setDynamicCellValueToDataTable(form, grid, table, editOpt, cellData);
                break;
            default:
                var dataType = table.cols[table.indexByKey(columnKey)].type;
                table.setByKey(columnKey, YIUI.Handler.convertValue(newValue, dataType));
                break;
            }
        },

        // 设置动态单元格的值
        setDynamicCellValueToDataTable: function (form, grid, table, editOpt, cellData) {
            var curOptions = cellData.curOptions;
            var typeDefKey = cellData.typeDefKey;
            if( !curOptions || !typeDefKey ) {
                return;
            }

            var columnKey = editOpt.columnKey;

            var cellType = curOptions.cellType;

            var newValue = cellData[0];

            switch ( cellType ) {
            case YIUI.CONTROLTYPE.DYNAMICDICT:
            case YIUI.CONTROLTYPE.DICT:
                if ( newValue == null ) {
                    if (curOptions.allowMultiSelection) {
                        table.setByKey(columnKey, null);
                    } else {
                        table.setByKey(columnKey, 0);
                    }
                    break;
                }
                if (curOptions.allowMultiSelection) {
                    var oids = [], itemKey = "";
                    if (curOptions.isCompDict) {
                        $.error($.ygrid.formatString($.ygrid.compDictNotDataBinding, editOpt.key))
                    }
                    for (var i = 0, len = newValue.length; i < len; i++) {
                        oids.push(newValue[i].oid);
                        oids.push(",");
                    }
                    if (oids && oids.length > 0) {
                        oids.pop();
                        itemKey = newValue[0].itemKey;
                    }
                    table.setByKey(columnKey, oids.join(""));
                    if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        table.setByKey(columnKey + "ItemKey", itemKey);
                    }
                } else {
                    table.setByKey(columnKey, newValue.oid);
                    if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT || cellType == YIUI.CONTROLTYPE.COMPDICT ) {
                        table.setByKey(columnKey + "ItemKey", newValue.itemKey);
                    }
                }
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                var result = null;
                if( newValue ) {
                    var format = null;
                    if( curOptions.onlyDate ) {
                        format = 'yyyy-MM-dd';
                    } else {
                        format = 'yyyy-MM-dd HH:mm:ss';
                    }
                    result = newValue.Format(format);
                }
                table.setByKey(columnKey,result);
                break;
            default:
                var dataType = table.cols[table.indexByKey(columnKey)].type;
                table.setByKey(columnKey, YIUI.Handler.convertValue(newValue, dataType));
                break;
            }
            // 如果空值,清除TypeDefKey字段
            if( grid.isNullValue(newValue) ) {
                typeDefKey = null;
            }
            table.setByKey(columnKey + "TypeDefKey", typeDefKey);
        },

        setFixValueToDoc: function (form, grid, rowIndex, colIndex) {
            var editOpt = grid.getCellEditOpt(rowIndex,colIndex),
                cellData = grid.getCellDataAt(rowIndex,colIndex),
                doc = form.getDocument();
            if ( !doc ) {
                return;
            }
            var table = doc.getByKey(editOpt.tableKey);
            if ( !table ) {
                return;
            }
            var bkmkRow = cellData.bkmkRow;
            if( bkmkRow ) {
                table.setByBkmk(bkmkRow.getBookmark());
                this.setCellValueToDataTable(form, grid, table, editOpt, cellData);
            } else {
                this.flushFixCell(form, grid, editOpt, rowIndex, colIndex);
            }
        },

        flushFixCell: function (form, grid, metaCell, rowIndex, colIndex) {
            var doc = form.getDocument(),
                table = doc.getByKey(metaCell.tableKey);

            table.addRow(true); // 新增一行
            var bkmkRow = new YIUI.DetailRowBkmk(table.getBkmk());

            var dimValue = metaCell.dimValue;
            if( dimValue ) {
                var cellData = grid.getCellDataAt(rowIndex, colIndex),
                    node;
                for( var i = 0,length = dimValue.size();i < length;i++ ) {
                    node = dimValue.getValue(i);
                    table.setByKey(node.columnKey, YIUI.Handler.convertValue(node.value, node.dataType));
                }

                this.setCellValueToDataTable(form, grid, table, metaCell, cellData);

                cellData.bkmkRow = bkmkRow;
            } else {
                if (metaCell.isColExpand) {

                    var crossValue = metaCell.crossValue,
                        areaIndex = metaCell.columnArea,
                        node,
                        columnKey;

                    var expInfo = grid.expandModel[areaIndex];
                    for (var k = 0, length = crossValue.values.length; k < length; k++) {
                        node = crossValue.values[k];
                        columnKey = expInfo[k];
                        if( columnKey ) {
                            table.setByKey(columnKey, node.value);
                        }
                    }

                    // 循环行,填值
                    var row,
                        cellData;
                    for (var i = 0, size = grid.getRowCount(); i < size; i++) {
                        row = grid.getRowDataAt(i);
                        if (row.rowType !== 'Fix') {
                            break;
                        }

                        metaCell = grid.getCellEditOpt(i, colIndex);
                        cellData = row.data[colIndex];

                        if( metaCell.columnKey ) {
                            this.setCellValueToDataTable(form, grid, table, metaCell, cellData);
                            cellData.bkmkRow = bkmkRow;
                        }
                    }
                } else {
                    var cellData = grid.getCellDataAt(rowIndex, colIndex);

                    this.setCellValueToDataTable(form, grid, table, metaCell, cellData);

                    cellData.bkmkRow = bkmkRow;
                }
            }
        },

        selectRange: function (grid, start, end, ci, value) {
            var cell,
                row;
            for( var i = start;i < end;i++ ) {
                row = grid.getRowDataAt(i);
                cell = row.data[ci];
                if( row.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(row) || !cell[2] )
                    continue;
                grid.setValueAt(i,ci,value,true,true);
            }
        },

        selectSingle: function (grid, rowIndex, colIndex, value) {
            if( value ) {
                var row;
                for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                    row = grid.getRowDataAt(i);
                    if( i == rowIndex || row.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(row) )
                        continue;
                    grid.setValueAt(i,colIndex,false,true,true);
                }
                var form = YIUI.FormStack.getForm(grid.ofFormID);
                var doc = form.getDocument();
                var shadowTable = doc.getShadow(grid.tableKey);
                if ( shadowTable ) {
                    shadowTable.clear();
                }
            }
            grid.setValueAt(rowIndex,colIndex,value,true,true);
        },

        selectRow: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.getRowDataAt(rowIndex),
                tableKey = grid.tableKey,
                doc = form.getDocument(),
                dataTable = doc.getByKey(tableKey);

            var bkmk;
            if( row.bkmkRow ) {
                bkmk = row.bkmkRow.getBookmark();
            }
            if( bkmk == null ) {
                bkmk = row.bookmark;
            }

            if ( bkmk == undefined || !tableKey ) {
                return;
            }

            var selectKey = YIUI.SystemField.SELECT_FIELD_KEY,
                OIDKey = YIUI.SystemField.OID_SYS_KEY,
                dataType = dataTable.cols[dataTable.indexByKey(selectKey)].type;

            newValue = YIUI.TypeConvertor.toDataType(dataType, newValue);

            if (grid.hasColExpand) {
                for (var i = 0, len = row.bookmark.length; i < len; i++) {
                    dataTable.setByBkmk(row.bookmark[i]);
                    dataTable.setByKey(selectKey, newValue);
                }
            } else {
                if (grid.pageInfo.pageLoadType == YIUI.PageLoadType.DB) {
                    var shadowTable = doc.getShadow(tableKey);
                    if ( !shadowTable ) {
                        shadowTable = YIUI.DataUtil.newShadowDataTable(dataTable);
                        doc.addShadow(tableKey, shadowTable);
                    }
                    dataTable.setByBkmk(bkmk);
                    if (dataTable.getState() == DataDef.R_New)
                        return;
                    var curOID = dataTable.getByKey(OIDKey), primaryKeys;
                    if (curOID != null && curOID != undefined) {
                        primaryKeys = [OIDKey];
                    } else {
                        primaryKeys = grid.primaryKeys;
                    }
                    var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                    if (YIUI.TypeConvertor.toBoolean(newValue)) {
                        if (pos != -1) {
                            shadowTable.setPos(pos);
                        } else {
                            shadowTable.addRow();
                            for (var j = 0, clen = shadowTable.cols.length; j < clen; j++) {
                                shadowTable.set(j, dataTable.get(j));
                            }
                        }
                        shadowTable.setByKey(selectKey, newValue);
                        shadowTable.setState(dataTable.getState());
                    } else {
                        if (pos != -1) {
                            shadowTable.setState(DataDef.R_New);// 置为新增状态,直接删除
                            shadowTable.delRow(pos);
                        }
                    }
                } else {
                    dataTable.setByBkmk(bkmk);
                    dataTable.setByKey(selectKey, newValue);
                }
            }
        },
        setDtlValueToDoc: function (form, grid, rowIndex, colIndex) {
            var editOpt = grid.getCellEditOpt(rowIndex,colIndex),
                rowData = grid.getRowDataAt(rowIndex),
                cellData = rowData.data[colIndex],
                doc = form.getDocument(),
                sIndex = grid.selectFieldIndex;

            var newValue = cellData[0];

            if ( sIndex == colIndex && rowData.rowType === 'Detail' ) {
                this.selectRow(form, grid, rowIndex, colIndex, newValue);
            }

            if ( !doc || !editOpt.hasDB )
                return;

            var table = doc.getByKey(grid.tableKey);

            var bkmk;
            if( rowData.bkmkRow ) {
                bkmk = rowData.bkmkRow.getBookmark();
            }
            if( bkmk == null ) {
                bkmk = rowData.bookmark;
            }

            if( rowData.rowType === 'Detail' && bkmk == null ) {
                this.flushRow(form, grid, rowIndex);

                grid.loadSubDetail();

                this.dealWithSequence(form, grid, rowIndex);
            } else {
                if (grid.hasColExpand) {
                    if (editOpt.isColExpand) {
                       var  crossValue = editOpt.crossValue,
                            areaIndex = editOpt.columnArea;

                        var cellBkmk = rowData.bkmkRow.getAtArea(areaIndex,crossValue);

                        if ( !cellBkmk ) {
                            table.addRow(true);
                            rowData.cellBkmks[colIndex] = table.getBkmk();

                            cellBkmk = new YIUI.DetailRowBkmk(table.getBkmk());
                            rowData.bkmkRow.add(areaIndex,crossValue,cellBkmk);

                            // 扩展数据赋值
                            var expInfo = grid.expandModel[areaIndex],
                                node;
                            for (var k = 0, count = crossValue.values.length; k < count; k++) {
                                node = crossValue.values[k];

                                table.setByKey(expInfo[k], node.value);
                            }

                            // 刷入非拓展字段
                            var metaRow = grid.getMetaObj().rows[rowData.metaRowIndex];
                            for (var i = 0,size = metaRow.cells.length;i < size;i++) {//循环单元格
                                editOpt = metaRow.cells[i];
                                if ( !editOpt.isColExpand ) {
                                    this.setCellValueToDataTable(form, grid, table, editOpt, rowData.data[i]);
                                }
                            }
                        } else {
                            table.setByBkmk(cellBkmk.getBookmark());
                        }
                        this.setCellValueToDataTable(form, grid, table, editOpt, cellData);
                    } else {
                        for (var i = 0, len = rowData.bookmark.length; i < len; i++) {
                            table.setByBkmk(rowData.bookmark[i]);
                            this.setCellValueToDataTable(form, grid, table, editOpt, cellData);
                        }
                    }
                } else {
                    table.setByBkmk(bkmk);
                    this.setCellValueToDataTable(form, grid, table, editOpt, cellData);
                }
            }
            // 设置子明细头控件的值
            var coms = form.subDetailInfo[editOpt.key];
            if( coms ) {
                for (var i = 0, len = coms.length; i < len; i++) {
                    form.getComponent(coms[i]).setValue(newValue, true, true);
                }
            }

            // 设置影子表的值
            this.setValue2ShadowTable(form,grid,editOpt,table);
        },

        setValue2ShadowTable:function (form, grid, editOpt, dataTable) {
            var doc = form.getDocument(),
                shadowTable = doc.getShadow(grid.tableKey),
                columnKey = editOpt.columnKey;
            if( !shadowTable  || !editOpt.columnKey )
                return;

            var bookmark = YIUI.ViewUtil.findShadowBkmk(doc, grid.tableKey);
            if( bookmark == -1 )
                return;

            shadowTable.setByBkmk(bookmark);

            shadowTable.setByKey(columnKey,dataTable.getByKey(columnKey));

            // 是否有ItemKey列
            var itemKeyColumn = columnKey + "ItemKey";
            if( shadowTable.getColByKey(itemKeyColumn) ) {
                shadowTable.setByKey(itemKeyColumn, dataTable.get(itemKeyColumn));
            }

            // 是否有TypeDefKey列
            var typeDefKeyColumn = columnKey + "TypeDefKey";
            if( shadowTable.getColByKey(itemKeyColumn) ) {
                shadowTable.setByKey(typeDefKeyColumn, dataTable.getByKey(typeDefKeyColumn));
            }
        },

        // 获取拓展的维度数据对应的key
        crossValKey:function(metaCell){
            var key = [];
            key.push(metaCell.columnArea);
            var crossValue = metaCell.crossValue;
            if( crossValue ) {
                for( var i = 0;i < crossValue.values.length;i++ ) {
                    var node = crossValue.values[i];
                    key.push(node.columnKey,node.dataType,node.value);
                }
            }
            return key.join("_");
        },
        flushRow: function (form, grid, rowIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                table = form.getDocument().getByKey(grid.tableKey),
                rowBkmk,
                viewRow;
            if (grid.hasColExpand) {
                rowBkmk = [];
                viewRow = new YIUI.ExpandRowBkmk(grid.getColumnExpandModel().length);
                var cellData,
                    metaCell,
                    crossValue,
                    areaIndex;
                for (var i = 0, len = rowData.data.length; i < len; i++) {
                    cellData = rowData.data[i];
                    metaCell = metaRow.cells[i];
                    if (metaCell.isColExpand) {
                        crossValue = metaCell.crossValue;
                        areaIndex = metaCell.columnArea;

                        var detailViewRow = viewRow.getAtArea(areaIndex,crossValue);

                        if ( !detailViewRow ) {
                            table.addRow(true);
                            rowBkmk.push(table.getBkmk());
                            rowData.cellBkmks[i] = table.getBkmk();

                            detailViewRow = new YIUI.DetailRowBkmk(table.getBkmk());
                            viewRow.add(areaIndex,crossValue,detailViewRow);

                            //扩展数据赋值
                            var expInfo = grid.expandModel[areaIndex],
                                node,
                                expKey;
                            for (var k = 0, cLen = crossValue.values.length; k < cLen; k++) {
                                node = crossValue.values[k];
                                expKey = expInfo[k];
                                if (expKey !== undefined && expKey !== null && expKey.length > 0) {
                                    table.setByKey(expKey, node.value);
                                }
                            }
                        } else {
                            rowData.cellBkmks[i] = detailViewRow.getBookmark();
                        }
                        this.setCellValueToDataTable(form, grid, table, metaCell, cellData);
                    }
                }
                for (var m = 0, size = viewRow.size(); m < size; m++) {
                    table.setByBkmk(viewRow.getAt(m).getBookmark());
                    for (var n = 0, length = rowData.data.length; n < length; n++) {
                        metaCell = metaRow.cells[n];
                        if ( !metaCell.isColExpand ) {
                            this.setCellValueToDataTable(form, grid, table, metaCell, rowData.data[n]);
                        }
                    }
                }
            } else {
                table.addRow(true);
                rowBkmk = table.getBkmk();

                // 设置维度值
                var dimValue = metaRow.dimValue,dimNode;
                if( dimValue ) {
                    for( var l = 0,size = dimValue.size();l < size;l++ ) {
                        dimNode = dimValue.getValue(l);
                        table.setByKey(dimNode.getColumnKey(),YIUI.Handler.convertValue(dimNode.getValue(), dimNode.getDataType()));
                    }
                }

                for (var k = 0, len = rowData.data.length; k < len; k++) {
                    metaCell = metaRow.cells[k];
                    this.setCellValueToDataTable(form, grid, table, metaCell, rowData.data[k]);
                }
                viewRow = new YIUI.DetailRowBkmk(rowBkmk);
                if( grid.isSubDetail ) {
                    var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form,grid),
                        parentRow = parentGrid.dataModel.data[parentGrid.getFocusRowIndex()];
                    table.rows[table.pos].parentBkmk = parentRow.bookmark;
                }
            }
            rowData.bookmark = rowBkmk;
            rowData.bkmkRow = viewRow;
            return rowData;
        },

        showRowData:function (form,grid,table,rowIndex) {
            var value,
                rowData = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                columnKey;

            for (var i = 0,metaCell;metaCell = metaRow.cells[i]; i++) {
                columnKey = metaCell.columnKey;
                if( columnKey && table.getColByKey(columnKey) ) {
                    value = YIUI.UIUtil.getCompValue(metaCell, table);
                    grid.setValueAt(rowIndex, i, value, false, false, true);
                }
            }
        },

        showDetailRowData: function (form, grid, rowIndex) {
            var doc = form.getDocument();
            if (doc == null) return;
            var dataTable = doc.getByKey(grid.tableKey);
            if (dataTable == null) return;
            var rowData = grid.getRowDataAt(rowIndex), rowbkmk = rowData.bkmkRow, firstRow = rowbkmk, expandRowBkmk;
            if (rowbkmk instanceof YIUI.ExpandRowBkmk) {
                expandRowBkmk = rowbkmk;
                firstRow = rowbkmk.getAt(0);
            }

            var value,
                metaCell,
                cellData,
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex];

            for (var i = 0;metaCell = metaRow.cells[i]; i++) {

                cellData = rowData.data[i];

                // 这边统一刷新behavior,setValueAt处不刷新
                grid.refreshDynamicOpt(metaCell,cellData,rowIndex,i);

                if (metaCell.hasDB) {
                    if (metaCell.isColExpand) {
                        var detailRowBkmk = expandRowBkmk.getAtArea(metaCell.columnArea, metaCell.crossValue);
                        if (detailRowBkmk != null) {
                            rowData.cellBkmks[i] = detailRowBkmk.getBookmark();
                            dataTable.setByBkmk(detailRowBkmk.getBookmark());
                            value = YIUI.UIUtil.getCompValue(metaCell, dataTable);

                            grid.setValueAt(rowIndex, i, value, false, false, true);
                        }
                    } else {
                        dataTable.setByBkmk(firstRow.getBookmark());
                        value = YIUI.UIUtil.getCompValue(metaCell, dataTable);

                        grid.setValueAt(rowIndex, i, value, false, false, true);
                    }
                } else if (metaCell.isSelect) {

                    dataTable.setByBkmk(firstRow.getBookmark());

                    if(grid.pageInfo.pageLoadType == YIUI.PageLoadType.DB){
                        if( YIUI.ViewUtil.findShadowBkmk(doc, grid.tableKey) != -1 ) {
                            grid.setValueAt(rowIndex, i, true, false, false, true);
                        }
                    } else {
                        grid.setValueAt(rowIndex, i, dataTable.getByKey(YIUI.SystemField.SELECT_FIELD_KEY), false, false, true);
                    }

                } else if (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK) {

                    grid.setCaptionAt(rowIndex, i, cellData[1]);
                }
            }
        },

        showFixRowData: function (form,grid,rowIndex) {
            var document = form.getDocument(),
                table,
                dimValue,
                value;

            var rowData = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                metaCell,
                cellData;

            for (var i = 0;metaCell = metaRow.cells[i]; i++) {
                cellData = rowData.data[i];
                if( metaCell.columnKey && metaCell.tableKey ) {
                    var tableKey = metaCell.tableKey;
                    table = document.getByKey(tableKey);
                    dimValue = metaCell.dimValue;
                    if( dimValue ) {
                        var bkmk = YIUI.DataUtil.locate(table,dimValue);
                        if( bkmk != -1 ) {
                            value = YIUI.UIUtil.getCompValue(metaCell, table);
                            grid.setValueAt(rowIndex, i, value, false, false, true);
                            cellData.bkmkRow = new YIUI.DetailRowBkmk(bkmk);
                        }
                    } else {
                        if( metaCell.isColExpand ) {
                             var rowMap = grid.dataModel.rowMap[tableKey];
                             var bkmkRow = rowMap.get(metaCell.crossValue);
                             if( bkmkRow ) {
                                 table.setByBkmk(bkmkRow.getBookmark());
                                 value = YIUI.UIUtil.getCompValue(metaCell, table);
                                 grid.setValueAt(rowIndex, i, value, false, false, true);
                                 cellData.bkmkRow = bkmkRow;
                             }
                        } else {
                            if( table.first() ) {
                                value = YIUI.UIUtil.getCompValue(metaCell, table);
                                grid.setValueAt(rowIndex, i, value, false, false, true);
                                cellData.bkmkRow = new YIUI.DetailRowBkmk(table.getBkmk());
                            }
                        }
                    }
                } else {
                    // 如果没有数据绑定,没有值,只有caption
                    //grid.setValueAt(rowIndex, i, cellData[1], false, false, true);
                }
            }
        },

        copyRow: function (form, grid, rowIndex, excludeKeys, excludeValues) {
            var dataTable = form.getDocument().getByKey(grid.tableKey),
                newRowIndex = rowIndex + 1;
            if (dataTable == undefined)
                return -1;
            var row = grid.getRowDataAt(rowIndex);
            if (row.isDetail && row.bookmark == undefined)
                return -1;
            grid.insertRow(newRowIndex,true);

            this.flushRow(form, grid, newRowIndex);

            var values = [], value;
            dataTable.setByBkmk(row.bookmark);
            var parentBkmk = dataTable.getParentBkmk();
            for (var i = 0, len = dataTable.cols.length; i < len; i++) {
                values.push(dataTable.get(i));
            }
            var newRow = grid.getRowDataAt(newRowIndex);
            dataTable.setByBkmk(newRow.bookmark);

            // 如果是子明细
            if( grid.isSubDetail ) {
                dataTable.setParentBkmk(parentBkmk);
            }
            var columnInfo;
            for (var ci = 0, length = dataTable.cols.length; ci < length; ci++) {
                columnInfo = dataTable.cols[ci];
                if( YIUI.SystemField.OID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.VERID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.DVERID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.SEQUENCE_FIELD_KEY == columnInfo.key )
                    continue;
                if (excludeKeys.indexOf(columnInfo.key) >= 0) {
                    var dataType = dataTable.cols[dataTable.indexByKey(columnInfo.key)].type;
                    dataTable.set(ci, YIUI.Handler.convertValue(excludeValues[excludeKeys.indexOf(columnInfo.key)], dataType));
                } else {
                    dataTable.set(ci, values[ci]);
                }
            }
            this.showDetailRowData(form, grid,newRowIndex);
            // 同FX,不计算,只是copy数据
           // form.getUIProcess().doPostInsertRow(grid,newRowIndex,false);
            this.dealWithSequence(form, grid, newRowIndex);
            return newRowIndex;
        },
        /**
         *处理表格值变化时需要发生的相关事件
         */
        fireEvent: function (form, grid, rowIndex, colIndex) {

            var editOpt = grid.getCellEditOpt(rowIndex,colIndex);

            // 触发事件
            form.getViewDataMonitor().fireCellValueChanged(grid, rowIndex, colIndex, editOpt.key);

            // 非明细,不需要新增行或者分组
            var rowData = grid.getRowDataAt(rowIndex);
            if( rowData.rowType != 'Detail' ) {
                return;
            }

            if ( (grid.isEnable() && grid.newEmptyRow && editOpt.columnKey) || grid.condition ) {

                grid.appendEmptyRow(rowIndex);

                if( rowData.inAutoGroup ) {
                    rowData.inAutoGroup = false;
                    for (var i = rowIndex - 1; i >= 0; i--) {
                        var pRow = grid.dataModel.data[i];
                        if (!pRow.inAutoGroup) break;
                        pRow.inAutoGroup = false;
                    }
                    for (var k = rowIndex + 1, len = grid.dataModel.data.length; k < len; k++) {
                        var nRow = grid.dataModel.data[k];
                        if (!nRow.inAutoGroup) break;
                        nRow.inAutoGroup = false;
                    }
                    grid.appendEmptyGroup();
                }
            }
        },

        exchangeRowSequence: function (grid, rowIndex, anotherIndex) {

            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID);

            var SYS_SEQUENCE = YIUI.SystemField.SEQUENCE_FIELD_KEY;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var seqIndex = dataTable.indexByKey(SYS_SEQUENCE);
            if (seqIndex == -1) {
                return;
            }

            var row = grid.dataModel.data[rowIndex];
            var bkmk = row.bookmark;

            if (grid.hasColExpand) {
                dataTable.setByBkmk(bkmk[0]);
                var seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                var anotherRow = grid.dataModel.data[anotherIndex];
                var anotherBkmk = anotherRow.bookmark;
                dataTable.setByBkmk(anotherBkmk[0]);
                var anotherSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                for (var j = 0, jlen = anotherBkmk.length; j < jlen; j++) {
                    dataTable.setByBkmk(anotherBkmk[j]);
                    dataTable.setByKey(SYS_SEQUENCE, seq);
                }
                dataTable.setByBkmk(bkmk[0]);
                for (var j = 0, jlen = anotherBkmk.length; j < jlen; j++) {
                    dataTable.setByBkmk(bkmk[j]);
                    dataTable.setByKey(SYS_SEQUENCE, anotherSeq);
                }

            } else {
                dataTable.setByBkmk(bkmk);
                var seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                var anotherRow = grid.dataModel.data[anotherIndex];
                dataTable.setByBkmk(anotherRow.bookmark);
                var anotherSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                dataTable.setByKey(SYS_SEQUENCE, seq);
                dataTable.setByBkmk(bkmk);
                dataTable.setByKey(SYS_SEQUENCE, anotherSeq);
            }
        },

        dealWithSequence: function (form, grid, rowIndex) {
            var SYS_SEQUENCE = YIUI.SystemField.SEQUENCE_FIELD_KEY;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var seqIndex = dataTable.indexByKey(SYS_SEQUENCE);
            if (seqIndex == -1) {
                return;
            }
            var row, bkmk, seq, curSeq = 0;
            for ( var i = rowIndex -1; i >= 0; --i) {
                row = grid.dataModel.data[i];

                if (!row.isDetail || row.bookmark == undefined) continue;

                bkmk = row.bookmark;
                if (grid.hasColExpand) {
                    dataTable.setByBkmk(bkmk[0]);
                } else {
                    dataTable.setByBkmk(bkmk);
                }
                curSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                break;
            }
            if (grid.getMetaObj().serialSeq) {
                for ( var i = rowIndex,len = grid.dataModel.data.length; i < len; i++){
                    row = grid.dataModel.data[i];
                    if (!row.isDetail || row.bookmark == undefined) continue;
                    bkmk = row.bookmark;
                    if (grid.hasColExpand) {
                        dataTable.setByBkmk(bkmk[0]);
                        seq = ++curSeq;
                        for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                            dataTable.setByBkmk(bkmk[j]);
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        }
                    } else {
                        dataTable.setByBkmk(bkmk);
                        dataTable.setByKey(SYS_SEQUENCE, ++curSeq);
                    }
                }
            } else {
                for (var i = rowIndex, len = grid.dataModel.data.length; i < len; i++) {
                    row = grid.dataModel.data[i];
                    if (!row.isDetail || row.bookmark == undefined) continue;
                    bkmk = row.bookmark;
                    if (grid.hasColExpand) {
                        dataTable.setByBkmk(bkmk[0]);
                        seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                        if (seq == undefined || seq == null || seq <= curSeq) {
                            seq = curSeq + 1;
                            for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                                dataTable.setByBkmk(bkmk[j]);
                                dataTable.setByKey(SYS_SEQUENCE, seq);
                            }
                        } else {
                            break;
                        }
                    } else {
                        dataTable.setByBkmk(bkmk);
                        seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                        if (seq == undefined || seq == null || seq <= curSeq) {
                            seq = curSeq + 1;
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        } else {
                            break;
                        }
                    }
                    curSeq = seq;
                }
            }
        },
        dependedValueChange: function (grid, target, depend, value) {
            var form = YIUI.FormStack.getForm(grid.ofFormID),
                loc = form.getCellLocation(target);
            if( loc ) {
                if ( grid.treeIndex == loc.column ) {
                    grid.load(true);
                } else {
                    if (loc.row == null || loc.row == -1) {
                        for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                            var row = grid.getRowDataAt(i);
                            if (row.rowType == 'Detail' && row.bookmark != null) {
                                this.dependedValueChanged(grid, i, target, value);
                            }
                        }
                    } else {
                        this.dependedValueChanged(grid, loc.row, target, value);
                    }
                }
            } else {
                if( grid.key === target ) {
                    grid.load(true);
                }
            }
        },
        doPostCellValueChanged: function (grid, rowIndex, depend, target, value) {
            var form = YIUI.FormStack.getForm(grid.ofFormID),
                comp = form.getComponent(target);
            if (comp != null) {
                comp.dependedValueChange(depend);
            } else {
                this.dependedValueChanged(grid, rowIndex, target, value);
            }
        },
        dependedValueChanged: function (grid, rowIndex, target, value) {
            var form = YIUI.FormStack.getForm(grid.ofFormID),
                loc = form.getCellLocation(target);

            if( loc.expand ) {
                var columns = loc.columns;
                for (var i = 0;i < columns.length; i++) {
                    grid.setValueAt(rowIndex, columns[i], value, true, true);
                }
            } else {
                grid.setValueAt(rowIndex, loc.column, value, true, true);
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();