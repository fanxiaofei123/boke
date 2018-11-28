(function () {
    YIUI.GridRowGroup = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        group: function () {
            this.grid.dataModel.rowMap = {};
            var tableKeys = this.grid.dataModel.tableKeys;
            for( var i = 0,length = tableKeys.length;i < length;i++ ) {
                this.grid.dataModel.rowMap[tableKeys[i]] = this.buildRowMap(tableKeys[i]);
            }
            var detailRow = this.grid.getDetailMetaRow();
            if( detailRow == null ) {
                return;
            }

            var rootBkmk;
            if( this.grid.multiple ) {
                rootBkmk = this.buildMultipleGridRowData();
            } else {
                rootBkmk = this.buildNormalGridRowData(this.sortData());
            }

            this.grid.dataModel.rootBkmk = rootBkmk;
        },
        buildMultipleGridRowData: function () {
            var doc = this.form.getDocument(),
                table = doc.getByKey(this.grid.tableKey),
                rootBkmk = new YIUI.MultiRowBkmk();
            if( !table ) {
                return rootBkmk;
            }

            var primaryKeys = YIUI.DataUtil.getPrimaryKeys(table);
            var dimValue;
            table.beforeFirst();
            while( table.next() ) {
                dimValue = YIUI.DataUtil.makeDimValue(table,primaryKeys);

                var rowBkmk = new YIUI.DetailRowBkmk(table.getBkmk());
                rootBkmk.put(dimValue,rowBkmk);
            }
            return rootBkmk;
        },
        buildRowMap: function (tableKey) {

            var doc = this.form.getDocument(),
                table = doc.getByKey(tableKey),
                column;

            var primaryKeys = YIUI.DataUtil.getPrimaryKeys(table),
                indexes = [],
                types = [];

            YIUI.DataUtil.getIndexesAndTypes(table,primaryKeys,indexes,types);

            var rowMap = new YIUI.RowMap(),
                rowBkmk,
                multiKey;

            table.beforeFirst();
            while( table.next() ) {
                multiKey = YIUI.DataUtil.makeMultiKey(table, indexes, types);
                rowBkmk = new YIUI.DetailRowBkmk(table.getBkmk());
                rowMap.put(multiKey,rowBkmk);
            }
            return rowMap;
        },
        buildNormalGridRowData: function (data) {
            var root = new YIUI.GroupRowBkmk(), rowLayer = this.grid.getMetaObj().rowLayer;
            var table = this.form.getDocument().getByKey(this.grid.tableKey);
            if (table == null) return root;
            var needGroupColumnKeys = this.getGroupCellColumnKeys();
            var primaryKeys = YIUI.DataUtil.getPrimaryKeys(table),
                primaryIndexes = [],
                primaryTypes = [];

            // 业务主键与行映射集合
            var rowMap = null;
            if( primaryKeys.length > 0 ) {
                rowMap = new YIUI.RowMap();
                this.grid.dataModel.rowMap[this.grid.tableKey] = rowMap;
            }

            YIUI.DataUtil.getIndexesAndTypes(table,primaryKeys,primaryIndexes,primaryTypes);

            var getRootGroup = function (rowLayer) {
                for (var l = 0, lLen = rowLayer.objectArray.length; l < lLen; l++) {
                    var obj = rowLayer.objectArray[l];
                    if (obj.objectType == YIUI.MetaGridRowObjectType.AREA) {
                        for (var n = 0, nlen = obj.objectArray.length; n < nlen; n++) {
                            var subObj = obj.objectArray[n];
                            if (subObj.objectType == YIUI.MetaGridRowObjectType.GROUP) {
                                return subObj;
                            }
                        }
                    }
                }
                return null;
            };
            var getRowArea = function (rowLayer) {
                for (var l = 0, lLen = rowLayer.objectArray.length; l < lLen; l++) {
                    var obj = rowLayer.objectArray[l];
                    if (obj.objectType == YIUI.MetaGridRowObjectType.AREA) {
                        return obj;
                    }
                }
                return null;
            };
            var getGroupInArea = function (area, index) {
                var i = 0, groupList = [];
                var getAllGroup = function (objectArray, groupList) {
                    if (objectArray == null) return;
                    for (var i = 0, len = objectArray.length; i < len; i++) {
                        var obj = objectArray[i];
                        if (obj.objectType == YIUI.MetaGridRowObjectType.GROUP) {
                            groupList.push(obj);
                        }
                        getAllGroup(obj.objectArray, groupList);
                    }
                };
                getAllGroup(area.objectArray, groupList);
                for (var l = 0, lLen = groupList.length; l < lLen; l++) {
                    var obj = groupList[l];
                    obj.leaf = (l == groupList.length - 1);
                }
                return groupList[index];
            };
            var tempColumnExpandIndexes = [], tempExpandDataType = [], columnExpandIndexes = [], expandDataType = [];
            var expandCount = 0;
            if (this.grid.hasColExpand) {
                var expandModel = this.grid.getColumnExpandModel();
                for (var j = 0, jLen = expandModel.length; j < jLen; j++) {
                    var expandColumnKeys = expandModel[j];
                    tempColumnExpandIndexes = [];
                    tempExpandDataType = [];
                    YIUI.DataUtil.getIndexesAndTypes(table, expandColumnKeys, tempColumnExpandIndexes, tempExpandDataType);
                    columnExpandIndexes.push(tempColumnExpandIndexes);
                    expandDataType.push(tempExpandDataType);
                }
                expandCount = expandModel.length;
            }
            var expandRowMap = new YIUI.RowMap(), viewGroupGridDataRow = new Array(needGroupColumnKeys.length),
                tempGroupDataMaps = new Array(needGroupColumnKeys.length);
            for (var m = 0, mLen = needGroupColumnKeys.length; m < mLen; m++) {
                tempGroupDataMaps[m] = new YIUI.RowMap();
            }
            var tempGroupKeyIndexes = [], tempGroupKeyDataType = [];
            YIUI.DataUtil.getIndexesAndTypes(table, needGroupColumnKeys, tempGroupKeyIndexes, tempGroupKeyDataType);
            var groupRow = null, rootGroup = getRootGroup(rowLayer), rowArea = getRowArea(rowLayer);
            if (needGroupColumnKeys == null || needGroupColumnKeys.length == 0) {
                groupRow = new YIUI.GroupRowBkmk();
                groupRow.setMetaGroup(rootGroup);
                groupRow.setLeaf(true);
                root.addRow(groupRow);
            }
            for (var h = 0, hLen = data.length; h < hLen; h++) {
                var index = data[h];
                table.setByBkmk(index);
                var detailGridRow = new YIUI.DetailRowBkmk();
                detailGridRow.setBookmark(table.getBkmk());
                if (needGroupColumnKeys != null && needGroupColumnKeys.length > 0) {
                    var groupKeyValue = new YIUI.MultiKey();
                    for (var f = 0, fLen = needGroupColumnKeys.length; f < fLen; f++) {
                        groupKeyValue = groupKeyValue.shallowClone();
                        groupKeyValue.addValue(new YIUI.MultiKeyNode(tempGroupKeyDataType[f], table.get(tempGroupKeyIndexes[f])));
                        var map = tempGroupDataMaps[f];
                        groupRow = map.get(groupKeyValue);
                        if (groupRow == null) {
                            groupRow = new YIUI.GroupRowBkmk();
                            if (f == needGroupColumnKeys.length - 1) {
                                groupRow.setLeaf(true);
                            }
                            groupRow.setMetaGroup(getGroupInArea(rowArea, f));
                            map.put(groupKeyValue, groupRow);
                            if (f == 0) {
                                root.addRow(groupRow);
                            }
                            if (f != 0) {
                                viewGroupGridDataRow[f - 1].addRow(groupRow);
                            }
                            if (this.grid.hasColExpand && f == needGroupColumnKeys.length - 1) {
                                expandRowMap = new YIUI.RowMap();
                            }
                        }
                        viewGroupGridDataRow[f] = groupRow;
                    }
                }
                if (this.grid.hasColExpand) {
                    var multiKey = YIUI.DataUtil.makeMultiKey(table, primaryIndexes, primaryTypes);
                    var expandRow = expandRowMap.get(multiKey);
                    if (expandRow == null) {
                        expandRow = new YIUI.ExpandRowBkmk(expandCount);
                        expandRowMap.put(multiKey, expandRow);
                        rowMap.put(multiKey, expandRow);
                        groupRow.addRow(expandRow);
                    }
                    for (var g = 0; g < expandCount; g++) {
                        tempColumnExpandIndexes = columnExpandIndexes[g];
                        tempExpandDataType = expandDataType[g];
                        var key = YIUI.DataUtil.makeMultiKey(table, tempColumnExpandIndexes, tempExpandDataType);
                        expandRow.add(g, key, detailGridRow);
                    }
                } else {
                    groupRow.addRow(detailGridRow);
                    if( rowMap ) {
                        var multiKey = YIUI.DataUtil.makeMultiKey(table, primaryIndexes, primaryTypes);
                        rowMap.put(multiKey,detailGridRow);
                    }
                }
            }
            return root;
        },
        sortData: function () {
            var groupColumnKeyList = this.getGroupCellColumnKeys();
            var table = this.form.getDocument().getByKey(this.grid.tableKey);
            var data = [];
            if (table == null) return data;
            table.beforeFirst();
            while (table.next()) {
                data.push(table.getBkmk());
            }
            if (groupColumnKeyList != null && groupColumnKeyList.length > 0) {
                var tableSort = new YIUI.DataTableGroupSort(table, groupColumnKeyList, data);
                tableSort.sort();
            }
            return data;
        },
        getGroupCellColumnKeys: function () {
            var groupColumnKeys = [], dtlIndex = this.grid.getMetaObj().detailMetaRowIndex,
                dtlMetaRow = this.grid.getMetaObj().rows[dtlIndex];
            for (var i = 0, len = dtlMetaRow.cells.length; i < len; i++) {
                var metaCell = dtlMetaRow.cells[i];
                if (this.grid.getMetaObj().groupCells.indexOf(metaCell.key) >= 0) {
                    if (metaCell.columnKey != null && metaCell.columnKey.length > 0) {
                        groupColumnKeys.push(metaCell.columnKey);
                    }
                }
            }
            return groupColumnKeys;
        }
    });
    YIUI.RowMap = YIUI.extend({
        map: null,
        init: function () {
            this.map = [];
        },
        put: function (key, rowBkmk) {
            var isMatch = false;
            for (var i = 0, len = this.map.length; i < len; i++) {
                if (this.map[i].key.equals(key)) {
                    this.map[i].row = rowBkmk;
                    isMatch = true;
                    break;
                }
            }
            if (!isMatch) {
                this.map.push({key: key, row: rowBkmk});
            }
        },
        get: function (key) {
            for (var i = 0, len = this.map.length; i < len; i++) {
                if (this.map[i].key.equals(key)) {
                    return this.map[i].row;
                }
            }
            return null;
        },
        getAt: function (index) {
            return this.map[index];
        },
        size: function () {
            return this.map.length;
        }
    });
    YIUI.DataTableGroupSort = YIUI.extend({
        table: null,
        groupKeys: null,
        tempArray: null,
        init: function (table, groupKeys, tempArray) {
            this.table = table;
            this.groupKeys = groupKeys;
            this.tempArray = tempArray;
        },
        sort: function () {
            var self = this;
            var sortTable = function (bkmk1, bkmk2) {
                var result = 0, key, value1, value2;
                for (var i = 0, len = self.groupKeys.length; i < len; i++) {
                    key = self.groupKeys[i];
                    self.table.setByBkmk(bkmk1);
                    value1 = self.table.getByKey(key);
                    self.table.setByBkmk(bkmk2);
                    value2 = self.table.getByKey(key);
                    var colInfo = self.table.getColByKey(key);
                    switch (colInfo.type) {
                        case YIUI.DataType.INT:
                        case YIUI.DataType.DOUBLE:
                        case YIUI.DataType.NUMERIC:
                        case YIUI.DataType.LONG:
                        case YIUI.DataType.FLOAT:
                            var n1 = YIUI.TypeConvertor.toDecimal(value1), n2 = YIUI.TypeConvertor.toDecimal(value2);
                            result = n1.comparedTo(n2);
                            break;
                        case YIUI.DataType.STRING:
                        case YIUI.DataType.TEXT:
                        case YIUI.DataType.FIXED_STRING:
                            result = value1.localeCompare(value2);
                            break;
                        case YIUI.DataType.DATE:
                        case YIUI.DataType.DATETIME:
                            var d1 = YIUI.TypeConvertor.toDate(value1), d2 = YIUI.TypeConvertor.toDate(value2);
                            result = d1.getTime() - d2.getTime();
                            break;
                        case YIUI.DataType.BOOLEAN:
                            var b1 = YIUI.TypeConvertor.toBoolean(value1), b2 = YIUI.TypeConvertor.toBoolean(value2);
                            if (b1 == true && b2 == false) {
                                result = 1;
                            } else if (b1 == false && b2 == true) {
                                result = -1;
                            }
                            break;
                    }
                    if (result != 0) {
                        break;
                    }
                }
                return result;
            };
            this.tempArray.sort(sortTable);
        }
    });
})();