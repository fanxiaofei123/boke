/**
 *
 * cellData结构: 1.value 2.caption 3.enable 4.required 5.error 6.errorMsg
 *
 */
YIUI.Control.Grid = YIUI.extend(YIUI.Control, {
    autoEl: '<table></table>',
    groupHeaders: [],
    pageInfo: null,
    rowList: [],
    gridHandler: YIUI.GridHandler,
    selectFieldIndex: -1,
    columnExpandInfo: [],
    rowExpandInfo: [],
    primaryKeys:[],
    orgMetaObj:null, // 原始配置对象
    hasColExpand:false,
    hasRowExpand:false,
    hasGroupRow:false,
    hasFixRow:false,
    hasTotalRow:false,
    showRowHead:true,
    newEmptyRow:true,
    hasDetailRow:false,
    hasCellMerge:false,
    hideGroup4Editing:false,
    topFixRowCount:0,
    bottomFixRowCount:0,
    endEditByNav:false,

    detailMetaRowIndex: -1,
    rowExpandIndex: -1,
    hasTree: false,
    treeIndex: -1,
    multiple: false,

    init: function (options) {
        this.base(options);
        this.orgMetaObj = options.metaObj;
        this.metaObj = options.metaObj;
        this.rowList = this.metaObj.rowList || [];
        this.detailMetaRowIndex = this.metaObj.detailMetaRowIndex;

        this.dataModel = {
            data: [],
            colModel: {},
            rowMap: {},
            tableKeys: []
        };

        this.initDimValue();
        this.initLeafColumns();
        this.initDataModel();

        this.pageInfo = {
            curPageIndex: 0,
            totalRowCount: 0,
            pageLoadType: this.metaObj.pageLoadType,
            pageRowCount: this.metaObj.pageRowCount,
            pageIndicatorCount: this.metaObj.pageIndicatorCount,
            pageCount: 1,
            reset:function () {
                this.curPageIndex = 0;
                this.totalRowCount = 0;
                this.pageCount = 1;
            },
            calcPage:function () {
                var pageCount = Math.ceil(this.totalRowCount / this.pageRowCount);
                this.pageCount = pageCount == 0 ? 1 : pageCount;
            }
        };
    },

    initDimValue: function () {
        var metaObj = this.getMetaObj();
        if( !metaObj.dimValueInit ) {
            var metaRows = metaObj.rows,metaRow,metaCell,dim;
            for( var i = 0,length = metaRows.length;i < length;i++ ) {
                metaRow = metaRows[i];
                dim = metaRow.dimValue;
                if( dim ) {
                    metaRow.dimValue = new YIUI.MultiDimValue(dim);
                }
                for( var k = 0,size = metaRow.cells.length;k < size;k++ ) {
                    metaCell = metaRow.cells[k];
                    dim = metaCell.dimValue;
                    if( dim ) {
                        metaCell.dimValue = new YIUI.MultiDimValue(dim);
                    }
                }
            }
        }
        metaObj.dimValueInit = true;
    },

    initLeafColumns:function () {
        var getLeafColumns = function (_columns) {
            for (var i = 0,column; column = _columns[i]; i++) {
                if (column.columns != null && column.columns.length > 0) {
                    getLeafColumns(column.columns, leafColumns);
                } else {
                    leafColumns.push(column);
                }
            }
        }

        var leafColumns = [];

        var columns = this.getMetaObj().columns;

        getLeafColumns(columns);

        this.metaObj.leafColumns = leafColumns;
    },

    initDataModel: function () {
        var columns = [],column;
        var leafColumns = this.getMetaObj().leafColumns;
        for (var i = 0, metaColumn; metaColumn = leafColumns[i]; i++) {
            column = {};
            column.key = metaColumn.key;
            column.label = metaColumn.caption;
            column.formulaCaption = metaColumn.formulaCaption;
            if (metaColumn.refColumn != null) {
                column.isExpandCol = true;
                column.refColumn = metaColumn.refColumn.key;
            }
            column.name = "column" + i;
            column.index = i;
            column.parentKey = metaColumn.parentKey;
            column.width = metaColumn.width;
            column.hidden = false;
            column.sortable = metaColumn.sortable;
            column.visible = metaColumn.visible;
            column.columnType = metaColumn.columnType;
            columns.push(column);
        }

        this.dataModel.colModel.columns = columns;
    },

    setMetaObj: function (metaObj) {
        if (metaObj != null) {
            this.metaObj = metaObj;
        }
    },

    // 获取配置对象:拓展后的
    getMetaObj: function () {
        return this.metaObj;
    },

    // 获取原始配置对象:未拓展的
    getOrgMetaObj: function () {
        return this.orgMetaObj;
    },

    setVAlign: function (vAlign) {

    },
    setHAlign: function (hAlign) {

    },
    getColumnExpandModel: function () {
        return this.columnExpandInfo;
    },
    getRowExpandModel: function () {
        return this.rowExpandInfo;
    },
    setRowExpandModel: function (rowExpandInfo) {
        this.rowExpandInfo = rowExpandInfo;
    },
    // private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
    onSetWidth: function (width) {
        this.el && this.el.setGridWidth(width);
    },

    setHeight: function (height) {
        this.base(height);
    },

    // private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
    onSetHeight: function (height) {
        this.el && this.el.setGridHeight(height);
    },

    //获得表格最外层节点
    getOuterEl: function () {
        return $("#gbox_" + this.id);
    },

    // 刷新动态单元格
    refreshDynamicOpt:function (editOpt,cellData,rowIndex,colIndex) {
        var form = YIUI.FormStack.getForm(this.ofFormID),
            cxt = new View.Context(form);

        cxt.setRowIndex(rowIndex);
        cxt.setColIndex(colIndex);

        var typeDefKey = form.eval(editOpt.editOptions.typeFormula, cxt);
        if( typeDefKey ) {
            var oldDefKey = cellData.typeDefKey;

            if( typeDefKey != oldDefKey ) {
                var cellTypeDef = form.metaForm.cellTypeGroup[typeDefKey],
                    editOptions = cellTypeDef.editOptions;

                var newData = YIUI.GridUtil.initCellData(editOptions.cellType, cellTypeDef);

                cellData[0] = newData[0];
                cellData[1] = newData[1];
                cellData.curOptions = $.extend({},editOptions);
                cellData.typeDefKey = typeDefKey;
            }
        } else {
            delete cellData.curOptions;
            delete cellData.typeDefKey;
        }
        return editOpt;
    },

    // 检查编辑值
    formatInput: function (editOpt,value) {
        switch (editOpt.cellType){
        case YIUI.CONTROLTYPE.TEXTEDITOR:
            return YIUI.TextEditorBehavior.checkValid(editOpt,value);
        case YIUI.CONTROLTYPE.NUMBEREDITOR:
            return YIUI.NumberEditorBehavior.checkValid(editOpt,value);
            break;
        }
        return value;
    },

    //编辑单元格时如果是自定义编辑组件，则这里进行对应组件的创建
    createCellEditor2: function (cell, rowIndex, colIndex, opt) {
        var self = this,
            editOpt = self.getCellEditOpt(rowIndex,colIndex),
            cellKey = editOpt.key;

        var cellType = editOpt.cellType;

        var editor,
            $t = self.el[0],

            cellData = self.getCellDataAt(rowIndex,colIndex),
            value = cellData[0], caption = cellData[1];

        // 动态单元格处理
        if (cellType == YIUI.CONTROLTYPE.DYNAMIC) {
            self.refreshDynamicOpt(editOpt,cellData,rowIndex,colIndex);

            var options = cellData.curOptions;

            if( !options ) {
                return;
            }

            options.key = cellKey;
            options.typeDefKey = cellData.typeDefKey;

            cellType = options.cellType;

            // 复制一个opt
            editOpt = $.extend({}, editOpt);
            editOpt.editOptions = options;

            value = cellData[0], caption = cellData[1];
        }

        editOpt.id = opt.id;

        if( !opt.normalEdit ) {
            caption = this.formatInput(editOpt, opt.event.code);
        }

        cell.html("").attr("tabIndex", "0");

        var setFocusAndSelect = function (editor) {

            var moveStart = function (element) {
                var pos = element.value.length;
                if (element.setSelectionRange) {
                    element.setSelectionRange(pos, pos);
                } else if (element.createTextRange) {
                    var r = element.createTextRange();
                    r.moveStart('character', pos);
                    r.collapse(true);
                    r.select();
                }
            };

            window.setTimeout(function () {
                $(editor.getInput()).focus(function () {
                    if( !opt.normalEdit ) { // 如果是单击编辑,移动光标
                        moveStart(this);
                    } else {
                        $(this).select(); // 双击编辑,选中全部
                    }
                });
                editor.focus(); // 编辑器获取焦点
            }, 0);
        };
        var clickDropBtn = function (editor) {
            var event = opt.event || window.event;
            if (event.type === "click") {
                var srcE = event.target || event.srcElement ,
                    x = event.offsetX || (event.clientX - srcE.getBoundingClientRect().left),
                    y = event.offsetY || (event.clientY - srcE.getBoundingClientRect().top),
                    btn = editor.getDropBtn()[0],
                    top = btn.offsetTop, left = btn.offsetLeft,
                    height = btn.offsetHeight, width = btn.offsetWidth;
                if (top <= y && y <= (top + height) && left <= x && x <= (cell[0].offsetLeft + cell[0].offsetWidth)) {
                    return editor.getDropBtn().click();
                }
            }
            setFocusAndSelect(editor);
        };

        switch (cellType) {
            case YIUI.CONTROLTYPE.TEXTEDITOR:
                editor = new YIUI.CellEditor.CellTextEditor(editOpt);
                editor.render(cell);

                editor.setText(caption);
                editor.getInput().addClass("celled");

                editor.setValue(value);
                setFocusAndSelect(editor);
                break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                editor = new YIUI.CellEditor.CellNumberEditor(editOpt);
                editor.render(cell);

                editor.setText(caption);
                editor.getInput().addClass("celled");

                editor.setValue(value);
                setFocusAndSelect(editor);
                break;
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                editor = new YIUI.CellEditor.CellDynamicDict(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setText(caption);

                editor.setValue(value);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.DICT:
                editor = new YIUI.CellEditor.CellDict(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setText(caption);
                editor.setValue(value);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                editor = new YIUI.CellEditor.CellComboBox(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setValue(value);
                editor.setText(caption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                editor = new YIUI.CellEditor.CellDatePicker(editOpt)
                editor.render(cell);
                editor.setValue(value);
                editor.setText(caption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                editor = new YIUI.CellEditor.CellUTCDatePicker(editOpt);
                editor.render(cell);
                editor.setValue(value);
                editor.setText(caption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                editOpt.click = function () {
                    self.gridHandler.doOnCellClick(self, rowIndex, colIndex);
                };
                editor = new YIUI.CellEditor.CellTextButton(editOpt);
                editor.render(cell);
                editor.setText(caption);
                editor.setValue(value);
                editor.getInput().addClass("celled");
                setFocusAndSelect(editor);
                break;
        }

        if(!editor){
            return;
        }

        //单元格值提交事件
        editor.saveCell = function (value) {
            editor.beforeDestroy();
            self.getControlGrid().setValueAt(rowIndex, colIndex, value, true, true);
        };

        //焦点离开事件,单元格恢复显示样式
        editor.doFocusOut = function(){
            editor.beforeDestroy();
            // $($t).yGrid("restoreCell", opt.ir, opt.ic, cellData);
           $($t).yGrid("updateCell", rowIndex, colIndex, cellData);
            // kvn获取焦点,使键盘事件可用
            // 表格切头控件 会来回调用focusin focusout
            // window.setTimeout(function () {
            //     $("#" + $t.p.knv).attr("tabindex", "-1").focus();
            // }, 0);
        };

        // 统一注册表格单元格编辑组件的事件
        editor.getInput().keydown(function (event) {
            var keyCode = event.charCode || event.keyCode || 0;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {
                editor.getInput().blur();
                if (editor.yesCom.isShowQuery) {
                    event.stopPropagation();
                }
                $("#" + $t.p.knv).trigger("keydown", event);
            }
        });
        cell[0].editor = editor;
    },

    endCheck2: function(editOpt, rowIndex, colIndex, val) {

        var caption = '',
            _this = this,
            cellData = _this.getCellDataAt(rowIndex,colIndex),
            meta = cellData.curOptions || editOpt.editOptions,
            cellType = meta.cellType;

        var def = $.Deferred();

        switch (cellType) {
            case YIUI.CONTROLTYPE.DICT:
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                return YIUI.DictHandler.getShowCaption(val, meta.allowMultiSelection, meta.independent);
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                var settings = YIUI.NumberEditorHandler.getSettings(meta);

                var caption = '';
                if( cellData.byZero ) {
                    caption = '#DIV/0';
                } else {
                    caption = YIUI.DecimalFormat.format(val, settings);
                }

                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.TEXTEDITOR:
                caption = val;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.TEXTAREA:
                caption = val;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                caption = val;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                var formID = this.ofFormID;
                var form = YIUI.FormStack.getForm(formID);

                if(meta.sourceType == YIUI.COMBOBOX_SOURCETYPE.QUERY){
                    caption = YIUI.TypeConvertor.toString(val);
                    def.resolve(caption);
                }else{
                    var cxt = new View.Context(form);
                    cxt.setRowIndex(rowIndex);
                    cxt.setColIndex(colIndex);

                    YIUI.ComboBoxHandler.getComboboxItems(form, meta, cxt)
                        .then(function(items){
                            var caption = YIUI.ComboBoxHandler.getShowCaption(meta.sourceType, items, val,
                                cellType == YIUI.CONTROLTYPE.CHECKLISTBOX, meta.editable);
                            def.resolve(caption);
                        });
                }
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                caption = YIUI.DateFormat.format(val, meta);
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                caption = YIUI.UTCDateFormat.formatCaption(val, meta.onlyDate);
                def.resolve(caption);
                break;
            default:
                caption = YIUI.TypeConvertor.toString(val);
                def.resolve(caption);
        }
        return def.promise();
    },

    checkAndSet2: function(editOpt, rowIndex, colIndex, val, callback) {

        var cellData = this.getCellDataAt(rowIndex,colIndex),
            meta = cellData.curOptions || editOpt.editOptions;

        var options = {
            oldVal: cellData[0],
            newVal: val
        };

        options = $.isDefined(meta) ? $.extend(options, meta) : options;

        // 处理除0错误
        if( meta.cellType == YIUI.CONTROLTYPE.NUMBEREDITOR ) {
            cellData.byZero = val == '#DIV/0';
            options.byZero = cellData.byZero;
            if( cellData.byZero ) {
                cellData[1] = '#DIV/0';
            }
        }

        // 动态字典计算ItemKey
        if( meta.cellType == YIUI.CONTROLTYPE.DYNAMICDICT ) {
            var form = YIUI.FormStack.getForm(this.ofFormID);
            options.itemKey = YIUI.DictHandler.getItemKey(form,options.refKey,rowIndex);
        }

        var cellHandler = null;
        switch (meta.cellType) {
            case YIUI.CONTROLTYPE.DICT:
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                cellHandler = YIUI.DictBehavior;
                break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                cellHandler = YIUI.NumberEditorBehavior;
                break;
            case YIUI.CONTROLTYPE.TEXTEDITOR:
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                cellHandler = YIUI.TextEditorBehavior;
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
                cellHandler = YIUI.ComboBoxBehavior;
                break;
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                cellHandler = YIUI.CheckListBoxBehavior;
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                cellHandler = YIUI.DatePickerBehavior;
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                cellHandler = YIUI.UTCDatePickerBehavior;
                break;
            case YIUI.CONTROLTYPE.CHECKBOX:
                cellHandler = YIUI.CheckBoxBehavior;
                break;
            case YIUI.CONTROLTYPE.TEXTAREA:
                cellHandler = YIUI.TextAreaBehavior;
                break;
            default:
                cellHandler = YIUI.BaseBehavior;
        }

        return cellHandler.checkAndSet(options, callback);
    },

    setSingleSelect: function (singleSelect) {
        this.singleSelect = singleSelect;
        this.el && this.el[0].setSelectAllVisible(singleSelect);
    },

    doSelect:function (rowIndex,colIndex,value,shiftDown) {
        var self = this,
            rowData = self.getRowDataAt(rowIndex);
        if( rowData.rowType === 'Detail' ) {
            if( shiftDown && !self.singleSelect ) {
                var sm = self.el[0].p.selectModel;
                self.gridHandler.selectRange(self,sm.top,sm.bottom + 1,colIndex,value);
            } else {
                if( self.singleSelect ) {
                    self.gridHandler.selectSingle(self,rowIndex,colIndex,value);
                } else {
                    self.setValueAt(rowIndex, colIndex, value, true, true)
                }
            }
        } else {
            self.setValueAt(rowIndex, colIndex, value, true, true);
        }
    },

    alwaysShowCellEditor: function (cell, ri, ci, value, opt, rowHeight) {
        var editor,
            _this = this,
            row = _this.p.data[ri],
            rowID = row.rowID,
            grid = _this.getControlGrid(),
            enable = value[2],
            editOpt = _this.getCellEditOpt(ri, ci);

        cell.html("");
        opt.rowID = rowID;
        cell[0].style.height = rowHeight + "px";//兼容FireFox,IE

        var hitTest = function (editor) {
            var tr = editor.parents("tr");
            return parseInt($.ygrid.stripPref($.ygrid.uidPref, tr[0].id), 10);
        }
        switch (editOpt.editOptions.cellType) {
            case YIUI.CONTROLTYPE.BUTTON:
                var icon = "";
                if (opt.icon) {
                    icon = "<span class='icon button' style='background-image: url(Resource/" + opt.icon + ")'></span>";
                }
                editor = $("<div class='ui-btn button cellEditor'>" + "<button>" + icon
                    + "<span class='txt button'>" + (value[1] == null ? "" : value[1]) + "</span></button></div>");
                editor[0].enable = enable;
                // 兼容IE
                if( $.browser.isIE && editOpt.key && editOpt.key.toLowerCase().indexOf('upload') != -1 ) {
                    $("<input type='file' class='upload' name='file'/>").appendTo(editor);
                }
                editor.appendTo(cell);
                editor.mousedown(function (e) {
                    e.target.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                    e.target.enable && $(this).removeClass("hover");
                });

                // delegate!!
                editor.delegate("button,input.upload","click",function (e) {
                    var target = e.target;
                    if ( !$(target).closest(".cellEditor")[0].enable ) {
                        e.stopPropagation();
                        return false;
                    }
                    if( $(target).hasClass('upload') ) {
                        window.up_target = target;
                    }
                    grid.gridHandler.doOnCellClick(grid, hitTest(editor), ci);
                    e.stopPropagation();
                });

                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case YIUI.CONTROLTYPE.HYPERLINK:
                var showV = (value[1] == null ? "" : value[1]);
                editor = $("<a class='ui-hlk cellEditor'>" + showV + "</a>");
                editor[0].enable = enable;

                var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
                switch (opt.targetType) {
                    case YIUI.Hyperlink_TargetType.Current:
                        showTarget = YIUI.Hyperlink_TargetType.Str_Current;
                    case YIUI.Hyperlink_TargetType.NewTab:
                        if (opt.url != null && opt.url.length > 0) {
                            editor.attr("href", opt.url);
                        }
                        editor.attr("target", YIUI.Hyperlink_target[showTarget]);
                        break;
                }
                editor.mousedown(function (e) {
                    e.delegateTarget.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                    e.delegateTarget.enable && $(this).removeClass("hover");
                });
                editor.click(function (e) {
                    if ( !this.enable ) {
                        e.stopPropagation();
                        return false;
                    }
                    if (opt.url && opt.targetType == YIUI.Hyperlink_TargetType.New) {
                        window.open(opt.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                    } else if (!opt.url) {
                        grid.gridHandler.doOnCellClick(grid, hitTest(editor), ci);
                    }
                    e.stopPropagation();
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case YIUI.CONTROLTYPE.CHECKBOX:
                var editor = $("<span class='cellEditor chk'/>");
                if( YIUI.TypeConvertor.toBoolean(value[0]) ) {
                    editor.addClass('checked');
                }
                editor.attr('enable',value[2]);
                cell.prepend(editor);
                cell.addClass("checkbox");
                editor.click(function (e) {
                    if( $(this).attr('enable') === 'true' ) {
                        var grid = _this.getControlGrid(),
                            value = !$(this).hasClass('checked'),
                            rowIndex = hitTest(editor);

                        grid.doSelect(rowIndex,ci,value,e.shiftKey);
                    }
                });
                break;
            case YIUI.CONTROLTYPE.TEXTAREA:
                opt.enable = value[2];
                opt.value  = value[1];
                opt.selectOnFocus = false;
                var cellTextArea = new YIUI.CellEditor.CellTextArea(opt);
                cellTextArea.render(cell);
                var editor = cellTextArea.getEl();
                var rowIndex = hitTest(editor), value = editor.val(), grid = _this.getControlGrid();
                cellTextArea.saveCell =  function(value){
                    grid.doSelect(rowIndex, ci, value, false);
                };
                cell.addClass("ui-edit-cell");
                cellTextArea.install();
                break;    
            case YIUI.CONTROLTYPE.IMAGE:
                opt.ofFormID = grid.ofFormID;
                opt.enable = enable;
                opt.value = value[0];
                opt.gridKey = grid.key;
                editor = new YIUI.CellEditor.CellImage(opt);
                editor.render(cell);
                editor.setEnable(enable);
                editor.saveCell = function (value) {
                    _this.getControlGrid().setValueAt(hitTest(editor.getEl()), ci, value, true, true);
                };
                editor.yesCom.click = function () {
                    if(this.enable) {
                        grid.gridHandler.doOnCellClick(grid, hitTest(editor.getEl()), ci);
                    }
                }
                cell.attr("title", editor.pathV);
                cell[0].editor = editor;
                break;
            case YIUI.CONTROLTYPE.LABEL:
                var showV = (value[1] == null ? "" : value[1]);
                editor = $("<div class='cellEditor'>" + showV + "</div>");
                editor[0].enable = enable;
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
        }
    },

    gotoPage: function (page) {
        return this.gridHandler.doGoToPage(this, page - 1 );
    },

    // 滚动分页:rowNum=50,非滚动分页:显示全部,rowNum无用
    initPageOpts: function () {
        if( this.getMetaObj().pageLoadType != YIUI.PageLoadType.NONE ) {
            var form = YIUI.FormStack.getForm(this.ofFormID),count;
            if (this.getMetaObj().pageLoadType == YIUI.PageLoadType.DB) {
                count = YIUI.TotalRowCountUtil.getRowCount(form.getDocument(), this.tableKey);
            } else {
                count = form.getDocument().getByKey(this.tableKey).size();
            }
            this.pageInfo.totalRowCount = count;
            this.pageInfo.calcPage();
        } else {
            this.pageInfo.totalRowCount = this.dataModel.data.length;
        }
    },

    rowOptFunc: function (cmd) {
        var self = this;
        var grid = self.getControlGrid();
        switch ( cmd ) {
        case "add":
            grid.insertRow(-1, true);
            break;
        case "del":
            grid.deleteGridRow(-1, true);
            break;
        case "upRow":
            grid.gridHandler.doShiftUpRow(grid, self.p.selectModel.focusRow);
            break;
        case "downRow":
            grid.gridHandler.doShiftDownRow(grid, self.p.selectModel.focusRow);
            break;
        }
    },

    onSortClick: function (ci, sortType) {
        this.gridHandler.doOnSortClick(this, ci, sortType);
    },

    //行点击事件
    clickRow:function (newRowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnRowClick(grid, newRowIndex);
    },

    //行切换事件
    focusRowChanged:function (newRowIndex, oldRowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.rowChange(grid, newRowIndex, oldRowIndex);
    },

    // 行双击事件
    dblClickRow: function (rowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnRowDblClick(grid, rowIndex);
    },

    // 单元格双击事件
    dblClickCell: function (rowIndex, colIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnCellDblClick(grid, rowIndex, colIndex);
    },

    getFocusRowIndex: function () {
        if(this.el){
            return this.el.getFocusRowIndex();
        }
        return -1;
    },
    getFocusColIndex: function () {
        if(this.el){
            return  this.el.getFocusColIndex();
        }

        return -1;
    },

    getControlGrid: function () {
        return this;
    },
    //初始化表格构建相关的属性
    initOptions: function () {

        var metaObj = this.getMetaObj();

        this.options = {
            populate: false,
            selectionMode: metaObj.selectionMode,
            treeIndex: this.treeIndex,
            treeExpand: this.treeExpand,
            rowExpandIndex: this.rowExpandIndex,
            rowSequences: this.showRowHead,
            enable: metaObj.editable,
            colModel: this.dataModel.colModel.columns,
         //   data: this.dataModel.data,
            navButtons: {
                add: metaObj.canInsert, addIcon: "ui-icon-plus", addFunc: this.rowOptFunc,
                del: metaObj.canDelete, delIcon: "ui-icon-trash", delFunc: this.rowOptFunc,
                upRow: metaObj.canShift, upRowIcon: "ui-icon-up", upRowFunc: this.rowOptFunc,
                downRow: metaObj.canShift, downRowIcon: "ui-icon-down", downRowFunc: this.rowOptFunc,
                bestWidth: true, bestWidthIcon:"ui-icon-bestwidth",
                frozenRow: metaObj.frozenRow, frozenRowIcon:"ui-icon-frozenRow",
                frozenColumn: metaObj.frozenColumn, frozenColumnIcon:"ui-icon-frozenColumn"
            },
            createCellEditor: this.createCellEditor2,
            // endCheck: this.endCheck,
            alwaysShowCellEditor: this.alwaysShowCellEditor,
            afterEndCellEditor: this.afterEndCellEditor,
            extKeyDownEvent: this.extKeyDownEvent,
            onSortClick: this.onSortClick,
            clickRow: this.clickRow,
            focusRowChanged: this.focusRowChanged,
            dblClickRow: this.dblClickRow,
            dblClickCell: this.dblClickCell,
            getControlGrid: this.getControlGrid,
            pageInfo: this.pageInfo,
            gotoPage: this.gotoPage,
            rowNumChange: this.rowNumChange,
            rowList: this.rowList,
            freezeRowCnt: metaObj.freezeRowCnt,
            freezeColCnt: metaObj.freezeColCnt,
            selectFieldIndex: this.selectFieldIndex,
            scrollPage: metaObj.pageLoadType == YIUI.PageLoadType.NONE || this.hasTree || this.hasRowExpand
        };
    },

    setGroupHeaders:function (groupHeaders) {
        this.groupHeaders = groupHeaders;
    },

    onRender: function (parent) {
        var self = this;
        this.base(parent);
        var $t = this.el[0];
        $t.getControlGrid = function () {
            return self;
        };
        this.initPageOpts();
        this.initOptions();
        this.el.yGrid(this.options);
        $t.p.data = this.dataModel.data;
        this.el.buildGroupHeaders(this.groupHeaders);
        $t.reloadGrid();
        this.refreshSelectAll();
        this.options = null;
    },

    reset: function () {
        this.pageInfo.reset();
        this.clearGridData();
    },

    beforeDestroy: function () {
        this.dataModel = null;
        this.groupHeaders = null;
        this.errorInfoes = null;
        this.el && this.el.GridDestroy();
    }
});

YIUI.Control.Grid = YIUI.extend(YIUI.Control.Grid, {   //纯web使用的一些方法
    rowIDMask: 0,
    randID: function () {
        return this.rowIDMask++;
    },
    setEnable: function (enable) {
        this.base(enable);

        var el = this.el;
        if( !el ) {
            return;
        }

        this.el[0].p.enable = enable;
        el.prop("disabled",false); // IE!!

        if (this.condition && this.getRowCount() > 0) {
            return this.refreshOpt();
        }

        if( this.hasTree || this.hasRowExpand ) {
            return this.refreshOpt();
        }

        if( enable ) {
            if( this.hasGroupRow && this.hideGroup4Editing ) {
                var data = this.dataModel.data,row;
                for( var i = data.length - 1; row = data[i]; i-- ) {
                    if( row.rowType == 'Group' ) {
                        data.splice(i,1);
                        this.el && this.el[0].deleteGridRow(i);
                    }
                }
            }
            if( this.hasDetailRow && this.newEmptyRow ) {
                if( this.isSubDetail ) {
                    var form = YIUI.FormStack.getForm(this.ofFormID),
                        par = YIUI.SubDetailUtil.getBindingGrid(form,this),
                        focusRow = par.getFocusRowIndex();
                    if( $.isNumeric(focusRow) && focusRow != -1 ) {
                        this.appendAutoRowAndGroup();
                    }
                } else {
                    this.appendAutoRowAndGroup();
                }
            }
        } else {
            this.removeAutoRowAndGroup();
        }

        this.refreshOpt();
    },

    setColumnVisible: function (index, visible, refreshGrid) {

        var _this = this,
            changed = false;

        if( !_this.impl_setVisible ) {
            _this.impl_setVisible = function (i,v) {
                var column = _this.dataModel.colModel.columns[i];
                var changed = (column.hidden == v);
                column.hidden = !v;
                return changed;
            }
        }

        if( $.isArray(index) ) {
            // 列拓展,不考虑返回值
            for( var i = 0,size = index.length;i < size;i++ ) {
                _this.impl_setVisible(index[i],visible[i]);
            }
        } else {
            changed = _this.impl_setVisible(index,visible);
        }

        if ( refreshGrid ) {
            this.refreshGrid();
        }
        return changed;
    },
    // 非拓展单元格使用
    setValueByKey: function (rowIndex, cellKey, newValue, commitValue, fireEvent) {
        var form = YIUI.FormStack.getForm(this.ofFormID),
            loc = form.getCellLocation(cellKey);
        this.setValueAt(rowIndex,loc.column,newValue,commitValue,fireEvent);
    },
    setCellBackColor: function (rowIndex, colIndex, color) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellBackColor(rowIndex, colIndex, color);
    },
    setCellForeColor: function (rowIndex, colIndex, color) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellForeColor(rowIndex, colIndex, color);
    },
    setFocusCell: function (rowIndex, colIndex) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellFocus(rowIndex, colIndex);
    },

    setCaptionAt: function (rowIndex, colIndex, caption) {
        var cellData = this.getCellDataAt(rowIndex,colIndex);
        cellData[1] = caption;
    },

    setValueAt: function (rowIndex, colIndex, newValue, commitValue, fireEvent, ignoreChanged) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;

        var _this = this;

        var editOpt = _this.getCellEditOpt(rowIndex,colIndex);

        var cellData = _this.getCellDataAt(rowIndex,colIndex);

        var isChanged = _this.checkAndSet2(editOpt, rowIndex, colIndex, newValue,
            function(val) {

                cellData[0] = val;

                //显示单元格内容，为异步处理,这个异步 导致 表格连续插行设置不能在第一行之前插,
                //应该一直从最后插
                _this.endCheck2(editOpt, rowIndex, colIndex, val)
                    .done(function(text){

                        // 异步设值的情况下可能当前界面已经不存在,saveData();close()
                        if( _this.isDestroyed ) {
                            return;
                        }

                        //计算caption 为异步， 分页情况下 单元格可能不正确，
                        //此时需判断，model中的行列数，并且判断 是否是原来的cellmodel
                        var rows = _this.dataModel.data;
                        if(rowIndex >= rows.length){
                            return;
                        }

                        var cells = rows[rowIndex].data;
                        if(colIndex >= cells.length){
                            return;
                        }

                        if(cellData == cells[colIndex]){
                            cellData[1] = text;

                            if(!_this.el){
                                return ;
                            }

                            _this.el.updateCell(rowIndex, colIndex, cellData);
                        }
                    });
            });

        if(isChanged && !ignoreChanged) {
            var form = YIUI.FormStack.getForm(this.ofFormID);

            if (commitValue) {
                this.gridHandler.setCellValueToDocument(form, this, rowIndex, colIndex);
            }

            form.getViewDataMonitor().preFireCellValueChanged(this, rowIndex, colIndex, editOpt.key);

            if (fireEvent) {
                this.gridHandler.fireEvent(form, this, rowIndex, colIndex);
            }

            form.getViewDataMonitor().postFireCellValueChanged(this, rowIndex, colIndex, editOpt.key);
        } else {
            this.el && _this.el.updateCell(rowIndex, colIndex, cellData);
        }
    },

    /**
     * 统一使用此方法获取单元格配置对象
     */
    getCellEditOpt: function (rowIndex,colIndex) {
        var row = this.dataModel.data[rowIndex];

        return this.getMetaObj().rows[row.metaRowIndex].cells[colIndex];
    },

    getMetaCellByColumnKey: function (columnKey) {
        var detailRow = this.getDetailMetaRow();
        if( !detailRow ) {
            return null;
        }
        var metaCell,
            _columnKey;
        for( var i = 0,size = detailRow.cells.length;i < size;i++ ) {
            metaCell = detailRow.cells[i];
            _columnKey = metaCell.columnKey;
            if( _columnKey && _columnKey == columnKey ) {
                return metaCell;
            }
        }
        return null;
    },

    // 非拓展时使用
    getValueByKey: function (rowIndex, cellKey) {
        var form = YIUI.FormStack.getForm(this.ofFormID),
            loc = form.getCellLocation(cellKey);
        return this.getValueAt(rowIndex, loc.column);
    },

    // 统一取值公式
    getValueAt: function (rowIndex, colIndex) {
        if( rowIndex == -1 || colIndex == -1 ) {
            return null;
        }
        return this.dataModel.data[rowIndex].data[colIndex][0];
    },

    /**
     *  提供给函数等外部使用使用的插行方法,插入空白行以及树形行
     * @param rowIndex 插行的位置
     */
    insertRow:function (rowIndex,fireEvent) {
        if( !this.impl_insertRow ) {
            if( this.treeIndex == -1 ) {
                this.impl_insertRow = function (rowIndex,fireEvent) {
                    var detailRow = this.getDetailMetaRow();
                    if( !detailRow )
                        return -1;
                    var level = 0;
                    if( rowIndex != -1 && rowIndex < this.getRowCount() ) {
                        var row = this.getRowDataAt(rowIndex);
                        if( row.rowType == 'Detail' ) {
                            level = row.rowGroupLevel;
                        } else {
                            return -1;
                        }
                    }

                    // 去掉当前行样式
                    if( this.el ) {
                        this.el[0].unselectGridRow(rowIndex);
                    }

                    var ri = this.addGridRow(rowIndex,detailRow,null,level,fireEvent);

                    if( !this.el ) return ri;

                    // 如果有焦点列,设置焦点
                    var ci = this.getFocusColIndex();
                    if( ci >= 0 ) {
                        this.el.setCellFocus(ri,ci);
                    }
                    return ri;
                }
            } else {
                this.impl_insertRow = function (rowIndex,fireEvent) {
                    var detailRow = this.getDetailMetaRow();
                    if( !detailRow )
                        return -1;
                    var row,
                        parent,
                        index,
                        treeLevel;
                    if( rowIndex != -1 && rowIndex < this.getRowCount() ) {
                        row = this.getRowDataAt(rowIndex);
                        treeLevel = row.treeLevel;
                        if( row.childRows ) {
                            parent = row;
                            index = rowIndex + row.childRows.length + 1;
                            treeLevel++;
                        } else if ( !row.parentRow ) {
                            parent = row;
                            index = rowIndex + 1;
                            treeLevel++;
                        } else {
                            parent = row.parentRow;
                            index = rowIndex;
                        }
                    }

                    // 去掉当前行样式
                    if( this.el ) {
                        this.el[0].unselectGridRow(rowIndex);
                    }

                    var ri = this.addGridRow(index,detailRow,null,0,fireEvent,function (rowData) {
                        rowData.treeLevel = treeLevel;
                        rowData.isLeaf = true;
                        rowData.parentRow = parent;
                    });

                    var newRow = this.getRowDataAt(ri);
                    if( parent != null ) {
                        if( !parent.childRows ) {
                            parent.childRows = [];
                        }
                        parent.childRows.push(newRow.rowID);
                        parent.isLeaf = false;
                    }

                    if( !this.el ) return ri;

                    // 如果有焦点列,设置焦点
                    var ci = this.getFocusColIndex();
                    if( ci >= 0 ) {
                        this.el.setCellFocus(ri,ci);
                    }
                    return ri;
                }
            }
        }
        if( rowIndex == -1 ) {
            rowIndex = this.getFocusRowIndex();
        }
        return this.impl_insertRow(rowIndex,fireEvent);
    },

    addGridRow: function (rowIndex, metaRow, bookmarkRow, groupLevel, fireEvent, fn) {
        rowIndex = parseInt(rowIndex, 10);

        var rowData = YIUI.GridUtil.initRowData(this, metaRow, bookmarkRow, groupLevel);

        var data = this.dataModel.data,
            index;
        if (rowIndex >= 0) {
            index = rowIndex;
            data.splice(rowIndex, 0, rowData);
        } else {
            index = data.length;
            data.push(rowData);
        }

        $.isFunction(fn) && fn.call(this,rowData);

        // 如果已经render,在重新加载数据的时候,列的数量可能不一致,后面会重新reload加载行
        if( this.el && metaRow.cells.length == this.el[0].getColumnCount() ) {
            this.el[0].insertGridRow(index, rowData, fireEvent);
        }

        this.gridHandler.rowInsert(this,index,fireEvent);

        return index;
    },

    appendAutoRowAndGroup:function () {
        this.removeAutoRowAndGroup();
        // 添加空白行
        var rowData,emptyInsert,index;
        for( var i = this.getRowCount() - 1; i >= 0; --i ) {
            index = this.appendEmptyRow(i);
            if( !emptyInsert && index != -1 ) {
                emptyInsert = true;
            }
        }

        // 添加空白分组
        if( this.hasGroupRow && !this.hideGroup4Editing ) {
            this.appendEmptyGroup();
            emptyInsert = true;
        }

        // 如果没插入行,插入一行空白行
        if ( !emptyInsert ) {
            var rowIndex = this.getRowCount() - this.bottomFixRowCount;
            this.addGridRow(rowIndex,this.getDetailMetaRow(),null,0,true);
        }
    },

    appendEmptyRow:function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex),
            metaObj = this.getMetaObj(),
            metaRow = metaObj.rows[rowData.metaRowIndex];

        var nextIndex = rowIndex + 1,
            preIndex = rowIndex - 1;

        switch ( rowData.rowType ) {
        case "Detail":
            if( nextIndex < this.getRowCount() ) { // 1.非最后一行
                var nextRow = this.getRowDataAt(nextIndex),
                    nextType = nextRow.rowType;
                if( nextType === 'Group' || nextType === 'Total' || nextType === 'Fix' ) {
                    return this.addGridRow(nextIndex,this.getDetailMetaRow(),null,rowData.rowGroupLevel,true);
                }
            } else {  // 2.最后一行
                return this.addGridRow(nextIndex,this.getDetailMetaRow(),null,rowData.rowGroupLevel,true);
            }
            break;
        case "Fix":
            if( metaRow.isAreaHead ) { // 1.非最后一行
                if( nextIndex < this.getRowCount() ) {
                    var nextRow = this.getRowDataAt(nextIndex);
                    if( nextRow.rowType !== 'Detail' ) {
                        return this.addGridRow(nextIndex,metaObj.rows[metaRow.detailIndex],null,rowData.rowGroupLevel,true);
                    }
                } else { // 2.最后一行
                    return this.addGridRow(nextIndex,metaObj.rows[metaRow.detailIndex],null,rowData.rowGroupLevel,true);
                }
            } else if ( metaRow.isAreaTail ) {
                if( preIndex >= 0 ) {
                    var preRow = this.getRowDataAt(preIndex);
                    if( preRow.rowType !== 'Detail' ) {
                        return this.addGridRow(rowIndex,metaObj.rows[metaRow.detailIndex],null,rowData.rowGroupLevel,true);
                    }
                } else {
                    return this.addGridRow(rowIndex,metaObj.rows[metaRow.detailIndex],null,rowData.rowGroupLevel,true);
                }
            }
            break;
        }
        return -1;
    },

    appendEmptyGroup:function () {

        var _this = this;

        // 静态私有方法
        var createNewGroup = function(groupLevel,groupRow){
            var rowObject;
            for( var i = 0,size = groupRow.objectArray.length; i < size;i++ ) {
                rowObject = groupRow.objectArray[i];
                if( rowObject.objectType === YIUI.MetaGridRowObjectType.ROW ) {
                    if( rowObject.rowType === 'Detail' ) {
                        groupLevel++;
                    }
                    var rowIndex = _this.getRowCount() - _this.bottomFixRowCount;
                    var metaRow = _this.getMetaObj().rows[rowObject.rowIndex];
                    var newRowIndex = _this.addGridRow(rowIndex,metaRow,null,groupLevel,true);
                    var rowData = _this.getRowDataAt(newRowIndex);
                    rowData.inAutoGroup = true;
                    if( rowObject.rowType === 'Detail' ) {
                        groupLevel--;
                    }
                } else {
                    groupLevel++;
                    createNewGroup(groupLevel,rowObject);
                    groupLevel--;
                }
            }
        }

        createNewGroup(0,this.getMetaObj().rootGroup);
    },

    // 去除所有空白行以及空白分组
    removeAutoRowAndGroup: function () {
        var data = this.dataModel.data, row;
        for (var i = data.length - 1; row = data[i]; i--) {
            if ( row.inAutoGroup || YIUI.GridUtil.isEmptyRow(row) ) {
                data.splice(i, 1);
                this.el && this.el[0].deleteGridRow(i);
            }
        }
    },

    /**
     * 删除行,静默删除,只删除模型中的行以及界面上行
     * 不删除数据
     * @param rowIndex
     */
    deleteRowAt:function (rowIndex, fireEvent) {

        var lastRow = rowIndex == this.dataModel.data.length - 1;

        var rowData = this.dataModel.data[rowIndex],
            parent = rowData.parentRow;

        // 删除模型行
        this.dataModel.data.splice(rowIndex, 1);

        // 从父行中移除
        if( parent ) {
            parent.childRows.splice(parent.childRows.indexOf(rowData.rowID),1);
        }

        if( !this.el ){
            return;
        }

        // 焦点转移
        var ri = lastRow ? rowIndex - 1 : rowIndex,ci = this.getFocusColIndex();

        // 先清空选择模型
        this.el[0].cleanSelection();

        // 删除界面行
        this.el[0].deleteGridRow(rowIndex, fireEvent);

        // 再设置焦点,避免进入编辑状态
        if ( ri >= 0 && ci >= 0 ) {
            this.el.setCellFocus(ri,ci);
        }
    },

    /**
     * 删除表格行
     * @param rowIndex
     */
    deleteGridRow: function (rowIndex,fireEvent) {
        rowIndex = parseInt(rowIndex, 10);

        var form = YIUI.FormStack.getForm(this.ofFormID);

        var isNeedDelete = function (form,grid,rowIndex) {

            if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= grid.dataModel.data.length) {
                return false;
            }

            var row = grid.dataModel.data[rowIndex];
            if (!row.isDetail) {
                return false;
            }

            if (form.getOperationState() != YIUI.Form_OperationState.Default) {

                if( !grid.newEmptyRow ) {
                    return true;
                }

                if ( YIUI.GridUtil.isEmptyRow(row) ) {
                    if (rowIndex == grid.getRowCount() - 1) {
                        return false;
                    }
                    if (grid.dataModel.data[rowIndex + 1].rowType != "Detail") {
                        return false;
                    }
                }
            }
            return true;
        };

        // 删除行数据
        var deleteDir = function (form,grid,rowIndex, fireEvent) {

            // 取出数据
            var bkmkRow = grid.dataModel.data[rowIndex].bkmkRow,bookmark;
            if( bkmkRow ) {
                if( bkmkRow.getRowType() === YIUI.IRowBkmk.Detail ) {
                    bookmark = bkmkRow.getBookmark();
                } else {
                    bookmark = bkmkRow.getRowArray();
                }
            }

            // 删除影子表数据
            grid.tableKey && deleteShadowRow(form,grid,bookmark);

            // 删除子明细数据
            !grid.hasColExpand && deleteSubDetailData(form,grid,bookmark);

            // 删除数据行
            grid.tableKey && deleteData(form,grid,bookmark);

            // 删除界面行并转移焦点
            ts.deleteRowAt(rowIndex, fireEvent);

            // 删除行事件
            grid.gridHandler.rowDelete(form,grid,rowIndex,fireEvent);
        };

        var deleteData = function (form,grid,bookmark) {
            if ( bookmark == undefined )
                return true;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            if ( $.isArray(bookmark) ) {
                for (var i = 0, len = bookmark.length; i < len; i++) {
                    dataTable.setByBkmk(bookmark[i].getBookmark());
                    dataTable.delRow();
                }
            } else {
                dataTable.setByBkmk(bookmark);
                dataTable.delRow();
            }
        }

        var deleteSubDetailData = function (form,grid,bookmark) {
            if ( bookmark == undefined )
                return;
            var delTblData = function (tbl) {
                var subTables = form.getDocument().getByParentKey(tbl.key),subTable;
                var OID = tbl.getByKey('OID'),POID;
                for( var i = 0,size = subTables.length;i < size;i++ ) {
                    subTable = subTables[i];
                    subTable.afterLast();
                    while ( subTable.previous() ) {
                        POID = subTable.getByKey('POID');
                        if ( (POID > 0 && OID === POID) || subTable.getParentBkmk() == tbl.getBkmk() ) {
                            delTblData(subTable);
                            subTable.delRow();
                        }
                    }
                }
            }
            var table = form.getDocument().getByKey(grid.tableKey);
            table.setByBkmk(bookmark);
            delTblData(table);
        }

        var deleteShadowRow = function (form,grid,bookmark) {
            var doc = form.getDocument(), dataTable = doc.getByKey(grid.tableKey);
            var shadowTbl = doc.getShadow(grid.tableKey);
            if( !shadowTbl )
                return;
            if( $.isArray(bookmark) ) {
                for( var i = 0,size = bookmark.length;i < size;i++ ) {
                    dataTable.setByBkmk(bookmark[i]);
                    var bookmark = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                    if( bookmark != -1 ) {
                        shadowTbl.setByBkmk(bookmark);
                        shadowTbl.setState(DataDef.R_New);// 置为新增状态,直接删除
                        shadowTbl.delRow();
                    }
                }
            } else {
                dataTable.setByBkmk(bookmark);
                var bookmark = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                if( bookmark != -1 ) {
                    shadowTbl.setByBkmk(bookmark);
                    shadowTbl.setState(DataDef.R_New);// 置为新增状态,直接删除
                    shadowTbl.delRow();
                }
            }
        }

        // 递归删除子行及自己
        var deleteTreeRow = function (form,grid,rowData,fireEvent) {
            var childRows = rowData.childRows, _child;
            if( childRows ) {
                for( var i = childRows.length - 1;i >=0;i-- ) {
                    _child = grid.getRowDataByID(childRows[i]);
                    if( !_child.isLeaf && _child.childRows ) {
                        deleteTreeRow(form,grid,_child,fireEvent);
                    } else {
                        deleteDir(form,grid,grid.getRowIndexByID(childRows[i]),fireEvent);
                    }
                }
            }
            deleteDir(form,grid,grid.getRowIndexByID(rowData.rowID),fireEvent);
        }

        var ts = this;

        // 批量删除
        if( rowIndex == -1 && this.selectFieldIndex != -1 ) {
            var indexes = [], v;
            for( var i = this.getRowCount() - 1;i >= 0; --i ) {
                v = this.getValueAt(i, this.selectFieldIndex);
                if( YIUI.TypeConvertor.toBoolean(v) && isNeedDelete(form,this,i) ) {
                    indexes.push(i);
                }
            }
            if( indexes.length > 0 ) {
                var options = {
                    msg: YIUI.I18N.grid.whetherAll,
                    msgType: YIUI.Dialog_MsgType.YES_NO
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
                dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                    for( var i = 0,length = indexes.length;i < length;i++ ) {
                        deleteDir(form,ts,indexes[i],fireEvent);
                    }
                });
            }
            return true;
        }

        if( rowIndex == -1 ) {
            rowIndex = this.getFocusRowIndex();
        }

        if (!isNeedDelete(form,this,rowIndex)) {
            return false;
        }

        var rowData = this.dataModel.data[rowIndex];
        if ( !YIUI.GridUtil.isEmptyRow(rowData) ) {
            if( form.getDocument().getByParentKey(this.tableKey).length > 0 && fireEvent ) {
                var options = {
                    msg: YIUI.I18N.grid.whetherEmpty,
                    msgType: YIUI.Dialog_MsgType.YES_NO
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
                dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                    deleteDir(form,ts,rowIndex,fireEvent);
                });
            } else if ( ts.treeIndex != -1 && rowData.childRows ) {
                var options = {
                    msg: YIUI.I18N.grid.whetherEmpty,
                    msgType: YIUI.Dialog_MsgType.YES_NO
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
                dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                    deleteTreeRow(form,ts,rowData,fireEvent);
                });
            } else {
                deleteDir(form,ts,rowIndex,fireEvent);
            }
        } else {
            deleteDir(form,ts,rowIndex,fireEvent);
        }
        return true;
    },

    /**
     * 是否有空白编辑行
     */
    hasAutoRow: function () {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i], isDetail = row.isDetail, bookmark = parseInt(row.bookmark, 10);
            if (isNaN(bookmark) && isDetail) return true;
        }
        return false;
    },

    /**
     * 根据rowID获得表格行数据的序号
     * @param rowID   表格行数据的标识
     * @returns {number} 表格数据行序号
     */
    getRowIndexByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  i;
        }
        return -1;
    },
    getRowDataByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  row;
        }
        return null;
    },
    getRowDataAt: function (rowIndex) {
        return this.dataModel.data[rowIndex];
    },
    getCellDataAt: function (rowIndex, colIndex) {
        return this.dataModel.data[rowIndex].data[colIndex];
    },
    setColumnEnable: function (colIndex, enable) {
        this.dataModel.colModel.columns[colIndex].editable = enable;
    },
    getColumnAt: function (colIndex) {
        return this.dataModel.colModel.columns[colIndex];
    },

    // 设置单元格可用
    setCellEnable: function (rowIndex, colIndex, enable) {
        var editOpt = this.getCellEditOpt(rowIndex, colIndex);
        if ( !editOpt || editOpt.edittype == "label" )
            return;

        this.dataModel.data[rowIndex].data[colIndex][2] = enable;

        if( !this.el )
            return;

        this.el.setCellEnable(rowIndex, colIndex, enable);
    },

    // 设置单元格必填
    setCellRequired: function (rowIndex, cellIndex, isRequired) {
        var cellData = this.getCellDataAt(rowIndex, cellIndex);
        cellData[3] = isRequired;
        if( !this.el )
            return;
        this.el.setCellRequired(rowIndex, cellIndex, isRequired);
    },

    // 设置单元格错误
    setCellError: function (rowIndex, colIndex, error, errorMsg) {
        var cellData = this.getCellDataAt(rowIndex,colIndex);
        cellData[4] = error;
        cellData[5] = errorMsg;
        if( !this.el )
            return;
        this.el.setCellError(rowIndex, colIndex, error, errorMsg);
    },

    // 设置行错误
    setRowError: function (rowIndex,error,errorMsg,errorSource) {
        var rowData = this.getRowDataAt(rowIndex);
        rowData.error = error;
        rowData.errorMsg = errorMsg;
        rowData.errorSource = errorSource;
        if( !this.el )
            return;
        this.el.setRowError(rowIndex,error,errorMsg);
    },

    // 设置行可见
    setRowVisible: function (rowIndex,visible) {
        var rowData = this.getRowDataAt(rowIndex);
        rowData.visible = visible;
        if( !this.el )
            return;
        this.el.setRowVisible(rowIndex,visible);
    },

    // 重新render!!
    refreshGrid: function () {
        if( !this.el )
            return;

        this.getOuterEl().remove();
        if( this.container ) {
            this.onRender(this.container);
            this.afterRender();
        }
        this.lastSize.width > 0 && this.el.setGridWidth(this.lastSize.width);
        this.lastSize.height > 0 && this.el.setGridHeight(this.lastSize.height);
    },

    load: function (construct) {
        var form = YIUI.FormStack.getForm(this.ofFormID);

        YIUI.SubDetailUtil.clearSubDetailData(form, this);

        var show = new YIUI.ShowGridData(form, this);
        show.load(construct);

        form.getUIProcess().resetComponentStatus(this);

        this.refreshGrid();
    },

    loadSubDetail: function () {
        var form = YIUI.FormStack.getForm(this.ofFormID);

        YIUI.SubDetailUtil.clearSubDetailData(form, this);

        var show = new YIUI.ShowSubDetailData(form, this);
        show.load();
    },

    refreshOpt: function () {
        this.el && this.el[0].updateToolBox();
    },

    clearGridData: function () {
        this.dataModel.data.length = 0;
        this.el && this.el[0].cleanSelection();
        this.el && this.el.clearGridData();
        this.rowIDMask = 0;
    },

    clearAllRows: function(fireEvent) {
        console.log("todo clearAllRows");
    },

    getPageInfo: function () {
        return this.pageInfo;
    },

    getRowCount: function () {
        return this.dataModel.data.length;
    },
    /**
     * 获取表格某个字段的值的集合
     */
    getFieldArray: function (form, colKey, condition) {
        var doc = form.getDocument(), list = new Array(), dataTable;
        dataTable = doc.getByKey(this.tableKey);
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var rd = this.dataModel.data[i], bookmark = rd.bookmark, cell;
            if (rd.isDetail && bookmark !== undefined) {
                dataTable.setByBkmk(bookmark);
                var isSelect = false;
                if (this.selectFieldIndex != -1) {
                    isSelect = this.getValueAt(i, this.selectFieldIndex);
                }
                if (isSelect) {
                    cell = dataTable.getByKey(colKey);
                    list.push(cell);
                }
            }
        }
        if (this.selectFieldIndex != -1 && $.isEmptyObject(list)) {
            YIUI.ViewException.throwException(YIUI.ViewException.DATA_BINDING_ERROR);
        }
        return list;
    },

    /**
     * 判断值是否为空值. null,'',undefined,0都是空值,下拉框只要选择了,就不是空值,没选''或者null
     */
    isNullValue:function (value) {
        if( value == null || value == '' ) { // 文本
            return true;
        }
        if( value instanceof Decimal ) { // 数值
            return value.isZero();
        }
        if( value instanceof YIUI.ItemData ) { // 字典
            return value.oid == 0;
        }
        if( $.isArray(value) ) { // 多选字典
            return value.length == 0;
        }
        return false;
    },

    // 非拓展使用
    setColumnCaption: function (cellKey, caption) {
        if( !this.el )
            return;

        var form = YIUI.FormStack.getForm(this.ofFormID),
            loc = form.getCellLocation(cellKey);

        var ci = loc.column + (this.showRowHead ? 1 : 0);

        $(".colCaption", this.el[0].grid.headers[ci].el).html(caption);
    },
    getColumnCount: function () {
        return this.dataModel.colModel.columns.length;
    },
    setForeColor: function (color) {
        this.el[0].p.foreColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'color': color
        });
    },
    setBackColor: function (color) {
        this.el[0].p.backColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'background-image': 'none',
            'background-color': color
        });
    },

    // 设置表格焦点行(触发事件,如行点击等)
    setFocusRowIndex: function (rowIndex,focus) {
        if( focus ) {
            this.el && this.el.setCellFocus(rowIndex,0);
        } else {
            this.el && this.el.selectRow(rowIndex,0);
        }
    },
    // 设置表格焦点(触发事件,如行点击等) // TODO
    focus: function () {
        if( !this.el )
            return;
        var row = this.getFocusRowIndex(),col = this.getFocusColIndex();
        if( row == -1 || col == -1 ) {
            this.el.setCellFocus(0,0);
        } else {
            this.el.setCellFocus(row,col);
        }
    },
    // 向焦点策略请求下一个焦点
    requestNextFocus: function () {
        this.focusManager.requestNextFocus(this);
    },

    isActivity: function () {
        var parents = this.el.parents(), parent;
        for (var i = 0, len = parents.length; i < len; i++) {
            parent = parents[i];
            if (parent.style.display == "none") {
                return false;
            }
        }
        return true;
    },

    getLastEmptyRowIndex: function () {
        for (var i = this.getRowCount() - 1; i >= 0; i--) {
            var row = this.getRowDataAt(i);
            if (row.isDetail && row.bookmark == null) {
                return  i;
            }
        }
        return -1;
    },

    // 是否需要检查全选状态
    needCheckSelect:true,

    refreshSelectAll: function () {
        if( !this.needCheckSelect || this.selectFieldIndex == -1 )
            return;
        var $check = $(".chk", $('.ui-ygrid-htable',this.getOuterEl()));
        if( $check.length == 0 )
            return;
        var selectAll = true, hasDataRow;
        for (var i = 0, len = this.getRowCount(); i < len; i++) {
            var rowData = this.getRowDataAt(i);
            if (rowData.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(rowData))
                continue;
            hasDataRow = true;
            if ( !rowData.data[this.selectFieldIndex][0] ) {
                selectAll = false;
                break;
            }
        }
        $check.removeClass('checked');
        if( hasDataRow ? selectAll : false ) {
            $check.addClass('checked');
        }
    },

    checkSelectAll: function () {
        this.el && this.el.checkSelectAll();
    },
    getHandler: function () {
        return this.gridHandler;
    },

    getDetailMetaRow: function(){
        return this.getMetaObj().rows[this.detailMetaRowIndex];
    },

    dependedValueChange: function (targetField, dependencyField, value) {
        this.gridHandler.dependedValueChange(this, targetField, dependencyField, value);
    },
    doPostCellValueChanged: function (rowIndex, dependencyField, targetField, value) {
        this.gridHandler.doPostCellValueChanged(this, rowIndex, dependencyField, targetField, value);
    }
});
YIUI.reg('grid', YIUI.Control.Grid);