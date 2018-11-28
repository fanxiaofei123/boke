/**
 * 表格插件
 */
(function ($) {
    "use strict";
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {//表格内部使用方法初始化
        version: "1.0.0",
        guid: 1,
        uidPref: 'ygd',
        minWidth: 50,
        regExp: /^#[0-9a-fA-F]{6}$/,
        format: "yyyy-MM-dd HH:mm:ss",
        msie: navigator.appName === 'Microsoft Internet Explorer',  //是否是IE
        getTextWidth: function (text, fontSize) {
            var span = document.getElementById("__getWidth");
            if (span == null) {
                span = document.createElement("span");
                span.id = "__getWidth";
                document.body.appendChild(span);
                span.style.visibility = "hidden";
                span.style.whiteSpace = "nowrap";
            }
            span.innerText = text;
            span.style.fontSize = (fontSize == null ? 15 : fontSize) + "px";
            return span.offsetWidth;
        },
        msiever: function () {     //ie版本号
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return rv;
        },
        getCellIndex: function (cell) {  //获取单元格序号
            var c = $(cell);
            if (c.is('tr')) {
                return -1;
            }
            c = (!c.is('td') && !c.is('th') ? c.closest("td,th") : c)[0];
            if ($.ygrid.msie) {
                return $.inArray(c, c.parentNode.cells);
            }
            return c.cellIndex;
        },
        formatString: function (format) { //格式化类似" {0} 共 {1} 页"的字符串，将{}按序号替换成对应的参数
            var args = $.makeArray(arguments).slice(1);
            if (format == null) {
                format = "";
            }
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        },
        stripPref: function (pref, id) {  //去除id的前缀，返回去除后的id
            var obj = $.type(pref);
            if (obj === "string" || obj === "number") {
                pref = String(pref);
                id = pref !== "" ? String(id).replace(String(pref), "") : id;
            }
            return id;
        },
        stripHtml: function (v) {  //去除html标签，返回标签内容
            v = String(v);
            var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            if (v) {
                v = v.replace(regexp, "");
                return (v && v !== '&nbsp;' && v !== '&#160;') ? v.replace(/\"/g, "'") : "";
            }
            return v;
        },
        randId: function (prefix) { //注册ID：添加前缀，进行ID分配
            return (prefix || $.ygrid.uidPref) + ($.ygrid.guid++);
        },
        intNum: function (val, defval) {
            val = parseInt(val, 10);
            if (isNaN(val)) {
                return defval || 0;
            }
            return val;
        },
        extend: function (methods) {  //继续扩展继承，主要用于添加方法
            $.extend($.fn.yGrid, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    });

    $.fn.yGrid = function (options) {
        if (this.grid) {
            return;
        }
        if (typeof options === 'string') {   //如果是字符串类型，则是执行表格的事件
            var fn = $.fn.yGrid[options];//得到表格事件
            if (!fn) {
                throw ("yGrid - No such method: " + options);
            }
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args);  //执行表格事件
        }
        return this.each(function () {
            var p = {
                enable: true,//是否可用
                width: 100, //宽度
                height: 150, //高度
                rowNum: 50, //一页显示的行数
                minColWidth:33, // 列最小宽度
                showPager: true,   //是否显示底部操作工具条
                showPageSet: true, //是否使用分页操作按钮及页码输入
                navButtons: {}, // 工具条上的操作按钮
                scrollPage: false,  //是否使用滚动来代替分页操作，及滚动翻页，如为true，则屏蔽分页操作按钮及页码输入
                colModel: [],  //列集合,其中列的属性为：name:名称,label:显示名称,sortable:排序,editable:可编辑,align:文本位置
                //    colNames: [],  //子叶列的名称(name)或者显示文本(label),比如[列1,列2]
                data: [],  //行数据，比如为[{col1:[value1-1,caption1-1],col2:[value2-1,caption2-1]},{col1:[value1-2,caption1-2],col2:[value2-2,caption2-2]}
                editCells: [],//已经进行编辑的单元格，需要进行保存单元格
                _indexMap: {},
                viewRecords: true,//是否显示数据信息，比如“1 - 10 共100条”
                rowSequences: true,//是否显示序号列
                rowSeqWidth: 48, //序号列宽度
                scrollTimeout: 40,//滚动延时时间
                lastpage: 1, //最后一页页码
                clickRow:null,//行点击事件
                focusRowChanged:null,// 焦点行切换事件
                dblClickRow: null,//行双击事件
                dblClickCell: null,//单元格双击事件
                onSortClick: null,   //表头列单元排序点击事件
                specialCellClick: null,  //点击事件，通常是特殊单元格（button，hyperlink，checkbox）的点击事件
                createCellEditor: null, //创建自定义单元格编辑组件
                alwaysShowCellEditor: null,//创建一直显示的单元格编辑组件
                checkAndSet: null,
                endCheck: null,
                endCellEditor: null, //结束自定义编辑组件
                // afterEndCellEditor: null, //结束自定义编辑组件之后的事件
                // extKeyDownEvent: null,//额外的按键事件
                // afterCopy: null, //复制后的事件
                // afterPaste: null, //粘贴后的事件
                groupHeaders: [], //多行表头信息
                bestWidthStatus: false, // 最佳列宽状态
                rowList: [] // 动态分页每页行数范围
            };
            for (var key in options) {
                var value = options[key];
                if ($.isArray(value)) {
                    p[key] = value.slice(0);
                } else {
                    p[key] = value;
                }
            }
            options = null;
            var ts = this,
                grid = {
                    headers: [], //表头的所有子叶列
                    //  cols: [],  //表格第一行的所有单元格
                    dragStart: function (i, e, y) {  //修改列大小，拖动开始
                        var gridLeftPos = $(this.bDiv).offset().left;
                        this.resizing = { idx: i, startX: e.clientX, sOL: e.clientX - gridLeftPos };
                        this.hDiv.style.cursor = "col-resize";
                        this.curGbox = $("#rs_m" + p.id, "#gbox_" + p.id);
                        this.curGbox.css({display: "block", left: e.clientX - gridLeftPos, top: y[1], height: y[2]});
                        document.onselectstart = function () {  //不允许选中文本
                            return false;
                        };

                    },
                    dragMove: function (x) {      //修改列大小，拖动中
                        if (this.resizing) {
                            var diff = x.clientX - this.resizing.startX, h = this.headers[this.resizing.idx],
                                newWidth = h.width + diff;

                            if (newWidth > ts.p.minColWidth ) {
                                this.curGbox.css({left: this.resizing.sOL + diff});
                                this.newWidth = p.tblwidth + diff;
                                h.newWidth = newWidth;
                            }

                        }
                    },
                    dragEnd: function () {         //修改列大小，拖动结束
                        this.hDiv.style.cursor = "default";
                        if (this.resizing) {
                            var idx = this.resizing.idx, nw = this.headers[idx].newWidth || this.headers[idx].width;
                            nw = parseInt(nw, 10);
                            this.resizing = false;
                            this.curGbox && this.curGbox.css({display: "none"});
                            p.colModel[idx].width = nw;
                            this.headers[idx].width = nw;
                            this.headers[idx].el.style.width = nw + "px";
                            //this.cols[idx].style.width = nw + "px";
                            $("tr.ygfirstrow td:eq("+idx+")", ts.grid.bDiv).css("width",nw + "px");
                            p.tblwidth = this.newWidth || p.tblwidth;
                            $('table:first', this.bDiv).css("width", p.tblwidth + "px");
                            $('table:first', this.hDiv).css("width", p.tblwidth + "px");
                            this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                            $(ts).triggerHandler("yGridResizeStop", [nw, idx]);
                        }
                        this.curGbox = null;
                        document.onselectstart = function () {  //允许选中文本
                            return true;
                        };
                    },
                    populateVisible: function () {
                        if (grid.timer) {
                            clearTimeout(grid.timer);
                        }
                        grid.timer = null;
                        var dh = $(grid.bDiv).height();
                        if (!dh) {
                            return;
                        }
                        var table = $("table:first", grid.bDiv);
                        var rowHeight;
                        //  取行高的算法 在行高不一致的情况下,有bug  TODO
                        if ( table[0].rows.length > 1 ) {
                            rowHeight = $(table[0].rows[1]).outerHeight();
                        } else {
                            rowHeight = grid.prevRowHeight;
                        }
                        if (!rowHeight) {
                            return;
                        }
                        grid.prevRowHeight = rowHeight;
                        var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
                        var ttop = Math.round(table.position().top) - scrollTop;
                        var tbot = ttop + table.height();
                        var div = rowHeight * p.rowNum;
                        var page, npage, empty;
                        if (tbot < dh && ttop <= 0 &&
                            (p.lastpage === undefined || parseInt((tbot + scrollTop + div - 1) / div, 10) <= p.lastpage)) {
                            npage = parseInt((dh - tbot + div - 1) / div, 10);
                            if (tbot >= 0 || npage < 2 || p.scrollPage === true) {
                                page = Math.round((tbot + scrollTop) / div) + 1;
                                ttop = -1;
                            } else {
                                ttop = 1;
                            }
                        }
                        if (ttop > 0) {
                            page = parseInt(scrollTop / div, 10) + 1;
                            npage = parseInt((scrollTop + dh) / div, 10) + 2 - page;
                            empty = true;
                        }

                        if (npage) {
                            if (p.lastpage && (page > p.lastpage || p.lastpage === 1 || (page === p.page && page === p.lastpage))) {
                                return;
                            }
                            p.page = page;
                            if (empty) {
                                grid.emptyRows.call(table[0], false);
                            }
                            grid.populate(npage);
                        }
                    },
                    scrollGrid: function (e) {

                        // 现在锁定做了table的偏移,事件暂时不需要

                        // 列动态锁定时对横向滚动做限制
                        // var nsl = grid.bDiv.scrollLeft;
                        // if( p.frozenColumns && nsl < grid.fsl ) {
                        //     grid.bDiv.scrollLeft = grid.fsl;
                        //     grid.hDiv.scrollLeft = grid.fsl;
                        //     return e.preventDefault();
                        // }

                        // 行动态锁定时对纵向滚动做限制
                        // var nst = grid.bDiv.scrollTop;
                        // if( p.frozenRows && nst < grid.fst ) {
                        //     grid.bDiv.scrollTop = grid.fst;
                        //     return e.preventDefault();
                        // }

                        // 因为滚动有延迟,所以为了保持锁定显示一致,加在最前面
                        if( p.frozenColumns ) {
                            grid.fbDiv.scrollTop( grid.bDiv.scrollTop );
                        }
                        if( p.frozenRows ) {
                            grid.fbDiv2.scrollLeft( grid.bDiv.scrollLeft );
                        }
                        if ( p.scrollPage ) {
                            var scrollTop = grid.bDiv.scrollTop;
                            if (grid.scrollTop === undefined) {
                                grid.scrollTop = 0;
                            }
                            if (scrollTop !== grid.scrollTop) {
                                grid.scrollTop = scrollTop;
                                if (grid.timer) {
                                    clearTimeout(grid.timer);
                                }

                                grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
                            }
                        }
                        grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
                        if (e) {
                            e.stopPropagation();
                        }
                    }
                },
                // 选择模型
                selectModel = {
                    selectionMode:p.selectionMode,
                    focusRow:-1,
                    focusCol:-1,
                    oldRowIndex:-1,
                    oldColIndex:-1,
                    left:-1,
                    top:-1,
                    right:-1,
                    bottom:-1,
                    changed:false,
                    select:function (left,top,right,bottom,focusRow,focusCol) {
                        switch (this.selectionMode) {
                            case YIUI.SelectionMode.RANGE:
                                this.changed = this.left !== left || this.top !== top || this.right !== right || this.bottom !== bottom
                                    || this.focusRow !== focusRow || this.focusCol !== focusCol;
                                this.left = left;
                                this.top = top;
                                this.right = right;
                                this.bottom = bottom;
                                break;
                            case YIUI.SelectionMode.ROW:
                            case YIUI.SelectionMode.CELL:
                                this.changed = this.focusRow != focusRow || this.focusCol != focusCol;
                                break;
                        }
                        this.oldRowIndex = this.focusRow;
                        this.oldColIndex = this.focusCol;
                        this.focusRow = focusRow;
                        this.focusCol = focusCol;
                        return this.changed;
                    }
                };
            p.selectModel = selectModel;
            var setColWidth = function () {    //初始化列宽，以及表格宽度
                var th = this;
                th.p.scrollOffset = 18;
                var initWidth = 0, scw = $.ygrid.intNum(th.p.scrollOffset), cw;
                $.each(th.p.colModel, function (index, col) {
                    if (this.hidden === undefined) {
                        this.hidden = false;
                    }
                    this.widthOrg = cw = $.ygrid.intNum(col.width);
                    if (this.hidden === false) {
                        initWidth += cw;
                    }
                });
                if (isNaN(th.p.width)) {
                    th.p.width = initWidth + (!isNaN(th.p.height) ? scw : 0);
                }
                grid.width = th.p.width;
                th.p.tblwidth = initWidth;
            };
            var getOffset = function (iCol) {     //获取某个列的位置信息
                var th = this, $th = $(th.grid.headers[iCol].el);
                var ret = [$th.position().left + $th.outerWidth()];
                ret[0] -= th.grid.bDiv.scrollLeft;
                ret.push($(th.grid.hDiv).position().top);
                ret.push($(ts.grid.bDiv).offset().top - $(ts.grid.hDiv).offset().top + $(ts.grid.bDiv).height());
                return ret;
            };

            /** 很据模型中的行列查询配置对象*/
            ts.getCellEditOpt = function(rowIndex, colIndex){
                var grid = ts.getControlGrid();
                return grid.getCellEditOpt(rowIndex,colIndex);
            };

            // 获取单元格value的字符串表示,用于ctrl+c,ctrl+v
            ts.getCellStringValue = function (cellType,value) {
                if( !value )
                    return "";
                switch (cellType) {
                    case YIUI.CONTROLTYPE.DICT:
                    case YIUI.CONTROLTYPE.DYNAMICDICT:
                    case YIUI.CONTROLTYPE.COMPDICT:
                        if( value instanceof YIUI.ItemData ) {
                            return $.toJSON(value);
                        }
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                        return value.Format($.ygrid.format);
                        break;
                }
                return value.toString();
            };

            var formatCol = function (column,editOpt,cellData,rowData) { //格式化单元格，主要是设置单元格属性
                var th = this, align = editOpt.align ? editOpt.align : column.align, result = ["style='"];
                if (align) {
                    result.push("text-align:");
                    result.push(align);
                    result.push(";");
                }
                if (cellData && cellData.backColor) {
                    result.push("background-color:");
                    result.push(cellData.backColor);
                    result.push(";");
                }
                if (editOpt.foreColor) {
                    result.push("color:");
                    result.push(editOpt.foreColor);
                    result.push(";");
                }
                if (column.hidden === true) {
                    result.push("display:none;");
                }

                if (cellData && (cellData.length > 4 && cellData[4] || cellData.length > 3 && cellData[3])) {
                    result.push("position:relative;");
                }

                var meta = editOpt.editOptions;

                result.push("' class='");

                if( meta ) {
                    var cellType = meta.cellType;

                    if (meta.negtiveForeColor && parseFloat(cellData[0]) < 0) {
                        result.push("color:");
                        result.push(meta.negtiveForeColor);
                    }

                    if ( cellData && !cellData[2] && !rowData.backColor ) {
                        result.push("ui-cell-disabled ");
                    }

                    if ( cellType == YIUI.CONTROLTYPE.LABEL && !rowData.backColor ) {
                        result.push("ui-cell-disabled ");
                    }

                    if ( cellType == YIUI.CONTROLTYPE.IMAGE ) {
                        result.push("ui-cell-image ");
                    }

                    if( editOpt.isAlwaysShow && cellType !== YIUI.CONTROLTYPE.LABEL ) {
                        result.push("always-show "); // 居中显示
                    } else {
                        result.push("space ");// 增加8px显示间距
                    }
                }

                result.push("'");
                if( cellData && cellData[1] ) {
                    result.push([" title='" , $.ygrid.stripHtml(cellData[1]), "' "].join(""));
                }
                result.push(" aria-describedby='");
                result.push([th.p.id, "_", column.name , "'"].join(""));
                return result.join("");
            };

            var addCell = function (column, editOpt, cellData, rowData, isTreeCol) {       //添加单元格
                var prp = formatCol.call(ts, column, editOpt, cellData, rowData);
                var tcIcon = "";
                if ( isTreeCol ) {
                    var pl = (rowData.treeLevel * 16) + "px", icon = ts.p.treeExpand ? "cell-expand" : "cell-collapse";
                    if (rowData.isLeaf) {
                        tcIcon = ["<span class='cell-treeIcon ","' style='margin-left: " , pl, "'></span>"].join("");
                    } else {
                        tcIcon = ["<span class='cell-treeIcon ", icon,"' style='margin-left: " , pl, "'></span>"].join("");
                    }
                }

                var err = "";
                if(cellData.length > 3 && cellData[3]){
                    err = ["<div class='ui-cell-required' title='","'>","</div>"].join("");
                }else if(cellData.length > 4 && cellData[4]){
                    var msg = cellData.length > 5 ? cellData[5] : '';
                    err = ["<div class='ui-cell-error' title='",msg,"'>","</div>"].join("");
                }

                return ["<td role=\"gridcell\" ", prp , ">", tcIcon, err, $.htmlEncode(cellData[1]), "</td>"].join("");
            };

            var addRowNum = function (grid, column, idx) {
                var prp = formatCol.call(ts, column, {isAlwaysShow: true,align: "center"});

                var num = idx + 1;
                if( grid.serialRowNum ) {
                    var pageInfo = grid.pageInfo,
                        pageIndex = pageInfo.curPageIndex,
                        pageCount = pageInfo.pageRowCount;
                    num += pageIndex * pageCount;
                }

                return ["<td role=\"gridcell\" class=\"ui-state-default ygrid-rownum\" " , prp, ">" , "<span>" + num + "</span>" , "</td>"].join("");
            };

            var gotBackColor = function (form,backColor,ri,ci) {
                var color = backColor;
                if( !$.ygrid.regExp.test(backColor) ) {
                    var cxt = new View.Context(form);
                    cxt.setRowIndex(ri);
                    cxt.setColIndex(ci);
                    color = form.eval(color,cxt);
                }
                return $.ygrid.regExp.test(color) ? color : "";
            }

            var addGridRow = function (form, rowData, idx) {
                var array = [], th = this, seq = th.p.rowSequences ? 1 : 0, alwaysShowIndex = [],
                    rowId = $.ygrid.uidPref + idx,grid = th.getControlGrid();

                var meta = grid.getMetaObj();
                var metaRow = meta.rows[rowData.metaRowIndex];

                // 初始化行背景色
                if( metaRow.backColor ) {
                    rowData.backColor = gotBackColor(form,metaRow.backColor,idx);
                }

                array.push(['<tr style="height:', rowData.rowHeight + 'px','" role="row" id="' , rowId , '" tabindex="-1" class="ui-widget-content ygrow ui-row-ltr">'].join(""));
                if ( seq ) {
                    array.push(addRowNum(grid, th.p.colModel[0], idx));
                }

                var column,cellData,editOptions;
                for (var j = seq ? 1 : 0;column = th.p.colModel[j]; j++) {
                    cellData = rowData.data[j - seq];
                    editOptions = th.getCellEditOpt(idx,j - seq);

                    if( editOptions.isAlwaysShow ) {
                        alwaysShowIndex.push(j);
                    }

                    if( editOptions.backColor ) {
                        cellData.backColor = gotBackColor(form,editOptions.backColor,idx,j - seq);
                    }
                    array.push(addCell(column, editOptions, cellData, rowData, column.index === th.p.treeIndex));
                }
                array.push("</tr>");

                var $table = $("table:first", th.grid.bDiv);

                $table.removeClass("ui-ygrid-empty");

                var $Row = $(array.join(''));

                var $row = $(th).getGridRowById($.ygrid.uidPref + idx);

                // 如果是往最后插或者表格还没行,直接追加
                if( idx == th.rows.length - 1 || !$row ) {
                    $table.find("tbody:first").append($Row);
                } else {
                    $Row.insertBefore($row);
                }

                var row = $Row.get(0);

                row.id = rowId;

                for (var ci = 0, alen = alwaysShowIndex.length; ci < alen; ci++) {
                    var iCol = alwaysShowIndex[ci],
                        colM = th.p.colModel[iCol],
                        colIndex = iCol - seq,
                        editOpt = th.getCellEditOpt(idx, colIndex),
                        val = rowData.data[colIndex],
                        opt = $.extend({}, editOpt.editOptions || {}, {});

                    th.p.alwaysShowCellEditor.call(th, $(row.cells[iCol]), idx, colIndex, val, opt, rowData.rowHeight);
                }

                if( th.p.treeIndex != -1 && rowData.parentRow) {
                    var index = grid.getRowIndexByID(rowData.parentRow.rowID),
                        viewRow = $(this).getGridRowById($.ygrid.uidPref + index);

                    var $td = $("td:eq("+(th.p.treeIndex + (th.p.rowSequences ? 1 : 0))+")",viewRow),
                        $span = $("span.cell-treeIcon",$td);
                    if( !$span.hasClass("cell-expand") && !$span.hasClass("cell-collapse") ){
                        $span.addClass("cell-collapse");
                    }
                    if( $span.hasClass('cell-collapse') ) {
                        $(row).hide();
                    }
                }

                // 动态分页才添加样式
                if( meta.freezeColCnt == 0 && th.p.freezeColCnt > 0 ) {
                    $("td:eq("+(th.p.freezeColCnt + (th.p.rowSequences ? 0 : -1))+")",row).addClass("frozenColumn");
                }

                if( rowData.backColor ) {
                    $(row).css('background', rowData.backColor);
                }

                if( rowData.visible === false ) {
                    $(row).hide();
                }

                return row;
            };
            var loadGridData = function (data, t, rcnt) {        //添加表格行
                if (data) {
                    if (!ts.p.scrollPage) {
                        grid.emptyRows.call(ts, false);
                        rcnt = 1;
                    } else {
                        rcnt = rcnt > 1 ? rcnt : 1;
                    }
                } else {
                    return;
                }

                var pageInfo = ts.getControlGrid().pageInfo;

                ts.p.records = pageInfo.totalRowCount;
                ts.p.page = $.ygrid.intNum(data[ts.p.localReader.page], ts.p.page);
                ts.p.reccount = data.rows.length;
                ts.p.lastpage = $.ygrid.intNum(data[ts.p.localReader.total], 1);

                var rowData,ri,form = YIUI.FormStack.getForm(ts.getControlGrid().ofFormID);
                for (var i = 0, len = data.rows.length; i < len; i++) {
                    rowData = data.rows[i];
                    ri = ts.p.data.indexOf(rowData);

                    // 添加行
                    addGridRow.call(ts, form, rowData, ri);

                    // 初始化行错误信息
                    if (rowData.error) {
                        $(ts).setRowError(i, true, rowData.errorMsg);
                    }
                }

                // 处理行锁定,只处理一次
                if( !p.frozenRows && p.freezeRowCnt > 0 ) {
                    $(ts).destroyFrozenRows();
                    $(ts).setFrozenRows();
                }

                // 处理列锁定,由于存在数据不断滚动加载,处理多次
                if( p.freezeColCnt > 0 ) {
                    $(ts).destroyFrozenColumns();
                    $(ts).setFrozenColumns();
                }

                ts.refreshIndex();
                ts.updatePager.call(ts);
            };

            var mergeCell = function () {
                var grid = ts.getControlGrid();
                if( !grid.hasCellMerge ) {
                    return;
                }

                var metaObj = grid.getMetaObj(),
                    rowData,
                    cellData;

                var resolvecspan = function (ci,span) {
                    var model = ts.p.colModel,
                        cm,
                        ret = span,
                        c = 0;
                    for( var k = ci + 1;cm = model[k] && c < span;k++,c++ ) {
                        if( cm.hidden ) {
                            ret--;
                        }
                    }
                    return ret;
                }

                var resolverspan = function (ri,span) {
                    var row,
                        ret = span,
                        c = 0;
                    for( var r = ri + 1;row = ts.rows[r] && c < span;r++,c++ ) {
                        if( $(r).is(":hidden") ) {
                            ret--;
                        }
                    }
                    return ret;
                }

                var ci = ts.p.rowSequences ? 1 : 0;

                // 直接设置colspan和rowspan
                for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                    rowData = grid.getRowDataAt(i);
                    var $row = $(ts).getGridRowById($.ygrid.uidPref + i);
                    for( var k = 0;k < rowData.data.length;k++ ) {
                        cellData = rowData.data[k];
                        if( cellData.isMerged ) {
                            var rowspan = cellData.rowspan,
                                colspan = cellData.colspan;
                            if( cellData.isMergedHead ) {
                                if (rowspan > 0) {
                                    var span = resolverspan($row.rowIndex, rowspan);
                                    $($row.cells[ci + k]).attr("rowspan", span);
                                }
                                if (colspan > 0) {
                                    var span = resolvecspan(ci, colspan);
                                    $($row.cells[ci + k]).attr("colspan", span);
                                }
                            } else {
                                $($row.cells[ci + k]).hide();
                            }
                        }
                    }
                }

                // // 直接设置colspan和rowspan
                // for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                //     rowData = grid.getRowDataAt(i);
                //     var ci = ts.p.rowSequences ? 1 : 0;
                //     for( var k = 0;k < rowData.data.length;k++ ) {
                //         cellData = rowData.data[k];
                //         if( cellData.isMerged && cellData.isMergedHead ) {
                //             var $row = $(ts).getGridRowById($.ygrid.uidPref + i),
                //                 rowspan = cellData.rowspan,
                //                 colspan = cellData.colspan;
                //             if (rowspan > 0) {
                //                 var span = resolverspan($row.rowIndex, rowspan);
                //                 $($row.cells[ci]).attr("rowspan", span);
                //                 for( var n = 1;n < span;n++ ) {
                //                     ts.rows[$row.rowIndex + n].cells[ci].remove(); // 合并行删除多余的单元格
                //                 }
                //             }
                //             if (colspan > 0) {
                //                 var span = resolvecspan(ci, colspan);
                //                 $($row.cells[ci]).attr("colspan", span); // 合并列删除多余的单元格
                //                 for (var m = 1; m < span; m++) {
                //                     $row.cells[ci + 1].remove();
                //                 }
                //                 k += span - 1;// 跳过合并区域的单元格
                //             }
                //         }
                //         ci++;
                //     }
                // }
            };

            var afterRowOpt = function (ri, isDelete) {
                var i, $t = this, idx, row,len = $t.rows.length;
                for (i = ri; i < len; i++) {
                    row = $t.rows[i];
                    idx = parseInt($.ygrid.stripPref($.ygrid.uidPref, row.id), 10);
                    idx = idx + (isDelete ? -1 : +1);
                    row.id = $.ygrid.uidPref + idx;
                    if ($t.p.rowSequences) {
                        $("span", $t.rows[i].cells[0]).html(idx + 1);
                    }
                }

                // 刷新索引
                $t.refreshIndex();
            };

            ts.refreshIndex = function () {
                ts.p._indexMap = {};

                for (var ti = 0, length = ts.rows.length; ti < length; ti++) {
                    ts.p._indexMap[$.ygrid.stripPref($.ygrid.uidPref, ts.rows[ti].id)] = ti;
                }
            };

            ts.deleteGridRow = function (ri, calTotal) {
                var th = this, row = $(th).getGridRowById($.ygrid.uidPref + ri), idx;
                if ( row ) {
                    idx = row.rowIndex;
                    $(row).remove();
                    afterRowOpt.call(th, idx, true);
                }
                calTotal && th.p.pageInfo.totalRowCount--;
                th.p.records--;
                th.p.reccount--;
                th.updatePager.call(th);
            };

            ts.insertGridRow = function (ri, rowData, calTotal) {
                var $t = this, row, lastRid = $.ygrid.stripPref($.ygrid.uidPref, $t.rows[$t.rows.length - 1].id);
                var lri = isNaN(parseInt(lastRid, 10)) ? 0 : parseInt(lastRid, 10);
                if( ri <= lri + 1 ) {
                    var form = YIUI.FormStack.getForm(ts.getControlGrid().ofFormID);
                    row = addGridRow.call($t, form, rowData, ri);
                    afterRowOpt.call($t, row.rowIndex + 1, false);
                }
                calTotal && $t.p.pageInfo.totalRowCount++;
                $t.p.records++;
                $t.p.reccount++;
                $t.updatePager.call($t);
            };

            ts.getColPos = function(colIndex){
                return colIndex + (ts.p.rowSequences ? 1 : 0);
            };

            ts.getColumnCount = function () {
                var count = ts.p.colModel.length;
                if( count > 0 ) {
                    return ts.p.rowSequences ? count - 1 : count;
                }
                return 0;
            }

            // ts.knvFocus = function () {
            //     // if(!ts.p.scrollPage){
            //     //     return;
            //     //  }
            //     window.setTimeout(function () {
            //         if( !ts.grid )
            //             return;
            //         var scrollLeft = ts.grid.bDiv.scrollLeft,
            //             scrollTop = ts.grid.bDiv.scrollTop;
            //         $("#" + ts.p.knv).attr("tabindex", "-1").focus();
            //         ts.grid.bDiv.scrollTop = scrollTop;
            //         ts.grid.bDiv.scrollLeft = scrollLeft;
            //     }, 0);
            // };

            // 同步方式
            ts.knvFocus2 = function () {
              //  window.setTimeout(function () {
                 //   if( !ts.grid )
                 //       return;
                    //  点击时调用,滚动距离不会改变
                    //  var scrollLeft = ts.grid.bDiv.scrollLeft,
                    //      scrollTop = ts.grid.bDiv.scrollTop;
                    $("#" + ts.p.knv).attr("tabindex", "-1").focus();
                    //   ts.grid.bDiv.scrollTop = scrollTop;
                    //   ts.grid.bDiv.scrollLeft = scrollLeft;
             //   }, 0);
            };

            // ts.modifyGridCell2 = function (rowIndex, colIndex, cellData, isChanged, isDynamic) {
            //     var rowId = $.ygrid.uidPref + rowIndex;
            //
            //     var row = $(this).getGridRowById(rowId);
            //     if(!$.isDefined(row)){
            //         return;
            //     }
            //
            //     var iCol = this.getColPos(colIndex);
            //
            //     var cell = row.cells[iCol];
            //
            //     if(!$.isDefined(cell)){
            //         return;
            //     }

            // 恢复显示
            // $(this).yGrid("restoreCell", row.rowIndex, iCol, cellData);

            // if( isChanged || isDynamic ) {
            //     // 值变化或者动态单元格, 刷新单元格显示值
            //     $(this).yGrid("setCell", rowId, iCol, cellData);
            //     this.p.editCells.splice(0, 1);
            // } else {
            //     // 值未变化 还原单元格样式
            //     $(this).yGrid("restoreCell", row.rowIndex, iCol, cellData);
            // }
            // };

            var initQueryData = function () {   //初始化表格数据相关信息，主要是分页信息及数据
                if (!$.isArray(ts.p.data)) {
                    return null;
                }

                var data = ts.p.data,total = data.length,
                    grid = ts.getControlGrid();

                var recordsperpage;

                if( ts.p.scrollPage ) {
                    recordsperpage = parseInt(ts.p.rowNum, 10); // 滚动分页:rowNum=50
                } else {
                    recordsperpage = ts.p.data.length; // 非滚动分页:显示全部,rowNum无用
                }

                var page = parseInt(ts.p.page, 10),
                    totalpages = Math.ceil(total / recordsperpage),
                    result = {};
                data = data.slice((page - 1) * recordsperpage, page * recordsperpage);
                result[ts.p.localReader.total] = totalpages == 0 ? 1 : totalpages;
                result[ts.p.localReader.page] = page;
                result[ts.p.localReader.records] = total;
                result[ts.p.localReader.root] = data;

                data = null;
                return  result;
            };
            grid.emptyRows = function (scroll) {
                var firstrow = ts.rows.length > 0 ? ts.rows[0] : null;
                $(this.firstChild).empty().append(firstrow);
                if (scroll && ts.p.scrollPage) {
                    $(ts.grid.bDiv.firstChild).css({height: "auto"});
                    $(ts.grid.bDiv.firstChild.firstChild).css({height: 0, display: "none"});
                    if (ts.grid.bDiv.scrollTop !== 0) {
                        ts.grid.bDiv.scrollTop = 0;
                    }
                }
            };
            grid.populate = function (npage) {        //表格载入数据计算
                var pvis = ts.p.scrollPage && npage === false, lc;
                if (ts.p.page === undefined || ts.p.page <= 0) {
                    ts.p.page = Math.min(1, ts.p.lastpage);
                }
                npage = npage || 1;
                if (npage > 1) {
                    lc = function () {
                        if (ts.p.page == 1 && ts.grid.scrollTop == 0)
                            return;
                        ts.p.page++;
                        ts.grid.hDiv.loading = false;
                        grid.populate(npage - 1);
                    };
                }
                var rcnt = !ts.p.scrollPage ? 1 : ts.rows.length;
                var req = initQueryData();
                loadGridData(req, ts.grid.bDiv, rcnt);
                mergeCell();
                if (lc) {
                    lc.call(ts);
                }
                if (pvis) {
                    grid.populateVisible();
                }
            };
            ts.updateToolBox = function () {
                var th = this,
                    grid = th.getControlGrid();

                $(["#add_" , th.id , ",#del_" , th.id, ", #upRow_" , th.id, ", #downRow_" , th.id].join("")).each(function () {
                    grid.enable ? $(this).removeClass("ui-state-disabled") : $(this).addClass("ui-state-disabled");
                });

            };
            ts.updatePager = function () {  //更新工具条，主要是分页操作按钮的显示和数据信息的显示
                var th = this, from, to, base = parseInt(th.p.page, 10) - 1,
                    grid = th.getControlGrid(),height;

                base = base * parseInt(th.p.rowNum, 10);
                to = base + th.p.reccount;
                if (th.p.scrollPage) {    //如果是滚动分页，则修改顶部div，使可见区域呈现在对应位置
                    var $rows = $("tbody:first > tr:gt(0)", th.grid.bDiv);
                    base = to - $rows.length;
                    var rh = $rows.outerHeight() || th.grid.prevRowHeight;
                    if (rh) {
                        var top = base * rh;

                        if( grid.treeIndex != -1 ) {
                            height = ($("tbody:first > tr:gt(0):visible", th.grid.bDiv).length)*rh;
                        } else {
                            height = parseInt(th.p.records, 10) * rh;
                        }

                        $(">div:first", th.grid.bDiv).css({height: height});

                        if (th.grid.bDiv.scrollTop == 0 && th.p.page > 1) {
                            th.grid.bDiv.scrollTop = th.p.rowNum * (th.p.page - 1) * rh;
                        }
                    }
                    th.grid.bDiv.scrollLeft = th.grid.hDiv.scrollLeft;
                }
                var pgboxes = th.p.pager;
                if (pgboxes) {

                    th.updateToolBox();

                    if (!th.p.scrollPage) {
                        //如果有分页操作，则更新操作按钮的显示以及输入框的页码

                        var pageInfo = this.p.pageInfo;

                        if(pageInfo == null){
                            return;
                        }

                        var totalRowCount = pageInfo.totalRowCount;

                        if(totalRowCount == 0){
                            return;
                        }

                        var curPage = pageInfo.curPageIndex + 1;

                        var pageCount = pageInfo.pageCount;

                        var _id = "_" + th.p.pager.substr(1);

                        if (curPage == 1) {
                            $("#first" + _id + ", #prev" + _id).addClass("ui-state-disabled");
                        } else {
                            $("#first" + _id + ", #prev" + _id).removeClass("ui-state-disabled");
                        }

                        if (curPage == pageCount) {
                            $("#next" + _id + ", #last" + _id).addClass("ui-state-disabled");
                        } else {
                            $("#next" + _id + ", #last" + _id).removeClass("ui-state-disabled");
                        }
                    }
                    updateViewRecords();
                }
            };

            var updateViewRecords = function(){
                if (ts.p.viewRecords) {    //如果显示数据信息，则更新相关信息

                    var pgboxes = ts.p.pager;
                    if (!pgboxes){
                        return;
                    }

                    var pageInfo = ts.p.pageInfo;

                    if(pageInfo == null){
                        return;
                    }

                    if(pageInfo.pageLoadType == YIUI.PageLoadType.NONE){

                        // $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.totalrecord, ts.p.records));

                    }else{
                        var totalRowCount = pageInfo.totalRowCount;
                        var pageRowCount = pageInfo.pageRowCount;
                        var curPage = pageInfo.curPageIndex + 1;

                        var begin = pageRowCount * (curPage - 1) + 1;
                        var end = begin + pageRowCount - 1 ;
                        end = end > totalRowCount ? totalRowCount : end;

                        if(pageInfo.pageLoadType == YIUI.PageLoadType.DB){
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.record, begin, end));
                        }else{
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.recordtext, begin, end, ts.p.records));
                        }
                    }
                }
            }

            if (ts.tagName.toUpperCase() !== 'TABLE') {
                alert($.ygrid.error.isNotTable);
                return;
            }
            if (document.documentMode !== undefined) { // IE only
                if (document.documentMode < 5) {
                    alert($.ygrid.error.isErrorMode);
                    return;
                }
            }
            $(this).empty().attr("tabindex", "0");

            this.p = p;
            this.grid = grid;

            // 如果需要序号字段
            if (ts.p.rowSequences) {
                ts.p.colModel.unshift({label: $.ygrid.defaults.seqColText, name: 'rn', width: ts.p.rowSeqWidth,
                    sortable: false, align: 'center'});
            }

            var gv = $("<div class='ui-ygrid-view'></div>");//表格主体
            $(gv).insertBefore(this);
            $(this).removeClass("scroll").appendTo(gv);
            var eg = $("<div class='ui-ygrid ui-widget ui-widget-content'></div>");  //表格整体
            $(eg).attr({id: "gbox_" + this.id, dir: "ltr"}).insertBefore(gv);
            $(gv).attr("id", this.id + "_view").appendTo(eg);
            $(this).attr({cellspacing: "0", cellpadding: "0", border: "0", "role": "grid", "aria-labelledby": "gbox_" + this.id});//表格数据主体
            this.p.id = this.id;
            ts.p.localReader = $.extend(true, {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                cell: "cell",
                id: "id"
            }, ts.p.localReader);
            //  if (ts.p.scrollPage) {   //滚动分页
            //      ts.p.showPageSet = false;
            //  }
            //初始化宽度
            setColWidth.call(ts); //初始化宽度
            $(eg).css("width", grid.width + "px");
            $(gv).css("width", grid.width + "px").before("<div class='ui-ygrid-resize-mark' id='rs_m" + ts.p.id + "'>&#160;</div>");
            //开始构建表头------------------------position:relative是为了后面动态锁定列对列头进行偏移----------------
            var hTable = $(["<table class='ui-ygrid-htable' style='width:" , ts.p.tblwidth ,
                    "px' role='ygrid' aria-labelledby='gbox_" , this.id , "' cellspacing='0' cellpadding='0' border='0'></table>"].join("")),
                hb = $("<div class='ui-ygrid-hbox-ltr'></div>").append(hTable);
            grid.hDiv = document.createElement("div");
            $(grid.hDiv).addClass('ui-ygrid-hdiv').css({ width: grid.width + "px"}).append(hb);
            grid.hDiv.onselectstart = function () {
                return false;
            };
            $(ts).before(grid.hDiv);
            var thead = ["<thead><tr class='ui-ygrid-headers' role='rowheader'>"];
            var tdc = $.ygrid.msie ? "class='ui-th-div-ie'" : "";
            var imgs = ["<span class='s-ico'/>"].join("");  //排序图标
            //添加表头单元格
            var form = YIUI.FormStack.getForm(ts.getControlGrid().ofFormID);
            var cm,name,formulaCaption;
            for (var i = 0; cm = ts.p.colModel[i]; i++) {
                name = cm.label;
                formulaCaption = cm.formulaCaption;
                if ( formulaCaption ) {
                    name = form.eval(formulaCaption, new View.Context(form));
                }
                cm.width = cm.width ? parseInt(cm.width,10) : 80;
                thead.push("<th id='");
                thead.push([ts.p.id , "_" , cm.name].join(""));
                thead.push("' role='columnheader' class='ui-state-default ui-th-column ui-th-ltr'");
                thead.push([" title=\"" , name , "\""].join(""));
                thead.push(">");
                thead.push("<div id='");
                thead.push([$.ygrid.uidPref , "_" , ts.p.id , "_" , cm.name].join(""));
                thead.push("' ");
                thead.push(tdc);
                thead.push("><span class='colCaption'>");
                if ( ts.p.selectFieldIndex != -1 && (i + (ts.p.rowSequences ? -1 : 0)) == ts.p.selectFieldIndex ) {
                    thead.push("<span class='chk'/>");
                    thead.push('<label>'+ name + '</label>');
                } else {
                    thead.push(name);
                }
                thead.push("</span>");
                thead.push(imgs);
                thead.push("</div></th>");
            }
            thead.push("</tr></thead>");
            imgs = null;
            hTable.append(thead.join(""));

            ts.setSelectAllVisible = function (singleSelect) {
                if( singleSelect ) {
                    $(".chk", hTable).hide();
                } else {
                    $(".chk", hTable).show();
                }
            }

            ts.setSelectAllVisible(ts.getControlGrid().singleSelect);

            // 全选按钮做成一直可用
            hTable.delegate(".chk","click",function (e) {
                // if( $(this).attr("enable") !== 'true' )
                //     return;
                var grid = ts.getControlGrid(),
                    value = !$(this).hasClass('checked');
                grid.needCheckSelect = false;

                grid.gridHandler.selectRange(grid,0,grid.getRowCount(),grid.selectFieldIndex,value);

                $(this).toggleClass('checked');
                grid.needCheckSelect = true;
                e.stopPropagation();
            });

            //开始处理表头单元中的一些特定功能：拖拉大小，排序图标
            thead = $("thead:first", grid.hDiv).get(0);
            var thr = $("tr:first", thead), w, sort, column;
            var firstRow = ["<tr class='ygfirstrow' role='row' style='height:auto'>"];
            var h = thr.height();
            $("th", thr).each(function (j) {
                column = ts.p.colModel[j];
                w = column.width;

                var res = document.createElement("span");
                $(res).html("&#160;").addClass('ui-ygrid-resize ui-ygrid-resize-ltr');

                var _this = $(this);
                _this.css("width", w + "px").prepend(res);
                res = null;
                var hdcol = "";
                if (column.hidden) {
                    _this.css("display", "none");
                    hdcol = "display:none;";
                }
                firstRow.push("<td role='gridcell' style='width:");
                firstRow.push(w + "px;");
                firstRow.push(hdcol);
                firstRow.push("'></td>");

                // 子叶列标志
                _this.attr("leaf",true).attr("colIndex",j);

                grid.headers[j] = {
                    caption:column.label,
                    width: w,
                    orgWidth: w,
                    orgHeight: h,
                    el: this,
                    visible: !column.hidden
                };

                // I think we should remove this !!!
                if( column.sortable ) {
                    _this.addClass("order");
                }

                $(">div", this).addClass('ui-ygrid-sortable');
            });

            // 子叶列绑定事件
            ts.bindEvents2LeafColumn = function () {

                var ts = this,
                    trs = $("tr", ts.grid.hDiv);

                $("th[leaf='true'] span.ui-ygrid-resize",trs).off("mousedown").mousedown(function (e) {
                    var th = $(this).parents("th");
                    var ci = parseInt(th.attr("colIndex"));
                    grid.dragStart(ci, e, getOffset.call(ts, ci));
                });

                $("th[leaf='true']",trs).off("click").click(function (e) {
                    var g = ts.getControlGrid();
                    if( g.hasGroupRow || g.hasColExpand || g.treeIndex != -1 || g.rowExpandIndex != -1 )
                        return;
                    var ci = parseInt($(this).attr("colIndex"));
                    var column = ts.p.colModel[ci];
                    if( !column.sortable )
                        return;
                    var colIndex = ts.p.rowSequences ? ci - 1 : ci;
                    if( colIndex == g.selectFieldIndex ) {
                        return;
                    }
                    var order = "asc";
                    if( ts.p.lastsort === ci ) {
                        order = (ts.p.sortorder == "asc" ? "desc" : "asc");
                    } else if ( ts.p.lastsort != null ) {
                        var el = ts.grid.headers[ts.p.lastsort].el;
                        // $("div span.s-ico", el).hide();
                        $("div span.s-ico",el).removeClass("ui-grid-sort-asc").removeClass("ui-grid-sort-desc");
                        $("div span.colCaption", el).css({width: "100%"});
                    }

                    var lastClass = 'ui-grid-sort-' + (order == "asc" ? "desc" : "asc"),
                        curClass = 'ui-grid-sort-' + order;
                    $("div span.s-ico", this).removeClass(lastClass).addClass(curClass).show();
                    $("div span.colCaption", this).css({width: "85%"});
                    if ($.isFunction(ts.p.onSortClick)) {
                        g.onSortClick(colIndex, order);
                    }
                    ts.p.lastsort = ci;
                    ts.p.sortorder = order;
                }).off("dblclick").dblclick(function (e) {
                    var ci = parseInt($(this).attr("colIndex"));
                    var colIndex = ts.p.rowSequences ? ci - 1 : ci;
                    if( colIndex == ts.getControlGrid().selectFieldIndex ){
                        return;
                    }
                    resizeColumn2BestWidth(ci);
                });
            };

            // 列拖动中及结束事件
            ts.bindEvents2GridView = function () {
                var ts = this,
                    gView = $(ts.grid.bDiv).parents(".ui-ygrid-view");

                gView.mousemove(function (e) {
                    if (grid.resizing) {
                        grid.dragMove(e);
                    }
                });

                $(document).bind("mouseup.yGrid" + ts.p.id, function () {
                    if (grid.resizing) {
                        grid.dragEnd();
                        return false;
                    }
                    return true;
                });
            }

            /**
             * 表格列最佳列宽
             * @param idx
             */
            var resizeColumn2BestWidth = function (idx) {
                var el = grid.headers[idx].el;
                var oldWidth = el.offsetWidth,width= $.ygrid.getTextWidth(el.innerText);
                if( $(".chk",el).length > 0 || $("div span.s-ico",el).is(":visible") ) {
                    width += 25;
                }
                $(".ygrow",ts.grid.bDiv).each(function () {
                    var td = $("td",this)[idx],tdWidth = $.ygrid.getTextWidth(td.innerText);
                    if( tdWidth > width ) {
                        width = tdWidth;
                    }
                });
                if( width < $.ygrid.minWidth ){
                    width = $.ygrid.minWidth;
                }
                grid.newWidth = p.tblwidth + (width - oldWidth);
                grid.headers[idx].newWidth = width;
                grid.resizing = {idx:idx};
                grid.dragEnd();
            }

            var resizeColumn2OrgWidth = function (idx) {
                var el = grid.headers[idx].el,
                    oldWidth = el.offsetWidth,
                    width = grid.headers[idx].orgWidth;
                grid.newWidth = p.tblwidth + (width - oldWidth);
                grid.headers[idx].newWidth = width;
                grid.resizing = {idx:idx};
                grid.dragEnd();
            }

            ts.switchWidth = function () {
                var thr = $("tr:first", thead);
                $("th", thr).each(function (i) {
                    if( ts.p.colModel[i].hidden )
                        return;
                    if( ts.p.bestWidthStatus ) {
                        resizeColumn2OrgWidth(i);
                    } else {
                        resizeColumn2BestWidth(i);
                    }
                });
                ts.p.bestWidthStatus = !ts.p.bestWidthStatus;
            }

            var frozenColumn = function (colIndex) {
                var ci = ts.p.rowSequences ? colIndex + 1 : colIndex;

                var header = ts.grid.headers[ci];
                $(header.el).addClass("frozenColumn");


                $(ts.rows).each(function () {
                    $("td:eq(" + ci + ")",this).addClass("frozenColumn");
                });


                // 冻结列
                $(ts).setFrozenColumns();
            }

            var unfrozenColumn = function (colIndex) {
                var ci = ts.p.rowSequences ? colIndex + 1 : colIndex;

                var header = ts.grid.headers[ci];
                $(header.el).removeClass("frozenColumn");

                $(ts.rows).each(function () {
                    $("td:eq(" + ci + ")", this).removeClass("frozenColumn");
                });

                // 解冻列
                $(ts).destroyFrozenColumns();
            }

            var frozenRow = function (rowIndex) {
                var viewRow = $(ts).getGridRowById($.ygrid.uidPref + rowIndex);
                if( viewRow ) {
                    $(viewRow.cells).each(function () {
                        $(this).addClass("frozenRow");
                    });
                }

                // 冻结列
                $(ts).setFrozenRows();
            }

            var unfrozenRow = function (rowIndex) {
                var viewRow = $(ts).getGridRowById($.ygrid.uidPref + rowIndex);
                if( viewRow ) {
                    $(viewRow.cells).each(function () {
                        $(this).removeClass("frozenRow");
                    });
                }

                // 解冻列
                $(ts).destroyFrozenRows();
            }

            ts.frozenRow = function ($btn,op) {
                var grid = ts.getControlGrid();
                var frozenCount = ts.p.freezeRowCnt;
                var rowIndex = grid.getFocusRowIndex();

                if( !frozenCount ) {
                    if( rowIndex == -1 ) {
                        return;
                    }
                    ts.p.freezeRowCnt = rowIndex + 1;

                    frozenRow(rowIndex);

                    $btn.attr("title",op.unfrozenrowtitle);
                    $btn.removeClass("ui-icon-frozenRow").addClass("ui-icon-unfrozenRow");
                } else {
                    ts.p.freezeRowCnt = 0;

                    unfrozenRow(frozenCount - 1);

                    $btn.attr("title",op.frozenrowtitle);
                    $btn.removeClass("ui-icon-unfrozenRow").addClass("ui-icon-frozenRow");
                }
            }

            ts.frozenColumn = function ($btn,op) {
                var grid = ts.getControlGrid();
                var frozenCount = ts.p.freezeColCnt;
                var colIndex = grid.getFocusColIndex();

                if( !frozenCount ) {
                    if( colIndex == -1 ) {
                        return;
                    }

                    // TODO support last child column
                    var ci = ts.p.rowSequences ? colIndex + 1 : colIndex;
                    var cm = ts.p.colModel[ci];
                    if( cm.parentKey ) {
                        return;
                    }

                    ts.p.freezeColCnt = colIndex + 1;

                    frozenColumn(colIndex);

                    $btn.attr("title",op.unfrozencoltitle);
                    $btn.removeClass("ui-icon-frozenColumn").addClass("ui-icon-unfrozenColumn");
                } else {
                    ts.p.freezeColCnt = 0;

                    unfrozenColumn(frozenCount - 1);

                    $btn.attr("title",op.frozencoltitle);
                    $btn.removeClass("ui-icon-unfrozenColumn").addClass("ui-icon-frozenColumn");
                }
            }

            // 注册最佳列宽事件
            $("#" + ts.p.id + "_" + ts.p.colModel[0].name,thr).dblclick(function () {
                var thr = $("tr:first", thead);
                $("th", thr).each(function (i) {
                    if( ts.p.colModel[i].hidden )
                        return;
                    resizeColumn2BestWidth(i);
                });
            });

            firstRow.push("</tr>");
            var tbody = document.createElement("tbody");
            this.appendChild(tbody);
            $(this).addClass('ui-ygrid-btable ui-ygrid-empty').append(firstRow.join(""));

            firstRow = null;
            //表头构建结束--------------------------------------

            //表格数据主体开始构建------------------------------
            if ($.ygrid.msie) {
                if (String(ts.p.height).toLowerCase() === "auto") {
                    ts.p.height = "100%";
                }
            }
            grid.bDiv = document.createElement("div");
            var height = ts.p.height + (isNaN(ts.p.height) ? "" : "px");

            $(grid.bDiv).addClass('ui-ygrid-bdiv').css("min-height",height).css("width",grid.width + "px")
                .append($('<div style="position:relative;' + ($.ygrid.msie && $.ygrid.msiever() < 8 ? "height:0.01%;" : "") + '"></div>')
                    .append("<div></div>").append(this))
                .scroll(grid.scrollGrid);

            $("table:first", grid.bDiv).css({
                width: ts.p.tblwidth + "px",
                position: "relative" //position:relative是为了后面动态锁定列对表体进行偏移
            });

            if (!$.support.tbody) { //IE
                if ($("tbody", this).length === 2) {
                    $("tbody:gt(0)", this).remove();
                }
            }
            $(grid.hDiv).after(grid.bDiv);
            // $(gv).mousemove(function (e) { //注册拖动大小拖动中事件
            //     if (grid.resizing) {
            //         grid.dragMove(e);
            //     }
            // });
            // $(".ui-ygrid-labels", grid.hDiv).bind("selectstart", function () {
            //     return false;
            // });
            // $(gv).mouseup(function (e) { //注册拖动大小拖动中事件
            //     if (grid.resizing) {
            //         grid.dragEnd();
            //     }
            // });
            // $(document).bind("mouseup.yGrid" + ts.p.id, function () { //注册拖动大小拖动结束事件
            //     if (grid.resizing) {
            //         grid.dragEnd();
            //         return false;
            //     }
            //     return true;
            // });
            if (ts.p.populate) {
                grid.populate(); //数据载入计算
            }
            //  this.grid.cols = this.rows[0].cells;
            // grid.clearSelectCells = function () {
            //     if (ts.p.selectCells) {
            //         for (var i = 0, len = ts.p.selectCells.length; i < len; i++) {
            //             $(ts.p.selectCells[i]).removeClass("ui-state-highlight").removeClass("ui-cell-multiselect");
            //         }
            //     }
            //     ts.p.selectCells = [];
            // };

            // 根据事件获取单元格位置
            var hitTest = function(e) {
                var hit = {},td = $(e.target).closest("td");
                var ptr = $(td, ts.rows).closest("tr.ygrow");
                if ($(ptr).length === 0) {
                    return hit;
                }

                var rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, ptr[0].id)),
                    colIndex = $.ygrid.getCellIndex(td) - (ts.p.rowSequences ? 1 : 0);
                hit.row = rowIndex,hit.column = colIndex;
                return hit;
            }

            $(grid.bDiv).mousemove(function (e) {
                if (ts.selecting && e.target.tagName === "TD") {

                    // console.log(" mousemove...");

                    if( e.clientX == ts.selecting.x && e.clientY == ts.selecting.y ){
                        // console.log("prevent mousemove...");
                        return;
                    }

                    var hitCell = ts.p.hitCell;

                    if( !hitCell ) {
                        return;
                    }

                    var oldLeft = hitCell.cellIndex - (ts.p.rowSequences ? 1 : 0),
                        oldRight = oldLeft,
                        oldTop = hitCell.parentElement.rowIndex - 1,
                        oldBottom = oldTop,

                        curCell = e.target,

                        rowIndex = curCell.parentElement.rowIndex - 1,
                        colIndex = curCell.cellIndex - (ts.p.rowSequences ? 1 : 0),

                        left = Math.min(colIndex, oldLeft),
                        right = Math.max(colIndex, oldRight),
                        top = Math.min(rowIndex, oldTop),
                        bottom = Math.max(rowIndex, oldBottom);

                    ts.selectGridRow(left,top,right,bottom,top,left);
                }
            }).keydown(function (e) { // 处理方向键直接结束编辑(全键盘操作)
                var _grid = ts.getControlGrid();
                if( _grid.endEditByNav  ) {
                    var keyCode = e.charCode || e.keyCode;
                    switch (keyCode) {
                        case 37:
                            ts.changeFocus("left");
                            break;
                        case 38:
                            ts.changeFocus("top");
                            break;
                        case 39:
                            ts.changeFocus("right");
                            break;
                        case 40:
                            ts.changeFocus("bottom");
                            break;
                        default:
                            break;
                    }
                }
            });
            $(ts).click(function (e) {      //表格点击事件,主要用来触发表格的各种事件以及进入编辑
                // 这里不能做这个限制,否则按钮等的事件无法触发
                //   if ( e.target.tagName === "TD" ) {
                var target = e.target,
                    tagName = target.tagName;
                // var ptr = $(td, ts.rows).closest("tr.ygrow");
                // if ($(ptr).length === 0 || ptr[0].className.indexOf('ui-state-disabled') > -1) {
                //     return;
                // }

                if( tagName === "INPUT" || tagName === 'TR' ) {
                    return;
                }

                // //当前点击单元格 不是编辑单元格，结束编辑
                // if (ts.p.editCells.length > 0) {
                //     $(ts).yGrid("restoreCell", ts.p.editCells[0].ir, ts.p.editCells[0].ic);
                // }

                var rowIndex = ts.p.selectModel.focusRow,
                    colIndex = ts.p.selectModel.focusCol,

                    oldRowIndex = ts.p.selectModel.oldRowIndex,

                    ri = rowIndex + 1,ci = colIndex + (ts.p.rowSequences ? 1 : 0),

                    hit = hitTest(e);

                // 光标所在的单元格未改变
                if( !ts.p.selectModel.changed && hit.row == rowIndex && hit.column == colIndex ) {
                    $(ts).yGrid('editCell', ri, ci, true, e);// 鼠标编辑
                }

                // 单击事件
                if( $.isFunction(ts.p.clickRow) ) {
                    ts.p.clickRow.call(ts,rowIndex);
                }

                // 树形表格点击
                if( $(target).hasClass('cell-treeIcon') ){
                    treeClick($(target), ri, ci);
                }

                // 行改变事件
                if( rowIndex != oldRowIndex && $.isFunction(ts.p.focusRowChanged) ) {
                    ts.p.focusRowChanged.call(ts,rowIndex,oldRowIndex);
                }

                //     }
            }).mouseup(function (e) {

                if (e.target.tagName === "INPUT") {
                    return;
                }

                var $target = $(e.target).closest("td");
                if( $target.length == 0 ) {
                    return;
                }

                document.onselectstart = function () {
                    return true;
                };

                ts.selecting = null;

                ts.knvFocus2();

            }).mousedown(function (e) {

                if (e.target.tagName === "INPUT") {
                    return;
                }

                // 标签类型是DIV
                var $target = $(e.target).closest("td");
                if( $target.length == 0 ) {
                    return;
                }

                document.onselectstart = function () {
                    return false;
                };

                ts.p.hitCell = $target[0];

                var hit = hitTest(e);

                var rowIndex = hit.row,colIndex = hit.column;

                if( rowIndex == null || colIndex == null || colIndex < 0 )
                    return;

                // 在改变焦点行之前结束控件编辑
                // 需要同步获取焦点,异步会有问题
                ts.knvFocus2();

                var oldRowIndex = ts.p.selectModel.focusRow,
                    oldColIndex = ts.p.selectModel.focusCol;

                if( colIndex == oldColIndex && e.shiftKey ) {

                    var top = Math.min(rowIndex, oldRowIndex);
                    var bottom = Math.max(rowIndex, oldRowIndex);

                    ts.selectGridRow(colIndex,top,colIndex,bottom,rowIndex,colIndex);

                } else {

                    ts.selectGridRow(colIndex,rowIndex,colIndex,rowIndex,rowIndex,colIndex);

                    ts.selecting = {x:e.clientX,y:e.clientY};
                }
            }).dblclick(function (e) {    //表格双击事件,包括单元格双击和行双击
                var td = e.target;
                if ($.ygrid.msie) {   //兼容IE
                    $(td).click();
                }

                var hit = hitTest(e);

                var rowIndex = hit.row,colIndex = hit.column;

                if( rowIndex == null || colIndex == null || colIndex < 0 )
                    return;

                if ($.isFunction(ts.p.dblClickCell)) {
                    ts.p.dblClickCell.call(ts, rowIndex, colIndex);
                }

                if ($.isFunction(ts.p.dblClickRow)) {
                    ts.p.dblClickRow.call(ts, rowIndex);
                }

            });

            ts.reloadGrid = function () {
                var grid = ts.getControlGrid();

                $(ts).clearGridData();

                if (ts.grid.prevRowHeight && ts.p.scrollPage) {
                    delete ts.p.lastpage;
                    ts.grid.populateVisible();
                } else {
                    ts.grid.populate();
                }

                updatePagination($("#pagination_" + ts.p.id + '_pager'));
            }

            // ----------------------------------表格选择模式--------------------------------------------

            var unselect = function (row,left,right) {
                left = left + (ts.p.rowSequences ? 1 : 0), right = right + (ts.p.rowSequences ? 1 : 0);
                $(row.cells).each(function () {
                    if( this.cellIndex >= left && this.cellIndex <= right){
                        $(this).removeClass("ui-state-highlight");
                    }
                });
            };

            var select = function (row,left,right) {
                left = left + (ts.p.rowSequences ? 1 : 0), right = right + (ts.p.rowSequences ? 1 : 0);
                $(row.cells).each(function () {
                    if( this.cellIndex >= left && this.cellIndex <= right){
                        $(this).addClass("ui-state-highlight");
                    }
                });
            };

            ts.unselectGridRow = function (rowIndex) {
                var viewRow = $(ts).getGridRowById($.ygrid.uidPref + rowIndex);
                if( viewRow ) {
                    $(viewRow.cells).each(function () {
                        $(this).removeClass("ui-state-highlight");
                    });
                }
            };

            //  传入的是真实的colIndex
            ts.selectGridRow = function (left,top,right,bottom,focusRow,focusCol) {
                var selectModel = ts.p.selectModel;
                var oldFocusRow = -1,oldFocusCol = -1;
                var rid,viewRow;
                switch (selectModel.selectionMode){
                    case YIUI.SelectionMode.RANGE:
                        var oldLeft = selectModel.left,oldRight = selectModel.right,
                            oldTop = selectModel.top,oldBottom = selectModel.bottom;
                        if( selectModel.select(left, top, right, bottom,focusRow,focusCol) ) {
                            $("tbody:first > tr:gt(0)", ts.grid.bDiv).each(function () {
                                var rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, this.id));
                                if(rowIndex >= oldTop && rowIndex <= oldBottom && oldLeft != -1 && oldRight != -1){
                                    unselect(this,oldLeft,oldRight);
                                }
                                if(rowIndex >= top && rowIndex <= bottom ) {
                                    select(this,left,right);
                                }
                            });
                        }
                        break;
                    case YIUI.SelectionMode.ROW:
                        oldFocusRow = selectModel.focusRow;
                        var count = ts.getControlGrid().getColumnCount();
                        if( selectModel.select(0,focusRow,count,focusRow,focusRow,focusCol) ) {
                            if( oldFocusRow != -1 ) {
                                rid = $.ygrid.uidPref + oldFocusRow;
                                viewRow = $(ts).getGridRowById(rid);
                            }
                            if( viewRow ) {
                                unselect(viewRow,0,count - 1);
                            }
                            rid = $.ygrid.uidPref + focusRow;
                            viewRow = $(ts).getGridRowById(rid);
                            if( viewRow ) {
                                select(viewRow,0,count - 1);
                            }
                        }
                        break;
                    case YIUI.SelectionMode.CELL:
                        oldFocusRow = selectModel.focusRow,oldFocusCol = selectModel.focusCol;
                        if( selectModel.select(focusCol,focusRow,focusCol,focusRow,focusRow,focusCol) ) {
                            if( oldFocusRow != -1 && oldFocusCol != -1 ) {
                                rid = $.ygrid.uidPref + oldFocusRow;
                                viewRow = $(ts).getGridRowById(rid);
                            }
                            if( viewRow ) {
                                unselect(viewRow,oldFocusCol,oldFocusCol);
                            }
                            rid = $.ygrid.uidPref + focusRow;
                            viewRow = $(ts).getGridRowById(rid);
                            if( viewRow ) {
                                select(viewRow,focusCol,focusCol);
                            }
                        }
                        break;
                }
            };

            /**
             * 表格焦点策略
             * @param event
             * @returns {*}
             */
            ts.doFocusPolicy = function (keyCode) {
                var row = ts.p.selectModel.focusRow,column = ts.p.selectModel.focusCol,
                    rid = $.ygrid.uidPref + row,colModel = ts.p.colModel;
                var grid = ts.getControlGrid(),cellData = grid.getCellDataAt(row,column);
                switch ( keyCode ){
                    case 13:
                    case 108:// enter
                        var editOpt = ts.getCellEditOpt(row,column);
                        switch (editOpt.editOptions.cellType) {
                            case YIUI.CONTROLTYPE.BUTTON:
                            case YIUI.CONTROLTYPE.HYPERLINK:
                                if( cellData[2] ) {
                                    grid.gridHandler.doOnCellClick(grid,row,column);
                                } else {
                                    return ts.changeFocus();
                                }
                                break;
                            case YIUI.CONTROLTYPE.CHECKBOX:
                                if( cellData[2] ) {
                                    grid.setValueAt(row,column,!cellData[0],true,true);
                                } else {
                                    return ts.changeFocus();
                                }
                                break;
                            default:
                                return ts.changeFocus();
                        }
                        break;
                    case 9:// tab
                        return ts.changeFocus();
                }
                return true;
            };

            var treeClick = function($span, ri, ci){
                if($span.hasClass('ui-state-disabled')){
                    return;
                }

                var isExpand = $span.hasClass('cell-collapse');

                var rowData = ts.p.data[ri - 1];

                if(rowData && rowData.isLeaf){
                    return;
                }

                var grid = ts.getControlGrid();

                if( isExpand ) {
                    showRows(grid,rowData,ci);
                } else {
                    hideRows(grid,rowData,ci);
                }
            };

            // 只显示一层
            var showRows = function (grid,rowData,ci) {
                var childRows = rowData.childRows;
                if( !childRows )
                    return;
                for(var i = 0,cid;cid = childRows[i];i++) {
                    $("#" + $.ygrid.uidPref + cid,ts).show();
                }
                var $td = $("td:eq("+ci+")",$("#" + $.ygrid.uidPref + rowData.rowID,ts));
                $("span",$td).removeClass('cell-collapse').addClass('cell-expand');
            };

            // 全部收起来
            var hideRows = function (grid,rowData,ci) {
                var childRows = rowData.childRows,row;
                if( !childRows )
                    return;
                for(var i = 0,cid;cid = childRows[i];i++) {
                    row = grid.getRowDataByID(cid);
                    hideRows(grid,row,ci);
                    $("#" + $.ygrid.uidPref + cid,ts).hide();
                }
                var $td = $("td:eq("+ci+")",$("#" + $.ygrid.uidPref + rowData.rowID,ts));
                $("span",$td).removeClass('cell-expand').addClass('cell-collapse');
            };

            ts.changeFocus = function (dir) {
                var row = ts.p.selectModel.focusRow,column = ts.p.selectModel.focusCol,
                    rid = $.ygrid.uidPref + row,colModel = ts.p.colModel;
                var grid = ts.getControlGrid();

                if( row == -1 || column == -1 )
                    return;

                var flag = dir ? dir : "right";

                var findVisiblePos = function (iRow, iCol, dir) {
                    var pos = {row:iRow,column:iCol},i,j,rl = ts.rows.length,cl = colModel.length,beg = ts.p.rowSequences ? 1 : 0;
                    if (dir === "next") {
                        // 当前行找
                        for( i = iCol + 1; i < cl; i++ ) {
                            if (colModel[i].hidden !== true) {
                                pos.row = iRow,pos.column = i;
                                return pos;
                            }
                        }
                        // 往下找
                        for( i = iRow + 1;i < rl;i++ ) {
                            if( $(ts.rows[i]).is(":hidden") )
                                continue;
                            for( j = beg; j < cl;j++ ) {
                                if( colModel[j].hidden !== true ) {
                                    pos.row = i,pos.column = j;
                                    return pos;
                                }
                            }
                        }
                    } else if (dir === "pre") {
                        // 当前行找
                        for (i = iCol - 1; i >= beg; i--) {
                            if (colModel[i].hidden !== true) {
                                pos.row = iRow,pos.column = i;
                                return pos;
                            }
                        }
                        // 往上找
                        for( var i = iRow - 1; i > 0;--i ) {
                            if( $(ts.rows[i]).is(":hidden") )
                                continue;
                            for (j = cl - 1; j >= beg; j--) {
                                if (colModel[j].hidden !== true) {
                                    pos.row = i,pos.column = j;
                                    return pos;
                                }
                            }
                        }
                    }
                    return pos;
                };

                var viewRow = $(ts).getGridRowById(rid);
                if( !viewRow )
                    return;
                var ri = viewRow.rowIndex,
                    ci = column + (ts.p.rowSequences ? 1 : 0);
                var pos = {};
                switch ( flag ) {
                    case "left":
                        pos = findVisiblePos(ri,ci,"pre");
                        break;
                    case "top":
                        pos.row = ri - 1,pos.column = ci;
                        break;
                    case "right":
                        pos = findVisiblePos(ri,ci,"next");
                        break;
                    case "bottom":
                        pos.row = ri + 1,pos.column = ci;
                        break;
                }

                // 没改变
                if( pos.row == ri && pos.column == ci )
                    return false;

                ri = pos.row,ci = pos.column;
                if( ri >= 0 && ri < ts.rows.length && ci >= 0 && ci < colModel.length ) {
                    viewRow = ts.rows[ri];
                    if( viewRow ) {
                        $(ts).scrollVisibleCell(ri,ci);
                        $(viewRow.cells[ci]).trigger("mousedown").trigger("mouseup").click();
                    }
                    return true;
                }
                return false;
            };

            // 清空选择
            ts.cleanSelection = function () {
                //var row = ts.p.selectModel.focusRow,column = ts.p.selectModel.focusCol;
                // var viewRow = $(ts).getGridRowById($.ygrid.uidPref + row);
                //  if( !viewRow )
                //     return;
                // $(viewRow.cells[column + (ts.p.rowSequences ? 1 : 0)]).removeClass("ui-state-highlight");
                ts.selectGridRow(-1,-1,-1,-1,-1,-1);
            };

            //刷新页码
            var updatePagination = function(pagination){
                //初始化页码
                var initPagination = function (begin, end, curPage) {
                    $("ul", pagination).html();
                    var btnStr = [], style, sClass;

                    end = end < begin ? begin : end;

                    for (var i = begin; i <= end; i++) {
                        sClass = (i == curPage) ? "ui-state-highlight" : "";
                        btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
                    }
                    $("ul", pagination).html(btnStr.join(""));

                    $("li", pagination).click(gotoPageEvent);
                };

                var pageInfo  = ts.getControlGrid().pageInfo;
                var curPage = pageInfo.curPageIndex + 1;
                var indicator = pageInfo.pageIndicatorCount;
                if (pageInfo.pageCount <= indicator) {
                    initPagination(1, pageInfo.pageCount, curPage);
                } else {
                    var step = Math.floor(indicator/2);
                    var begin = (curPage - step) >= 1 ? (curPage - step) : 1, end = begin + indicator - 1;
                    if (end > pageInfo.pageCount) {
                        var gap = end - pageInfo.pageCount;
                        begin -= gap;
                        end -= gap;
                    }
                    initPagination(begin, end, curPage);
                }
            }

            //表格数据主体构建结束------------------------------
            //构建工具条
            if (this.p.showPager) {
                var op = $.extend(this.p.navButtons, $.ygrid.nav);

                var pagerId = this.p.id + '_pager';

                var pager = $("<div id='" + pagerId + "'></div>");
                var onHoverIn = function () {
                        if (!$(this).hasClass('ui-state-disabled')) {
                            $(this).addClass("ui-state-hover");
                        }
                    },
                    onHoverOut = function () {
                        $(this).removeClass("ui-state-hover");
                    };
                ts.p.pager = "#" + pagerId;
                pager.css({width: grid.width + "px"}).addClass('ui-state-default ui-ygrid-pager').attr("dir", "ltr").appendTo(eg);
                pager.append([
                    "<div id='pg_" , pagerId , "' class='ui-pager-control' role='group'>" ,
                    "<table cellpadding='0' border='0' class='ui-pg-table total' role='row'>" ,
                    "<tbody><tr><td id='" , pagerId , "_left' align='left' class='operation'></td>" ,
                    "<td id='" , pagerId , "_center' align='right' class='page'></td>",
                    "<td id='" , pagerId , "_right' align='right' class='count'></td>",
                    "</tr></tbody></table></div>"].join(""));
                var tbd,
                    navBTtbl = $("<table cellpadding='0' border='0' class='ui-pg-table navtable'><tbody><tr></tr></tbody></table>"),
                    sep = "<td class='ui-pg-button ui-state-disabled' ><span class='ui-separator'></span></td>";
                if (op.add) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.addIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.addtitle || "", id: "add_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.addFunc)) {
                                    op.addFunc.call(ts, "add");
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.del) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.delIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.deltitle || "", id: "del_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.delFunc)) {
                                    op.delFunc.call(ts, "del");
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.upRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.upRowIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.uprowtitle || "", id: "upRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.upRowFunc)) {
                                    op.upRowFunc.call(ts, "upRow");
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.downRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.downRowIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.downrowtitle || "", id: "downRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.downRowFunc)) {
                                    op.downRowFunc.call(ts, "downRow");
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }

                if (op.frozenRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.frozenRowIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.frozenrowtitle || "", id: "frozenrow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(ts.frozenRow)) {
                                    ts.frozenRow($("span",this),op);
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }

                if (op.frozenColumn) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.frozenColumnIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.frozencoltitle || "", id: "frozencolumn_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(ts.frozenColumn)) {
                                    ts.frozenColumn($("span",this),op);
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }

                if (op.bestWidth) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.bestWidthIcon , "'></span>", "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.bestwidthtitle || "", id: "bestWidth_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(ts.switchWidth)) {
                                    ts.switchWidth();
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }

                if (op.add || op.del || op.upRow || op.downRow || op.bestWidth) {
                    $("tr", navBTtbl).append(sep);
                }
                $(ts.p.pager + "_left", ts.p.pager).append(navBTtbl);
                tbd = null;
                navBTtbl = null;
                //初始化分页操作按钮
                if (!ts.p.scrollPage) {
                    var pgl = ["<table cellpadding='0' border='0'  class='ui-pg-table'><tbody><tr>"],
                        po = [
                            "first_" + pagerId,
                            "prev_" + pagerId,
                            "next_" + pagerId,
                            "last_" + pagerId,
                            "page_" + pagerId
                        ],
                        pagination = "<td><div id='pagination_" + pagerId + "' class='ui-pagination'><ul></ul></div></td>";

                    // 第一页
                    pgl.push("<td id='");
                    pgl.push(po[0]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-first common'></span></td>");

                    // 上一页
                    pgl.push("<td id='");
                    pgl.push(po[1]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-prev'></span></td>");

                    // 页码
                    pgl.push(pagination);

                    // 下一页
                    pgl.push("<td id='");
                    pgl.push(po[2]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-next'></span></td>");

                    // 最后一页
                    pgl.push("<td id='");
                    pgl.push(po[3]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-end common'></span></td>");

                   if (ts.p.rowList.length > 0) {
                        pgl.push("<td id='");
                        pgl.push(po[4] + "'>");
                        pgl.push("<select class='ui-pg-selbox ui-widget-content ui-corner-all'" + " role=\"listbox\" title=\"Records per Page\">");
                        var nm,rowNum = ts.getControlGrid().pageInfo.pageRowCount;
                        for(i = 0;i < ts.p.rowList.length;i++){
                            nm = ts.p.rowList[i].toString();

                            pgl.push("<option role=\"option\" value=\""+nm+"\""+(rowNum === parseInt(nm)?" selected=\"selected\"":"")+">"+nm+"</option>");
                        }
                        pgl.push("</select></td>");
                   }

                    pgl.push("</tr></tbody></table>");
                    $(ts.p.pager + "_center", ts.p.pager).append(pgl.join(""));

                    //行数改变事件
                    var rowNumChangeEvent = function () {
                        var grid = ts.getControlGrid();

                        grid.pageInfo.pageRowCount = parseInt(this.value);

                        ts.p.gotoPage.call(grid, 1);
                        return false;
                    }

                    $(".ui-pg-selbox","#page_" + pagerId).on('change', rowNumChangeEvent);

                    var _id = "_" + ts.p.pager.substr(1);

                    //翻页事件
                    var gotoPageEvent = function () {
                        var $this = $(this);
                        if ($this.hasClass("ui-state-disabled")) {
                            return false;
                        }

                        var pageInfo = ts.getControlGrid().pageInfo;
                        var curPage = pageInfo.curPageIndex + 1,
                            page = curPage;

                        //判断做的操作
                        var id = this.id;
                        if(id.startsWith('first')){
                            page = 1;
                        }else if(id.startsWith('prev')){
                            page = page - 1;
                        }else if(id.startsWith('next')){
                            page = page + 1;
                        }else if(id.startsWith('last')){
                            page = pageInfo.pageCount;
                        }else if($this.hasClass('pagination_btn')){
                            page = parseInt($this.attr("data-num"));
                        }

                        if(curPage == page){
                            return false;
                        }

                        //表格翻页 显示为异步，所以点击按钮后 设置 不可编辑 表格翻页结束后恢复
                        $("#first" + _id + ", #prev" + _id + ", #next" + _id + ", #last" + _id).addClass("ui-state-disabled");

                        //转发grid 翻页事件
                        ts.p.gotoPage.call(ts.getControlGrid(), page).always(function(){
                            //更新页码
                            updatePagination($("#pagination_" + pagerId));
                        });

                        return false;
                    };

                    updatePagination($("#pagination_" + pagerId));

                    $("#first" + _id + ", #prev" + _id + ", #next" + _id + ", #last" + _id).click(gotoPageEvent);
                }

                //初始化数据信息显示
                if (ts.p.viewRecords === true) {
                    $(ts.p.pager + "_right", ts.p.pager).append("<div style='text-align:right' class='ui-paging-info'></div>");
                }
                ts.updatePager.call(ts);

                $(ts).bindKeys();
            }
        });
    }
})(jQuery);

