YIUI.DataUtil = (function () {
    var Return = {
        dataType2JavaDataType: function (dataType) {
            switch (dataType) {
                case YIUI.DataType.LONG:
                    return YIUI.JavaDataType.USER_LONG;
                case YIUI.DataType.BINARY:
                    return YIUI.JavaDataType.USER_BINARY;
                case YIUI.DataType.BOOLEAN:
                    return YIUI.JavaDataType.USER_BOOLEAN;
                case YIUI.DataType.DATE:
                case YIUI.DataType.DATETIME:
                    return YIUI.JavaDataType.USER_DATETIME;
                case YIUI.DataType.DOUBLE:
                case YIUI.DataType.FLOAT:
                case YIUI.DataType.NUMERIC:
                    return YIUI.JavaDataType.USER_NUMERIC;
                case YIUI.DataType.INT:
                    return YIUI.JavaDataType.USER_INT;
                case YIUI.DataType.STRING:
                    return YIUI.JavaDataType.USER_STRING;

            }
            return -1;
        },
        toJSONDoc: function (document) {
            if (!document) return;

            var doc = {},
                table_list = [],
                table;
            if (document.oid) {
                doc.oid = document.oid;
            }
            if (document.poid) {
                doc.poid = document.poid;
            }
            doc.verid = document.verid || 0;
            doc.dverid = document.dverid || 0;

            doc.state = document.state || DataType.D_Normal;

            if (document.docType) {
                doc.document_type = document.docType;
            }
            var maps = document.maps.table, map;
            for (var i in maps) {
                map = maps[i];
                table = this.toJSONDataTable(map);
                table_list.push(table);
            }
            doc.table_list = table_list;
            doc.expand_data = document.expData;
            doc.expand_data_type = document.expDataType;
            doc.expand_data_class = document.expDataClass;
            return doc;
        },

        toJSONDataTable: function (dataTable) {
            if(!dataTable) return;

            var table = {};
            table.key = dataTable.key;
            table.bookmark_seed = dataTable.bkmkSeed;
            table.tableMode = dataTable.tableMode;
            var allRows = dataTable.allRows,
                row, all_data_rows = [], all_data_row;
            for (var j = 0, len = allRows.length; j < len; j++) {
                row = allRows[j];
                all_data_row = {};
                all_data_row.data = row.vals;
                all_data_row.row_bookmark = row.bkmk;
                all_data_row.row_parent_bookmark = row.parentBkmk;
                all_data_row.row_state = row.state;
                if (row.orgVals) {
                    all_data_row.originaldata = row.orgVals;
                }
                all_data_rows.push(all_data_row);
            }
            table.all_data_rows = all_data_rows;
            var cols = dataTable.cols, col, columns = [], column;
            for (var k = 0, length = cols.length; k < length; k++) {
                col = cols[k];
                column = {};
                column.data_type = col.type;
                column.key = col.key;
                column.index = k;
                column.user_type = col.userType;
                column.accesscontrol = col.accessControl;
                columns.push(column);
            }
            table.columns = columns;
            return table;
        },

        fromJSONDoc: function (document) {
            if (!document) return;

            var doc = new DataDef.Document();
         
            if (document.oid) {
                doc.oid = document.oid;
            }
            if (document.poid) {
                doc.poid = document.poid;
            }
            doc.verid = document.verid || 0;
            doc.dverid = document.dverid || 0;

            doc.state = document.state || 0;

            if (document.document_type) {
                doc.docType = document.document_type;
            }
            if (document.table_list) {
                var dataTable, doc_tableList = document.table_list, doc_table, tableKey;
                for (var j = 0; j < doc_tableList.length; j++) {
                    doc_table = doc_tableList[j];
                    tableKey = doc_table.key;
                    dataTable = this.fromJSONDataTable(doc_table);
                    doc.add(tableKey, dataTable);
                }
            }
            doc.expData = document.expand_data;
            doc.expDataType = document.expand_data_type;
            doc.expDataClass = document.expand_data_class;
            return doc;
        },
        
        fromJSONDataTable: function (jsondt) {
            if (!jsondt) return null;

            var dataTable = new DataDef.DataTable();

            dataTable.key = jsondt.key;
            dataTable.parentKey = jsondt.parentKey;
            dataTable.tableMode = jsondt.tableMode;
            var docTable = jsondt,
                allDataRows = docTable.all_data_rows,
                columns = docTable.columns;
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                dataTable.addCol(column.key, column.data_type, column.user_type, column.accesscontrol, column.defaultValue, column.isPrimary);
            }
            
            var delpos = [];
            for (var i = 0; i < allDataRows.length; i++) {
                var dataRow = allDataRows[i];
                dataTable.addRow();

                var row = dataTable.rows[dataTable.pos];
                var val = null, col;
                for (var k = 0; k < dataRow.data.length; k++) {

                    col = columns[k];

                    val = dataRow.data[k];
//                    if((col.data_type == YIUI.DataType.DATETIME || col.data_type == YIUI.DataType.DATE) && val != null) {
//                        val = new Date(parseInt(val));
//                    }

                    row.vals[k] = val;
                }

                row.state = dataRow.row_state || DataDef.R_Normal;
                

                
                row.bkmk = dataRow.row_bookmark;
//                if (row.bkmk >= dataTable.bkmkSeed) {
//                    dataTable.bkmkSeed++;
//                }
//                dataTable.bkmks.put(row.bkmk, dataTable.rows.length - 1);
                row.parentBkmk = dataRow.row_parent_bookmark;
                
                if(row.state == DataDef.R_Deleted){
                	delpos.push(dataTable.pos);
                }

            }
            
            for (var n = 0 ; n < delpos.length; n++){
            	dataTable.delRow(delpos[n]);
            }
            
            if (docTable.bookmark_seed) {
                dataTable.bkmkSeed = docTable.bookmark_seed;
            }
            return dataTable;
        },
        fromJSONItem: function (json) {
            var item = new DataDef.Item();
            if (!item) return;
            item.itemKey = json.itemKey;
            item.oid = json.oid;
            item.nodeType = json.nodeType || 0;
            item.enable = json.enable || 0;
            item.caption = json.caption;
            item.mainTableKey = json.mainTableKey;
            item.itemTables = json.itemTables;
            return item;
        },
        getShadowTableKey: function (tableKey) {
            return tableKey + "_shadow";
        },
        newShadowDataTable: function (dataTable) {
            var shadowTable = new DataDef.DataTable();
            shadowTable.key = this.getShadowTableKey(dataTable.key);
            var columns = dataTable.cols;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                shadowTable.addCol(column.key, column.type, column.userType, column.accessControl, column.defaultValue, column.isPrimary);
            }
            return shadowTable;
        },
        getPosByPrimaryKeys: function (dataTable, shadowTable, primaryKeys) {
            if (primaryKeys == undefined || primaryKeys == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.PRIMARYKEYS_UNDEFINED);
            }
            shadowTable.beforeFirst();
            var matchPos = -1;
            while (shadowTable.next()) {
                var isMatch = true;
                for (var k = 0, klen = primaryKeys.length; k < klen; k++) {
                    var cDataType = dataTable.cols[dataTable.indexByKey(primaryKeys[k])].type,
                        value = dataTable.getByKey(primaryKeys[k]), sdValue = shadowTable.getByKey(primaryKeys[k]),
                        tValue = YIUI.Handler.convertValue(value, cDataType),
                        tSDValue = YIUI.Handler.convertValue(sdValue, cDataType);
                    if (tValue instanceof  Decimal) {
                        if (!tValue.equals(tSDValue)) {
                            isMatch = false;
                            break;
                        }
                    } else if (tValue != tSDValue) {
                        isMatch = false;
                        break;
                    }
                }
                if (isMatch) {
                    matchPos = shadowTable.pos;
                    break;
                }
            }
            return matchPos;
        },
        posWithShadowRow: function (grid, doc, dataTable) {  //定位影子表的对应的行，如果没有，则新增行
            if (grid.pageInfo.pageLoadType != "DB")return;
            var shadowTableKey = Return.getShadowTableKey(grid.tableKey),
                shadowTable = doc.getByKey(shadowTableKey);
            if (shadowTable == null || shadowTable == undefined) {
                shadowTable = YIUI.DataUtil.newShadowDataTable(dataTable);
                doc.add(shadowTableKey, shadowTable);
            }
            var curOID = dataTable.getByKey(YIUI.DataUtil.System_OID_Key), pos, primaryKeys;
            if (curOID != null && curOID != undefined) {
                primaryKeys = [YIUI.DataUtil.System_OID_Key];
            } else {
                primaryKeys = grid.primaryKeys;
            }
            pos = Return.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
            if (pos != -1) {
                shadowTable.setPos(pos);
            } else {
                shadowTable.addRow();
                for (var j = 0, clen = shadowTable.cols.length; j < clen; j++) {
                    shadowTable.set(j, dataTable.get(j));
                }
                shadowTable.allRows[shadowTable.pos].state = dataTable.allRows[dataTable.pos].state;
            }
            return shadowTable;
        },
        modifyDisplayValueByShadow: function (doc, dataTable, grid, data) {
            var shadowTable = doc.getByKey(YIUI.DataUtil.getShadowTableKey(grid.tableKey)), rowData;
            if (shadowTable) {
                for (var i = 0, len = data.length; i < len; i++) {
                    rowData = data[i];
                    if (rowData.bookmark == undefined || rowData.bookmark == null) continue;
                    dataTable.setByBkmk(rowData.bookmark);
                    var curOID = dataTable.getByKey(YIUI.DataUtil.System_OID_Key), pos, primaryKeys;
                    if (curOID != null && curOID != undefined) {
                        primaryKeys = [YIUI.DataUtil.System_OID_Key];
                    } else {
                        primaryKeys = grid.primaryKeys;
                    }
                    pos = Return.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                    if (pos != -1) {
                        for (var j = 0, clen = dataTable.cols.length; j < clen; j++) {
                            dataTable.set(j, shadowTable.get(j));
                        }
                        grid.showDetailRow(i, true);
                    }
                }
            }
        },
        deleteAllRow: function (dataTable) {
            for (var len = dataTable.size(), i = len - 1; i >= 0; i--) {
                dataTable.delRow(i);
            }
        },
        append: function (srcTable, tgtTable) {
            var srcIndexArray = [], tgtIndexArray = [];
            for (var i = 0, len = srcTable.cols.length; i < len; i++) {
                var colInfo = srcTable.getCol(i);
                var tgtIndex = tgtTable.indexByKey(colInfo.key);
                if (tgtIndex != -1) {
                    srcIndexArray.push(i);
                    tgtIndexArray.push(tgtIndex);
                }
            }
            srcTable.beforeFirst();
            while (srcTable.next()) {
                tgtTable.addRow();
                for (var j = 0, jLen = srcIndexArray.length; j < jLen; j++) {
                    tgtTable.set(tgtIndexArray[j], srcTable.get(srcIndexArray[j]));
                }
            }
            srcTable.beforeFirst();
            tgtTable.beforeFirst();
        }
    };
    Return.System_SelectField_Key = "SelectField";
    Return.System_OID_Key = "OID";
    return Return;
})();