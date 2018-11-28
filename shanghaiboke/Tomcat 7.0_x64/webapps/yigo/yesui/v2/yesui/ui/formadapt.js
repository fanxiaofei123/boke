(function () {
    YIUI.FormAdapt = function (options) {
        var Return = {
            form: null,
            compList: {},
            orderList: [],
            unOrderList: [],
            cellMap: {},
            columnMap: {},
            gridMap: [],
            cellSubDtlCompMap: {},
            LVMap: [],
            panelMap: [],
            optMap: {},
            radioMap: {},
            rootPanel: null, 
            metaComps: {},

            init: function (rootObj) {
                if (!rootObj) return;
                this.formID = this.form.formID;
                this.metaComps = this.form.metaComps;
                this.rootPanel = YIUI.create(rootObj);
            },

            load: function () {

                var _this = this;

                var loadComp = function (array, com) {
                	if(com.ofFormID > 0) return;
                    com.ofFormID = _this.formID;
                    com.id = com.ofFormID + "_" + com.key;
                    if (com.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        _this.loadListViewMap(com);
                        YIUI.GridLookupUtil.buildCellLookup(_this.form,com);
                    } else if (com.type == YIUI.CONTROLTYPE.GRID) {
                        _this.loadGridMap(com);
                        YIUI.GridLookupUtil.buildCellLookup(_this.form,com);
                    } else if (com.type == YIUI.CONTROLTYPE.RADIOBUTTON) {
                        _this.radioMap[com.groupKey] = _this.radioMap[com.groupKey] || [];
                        _this.radioMap[com.groupKey].push(com);
                    } else if ( com.type == YIUI.CONTROLTYPE.CONTAINER ) {
                        if( com.mergeOperation ) {
                            _this.form.mergeOptContainer = com.key;
                        }
                        if( com.isDefault ) {
                            _this.form.defCtKey = com.key;
                        }
                    }
                    if (com.items && (com instanceof YIUI.Panel)) {
                        _this.panelMap[com.key] = com;
                        for (var i = 0; i < com.items.length; i++) {
                            loadComp(array, com.items[i]);
                        }
                    } else {
                        if (com.type == YIUI.CONTROLTYPE.TOOLBAR) {
                            if(com.isDefault) {
                                _this.form.defaultToolBar = com;
                                _this.loadOptMap(_this.optMap, _this.form.operations, com.key);
                           }
                        }
                    }
                    array[com.key] = com;
                    com.setFocusManager(_this.focusManager);
                    if( com.receiveFocus ) {
                        if( $.isNumeric(com.tabOrder) && com.tabOrder != -1 ) {
                            _this.orderList.push(com); // tabOrder不为-1的
                        } else {
                            _this.unOrderList.push(com);// tabOrder为-1的
                        }
                    }
                    _this.metaComps[com.key] = com.getMetaObj();
                    var cellKey = com.bindingCellKey;
                    var p_gridKey = com.parentGridKey;
                    if (cellKey != null && p_gridKey != null) {
                        var gridMap = _this.cellSubDtlCompMap[p_gridKey];
                        if (gridMap == null) {
                            gridMap = {};
                            _this.cellSubDtlCompMap[p_gridKey] = gridMap;
                        }
                        if (gridMap[cellKey] == null) {
                            gridMap[cellKey] = [];
                        }
                        gridMap[cellKey].push(com);
                    }
                }
                loadComp(_this.compList, _this.rootPanel);
            },

            loadOptMap: function (optMap, operations, defTbr) {
                for (var i = 0, item, len = operations.length; i < len; i++) {
                    item = operations[i];
                    optMap[item.key] = {barKey: defTbr, opt: item};
                    if ( item.items ) {
                        for (var j = 0, subItem, jlen = item.items.length; j < jlen; j++) {
                            subItem = item.items[j];
                            optMap[subItem.key] = {barKey: defTbr, opt: subItem};
                        }
                    }
                }
            },

            loadGridMap: function (parentCom) {
                var gridInfo = {
                    key: parentCom.key,
                    tableKey: parentCom.tableKey
                };
                this.gridMap.push(gridInfo);
            },

            loadListViewMap: function(parentCom) {
                var lvInfo = {
                    key: parentCom.key,
                    tableKey: parentCom.tableKey
                };
                this.LVMap.push(lvInfo);
            },

            addCellLocation: function (key, cellLocation) {
                this.cellMap[key] = cellLocation;
            },

            getCellLocation: function (key) {
                return this.cellMap[key];
            },

            getRadios: function(groupKey) {
            	return this.radioMap[groupKey];
            },
            
            getOptMap: function () {
                return this.optMap;
            },

            getListView: function (arg) {
                var key,lv;
                if ($.isNumeric(arg)) {
                    var index = YIUI.TypeConvertor.toInt(arg),
                        lv = this.LVMap[index];
                    key = lv && lv.key;
                } else {
                    for (var i = 0;lv = this.LVMap[i]; i++) {
                        if (lv.tableKey == arg) {
                            key = lv.key;
                        }
                    }
                }
                return key ? this.getComp(key) : null;
            },

            getGrid: function (arg) {
            	var key, grid;
            	if ($.isNumeric(arg)) {
            		var index = YIUI.TypeConvertor.toInt(arg),
            			grid = this.gridMap[index];
            		key = grid && grid.key;
            	} else {
            		for (var i = 0; grid = this.gridMap[i]; i++) {
            			if (grid.tableKey == arg) {
            				key = grid.key;
            			}
            		}
            	}
            	return key ? this.getComp(key) : null;
            },

            getPanel: function (key) {
                return this.panelMap[key];
            },
            getCellSubDtlCompMap: function () {
                return this.cellSubDtlCompMap;
            },
            getGridMap: function () {
                return this.gridMap;
            },
            getListViewMap: function () {
                return this.LVMap;
            },
            getCompList: function () {
                return this.compList;
            },
            getOrderList: function () {
                return this.orderList;
            },
            getUnOrderList: function () {
                return this.unOrderList;
            },
            getComp: function (comKey) {
                return this.compList[comKey];
            },
            getRoot: function () {
                return this.rootPanel;
            },
            setRootPanel: function (rootPanel) {
                this.rootPanel = rootPanel;
            },

            setCompValue: function (key, value, fireEvent) {
                var com = this.getComp(key);
                if ( !com  ) {
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT_KEY, key);
                }
                com.setValue(value, true, fireEvent);
            },
            setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                case YIUI.CONTROLTYPE.LISTVIEW:
                    comp.setValByIndex(rowIndex, colIndex, value, fireEvent);
                    break;
                case YIUI.CONTROLTYPE.GRID:
                    comp.setValueAt(rowIndex, colIndex, value, true, fireEvent);
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByIndex: function (key, rowIndex, colIndex) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                case YIUI.CONTROLTYPE.LISTVIEW:
                    value = comp.getValue(rowIndex, colIndex);
                    break;
                case YIUI.CONTROLTYPE.GRID:
                    value = comp.getValueAt(rowIndex, colIndex);
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                case YIUI.CONTROLTYPE.LISTVIEW:
                    comp.setValByKey(rowIndex, colKey, value, fireEvent);
                    break;
                case YIUI.CONTROLTYPE.GRID:
                    comp.setValueByKey(rowIndex, colKey, value, true, fireEvent);
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByKey: function (key, rowIndex, colKey) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                case YIUI.CONTROLTYPE.LISTVIEW:
                    value = comp.getValByKey(rowIndex, colKey);
                    break;
                case YIUI.CONTROLTYPE.GRID:
                    value = comp.getValueByKey(rowIndex, colKey);
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            getColumnInfo: function (key) {
                return this.columnMap[key];
            },
            setDefContainer: function (defContainer) {
                this.defContainer = defContainer;
            },
            getDefContainer: function (defCtKey) {
                if (defCtKey) {
                    return this.getComp(defCtKey);
                }
                return null;
            },
            setContainer: function (container) {
                this.container = container;
            },
            getContainer: function () {
                return this.container;
            },
            toJSON: function () {
                var jsonArr = [],
                    rootPanel = this.rootPanel;
                this.compToJson(rootPanel, jsonArr);
                return jsonArr;
            },
            compToJson: function (panel, comps) {
                var items = panel.items, item, comp;
                for (var i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if (item instanceof YIUI.Panel) {
                        this.compToJson(item, comps);
                    } else if (!(item.type == YIUI.CONTROLTYPE.LISTVIEW || item.type == YIUI.CONTROLTYPE.GRID)) {
                        comp = {};
                        comp.key = item.key;
                        if (item.type == YIUI.CONTROLTYPE.DATEPICKER) {
                            if (item.getValue()) {
                                comp.value = item.getValue().getTime();
                            } else {
                                comp.value = null;
                            }
                        } else {
                            comp.value = item.getValue();
                        }
                        comp.caption = item.caption;
                        comps.push(comp);
                    }
                }
            }
        };
        Return = $.extend(Return, options);
        Return.init(Return.rootObj);
        return Return;
    };
})();
