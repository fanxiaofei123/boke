YIUI.Handler = (function () {
    var Return = {
        formatDate: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "H+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return format;
            }
        },

        //DataTable 赋值转换方法
        convertValue: function (value, type) {
            var ret;
            switch (type) {
                case DataType.STRING:
                    if (value == null || value == undefined) {
                        ret = '';
                    } else {
                        ret = '' + value;
                    }
                    break;
                case DataType.INT:
                case DataType.LONG:
                case DataType.DOUBLE:
                case DataType.FLOAT:
                case DataType.NUMERIC:
                    if (value == undefined || value == null || value == '') {
                        ret = 0;
                    } else {
                        if (value.toString().toLowerCase() == "true") value = 1;
                        if (value.toString().toLowerCase() == "false") value = 0;
                        ret = new Decimal(value, 10);
                    }
                    break;
                case DataType.BOOLEAN:
                    ret = value ? true : false;
                    break;
                // case DataType.DATETIME:
                // case DataType.DATE:
                //     if(value instanceof Date){
                //         ret = value.getTime();
                //     }else{
                //         ret = null;
                //     }
                //     break;
                default:
                    ret = value;
            }
            return ret;
        },
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (formID, formula) {
            var form = YIUI.FormStack.getForm(formID);
            var cxt = new View.Context(form);
            if (formula) {
                form.eval(formula, cxt, null);
            }
        },
        setValueToDocument: function (control, dataTable, columnKey, newValue) {
            if (dataTable.indexByKey(columnKey) == -1) return;
            var type = control.type;
            var dataType = dataTable.cols[dataTable.indexByKey(columnKey)].type;

            if( !control.isSubDetail ) {
                if(!dataTable.first()){
                    dataTable.addRow(true);
                }
            }

            if (newValue == undefined || newValue == null) {
                newValue = Return.convertValue(newValue, dataType);
                dataTable.setByKey(columnKey, newValue);
            } else {
                switch (type) {
                    case YIUI.CONTROLTYPE.DICT:
                    case YIUI.CONTROLTYPE.DYNAMICDICT:
                    case YIUI.CONTROLTYPE.COMPDICT:
                        if (control.multiSelect) {
                            if (newValue.length > 0) {
                                var str = '';
                                for (var i = 0; i < newValue.length; i++) {
                                    str += ',' + newValue[i].oid;
                                }
                                str = str.substring(1);
                                dataTable.setByKey(columnKey, str);

                                if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                    dataTable.setByKey(columnKey + 'ItemKey', newValue[0].itemKey);
                                }
                            }
                        } else {
                            dataTable.setByKey(columnKey, newValue.oid);
                            if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                dataTable.setByKey(columnKey + 'ItemKey', newValue.itemKey);
                            }
                        }
                        break;
                    // case YIUI.CONTROLTYPE.DATEPICKER:
                    //     if (newValue instanceof Date) {
                    //         newValue = newValue.getTime();
                    //     } else {
                    //         newValue = new Date(newValue).getTime();
                    //     }
                    //     dataTable.setByKey(columnKey, newValue);
                    //     break;
                    default:
                        newValue = Return.convertValue(newValue, dataType);
                        dataTable.setByKey(columnKey, newValue);
                }
            }
        },

        setSubDetailValueToDocument: function (form,control,table,newValue,fireEvent) {
            var grid = form.getComponent(control.parentGridKey),
                rowIndex = (grid == null ? -1 : grid.getFocusRowIndex());
            if( isNaN(rowIndex) || rowIndex == -1 ) {
                rowIndex = grid.getLastEmptyRowIndex();
                if( isNaN(rowIndex) || rowIndex == -1 ) {
                    return;
                }
                grid.setFocusRowIndex(rowIndex,false);
            }

            if( table ) {
                var rowData = grid.getRowDataAt(rowIndex);
                if( YIUI.GridUtil.isEmptyRow(rowData) ) {
                    grid.getHandler().flushRow(form,grid,rowIndex);

                    this.setValueToDocument(control,table,control.columnKey,newValue);

                    if( grid.newEmptyRow && grid.isEnable() ) {
                        grid.appendEmptyRow(rowIndex);
                    }
                    grid.loadSubDetail();
                }
            } else {
                grid.setValueByKey(rowIndex, control.bindingCellKey, newValue, true, fireEvent);
            }
        },

        doValueChanged: function (control, newValue, commitValue, fireEvent) {
            var form = YIUI.FormStack.getForm(control.ofFormID),
                tableKey = control.tableKey,
                document = form.getDocument(),
                dataTable;

            if (commitValue) {
                if ( tableKey ) {
                    dataTable = document.getByKey(tableKey);
                }

                if ( control.isSubDetail ) {
                    this.setSubDetailValueToDocument(form, control, dataTable, newValue, fireEvent);
                } else {
                    dataTable && this.setValueToDocument(control, dataTable, control.columnKey, newValue);
                }

                // 触发事件之前需要做的事
                form.getViewDataMonitor().preFireValueChanged(control);

                // 触发事件
                if ( fireEvent ) {
                    form.getViewDataMonitor().fireValueChanged(control);
                }
                // 触发事件之后需要做的事
                form.getViewDataMonitor().postFireValueChanged(control);
            }
        },

    	validated: function(formID, validation) {
    		var passed = true;
			if ( validation ) {
                var form = YIUI.FormStack.getForm(formID);
	            var cxt = new View.Context(form);
				passed = form.eval(validation, cxt);
			}
    		return passed;
    	},
    	
        hasChanging: function(changing) {
    		var hasChanging = false;
			if (changing) {
				hasChanging = true;
			}
    		return hasChanging;
    	},

        changing: function(formID, changing) {
			if (changing) {
                var form = YIUI.FormStack.getForm(formID);
	            var cxt = new View.Context(form);
				form.eval(changing, cxt);
			}
    	}

    };
    return Return;
})();
