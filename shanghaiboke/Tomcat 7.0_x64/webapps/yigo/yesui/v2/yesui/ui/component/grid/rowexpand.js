(function () {
    YIUI.GridRowExpand = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        dealRowExpand: function () {
            var detailRow = this.grid.getDetailMetaRow();
            var expandCell = detailRow.cells[this.grid.rowExpandIndex];
            var rowExpand = expandCell.rowExpand, values = [];
            switch (rowExpand.expandType) {
                case YIUI.RowExpandType.DICT:
                    var itemKey = rowExpand.itemKey, filter, opt = expandCell.editOptions;
                    if (expandCell.cellType == YIUI.CONTROLTYPE.DICT) {
                        filter = YIUI.DictHandler.getDictFilter(this.form, expandCell.key, opt.itemFilters, opt.itemKey);
                    }
                    var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);
                    for (var m = 0, size = items.length; m < size; m++) {
                        values.push(items[m].oid);
                    }
                    break;
                case YIUI.RowExpandType.QUERY:
                    var queryDef = rowExpand.queryDef,
                        paras = queryDef.parameters && queryDef.parameters.paras,
                        paraValues = [];
                    if( paras ) {
                        for (var i = 0, len = paras.length; i < len; i++) {
                            var sourceType = paras[i].sourceType;
                            switch (sourceType) {
                            case YIUI.ParameterSourceType.CONST:
                                paraValues.push(paras[i].value);
                                break;
                            case YIUI.ParameterSourceType.FORMULA:
                                paraValues.push(this.form.eval(paras[i].formula, {form: this.form}, null));
                                break;
                            case YIUI.ParameterSourceType.FIELD:
                                var cellLoc = this.form.getCellLocation(paras[i].fieldKey), value;
                                if (cellLoc != null) {
                                    value = this.form.getCellValByKey(cellLoc.key, cellLoc.row, cellLoc.col);
                                } else {
                                    value = this.form.getValue(paras[i].fieldKey);
                                }
                                if ($.isObject(value) && value.oid) {
                                    value = value.oid;
                                }
                                paraValues.push(value);
                                break;
                            }
                        }
                    }
                    var serviceParas = {
                        cmd: "GetRowExpandItems",
                        service: "GetRowExpandItems",
                        formKey: this.form.formKey,
                        cellKey: expandCell.key,
                        param: $.toJSON(paraValues)
                    };
                    var list = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, serviceParas);
                    for (var m = 0, size = list.length; m < size; m++) {
                        values.push(list[m]);
                    }
                    break;
                case YIUI.RowExpandType.FORMULA:
                    var content = rowExpand.content;
                    if( !content ) {
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_EXPANDSOURCE_RESULT_GET);
                    }
                    var cxt = new View.Context(this.form);
                    var result = this.form.eval($.trim(content),cxt,null);
                    if( !result )
                        return;
                    if( result instanceof DataDef.DataTable ) {
                        result.beforeFirst();
                        while (result.next()) {
                            values.push(result.get(0));
                        }
                    } else if ( $.isString(result) ) {
                        values = values.concat(result.split(","));
                    } else if ( $.isArray(result) ) {
                        values = values.concat(result);
                    }
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.UNDEFINED_ROW_EXPAND_TYPE);
            }
            this.grid.setRowExpandModel(values);
        }
    });
})();