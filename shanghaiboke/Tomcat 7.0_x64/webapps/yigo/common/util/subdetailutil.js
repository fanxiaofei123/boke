YIUI.SubDetailUtil = (function () {
    var Return = {
        isSubDetail: function (form, comp, gridKey) {
            if (comp.getMetaObj().parentGridKey != null) {
                if (comp.getMetaObj().parentGridKey != gridKey) {
                    return Return.isSubDetail(form, Return.getBindingGrid(form, comp), gridKey);
                } else {
                    return true;
                }
            }
            return false;
        },
        getBindingGrid: function (form, subDetailComp) {
            var parentGridKey = subDetailComp.getMetaObj().parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            return form.getComponent(grid.key);
        },
        getBindingCellData: function (form, subDetailComp) {
            var bindingCellKey = subDetailComp.getMetaObj().bindingCellKey,
                parentGridKey = subDetailComp.getMetaObj().parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            grid = form.getComponent(grid.key);
            var rowIndex = grid.getFocusRowIndex();
            if (rowIndex == -1 || bindingCellKey == null || bindingCellKey == "")
                return null;
            return grid.getCellDataByKey(rowIndex, bindingCellKey);
        },
        getBindingCellError: function (form, subDetailComp) {
            var bindingCellKey = subDetailComp.getMetaObj().bindingCellKey,
                parentGridKey = subDetailComp.getMetaObj().parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            grid = form.getComponent(grid.key);
            var rowIndex = grid.getFocusRowIndex();
            if (rowIndex == -1 || bindingCellKey == null || bindingCellKey == "")
                return null;
            for (var i = 0, len = grid.errorInfoes.cells.length; i < len; i++) {
                var cellInfo = grid.errorInfoes.cells[i];
                if (cellInfo.rowIndex == rowIndex && cellInfo.colIndex == grid.getCellIndexByKey(bindingCellKey)) {
                    return cellInfo;
                }
            }
        },
        showSubDetailData: function (grid, rowIndex) {
            var begin = new Date().getTime(), rowData = grid.getRowDataAt(rowIndex);
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            this.clearSubDetailData(form, grid);
            if (rowData == null || (rowData.isDetail && rowData.bookmark == null)) return;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var row = grid.dataModel.data[rowIndex], value, OID = -1, compList, comp, ubookmark, compTable;
            if (row.isDetail && !grid.hasColExpand) {
                if (row.bookmark != null) {
                    dataTable.setByBkmk(row.bookmark);
                    OID = dataTable.getByKey("oid");
                } else {
                    dataTable.beforeFirst();
                }
                compList = form.subDetailInfo[grid.key].compList;
                for (var i = 0, len = compList.length; i < len; i++) {
                    comp = form.getComponent(compList[i]);
                    if (comp instanceof  YIUI.Control.Grid) {
                        compTable = form.getDocument().getByKey(comp.tableKey);
                        comp.dataModel.data = [];
                        var info = form.subDetailInfo[grid.key].info, dtrIndex = comp.metaRowInfo.dtlRowIndex, metaRow;
                        var addNewRow = function (isDetail, metaRow, bookmark, parentBkmk, cellKeys, data) {
                            var newRowIndex = data.length, rowTable, tableKey;
                            var newRow = {};
                            newRow.isDetail = isDetail;
                            newRow.isEditable = (metaRow.rowType == "Detail" || metaRow.rowType == "Fix");
                            newRow.rowID = comp.randID();
                            newRow.bookmark = bookmark;
                            newRow.parentBkmk = parentBkmk;
                            newRow.cellKeys = cellKeys;
                            newRow.rowHeight = metaRow.rowHeight;
                            newRow.metaRowIndex = comp.metaRowInfo.rows.indexOf(metaRow);
                            newRow.rowType = metaRow.rowType;
                            newRow.data = [];
                            data.push(newRow);
                            for (var j = 0, clen = comp.dataModel.colModel.columns.length; j < clen; j++) {
                                var editOpt = comp.dataModel.colModel.cells[cellKeys[j]];
                                if (editOpt !== undefined) {
                                    if (bookmark == undefined) {
                                        tableKey = (editOpt.tableKey == undefined ? metaRow.tableKey : editOpt.tableKey );
                                        rowTable = form.getDocument().getByKey(tableKey);
                                        if (rowTable !== undefined && rowTable !== null) {
                                            rowTable.first();
                                            value = (editOpt.columnKey == undefined ? null : rowTable.getByKey(editOpt.columnKey));
                                        }
                                    } else {
                                        value = (editOpt.columnKey == undefined ? null : compTable.getByKey(editOpt.columnKey));
                                    }
                                    var defaultFV = metaRow.cells[j].defaultFormulaValue,
                                        defaultV = metaRow.cells[j].defaultValue;
                                    if (editOpt !== undefined && value == null
                                        && (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink")) {
                                        value = (metaRow.cells[j].caption == undefined ? "" : metaRow.cells[j].caption);
                                    }
                                    if (value == null && defaultFV !== undefined && defaultFV !== null && defaultFV.length > 0) {
                                        value = form.eval(defaultFV, {form: form, rowIndex: newRowIndex}, null);
                                    }
                                    if (value == null && defaultV !== undefined && defaultV !== null && defaultV.length > 0) {
                                        value = defaultV;
                                    }
                                } else {
                                    value = (metaRow.cells[j].caption == undefined ? "" : metaRow.cells[j].caption);
                                }
                                value = comp.getCellNeedValue(newRowIndex, j, value, true);
                                newRow.data.push(value);
                                value = null;
                            }
                        };
                        for (var j = 0; j < dtrIndex; j++) {
                            metaRow = comp.metaRowInfo.rows[j];
                            addNewRow(false, metaRow, ubookmark, dataTable.getBkmk(), metaRow.cellKeys, comp.dataModel.data);
                        }
                        compTable.beforeFirst();
                        while (compTable.next()) {
                            if (compTable.rows[compTable.pos].state == DataDef.R_Deleted) continue;
                            var inGrid = false;
                            if (info.linkType === 1) {
                                if ((row.bookmark != null && compTable.getParentBkmk() === row.bookmark)
                                    || (compTable.getByKey("POID") === OID && OID > 0)) {
                                    inGrid = true;
                                }
                            } else if (info.linkType == 2) {
                                inGrid = true;
                                var sourceFields = info.sourceFields, targetFields = info.targetFields, srcField, tgtField;
                                for (var k = 0, slen = sourceFields.length; k < slen; k++) {
                                    srcField = sourceFields[k];
                                    tgtField = targetFields[k];
                                    var dataType = dataTable.cols[dataTable.indexByKey(srcField)].type;
                                    var dV = YIUI.Handler.convertValue(dataTable.getByKey(srcField), dataType),
                                        compDV = YIUI.Handler.convertValue(compTable.getByKey(tgtField), dataType);
                                    if (dV instanceof Decimal && compDV instanceof Decimal) {
                                        if (!dV.equals(compDV)) {
                                            inGrid = false;
                                            break;
                                        }
                                    } else if (dV !== compDV) {
                                        inGrid = false;
                                        break;
                                    }
                                }
                            }
                            if (inGrid) {
                                metaRow = comp.metaRowInfo.rows[dtrIndex];
                                addNewRow(true, metaRow, compTable.getBkmk(), dataTable.getBkmk(), metaRow.cellKeys, comp.dataModel.data);
                                inGrid = false;
                            }
                        }
                        for (var m = dtrIndex + 1, length = comp.metaRowInfo.rows.length; m < length; m++) {
                            metaRow = comp.metaRowInfo.rows[m];
                            addNewRow(false, metaRow, ubookmark, dataTable.getBkmk(), metaRow.cellKeys, comp.dataModel.data);
                        }
                        comp.refreshGrid();
                        if (comp.isEnable() && !comp.hasAutoRow() && comp.treeType === -1 && !comp.hasRowExpand) {
                            if (comp.hasGroupRow) {
                                comp.appendAutoRowAndGroup();
                            } else {
                                comp.addGridRow();
                            }
                        } else if (!comp.isEnable() && comp.treeType === -1) {
                            comp.removeAutoRowAndGroup();
                        }
                    } else {
                        if (comp.metaObj.bindingCellKey && comp.metaObj.bindingCellKey.length > 0) {
                            var colInfoes = grid.getColInfoByKey(comp.metaObj.bindingCellKey);
                            if (colInfoes !== null) {
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    value = row.data[colInfoes[ci].colIndex][0];
                                    if (comp.type == YIUI.CONTROLTYPE.DICT && value != null && typeof value == 'string') {
                                        value = JSON.parse(value);
                                    }
                                    comp.setValue(value, false, false);
                                }
                            }
                        } else if (comp.tableKey && comp.tableKey.length > 0 && comp.columnKey && comp.columnKey.length > 0) {
                            if (comp.tableKey == grid.tableKey) {
                                if (dataTable.pos >= 0) {
                                    value = dataTable.getByKey(comp.columnKey);
                                    comp.setValue(value, false, false);
                                }
                            } else {
                                compTable = form.getDocument().getByKey(comp.tableKey);
                                compTable.first();
                                value = compTable.getByKey(comp.columnKey);
                                comp.setValue(value, false, false);
                            }
                        }
                    }
                }
                form.getUIProcess().calcSubDetail(grid.key);
            }
            var end = new Date().getTime();
            console.log("showSubDetail Cost: " + (end - begin) + " ms");
        },
        clearSubDetailData: function (form, parentGrid) {
            var subDetailInfo = form.subDetailInfo[parentGrid.key];
            if (subDetailInfo == undefined) return;
            var compList = subDetailInfo.compList, subComp;
            for (var i = 0, len = compList.length; i < len; i++) {
                subComp = form.getComponent(compList[i]);
                if (subComp instanceof  YIUI.Control.Grid) {
                    subComp.dataModel.data = [];
                    subComp.errorInfoes.cells = [];
                    subComp.errorInfoes.rows = [];
                    subComp.el.clearGridData();
                    this.clearSubDetailData(form, subComp);
                } else {
                    if (subComp.needClean()) {
                        subComp.setValue(null, false, false);
                        subComp.setRequired(false);
                        subComp.setError(false, "");
                    }
                }
            }
        }
    };
    return Return;
})();