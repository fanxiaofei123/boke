YIUI.ExprUtil = (function () {
    var Return = {
        //仅拿来处理Dict值
        getImplValue: function (form, key, cxt, obj) {
            var value = null;
    		if (!obj) {
    			var cellLocation = form.getCellLocation(key);
    			// 如果存在单元位置，那么是一个集合组件
    			if (cellLocation) {
    				var key = cellLocation.key;
    				var column = cellLocation.column;
    				var row = cellLocation.row;
    				var viewRow = cxt.rowIndex;
    				//如果是固定行的单元格,取自己的位置信息
    				value = form.getCellValByIndex(key, row == -1 ? viewRow : row, column);
    			} else {
    				// 头控件
    				var comp = form.getComponent(key);
    				if (!comp) {
    		            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
    				}
    				value = comp.getValue();
    			}
    			value = this.convertValue(value);
    		} else {
    			var grid = form.getGridInfoByTableKey(obj);
    			var lv = form.getListView(obj);
				var rowIndex = cxt.rowIndex;
				var doc = form.getDocument();
				var table = doc.getByKey(obj);
    			if(lv) {
//    				var rowIndex = rowLocation.getRow();
					table.setPos(rowIndex);
					value = table.getByKey(key);
    			} else if(grid) {
        			grid = form.getComponent(grid.key);
    				var gridRow = grid.getRowDataAt(rowIndex);
					var bkmk = gridRow.bookmark;
					if(bkmk < 0) return null;
					table.setByBkmk(bkmk);
//					table.setPos(rowIndex);
					value = table.getByKey(key);
    			} else {
    				if (table) {
//    					table.setPos(rowIndex);
    					value = table.getByKey(key);
    				}
    			}
    		}
    		return value;
        },
        setImplValue: function(form, key, value, cxt) {
        	var cmp = form.getComponent(key);
    		var cell = form.getCellLocation(key);
        	if(cmp) {
        		form.setComponentValue(key, value);
        	} else if(cell) {
        		var rowIndex = cxt.rowIndex;
        		form.setCellValByKey(cell.key, rowIndex, key, value);
        	}
        	
        },
        convertValue: function(value,editOpt) {
        	if (value && value instanceof YIUI.ItemData) {
                value = value.getOID();
            } else if ($.isObject(value) && (value.oid > -1)) {
            	value = value.oid;
            } else if ( editOpt && editOpt.edittype === 'datePicker' && $.isNumeric(value)) {
            	value = new Date(value);
			}
    		return value;
    	},
        getJSONValue: function (form, key, cxt) {
    		var reValue;
    		var comp = form.getComponent(key);
			if (!comp) {
	            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
			}
			
			var type = comp.type;
			switch(type) {
				case YIUI.CONTROLTYPE.DICT:
				case YIUI.CONTROLTYPE.DYNAMICDICT:
				case YIUI.CONTROLTYPE.COMPDICT:
					value = comp.getValue();
					if (value instanceof YIUI.ItemData) {
						reValue = value.toJSON();
					} else if ($.isArray(value)) {
						reValue = new Array();
						for(var i = 0 ; i < value.length;i++){
							reValue[i] = value[i].toJSON();
						}
					}
			}
			
			return reValue;
    	}
    };
    return Return;
})();