//提供给外部使用的事件
(function ($) {

    $.ygrid.extend({
        getGridParam: function (pName) {  //获取表格属性值
            var $t = this[0];
            if (!$t || !$t.grid) {
                return null;
            }
            if (!pName) {
                return $t.p;
            }
            return $t.p[pName] !== undefined ? $t.p[pName] : null;
        },
        setGridParam: function (newParams) {     //设置表格属性
            return this.each(function () {
                if (this.grid && typeof newParams === 'object') {
                    for (var key in newParams) {
                        var value = newParams[key];
                        if ($.isArray(value)) {
                            this.p[key] = value.slice(0);
                        } else {
                            this.p[key] = value;
                        }
                    }
                }
            });
        },
        refreshData: function () {
            return this.each(function () {
                var $t = this, top = $t.grid.bDiv.scrollTop, left = $t.grid.bDiv.scrollLeft;
                if (!$t.grid) {
                    return;
                }
                var trf = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(trf);
                $t.updatePager.call($t);
                $t.grid.populate();
                $t.grid.bDiv.scrollTop = top;
                $t.grid.bDiv.scrollLeft = left;
            });
        },
        clearGridData: function () {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var firstRow = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(firstRow);
                $t.cleanSelection();
                $t.p.editCells = [];
             //   $t.p.data = [];
                $t.p.records = 0;
                $t.p.page = 1;
                $t.p.lastpage = 1;
                $t.p.reccount = 0;

                $t.grid.bDiv.scrollTop = 0;
                $t.grid.bDiv.scrollLeft = 0;
            });
        },

        getFocusRowIndex: function () {
            return this[0].p.selectModel.focusRow;
        },

        getFocusColIndex: function () {
            return this[0].p.selectModel.focusCol;
        },

        bindKeys: function () {
            return this.each(function () {
                this.p.knv = this.p.id + "_kn";
                var knv = $("#" + this.p.knv);
                if (knv.length == 0) {
                    knv = $(["<div tabindex='-1' id='" ,
                        this.p.knv , "'></div>"].join("")).insertBefore($(this.grid.bDiv).parents(".ui-ygrid-view")[0]);
                }

                var _this = this;
                /**
                 * 表格焦点策略
                 */
                knv.keydown(function (event, outEvent) {
                    if (outEvent != null && outEvent.isPropagationStopped()) return;
                    var ts = $(".ui-ygrid-btable", event.target.nextSibling)[0], colModel = ts.p.colModel;
                    var keyCode = event.charCode || event.keyCode || 0;
                    if (keyCode == 0 && outEvent !== undefined) {
                        keyCode = outEvent.charCode || outEvent.keyCode || 0;
                    }
                    var grid = ts.getControlGrid();
                    var ri = ts.p.selectModel.focusRow,ci = ts.p.selectModel.focusCol;
                    if( ri == -1 || ci == -1 )
                        return;
                    var vri = ri + 1,vci = ci + (ts.p.rowSequences ? 1 : 0);

                    // 按下ctrl按键的时候将选中的值填到textArea
                    if( event.ctrlKey ) {
                        var textArea = $("#copyText" + ts.p.id),val;
                        if ( textArea.length == 0 ) {
                            textArea = $("<textarea id='copyText" + ts.p.id + "'/>").appendTo($(document.body));
                            textArea.css({position: "fixed", top: "-10000px", left: left + "px", width: "1000px", height: "200px"});

                            // 粘贴值
                            if( !ts.pasteCellValue ) {
                                ts.pasteCellValue = function () {
                                    ri = ts.p.selectModel.focusRow,ci = ts.p.selectModel.focusCol,val = textArea.val();
                                    if( ri == -1 || ci == -1 || !val )
                                        return;
                                    var rowData = grid.getRowDataAt(ri);
                                    if (rowData.rowType !== 'Detail' || ts.p.editCells.length > 0)
                                        return;

                                    // 检查并且设值
                                    var checkAndSetValue = function (ri, ci, value) {
                                        var cell = grid.getCellDataAt(ri, ci);
                                        if ( value == null || value.trim().length == 0 )
                                            return;
                                        if ( cell[2] ) {
                                            grid.setValueAt(ri, ci, value.trim(), true, true);
                                        }
                                    }

                                    var values, vals, _column;
                                    switch (ts.p.selectModel.selectionMode) {
                                        case YIUI.SelectionMode.CELL:
                                            checkAndSetValue(ri, ci, val);
                                            break;
                                        case YIUI.SelectionMode.RANGE:
                                            values = val.split("\n");
                                            for (var i = ri, length = values.length; i < grid.getRowCount() && i - ri < length; i++) {
                                                vals = values[i - ri].split("\t");
                                                for (var c = ci, size = vals.length,idx = 0; c < rowData.data.length && idx < size; c++) {
                                                    _column = grid.getColumnAt(c);
                                                    if( _column.hidden )
                                                        continue;
                                                    checkAndSetValue(i, c, vals[idx]);
                                                    idx++;
                                                }
                                            }
                                            break;
                                        case YIUI.SelectionMode.ROW:
                                            values = val.split("\t"),length = rowData.data.length,size = values.length;
                                            for (var c = 0,idx = 0; c < length && idx < size; c++) {
                                                _column = grid.getColumnAt(c);
                                                if( _column.hidden )
                                                    continue;
                                                checkAndSetValue(ri, c, values[idx]);
                                                idx++;
                                            }
                                            break;
                                    }
                                }
                            }

                            textArea.keyup(function (event) {

                                var keyCode = event.charCode || event.keyCode;

                                if (event.ctrlKey && keyCode == 86) {
                                    ts.pasteCellValue();
                                }

                                textArea.blur();
                                textArea.val("");

                                _this.knvFocus2();

                            });
                        }

                        textArea.val("");

                        // 检查并选中单元格的值
                        if( !ts.checkAndSelectValue ) {
                            ts.checkAndSelectValue = function (ri, ci,values) {
                                var column = grid.getColumnAt(ci);
                                if (column.hidden)
                                    return;
                                var cell = grid.getCellDataAt(ri, ci),
                                    editOpt = ts.getCellEditOpt(ri, ci);
                                values.push(ts.getCellStringValue(editOpt.editOptions.cellType, cell[0]), "\t");
                            }
                        }

                        var values = [];
                        switch (ts.p.selectModel.selectionMode) {
                            case YIUI.SelectionMode.CELL:
                                ts.checkAndSelectValue(ri,ci,values);
                                break;
                            case YIUI.SelectionMode.RANGE:
                                var top = ts.p.selectModel.top, bottom = ts.p.selectModel.bottom,
                                    left = ts.p.selectModel.left, right = ts.p.selectModel.right;
                                var row;
                                for (var i = top; i <= bottom; i++) {
                                    row = $("#" + $.ygrid.uidPref + i, ts);
                                    if (!row.is(":visible"))
                                        continue;
                                    for (var j = left; j <= right; j++) {
                                        ts.checkAndSelectValue(i,j,values);
                                    }
                                    values.pop();
                                    values.push("\n");
                                }
                                break;
                            case YIUI.SelectionMode.ROW:
                                var rowData = grid.getRowDataAt(ri);
                                for (var i = 0, size = rowData.data.length; i < size; i++) {
                                    ts.checkAndSelectValue(ri,i,values);
                                }
                                break;
                        }
                        values.pop();
                        textArea.val(values.join(""));
                        textArea.focus();
                        textArea.select();
                    }

                    var doEdit = function (vri, vci, event, keyCode) {
                        var code;
                        if (keyCode >= 48 && keyCode <= 57) { //数字
                            code = String.fromCharCode(keyCode);
                        } else if (keyCode >= 96 && keyCode <= 105) {  //小键盘数字
                            code = String.fromCharCode(keyCode - 48);
                        } else if (keyCode >= 65 && keyCode <= 90) { //字母
                            code = String.fromCharCode(keyCode);
                        } else if (keyCode==32 || keyCode == 109) {
                            code = " ";
                        } else if (keyCode == 189) {
                            code = "-"
                        }
                        if( code ) {
                            event.code = event.shiftKey ? code.toUpperCase() : code.toLowerCase();;
                            $(ts).yGrid('editCell', vri, vci, false, event);
                            event.preventDefault(); // 阻止默认行为
                        }
                    }

                    switch (keyCode) {
                        case 13:
                        case 108:  // Enter,Tab键
                        case 9:
                            if (!ts.doFocusPolicy(keyCode)) {
                                ts.cleanSelection();
                                grid.requestNextFocus();
                            }
                            //event.stopPropagation();//  不能阻止传播,可能有快捷键
                            event.preventDefault();// 阻止默认行为
                            break;
                        case 37:
                            ts.changeFocus("left");
                            break;
                        case 38:
                            ts.changeFocus("top");
                            break;
                        case 39:
                            ts.changeFocus("right");
                            break;
                        case 40:
                            ts.changeFocus("bottom");
                            break;
                        case 46:
                            var cell = grid.getCellDataAt(ri, ci);
                            if( cell[2] ) {
                                grid.setValueAt(ri,ci,null,true,true);
                            }
                            break;
                        case 67: // C
                            if (event.ctrlKey) {
                                // noop
                            } else {
                                doEdit(vri, vci, event, keyCode);
                            }
                            break;
                        case 86: // V
                            if ( event.ctrlKey ) {
                                // noop
                            } else {
                                doEdit(vri, vci, event, keyCode);
                            }
                            break;
                        default:
                            return doEdit(vri, vci, event, keyCode);
                    }
                })
            });
        },
        setGridWidth: function (newWidth) {
            return this.each(function () {
                if (!this.grid) {
                    return;
                }
                var $t = this;
                if (isNaN(newWidth)) {
                    return;
                }
                newWidth = parseInt(newWidth, 10);
                $t.grid.width = $t.p.width = newWidth;
                $("#gbox_" + $t.p.id).css("width", newWidth + "px");
                $("#" + $t.p.id + "_view").css("width", newWidth + "px");
                $($t.grid.bDiv).css("width", (newWidth - 5) + "px");
                $($t.grid.hDiv).css("width", (newWidth - 5) + "px");

                $($t).resizeFrozenDiv(true,true);

                if ($t.p.showPager) {
                    $($t.p.pager).css("width", newWidth + "px");
                }
            });
        },
        setGridHeight: function (newHeight) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var titleH = $($t.grid.hDiv).height();
                if (titleH === 0) {
                    var lastTr = $("tr.ui-ygrid-headers", $t.grid.hDiv);
                    var hrCount = $("tr.ui-ygrid-columnheader", $t.grid.hDiv).length + lastTr.length;
                    var th_H = $("th", lastTr).height();
                    titleH = (th_H + 2) * hrCount;
                }
                newHeight = newHeight - titleH - $($t.p.pager).height();

                $($t.grid.bDiv).css({height: (newHeight) + (isNaN(newHeight) ? "" : "px")});

                $t.p.height = newHeight;

                $($t).resizeFrozenDiv(true,true);

                if ($t.p.scrollPage) {
                    $t.grid.populateVisible();
                }
            });
        },

        // 通用的调整冻结DIV的方法
        resizeFrozenDiv: function (frozenRows,frozenColumns) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                // 根据纵向滚动条是否存在确定行锁定fbDiv宽度
                if( frozenRows && $t.grid.fbDiv2 ) {
                    if( $("table:first",$t.grid.bDiv).height() > $($t.grid.bDiv).height() ) {
                        $($t.grid.fbDiv2).width($($t.grid.bDiv).width() - 17);
                    } else {
                        $($t.grid.fbDiv2).width($($t.grid.bDiv).width());
                    }
                }
                // 根据横向滚动条是否存在调整列锁定fbDiv高度
                if( frozenColumns && $t.grid.fbDiv ) {
                    if( $("table:first",$t.grid.bDiv).width() > $($t.grid.bDiv).width() ) {
                        $($t.grid.fbDiv).height($($t.grid.bDiv).height() - 17);
                    } else {
                        $($t.grid.fbDiv).height($($t.grid.bDiv).height());
                    }
                }
            });
        },

        setFrozenRows: function () {
            return this.each(function () {
                if( !this.grid ){
                    return;
                }

                var $t = this;

                var grid = $t.getControlGrid();

                var frozenCount = $t.p.freezeRowCnt;

                if( frozenCount > 0 ) {
                    var gView = $($t.grid.bDiv).parents(".ui-ygrid-view");

                    var p = $($t.grid.bDiv).position();

                    // 偏移
                    var top = $t.grid.bDiv.scrollTop - $(".ui-ygrid-hdiv",gView).height(),
                        left = $t.grid.bDiv.scrollLeft;

                    $t.grid.fbDiv2 = $('<div style="left:'+(-left)+'px;top:'+(-top)+'px;" class="frozen-bdiv ui-ygrid-bdiv"></div>');

                    gView.append($t.grid.fbDiv2);

                    $($t).on('yGridResizeStop.setFrozenRows', function (e, w, index) {
                        var btd = $(".ui-ygrid-btable",$t.grid.fbDiv2);
                        $("tr:first td:eq("+index+")", btd).width( w - 1 );
                    });

                    $($t).on('yGridAfterGridComplete.setFrozenRows', function () {
                        $("#"+$t.p.id+"_frozenRow").remove();

                        $($t).resizeFrozenDiv(true,false);

                        // record row height
                        var mh = [];
                        $("tr[role=row].ygrow",$t.grid.bDiv).each(function(){
                            mh.push( $(this).height() );
                        });

                        console.log("setFrozenRows.................");

                        var btbl = $(".ui-ygrid-btable",$t.grid.bDiv).clone(true);

                        $("tr[role=row]:gt("+frozenCount+")",btbl).remove();

                        $(btbl).attr("id",$t.p.id+"_frozenRow");

                        // if( !$.ygrid.msie ) {
                        //     $(btbl).css("height","100%");
                        // }

                        $($t.grid.fbDiv2).append(btbl);

                        // set the height
                        $("tr[role=row].ygrow",btbl).each(function(i){
                            $(this).height( mh[i] );
                        });

                        // 锁定时的滚动位置
                        $t.grid.fst = $t.grid.bDiv.scrollTop;

                        // // 动态锁定滚动事件处理
                        // $($t.grid.bDiv).on('mousewheel DOMMouseScroll', function (e) {
                        //     var nst = $t.grid.bDiv.scrollTop;
                        //
                        //     var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);
                        //
                        //     // 向上滚动进行控制
                        //     if( delta > 0 ) {
                        //         // 当前的滚动位置减去原先的滚动位置
                        //         var d = nst - $t.grid.fst;
                        //         if( d <= 0 ) {
                        //             return e.preventDefault();
                        //         }
                        //
                        //         // 如果差值大于25,滚动25,否则滚动差值
                        //         $t.grid.bDiv.scrollTop -= (d > 25 ? 25 : d);
                        //
                        //         // 阻止事件,向上的滚动不需要再处理
                        //         return e.preventDefault();
                        //     }
                        // });

                        // 滚动的距离
                        // $t.grid.fbDiv2.scrollTop( $t.grid.bDiv.scrollTop );
                        // $t.grid.fbDiv2.scrollLeft( $t.grid.bDiv.scrollLeft );

                        // 设置table偏移量
                        if( $t.grid.fst > 0 ) {
                            $("table:first",$t.grid.bDiv).css({
                                top:$t.grid.fst * (-1) + "px"
                            });
                        }

                        // 滚动条置0
                        $t.grid.bDiv.scrollTop = 0;

                        btbl = null;
                    });

                    $($t).triggerHandler("yGridAfterGridComplete");

                    $t.p.frozenRows = true;
                }
            });
        },

        destroyFrozenRows: function () {
            return this.each(function() {
                if ( !this.grid ) {
                    return;
                }
                if( this.p.frozenRows ) {
                    var $t = this;
                    $($t.grid.fbDiv2).remove();
                    $t.grid.fbDiv2 = null;

                    $(this).off('.setFrozenRows');
                    $($t.grid.bDiv).off('mousewheel DOMMouseScroll');
                    $("table:first",$t.grid.bDiv).css({top:"0px"});
                    $t.grid.fst = 0;

                    this.p.frozenRows = false;
                }
            });
        },

        // 由于字典单元格的异步加载,第一次打开会有问题 TODO
        setFrozenColumns: function () {
            return this.each(function () {
                if( !this.grid ){
                    return;
                }

                var $t = this;

                var grid = $t.getControlGrid();

                var frozenCount = $t.p.freezeColCnt;

                if( frozenCount > 0 ) {

                    var gView = $($t.grid.bDiv).parents(".ui-ygrid-view");

                    var divh = parseInt( $(".ui-ygrid-hdiv",gView).height(), 10 );

                    var left = -( $t.grid.bDiv.scrollLeft || 0 );

                    $t.grid.fhDiv = $('<div style="position:absolute;left:'+left+'px;top:0px;' + 'height:'+divh+'px;" class="frozen-div ui-ygrid-hdiv"></div>');
                    $t.grid.fbDiv = $('<div style="position:absolute;left:'+left+'px;top:'+ divh +'px;overflow-y:hidden" class="frozen-bdiv ui-ygrid-bdiv"></div>');

                    // 列头部分
                    gView.append($t.grid.fhDiv);

                    var htbl = $(".ui-ygrid-htable",gView).clone(true);

                    var dh = [];
                    $(".ui-ygrid-htable tr", gView).each(function () {
                        dh.push(parseInt($(this).height(),10));
                    });

                    // 锁定列所在的列序号
                    var ci = $t.p.rowSequences ? frozenCount : frozenCount - 1;

                    var index = -1;
                    $("tr",htbl).each(function () {
                        var cm = $("th[colindex=" + ci + "]", this);
                        if( cm.length > 0 ) {
                            return index = cm.index();
                        }
                    });

                    // 去掉锁定列后的列头  TODO
                    $("tr",htbl).each(function () {
                        $("th",this).each(function () {
                            if( $(this).index() > ci || parseInt($(this).attr("colindex")) > ci ){
                                $(this).remove();
                            }
                        });
                    });

                    $("tr",htbl).each(function(i){
                        $(this).height(dh[i]);
                    });

                    $(htbl).width(1);
                    // if( !$.ygrid.msie ) {
                    //    $(htbl).css("height","100%");
                    // }

                    $($t.grid.fhDiv).append(htbl).mousemove(function (e) {
                        if( $t.grid.resizing ) {
                            $t.grid.dragMove(e);
                            return false;
                        }
                    });

                    $($t).on('yGridResizeStop.setFrozenColumns', function (e, w, index) {
                        var rhth = $(".ui-ygrid-htable",$t.grid.fhDiv),
                            btd = $(".ui-ygrid-btable",$t.grid.fbDiv);

                        $("th:eq("+index+")", rhth).width( w );
                        $("tr:first td:eq("+index+")", btd).width( w );

                    });

                    // 数据部分
                    gView.append($t.grid.fbDiv);

                    // 滚动事件
                    $($t.grid.fbDiv).on('mousewheel DOMMouseScroll', function (e) {
                        var st = $t.grid.bDiv.scrollTop;
                        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                            //up
                            $t.grid.bDiv.scrollTop = st - 25;
                        } else {
                            //down
                            $t.grid.bDiv.scrollTop = st + 25;
                        }
                        e.preventDefault();
                    });

                    $($t).on('yGridAfterGridComplete.setFrozenColumns', function () {
                        $("#"+$t.p.id+"_frozenColumn").remove();

                        $($t).resizeFrozenDiv(false,true);

                        // record row height
                        var mh = [];
                        $("tr[role=row].ygrow",$t.grid.bDiv).each(function(){
                            mh.push( $(this).height() );
                        });

                        console.log("setFrozenColumns.................");

                        var btbl = $(".ui-ygrid-btable",$t.grid.bDiv).clone(true);
                        $("tr[role=row]",btbl).each(function(){
                            $("td[role=gridcell]:gt("+ci+")",this).remove();
                        });

                        $(btbl).width(1).attr("id",$t.p.id+"_frozenColumn");
                        $($t.grid.fbDiv).append(btbl);
                        // set the height
                        $("tr[role=row].ygrow",btbl).each(function(i){
                            $(this).height( mh[i] );
                        });

                        // 记录横向滚动位置
                        $t.grid.fsl = $t.grid.bDiv.scrollLeft;

                        // 滚动的距离
                        $t.grid.fbDiv.scrollTop( $t.grid.bDiv.scrollTop );

                        // 设置table偏移量
                        if( $t.grid.fsl > 0 ) {
                            $("table:first",$t.grid.bDiv).css({left:$t.grid.fsl * (-1) + "px"});
                            $("table:first",$t.grid.hDiv).css({left:$t.grid.fsl * (-1) + "px"});
                        }

                        // 滚动条置0
                        $t.grid.bDiv.scrollLeft = 0;

                        btbl = null;
                    });

                    $($t).triggerHandler("yGridAfterGridComplete");

                    $t.p.frozenColumns = true;
                }
            });
        },

        destroyFrozenColumns: function() {
            return this.each(function() {
                if ( !this.grid ) {
                    return;
                }
                if( this.p.frozenColumns ) {
                    var $t = this;
                    $($t.grid.fhDiv).remove();
                    $($t.grid.fbDiv).remove();
                    $t.grid.fhDiv = null;
                    $t.grid.fbDiv = null;

                    $(this).off('.setFrozenColumns');
                    $("table:first",$t.grid.bDiv).css({left:"0px"});
                    $("table:first",$t.grid.hDiv).css({left:"0px"});
                    $t.grid.fsl = 0;

                    this.p.frozenColumns = false;
                }
            });
        },

        buildGroupHeaders: function (array) {
            return this.each(function () {
                var th = this, len = array.length;

                $(th.grid.hDiv).find("tr.ui-ygrid-columnheader").remove();
                th.p.groupHeaders = [];

                for (var i = 0; i < len; i++) {
                    $(th).setGroupHeaders(array[i]);
                    th.p.groupHeaders.push(array[i]);
                }

                var headers = th.grid.headers;

                $(headers).each(function () {
                    this.el.rowSpan = 1;
                });

                // 从下往上,合并表头单元格
                var chs = $("tr.ui-ygrid-columnheader", th.grid.hDiv),chCell,rhCell,height,span;
                for (var i = chs.length - 1,ch; ch = chs[i]; i--) {
                    for (var ci = 0, rhci = 0, clen = ch.cells.length; ci < clen; ci++) {
                        chCell = $(ch.cells[ci]);
                        span = parseInt(chCell.attr("span")) || 0;

                        if( !headers[rhci].visible ) {
                            if( span > 0 ) {
                                rhci += span;
                            } else {
                                rhci++;
                            }
                            continue;
                        }

                        if ( span > 0 ) {     // 跨至少一列
                            rhci += span;
                        } else { // 跨一列
                            rhCell = $(headers[rhci].el);

                            rhCell[0].rowSpan += 1;

                            rhCell.insertBefore(chCell);

                            height = rhCell[0].rowSpan * 36;

                            $("div", rhCell).css({height: height + "px", lineHeight: height + "px"});

                            chCell.remove();
                            rhci++;
                        }
                    }
                }

                // 合并完注册相关事件
                th.bindEvents2LeafColumn();
                th.bindEvents2GridView();
            });
        },
        setGroupHeaders: function (o) {     //设置表格多层表头
            return this.each(function () {
                var indexOfColumnHeader = function (text, columnHeaders) {
                    var length = columnHeaders.length;
                    for (var i = 0; i < length; i++) {
                        if (columnHeaders[i].startColumnName === text) {
                            return i;
                        }
                    }
                    return -1;
                };
                var $th = this, groupHeaderArray = o, $rowHeader = $("tr.ui-ygrid-headers", $th.grid.hDiv),
                    $groupHeadRow = $("<tr class='ui-ygrid-columnheader' role='columnheader'></tr>").insertBefore($rowHeader),
                    $firstHeaderRow = $($th.grid.hDiv).find("tr.yg-first-row-header");   //不可见行，用于控制每个列的动态宽度
                if ($firstHeaderRow.length == 0) {
                    $firstHeaderRow = $('<tr>', {role: "row", "aria-hidden": "true"}).addClass("yg-first-row-header");
                } else {
                    $firstHeaderRow.empty();
                }
                for (var j = 0, len = $th.p.colModel.length; j < len; j++) {
                    var thStyle = {width: $th.grid.headers[j].width + 'px', display: ($th.p.colModel[j].hidden ? 'none' : '')};
                    $("<th>", {role: 'gridcell'}).css(thStyle).addClass("ui-first-th-ltr").appendTo($firstHeaderRow);
                }
                var index, colHeader, clen = $th.p.colModel.length;

                var form = YIUI.FormStack.getForm($th.getControlGrid().ofFormID);

                for (var i = 0; i < clen; i++) {   //构建上级表头
                    index = indexOfColumnHeader($th.p.colModel[i].name, groupHeaderArray);

                    colHeader = $('<th class="ui-state-default ui-th-column ui-th-ltr" role="columnheader"></th>').appendTo($groupHeadRow);

                    if( index >= 0 ) {
                        var colDef = groupHeaderArray[index];
                        var colWidth = 0,
                            count = colDef.numberOfColumns,
                            vCount = 0;

                        // 非子叶列公式标题
                        var caption = colDef.caption,
                            formulaCaption = colDef.formulaCaption;
                        if( formulaCaption ) {
                            caption = form.eval(formulaCaption, new View.Context(form));
                        }

                        for (var iCol = 0; iCol < count && (i + iCol < clen); iCol++) {
                            if ( $th.p.colModel[i + iCol].hidden )
                                continue;
                            colWidth += $th.grid.headers[i + iCol].width + 1;
                            vCount += 1;
                        }
                        if (colWidth > 0) {
                            colHeader.css({width: colWidth + "px"});
                        } else {
                            colHeader.hide();
                        }
                        colHeader.html(caption).attr("title",caption);
                        colHeader.attr("span",count).attr("colspan",vCount);
                        i += count - 1;
                    } else {
                        if ($th.p.colModel[i].hidden) {
                            colHeader.hide();
                        }
                    }
                }
                $($th.grid.hDiv).find(".ui-ygrid-htable").children("thead").prepend($firstHeaderRow);
                $($th).bind('yGridResizeStop.setGroupHeaders', function (e, nw, idx) {
                    $firstHeaderRow.find('th').eq(idx).width(nw - 1);
                });
            });
        },
        getGridRowById: function (rowid) { //根据行id获取表格行
            var row;
            this.each(function () {
                try {
                    var i = this.rows.length;
                    while (i--) {
                        if (rowid.toString() === this.rows[i].id) {
                            row = this.rows[i];
                            break;
                        }
                    }
                } catch (e) {
                    row = $(this.grid.bDiv).find("#" + rowid);
                }
            });
            return row;
        },
        getGridRowAt: function (rowIndex) {
            var row;
            this.each(function () {
                var th = this;
                row = th.rows[rowIndex];
            });
            return row;
        },
        getGridCellAt: function (rowIndex, colIndex) {
            var cell;
            this.each(function () {
                var th = this;
                var row = th.rows[rowIndex];
                if (row) {
                    cell = row.cells[colIndex];
                }
            });
            return cell;
        },

        setCellRequired: function (rowIndex, colIndex, isRequired) {
            return this.each(function () {
                var pos = this.getColPos(colIndex);
                var cell = $(this).getGridCellAt(rowIndex + 1, pos);
                if( !cell )
                    return;
                var viewCell = $(cell);
                var errorReg = $("div.ui-cell-required",viewCell);
                if( isRequired ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-required").appendTo(viewCell);
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.removeAttr("position");
                }
            });
        },

        setCellFocus: function (rowIndex,colIndex) {
            return this.each(function () {
                var ri = rowIndex + 1,
                    ci = this.getColPos(colIndex);

                var row = $(this).getGridRowAt(ri);
                if( !row || $(row).is(":hidden") )
                    return;

                var cell = row.cells[ci];
                if( !cell )
                    return;

                $(this).scrollVisibleCell(ri,ci);
                this.cleanSelection(); // 为了change!!

                $(cell).trigger("mousedown").trigger("mouseup").trigger("click");
            });
        },

        // 只选择,不设置焦点
        selectRow: function (rowIndex, colIndex) {
            return this.each(function () {
                this.selectGridRow(colIndex,rowIndex,colIndex,rowIndex,rowIndex,colIndex);
            });
        },

        setCellBackColor: function (rowIndex, colIndex, color) {
            return this.each(function () {
                var pos = this.getColPos(colIndex);
                var cell = $(this).getGridCellAt(rowIndex + 1, pos);
                if (!cell) {
                    return;
                }
                cell.style.backgroundColor = color;
            });
        },

        setCellForeColor: function (rowIndex, colIndex, color) {
            return this.each(function () {
                var pos = this.getColPos(colIndex);
                var cell = $(this).getGridCellAt(rowIndex + 1, pos);
                if (!cell) {
                    return;
                }
                cell.style.color = color;
            });
        },

        setCellEnable:function (rowIndex,colIndex,enable) {
            return this.each(function(){
                var pos = this.getColPos(colIndex);
                var cell = $(this).getGridCellAt(rowIndex + 1, pos);
                if( !cell )
                    return;

                var rowData = this.p.data[rowIndex];

                if( !rowData.backColor ) {
                    if ( enable ) {
                        $(cell).removeClass("ui-cell-disabled");
                    } else {
                        $(cell).addClass("ui-cell-disabled");
                    }
                }

                var editOpt = this.getCellEditOpt(rowIndex,colIndex);

                if (editOpt && editOpt.isAlwaysShow) {
                    switch (editOpt.formatter) {
                        case "button":
                            $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                            break;
                        case "label":
                        case "hyperlink":
                            $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                            break;
                        case "checkbox":
                            $(".cellEditor",cell).attr('enable',enable);
                            break;
                        case "image":
                            cell.editor.setEnable(enable);
                            break;
                        default:
                            break;
                    }
                }

                // var trl = $(".ui-ygrid.ui-readonly .ui-ygrid-btable tr.ygrow").length;
                //  for (var i = 0; i < trl; i++) {
                //      if(i % 2 != 0 ){
                //          $(".ygrow")[i].className = "ui-widget-content ygrow ui-row-ltr even";
                //      }else{
                //          $(".ygrow")[i].className = "ui-widget-content ygrow ui-row-ltr";
                //      }
                //
                //  }

            });
        },

        setCellError: function (rowIndex,colIndex,error,errorMsg) {
            return this.each(function () {
                var pos = this.getColPos(colIndex);
                var cell = $(this).getGridCellAt(rowIndex + 1, pos);
                if( !cell )
                    return;
                var viewCell = $(cell);
                var errorReg = $("div.ui-cell-error",viewCell);
                if( error ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.attr({title: errorMsg}).css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-error").appendTo(viewCell);
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.attr({title:viewCell.text()}).removeAttr("position");
                }
            });
        },

        setRowError: function (rowIndex,error,errorMsg) {
            return this.each(function () {
                var viewRow = $(this).getGridRowById($.ygrid.uidPref + rowIndex);
                if( !viewRow )
                    return;
                var viewCell = $(viewRow.cells[0]);
                var errorReg = $("div.ui-cell-error",viewRow.cells[0]);
                if( error ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.attr({title: errorMsg}).css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-error").appendTo(viewCell);
                    viewCell.parent().addClass("ui-row-error");
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.attr({title:viewCell.text()}).removeAttr("position");
                    viewCell.parent().removeClass("ui-row-error");
                }
            });
        },

        setRowVisible: function (rowIndex,visible) {
            return this.each(function () {
                var viewRow = $(this).getGridRowById($.ygrid.uidPref + rowIndex);
                if( !viewRow )
                    return;
                if( !visible ) {
                    $(viewRow).hide();
                } else {
                    $(viewRow).show();
                }
            });
        },

        exchangeRow:function (rowIndex,exIndex) {
            return this.each(function () {
                var $t = this,row = $($t).getGridRowById($.ygrid.uidPref + rowIndex),$exRow,tempId;
                if( !row )
                    return;
                if( rowIndex > exIndex ) {
                    var $exRow = $(row).prev(),tempId = $exRow[0].id; // 上移
                    $exRow.before(row);
                } else {
                    var $exRow = $(row).next(),tempId = $exRow[0].id; // 下移
                    $exRow.after(row);
                }

                // 交换行id
                $exRow[0].id = row.id;
                row.id = tempId;

                // 交换行序号
                $(".ygrid-rownum",row).text(parseInt($.ygrid.stripPref($.ygrid.uidPref, row.id)) + 1);
                $(".ygrid-rownum",$exRow).text(parseInt($.ygrid.stripPref($.ygrid.uidPref, $exRow[0].id)) + 1);

                // 刷新行索引
                $t.refreshIndex();

                var colIndex = $t.getControlGrid().getFocusColIndex();
                $t.selectGridRow(colIndex,exIndex,colIndex,exIndex,exIndex,colIndex);

                $t.knvFocus2();
            });
        },

        editCell: function (iRow, iCol, normalEdit, event) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                iCol = parseInt(iCol, 10);
                if ($t.p.editCells.length > 0) {
                    //    if (ed === true) {
                    if (iRow == $t.p.iRow && iCol == $t.p.iCol) {
                        return;
                    }
                    //    }
                    //  现在的机制不会走到这里
                    // $($t).yGrid("saveCell", $t.p.editCells[0].ir, $t.p.editCells[0].ic);
                }
                var cm = $t.p.colModel[iCol],
                    // rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id)),
                    rowIndex = $t.p.selectModel.focusRow,
                    colIndex = iCol - ($t.p.rowSequences ? 1 : 0),
                    row = $t.p.data[rowIndex], editOpt = $t.getCellEditOpt(rowIndex, colIndex);
                var nm = cm.name;

                if( nm === 'rn' || editOpt.isAlwaysShow )
                    return;

                if( colIndex == $t.p.treeIndex || colIndex === $t.p.rowExpandIndex )
                    return;
                var rowEditable = (row.isEditable === undefined ? true : row.isEditable);
                if( !rowEditable )
                    return;
                var curCell = $("td:eq(" + iCol + ")", $t.rows[iRow]), enable = row.data[cm.index][2];
                if (enable === undefined || enable === null) {
                    enable = cm.editable;
                }
                if (enable === undefined || enable === null) {
                    enable = $t.p.enable;
                }
                if (enable === true && !curCell.hasClass("not-editable-cell")) {
                    if (parseInt($t.p.iCol, 10) >= 0 && parseInt($t.p.iRow, 10) >= 0) {
                        $($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover");
                    }
                    $(curCell).addClass("ui-edit-cell");
                    $($t.rows[iRow]).addClass("selected-row ui-state-hover");

                    $t.p.editCells.push({ir: iRow, ic: iCol, name: nm, v: row.data[cm.index], cell: curCell});

                    var opt = {normalEdit: normalEdit, ir: iRow, ic: iCol, id: iRow + "_" + nm, name: nm, event:event};
                    if ($t.p.createCellEditor && $.isFunction($t.p.createCellEditor)) {
                        $t.p.createCellEditor.call($t.getControlGrid(), curCell, rowIndex, colIndex, opt);
                    }
                }
                $t.p.iCol = iCol;
                $t.p.iRow = iRow;
            });
        },

        // saveCell: function (iRow, iCol, val) {
        // return this.each(function () {
        // var $t = this, fr;
        // if (!$t.grid) {
        //     return;
        // }
        // if ($t.p.editCells.length >= 1) {
        //     fr = 0;
        // } else {
        //     fr = null;
        // }
        // if (fr !== null) {
        //     var cc = $("td:eq(" + iCol + ")", $t.rows[iRow]), v2,
        //         rowIndex = $.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id),
        //         colIndex = iCol - ($t.p.rowSequences ? 1 : 0),
        //         editOpt = $t.getCellEditOpt(rowIndex, colIndex), isChanged = false;
        //
        //     if (!editOpt.isAlwaysShow && $t.p.checkAndSet && $.isFunction($t.p.checkAndSet)) {
        //         isChanged = $t.p.checkAndSet.call($t, cc, editOpt.edittype, iRow, iCol, val);
        //     }
        //     if(isChanged){
        //         if (!editOpt.isAlwaysShow && $t.p.endCheck && $.isFunction($t.p.endCheck)) {
        //             var caption = $t.p.endCheck.call($t, cc, editOpt.edittype, iRow, iCol, val);
        //             console.log(caption);
        //
        //
        //             var cm = this.p.colModel[iCol], id = this.rows[iRow].id ,
        //                 rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id),
        //                 row = this.p.data[rowIndex];
        //
        //
        //             $($t).yGrid("setCell", $t.rows[iRow].id, iCol, row.data[cm.index]);
        //             $t.p.editCells.splice(0, 1);
        //
        //         }
        //     }
        //
        //
        //     if (isChanged) {
        //         //$($t).yGrid("setCell", $t.rows[iRow].id, iCol, v2, false, false);
        //         // $t.p.editCells.splice(0, 1);
        //     } else {
        //         $($t).yGrid("restoreCell", iRow, iCol);
        //     }
        //     if ($t.p.afterEndCellEditor && $.isFunction($t.p.afterEndCellEditor)) {
        //         $t.p.afterEndCellEditor.call($t, cc, editOpt.edittype, isChanged, iRow, iCol);
        //     }
        //
        // }

        //  });
        // },
        updateCell: function (rowIndex, colIndex, cellData) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }

                var rowId = $.ygrid.uidPref + rowIndex;

                var $row = $(this).getGridRowById(rowId);
                if(!$.isDefined($row)){
                    return;
                }

                var iCol = this.getColPos(colIndex);

                var $cell = $row.cells[iCol];
                if(!$.isDefined($cell)){
                    return;
                }

                $($t).yGrid("setCell", $row, iCol, cellData);
                if( $t.p.editCells.length >= 1 ) {
                    $t.p.editCells.splice(0, 1);

                    // 不加 后面改成 不直接结束编辑FX
                   // $t.knvFocus2();
                }
            });
        },
        // 私有方法,外部不调用
        setCell: function ($row, iCol, cellData) {
            return this.each(function () {
                var $t = this, v;
                if (!$t.grid || !$row) {
                    return;
                }

                var rowid = $row.id,
                    ri = parseInt($.ygrid.stripPref($.ygrid.uidPref, rowid), 10),
                    ci = iCol - ($t.p.rowSequences ? 1 : 0);

                var $cell = $("td:eq(" + iCol + ")", $row);

                if ( cellData ) {
                    var editOpt = this.getCellEditOpt(ri, ci);
                    v = cellData[1];
                    if (editOpt.isAlwaysShow) {
                        switch (editOpt.formatter) {
                            case "button":
                                $(".cellEditor span.txt", $cell).html(v);
                                break;
                            case "label":
                            case "hyperlink":
                                $(".cellEditor", $cell).html(v);
                                break;
                            case "checkbox":
                                $(".cellEditor", $cell).removeClass('checked');
                                if( v && v !== 'false' ) {
                                    $(".cellEditor", $cell).addClass('checked');
                                }
                                break;
                            case "image":
                                $cell[0].editor.setValue(v);
                                break;
                        }
                    } else {
                        $cell.attr("tabindex", "-1").removeClass("ui-edit-cell");

                        var title = {"title": v};

                        var span = $cell.find("span");

                        if($t.p.treeIndex != -1 && $t.p.treeIndex == ci){
                            $($cell).empty().append(span).append(v).attr(title);
                        } else {
                            $($cell).empty().text(v).attr(title);
                        }

                        // 字典类型caption延迟加载

                        if( $t.p.frozenRows ) {
                            $row = $($t.grid.fbDiv2).find("#" + rowid);
                            $cell = $("td:eq(" + iCol + ")", $row);
                            if( $cell.length > 0 ) {
                                $($cell).text(v).attr(title);
                            }
                        }

                        if( $t.p.frozenColumns ) {
                            $row = $($t.grid.fbDiv).find("#" + rowid);
                            $cell = $("td:eq(" + iCol + ")", $row);
                            if( $cell.length > 0 ) {
                                $($cell).text(v).attr(title);
                            }
                        }
                    }

                    // 必填
                    $($t).yGrid("setCellRequired", ri, ci, cellData[3]);

                    // 检查规则
                    $($t).yGrid("setCellError", ri, ci, cellData[4], cellData[5]);
                }
            });
        },
        //滚动表格使得当前单元格处于显示区域
        scrollVisibleCell: function (iRow, iCol) {
            return this.each(function () {
                var $t = this;
                var ch = $t.grid.bDiv.clientHeight,
                    st = $t.grid.bDiv.scrollTop,
                    crth = $t.rows[iRow].offsetTop + $t.rows[iRow].clientHeight,
                    crt = $t.rows[iRow].offsetTop;
                if (crth >= ch + st) {
                    $t.grid.bDiv.scrollTop = crth - ch;// 下部超界
                } else if (crt < st) {
                    $t.grid.bDiv.scrollTop = crt;// 上部超界
                }
                var cw = $t.grid.bDiv.clientWidth,
                    sl = $t.grid.bDiv.scrollLeft,
                    crclw = $t.rows[iRow].cells[iCol].offsetLeft + $t.rows[iRow].cells[iCol].clientWidth,
                    crcl = $t.rows[iRow].cells[iCol].offsetLeft;
                if (crclw >= cw + sl) {
                    $t.grid.bDiv.scrollLeft = crclw - cw;// 右部超界
                } else if (crcl < sl) {
                    $t.grid.bDiv.scrollLeft = crcl; // 左部超界
                }
            });
        },
        clearBeforeUnload: function () {
            return this.each(function () {
                var grid = this.grid;
                if ($.isFunction(grid.emptyRows)) {
                    grid.emptyRows.call(this, true, true);
                }
                $(document).unbind("mouseup.yGrid" + this.p.id);
                $(grid.hDiv).unbind("mousemove");
                $(grid.bDiv).unbind("mousemove");
                $(this).unbind();
                grid.dragEnd = null;
                grid.dragMove = null;
                grid.dragStart = null;
                grid.emptyRows = null;
                grid.populate = null;
                grid.populateVisible = null;
                grid.scrollGrid = null;
                // grid.clearSelectCells = null;
                grid.timer = null;
                grid.prevRowHeight = null;
                grid.bDiv = null;
                grid.hDiv = null;
                //     grid.cols = null;
                var i, l = grid.headers.length;
                for (i = 0; i < l; i++) {
                    grid.headers[i].el = null;
                }
                this.updatepager = null;
                this.refreshIndex = null;
                //  this.modifyGridCell = null;
                this.formatter = null;
                this.grid = null;
                this.p._indexMap = null;
                this.p.data = null;
                this.p = null;
            });
        },
        GridDestroy: function () {
            return this.each(function () {
                if (this.grid) {
                    if (this.p.pager) {
                        $(this.p.pager).remove();
                    }
                    try {
                        $(this).clearBeforeUnload();
                        $("#gbox_" + this.id).remove();
                    } catch (_) {
                    }
                }
            });
        }
    });
})(jQuery);
//fmatter初始化
(function ($) {
    "use strict";
    $.fmatter = {};
    $.fn.fmatter = function (formatType, cellval, opts, rwd, act) {
        var v = cellval;
        opts = $.extend({}, $.ygrid.formatter, opts);
        try {
            v = $.fn.fmatter[formatType].call(this, cellval, opts, rwd, act);
        } catch (fe) {
        }
        return v;
    };
    $.extend($.fmatter, {
        isBoolean: function (o) {
            return typeof o === 'boolean';
        },
        isObject: function (o) {
            return (o && (typeof o === 'object' || $.isFunction(o))) || false;
        },
        isString: function (o) {
            return typeof o === 'string';
        },
        isNumber: function (o) {
            return typeof o === 'number' && isFinite(o);
        },
        isValue: function (o) {
            return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
        },
        isEmpty: function (o) {
            if (!this.isString(o) && this.isValue(o)) {
                return false;
            }
            if (!this.isValue(o)) {
                return true;
            }
            o = $.trim(o).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            return o === "";
        },
        extend: function (formatType, formatFunc) {
            if ($.isFunction(formatFunc)) {
                $.fn.fmatter[formatType] = formatFunc;
            }
        }
    });
    $.fn.fmatter.defaultFormat = function (cellval, opts) {
        return ($.fmatter.isValue(cellval) && cellval !== "" ) ? cellval : opts.defaultValue || "&#160;";
    };
    $.fn.fmatter.hyperlink = function (cellval, opts) { //超链接单元格格式化
        var op = {baseLinkUrl: opts.baseLinkUrl, showAction: opts.showAction, addParam: opts.addParam || "", target: opts.target, idName: opts.idName},
            target = "", idUrl;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.target) {
            target = 'target=' + op.target;
        }
        if (op.baseLinkUrl) {
            idUrl = op.baseLinkUrl + op.showAction + '?' + op.idName + '=' + opts.rowId + op.addParam;
        } else {
            idUrl = "#";
        }
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {	//add this one even if its blank string
            return ["<a  style='width: 100%' " , target , " href='" , idUrl , "' class='ui-hyperlink'>" , cellval , "</a>"].join("");
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.button = function (cellval, opts) {  //按钮单元格格式化
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {
            cellval = typeof(cellval) == "undefined" ? "" : cellval;
            return "<button style='width: 100%;height: 100%' class='ui-button'>" + cellval + "</button>"
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.checkbox = function (cellval, opts) {  //复选框单元格格式化
        var op = $.extend({}, opts.checkbox), ds;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.disabled === true || (opts.colModel.editable === undefined ? !this.p.enable : !opts.colModel.editable)) {
            ds = "disabled=\"disabled\"";
        } else {
            ds = "";
        }
        if ($.fmatter.isEmpty(cellval) || cellval === undefined) {
            cellval = false;
        }
        cellval = String(cellval);
        cellval = (cellval + "").toLowerCase();
        var bchk = cellval.search(/(false|f|0|no|n|off|undefined)/i) < 0 ? " checked='checked' " : "";
        return "<input type=\"checkbox\" style='text-align: center' " + bchk + " value=\"" + cellval + "\" offval=\"false\" " + ds + "/>";
    };
    $.fn.fmatter.textEditor = function (cellval, opts) {  //输入框格式化
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.numberEditor = function (cellval, opts) {  //数值框格式化
        if (isNaN(parseFloat(cellval))) {
            cellval = "";
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.datePicker = function (cellval, opts) {  //日期格式化
        if (!$.fmatter.isEmpty(cellval)) {
            var option = opts.colModel.editOptions;
            var date = new Date(parseFloat(cellval, 10));
            return date.Format(option.formatStr);
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
})(jQuery);