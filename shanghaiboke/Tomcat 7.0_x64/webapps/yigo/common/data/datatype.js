var DataType = (function () {
    var Return = {
        /** 32位整型 */
        INT: 1001,

        /** 字符串类型 */
        STRING: 1002,

        /** 日期类型 */
        DATE: 1003,

        /** 日期时间类型 */
        DATETIME: 1004,

        /** 数值类型 */
        NUMERIC: 1005,

        /** 双精度浮点数类型 */
        DOUBLE: 1006,

        /** 浮点数类型 */
        FLOAT: 1007,

        /** 二进制类型 */
        BINARY: 1008,

        /** 布尔类型 */
        BOOLEAN: 1009,

        /** 64位整型 */
        LONG: 1010
    };
    return Return;
})();

var DynamicCell = (function () {
    var Return = {
        getCellTypeTable: function () {
            if (Return.CellTypeTable == null) {
                var paras = {
                    cmd: "GetCellTypeTable",
                    service: "PureMeta"
                };
                Return.CellTypeTable = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            }
            return Return.CellTypeTable;
        }
    };
    Return.CellTypeTable = null;
    return Return;
})();

var DataDef = DataDef || {};

(function () {
    Lang.assign(DataDef, {
        R_Normal: 0,
        R_New: 1,
        R_Modified: 2,
        R_Deleted: 3,

        D_Normal: 0,
        D_New: 1,
        D_Modified: 2,
        D_Deleted: 3,

        D_Obj: 1,
        D_ObjDtl: 2
    });

    DataDef.BkmkMap = function () {
        this.tbs = new Array();
    };

    Lang.impl(DataDef.BkmkMap, {
        put: function (bkmk, idx) {
            if (bkmk >= this.tbs.length) {
                this.tbs.length = bkmk + 1;
            }
            this.tbs[bkmk] = idx;
        },
        get: function (bkmk) {
            if (bkmk < this.tbs.length) {
                return this.tbs[bkmk];
            }
            return undefined;
        },
        remove: function (bkmk) {
            this.tbs[bkmk] = undefined;
        },
        clear: function () {
            this.tbs = new Array();
        }
    });

    DataDef.ColInfo = function (key, type, userType, accessControl, defaultValue, isPrimary) {
        this.key = key;
        this.type = type;
        this.userType = userType;
        this.accessControl = accessControl;
        this.defaultValue = defaultValue;
        this.isPrimary = isPrimary;
    };

    Lang.impl(DataDef.ColInfo, {
        setKey: function (key) {
            this.key = key;
        },
        getKey: function () {
            return this.key;
        },
        setType: function (type) {
            this.type = type;
        },
        getType: function () {
            return this.type;
        },
        setUserType: function (userType) {
            this.userType = userType;
        },
        getUserType: function () {
            return this.userType;
        },
        setAccessControl: function (accessControl) {
            this.accessControl = accessControl;
        },
        getAccessControl: function () {
            return this.accessControl;
        },
        setDefaultValue: function (defaultValue) {
            this.defaultValue = defaultValue;
        },
        getDefaultValue: function () {
            return this.defaultValue;
        },
        setPrimary: function (primary) {
            this.isPrimary = primary;
        },
        isPrimary: function () {
            return this.isPrimary;
        }
    });

    DataDef.Row = function (size) {
        this.bkmk = -1;
        this.state = 0;
        this.orgVals = null;
        this.vals = new Array(size);
    };

    DataDef.DataTable = function () {
        this.key = "";
        this.allRows = new Array();
        this.rows = new Array();
        this.cols = new Array();
        this.bkmks = new DataDef.BkmkMap();
        this.pos = -1;
        this.bkmkSeed = 0;
        this.tableMode = -1;
    };

    Lang.impl(DataDef.DataTable, {
        clone: function () {
            var newTable = new DataDef.DataTable();
            newTable.key = this.key;
            newTable.pos = this.pos;
            newTable.bkmkSeed = this.bkmkSeed;
            newTable.bkmks = $.extend(true, {}, this.bkmks);
            newTable.allRows = $.extend(true, [], this.allRows);
            newTable.rows = $.extend(true, [], this.rows);
            newTable.cols = $.extend(true, [], this.cols);
            return newTable;
        },
        addCol: function (key, type, userType, accessControl, defaultValue, isPrimary) {
            var c = new DataDef.ColInfo(key, type, userType, accessControl, defaultValue, isPrimary);
            this.cols.push(c);
        },
        getCol: function (index) {
            return this.cols[index];
        },
        getColByKey: function (colKey) {
            return this.getCol(this.indexByKey(colKey));
        },
        clear: function () {
            this.allRows.length = 0;
            this.rows.length = 0;
            this.bkmks.clear();
            this.pos = -1;
        },
        addRow: function (needDefValue) {
            var r = new DataDef.Row(this.cols.length);
            if (needDefValue) {
                var setDefaultValue = function (cols, row) {
                    for (var i = 0, l = cols.length; i < l; ++i) {
                        var col = cols[i];
                        var defaultValue = col.getDefaultValue();
                        var type = col.getType();
                        var colKey = col.getKey();
                        if ($.isDefined(defaultValue) && defaultValue != null) {
                            var val = YIUI.TypeConvertor.toDataType(type, defaultValue);
                            row.vals[i] = val;
                        } else if ((type == YIUI.DataType.INT
                            || type == YIUI.DataType.LONG
                            || type == YIUI.DataType.NUMERIC) &&
                            (YIUI.SystemField.OID_SYS_KEY != colKey
                                && YIUI.SystemField.SOID_SYS_KEY != colKey
                                && YIUI.SystemField.POID_SYS_KEY != colKey
                                && YIUI.SystemField.VERID_SYS_KEY != colKey
                                && YIUI.SystemField.DVERID_SYS_KEY != colKey
                                )) {
                            row.vals[i] = 0;
                        }

                    }
                };
                setDefaultValue(this.cols, r);
            }
            r.bkmk = this.bkmkSeed++;
            r.state = DataDef.R_New;
            this.rows.push(r);
            this.allRows.push(r);
            this.bkmks.put(r.bkmk, this.rows.length - 1);
            this.pos = this.rows.length - 1;
        },
        size: function () {
            return this.rows.length;
        },
        setPos: function (pos) {
            this.pos = pos;
        },
        pos: function () {
            return this.pos;
        },
        setByBkmk: function (bkmk) {
            var idx = this.bkmks.get(bkmk);
            if (idx != undefined) {
                this.pos = idx;
            } else {
                this.pos = -1;
            }
        },
        getBkmk: function () {
            return this.rows[this.pos].bkmk;
        },
        getParentBkmk: function () {
            return this.rows[this.pos].parentBkmk;
        },
        setParentBkmk:function(bkmk) {
            this.rows[this.pos].parentBkmk = bkmk;
        },
        beforeFirst: function () {
            this.pos = -1;
        },
        afterLast: function () {
            this.pos = this.rows.length;
        },
        next: function () {
            if (this.pos == this.rows.length) {
                return false;
            }
            ++this.pos;
            return this.pos != this.rows.length;
        },
        previous: function () {
            if (this.pos == -1) {
                return false;
            }
            --this.pos;
            return this.pos != -1;
        },
        first: function () {
            if (this.rows.length == 0) {
                return false;
            }
            this.pos = 0;
            return true;
        },
        last: function () {
            if (this.rows.length == 0) {
                return false;
            }
            this.pos = this.rows.length - 1;
            return true;
        },
        getRowCount: function () {
            return this.rows.length;
        },
        isBeforeFirst: function () {
            return this.pos == -1;
        },
        isAfterLast: function () {
            return this.pos == this.rows.length;
        },
        isFirst: function () {
            return this.rows.length != 0 && this.pos == 0;
        },
        isLast: function () {
            return this.rows.length != 0 && this.pos == this.rows.length - 1;
        },
        isValid: function () {
            return this.rows.length != 0 & this.pos >= 0 && this.pos < this.rows.length;
        },
        get: function (idx) {
            return this.rows[this.pos].vals[idx];
        },
        set: function (idx, val) {
            var row = this.rows[this.pos];
            var rowState = row.state;
            if (rowState == DataDef.R_Normal) {
                row.orgVals = $.extend([], row.vals);
                row.state = DataDef.R_Modified;
            }
            row.vals[idx] = val;
        },
        setState:function(state) {
            var row = this.rows[this.pos];
            row.state = state;
        },
        indexByKey: function (key) {
            var cIdx = -1;
            for (var i = 0, l = this.cols.length; i < l; ++i) {
                var col = this.cols[i];
                if (col.key.toLowerCase() == key.toLowerCase()) {
                    cIdx = i;
                    break;
                }
            }
            return cIdx;
        },
        getByKey: function (key) {
            var index = this.indexByKey(key);
            if (index == -1)
                return null;
            return this.get(index);
        },
        setByKey: function (key, val) {
            var index = this.indexByKey(key);
            if (index == -1)
                return;
            this.set(index, val);
        },

        setNew: function () {
            this.rows = [];
            this.bkmks.clear();
            this.pos = -1;
            this.rows = this.allRows;
            for (var i = 0, len = this.rows.length; i < len; i++) {
                var row = this.rows[i];
                this.bkmks.put(row.bkmk, i);
                row.state = DataDef.R_New;
                row.orgVals = [];
            }
        },
        delRow: function (idx) {
            if (idx == null) {
                idx = this.pos;
            }
            var r = this.rows[idx], oldSize = this.rows.length;
            this.rows.splice(idx, 1);
            if (r.state == DataDef.R_New) {
            
            	for(var i = 0 ; i < this.allRows.length ; i ++){
            		if(r == this.allRows[i]){
            		        this.allRows.splice(i, 1);
            		        break;
            		}
            	}
      
                this.bkmks.remove(r.bkmk);
                if (this.pos > idx)
                    this.pos--;
            } else {
                r.state = DataDef.R_Deleted;
                this.bkmks.remove(r.bkmk);
                if (this.pos > idx)
                    this.pos--;
            }
            var newSize = this.rows.length;
            if (newSize != oldSize) {
                for (var i = 0, len = this.rows.length; i < len; i++) {
                    r = this.rows[i];
                    this.bkmks.put(r.bkmk, i);
                }
            }
        },
        batchUpdate: function () {
            var l = this.allRows.length;
            for (var i = l - 1; i >= 0; --i) {
                var r = this.allRows[i];
                if (r.state == DataDef.R_Deleted) {
                    this.allRows.splice(i, 1);
                } else {
                    r.state = DataDef.R_Normal;
                    r.orgVals = null;
                }
            }
        }
    });

    DataDef.Document = function () {
        this.tbls = new Array();
        this.maps = new HashMap();
        this.oid = -1;
        this.poid = -1;
        this.verid = -1;
        this.dverid = -1;
        this.state = 0;
        this.docType = DataDef.D_Obj;
        this.expData = new HashMap();
        this.expDataType = new HashMap();
        this.expDataClass = new HashMap();
        this.mainTableKey = "";
    };

    Lang.impl(DataDef.Document, {
        isNew: function () {
            return this.state == YIUI.DocType.NEW;
        },
        getExpDataInfo: function (key) {
            return {data: this.expData[key], dataType: this.expDataType[key], dataClass: this.expDataClass[key]};
        },
        getExpData: function (key) {
            return this.expData[key];
        },
        putExpandData: function (key, value) {
            this.expData[key] = value;
        },
        add: function (key, tbl) {
            this.tbls.push(tbl);
            this.maps.put(key, tbl);
        },
        remove: function (key) {
            var tbl = this.maps.get(key);
            this.maps.remove(key);
            for (var i = this.tbls.length - 1; i >= 0; --i) {
                if (this.tbls[i] == tbl) {
                    this.tbls.splice(i, 1);
                    break;
                }
            }
        },
        get: function (idx) {
            return this.tbls[idx];
        },
        setByKey: function (key, tbl) {
            this.maps.put(key, tbl);
            for (var i = this.tbls.length - 1; i >= 0; --i) {
                if (this.tbls[i].key == key) {
                    this.tbls.splice(i, 1, tbl);
                    break;
                }
            }
        },
        getByParentKey: function (parentKey) {
            var subTables = [], table;
            for (var i = 0, len = this.tbls.length; i < len; i++) {
                table = this.tbls[i];
                if (table.parentKey == parentKey) {
                    subTables.push(table);
                }
            }
            return subTables;
        },
        getByKey: function (key) {
            return this.maps.get(key);
        },
        clear: function () {
            this.tbls.length = 0;
            this.maps.clear();
        },
        setDocType: function (type) {
            this.docType = type;
        },
        setModified: function () {
            this.state = DataDef.D_Modified;
        },
        batchUpdate: function () {
            for (var i = 0, l = this.tbls.length; i < l; ++i) {
                var t = this.tbls[i];
                t.batchUpdate();
            }
        },
        clone: function () {
            var newDoc = new DataDef.Document();
            newDoc.oid = this.oid;
            newDoc.poid = this.poid;
            newDoc.verid = this.verid;
            newDoc.dverid = this.dverid;
            newDoc.state = this.state;
            newDoc.docType = this.docType;
            newDoc.mainTableKey = this.mainTableKey;
            newDoc.tbls = [];
            newDoc.maps = new HashMap();
            for (var i = 0, table, len = this.tbls.length; i < len; i++) {
                table = this.tbls[i].clone();
                newDoc.tbls.push(table);
                newDoc.maps.put(table.key, table);
            }
            newDoc.expData = $.extend(true, {}, this.expData);
            newDoc.expDataType = $.extend(true, {}, this.expDataType);
            newDoc.expDataClass = $.extend(true, {}, this.expDataClass);
            return newDoc;
        }
    });

    DataDef.Item = function () {
        this.itemKey = null;
        this.oid = 0;
        this.nodeType = 0;
        this.enable = 0;
        this.caption = null;
        this.mainTableKey = null;
        this.itemTables = {};
    };

    Lang.impl(DataDef.Item, {
        toItemData: function () {
            var itemData = {};
            itemData.itemKey = this.itemKey;
            itemData.oid = this.oid;
            return itemData;
        },

        getValue: function (fieldKey, tableKey) {
            if (!tableKey) {
                tableKey = this.mainTableKey;
            }

            var table = this.itemTables[tableKey];

            var value = null;
            if (table && table.itemRows.length > 0) {
                if (table.tableMode == 0) {
                    value = table.itemRows[0][fieldKey];
                } else {
                    var len = table.itemRows.length;

                    value = new Array(len);

                    for (var i = 0; i < len; i++) {
                        value.push(table.itemRows[i][fieldKey]);
                    }
                }
            }

            return value;

        }
    });
})();




