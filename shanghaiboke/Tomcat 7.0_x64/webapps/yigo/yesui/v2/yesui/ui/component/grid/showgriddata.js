/**
 * Created by 陈瑞 on 2018/1/25.
 */
(function () {
    YIUI.ShowGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function (construct) {
            var show;
            if( this.form.type == YIUI.Form_Type.Report ) {
                show = new YIUI.ShowReportGridData(this.form,this.grid);
            } else {
                show = new YIUI.ShowNormalGridData(this.form,this.grid);
            }
            show.load(construct);
        }
    });

    YIUI.ShowNormalGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function (construct) {
            var doc = this.form.getDocument();
            if (doc == null) {
                return;
            }

            if( this.grid.isSubDetail && !this.filterSubDetail(this.form) ) {
                return;
            }

            if (construct) {
                this.constructGrid();
            }

            var rowGroup = new YIUI.GridRowGroup(this.form, this.grid);
            rowGroup.group();

            var builder = new YIUI.GridRowBuilder(this.form, this.grid);
            builder.build();

            YIUI.GridLookupUtil.updateFixPos(this.form,this.grid);

            this.mergeCell();

            var table = doc.getByKey(this.grid.tableKey);
            if( table ) {
                table.clearFilter();
            }
        },
        constructGrid: function () {
            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();

                this.grid.initLeafColumns();
                this.grid.initDataModel();

                YIUI.GridLookupUtil.buildCellLookup(this.form, this.grid);// 更新单元格位置信息

                YIUI.ViewUtil.updateFormulaItemsIndex(this.form, this.grid); // 更新计算表达式位置信息
            }

            YIUI.GridUtil.buildGroupHeaders(this.grid);//重建表头
        },

        mergeCell: function () {
            if( !this.grid.hasCellMerge ) {
                return;
            }

            var merge = function (ri,ci,rowspan,colspan) {
                var cellData,
                    rowType,
                    curType;
                for( var i = 0;i < rowspan;i++ ) {
                    rowType = _this.grid.getRowDataAt(ri + i).rowType;
                    if( i > 0 && rowType !== curType ) {
                        throw new Error("合并单元格配置错误");
                    }
                    for( var j = 0;j < colspan;j++ ) {
                        cellData = _this.grid.getCellDataAt(ri + i,ci + j);
                        if( i == 0 && j == 0 ) {
                            cellData.isMerged = true;
                            cellData.isMergedHead = true;
                            cellData.rowspan = rowspan;
                            cellData.colspan = colspan;
                        } else {
                            cellData.isMerged = true;
                            cellData.isMergedHead = false;
                            cellData.rowspan = i;
                            cellData.colspan = j;
                        }
                    }
                    curType = rowType;
                }
            }

            var _this = this,
                metaGrid = _this.grid.getMetaObj(),
                rowData,
                metaRow,
                metaCell;
            for( var i = 0,size = _this.grid.getRowCount();i < size;i++ ) {
                rowData = _this.grid.getRowDataAt(i);
                metaRow = metaGrid.rows[rowData.metaRowIndex];
                for( var k = 0,length = metaRow.cells.length;k < length;k++ ) {
                    metaCell = metaRow.cells[k];
                    if( metaCell.isMerged && metaCell.isMergedHead ) {
                        merge(i,k,metaCell.rowspan,metaCell.colspan);
                    }
                }
            }
        },

        filterSubDetail: function (form) {
            var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form,this.grid);
            var rowIndex = parentGrid.getFocusRowIndex();
            if( rowIndex == -1 ) {
                return false;
            }

            var rowData = parentGrid.getRowDataAt(rowIndex);
            if( !rowData.isDetail || rowData.bkmkRow == null ) {
                return false;
            }
            var bookmark = rowData.bkmkRow.getBookmark();

            var doc = form.getDocument(),
                table = doc.getByKey(parentGrid.tableKey),
                subTable = doc.getByKey(this.grid.tableKey);

            table.setByBkmk(bookmark);

            var detailRow = parentGrid.getDetailMetaRow();

            switch (detailRow.linkType) {
            case YIUI.LinkType.PARENT:
                var OID = table.getByKey(YIUI.SystemField.OID_SYS_KEY);

                subTable.setFilterEval(function () {
                    var parentBkmk = subTable.getParentBkmk();
                    if( bookmark != null && parentBkmk == bookmark ) {
                        return true;
                    }
                    var POID = subTable.getByKey(YIUI.SystemField.POID_SYS_KEY);
                    if( OID > 0 && POID == OID ) {
                        return true;
                    }
                    return false;
                });
                break;
            case YIUI.LinkType.FOREIGN:
                subTable.setFilterEval(function () {
                    var sourceFields = detailRow.sourceFields,
                        targetFields = detailRow.targetFields,
                        srcField,
                        tgtField;
                    for (var k = 0, slen = sourceFields.length; k < slen; k++) {
                        srcField = sourceFields[k];
                        tgtField = targetFields[k];
                        var dataType = table.cols[table.indexByKey(srcField)].type;
                        var dV = YIUI.Handler.convertValue(table.getByKey(srcField), dataType),
                            compDV = YIUI.Handler.convertValue(subTable.getByKey(tgtField), dataType);
                        if (dV instanceof Decimal && compDV instanceof Decimal) {
                            if (!dV.equals(compDV)) {
                                return false;
                            }
                        } else if (dV !== compDV) {
                            return false;
                        }
                    }
                    return true;
                });
                break;
            }
            subTable.filter();
            return true;
        }
    });

    YIUI.GridRowBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {

            var self = this;

            var impl_buildMultiple = function () {
                var builder = new YIUI.GridMultiBuilder(self.form,self.grid);
                builder.build();
            }

            var impl_buildNormal = function () {
                self.grid.clearGridData();

                var metaObj = self.grid.getMetaObj(),
                    rowLayer = metaObj.rowLayer,
                    metaRow,
                    rowObject;

                for (var i = 0;rowObject = rowLayer.objectArray[i]; i++) {
                    switch (rowObject.objectType) {
                    case YIUI.MetaGridRowObjectType.ROW:
                        metaRow = metaObj.rows[rowObject.rowIndex];
                        var rowIndex = self.grid.addGridRow(-1, metaRow, null, 0, false);
                        self.grid.getHandler().showFixRowData(self.form, self.grid, rowIndex);
                        break;
                    case YIUI.MetaGridRowObjectType.AREA:
                        var root = self.grid.dataModel.rootBkmk;
                        self.loadGroup(rowObject, root, 0);
                        break;
                    default:
                        break;
                    }
                }
            }

            if( this.grid.multiple ) {
                impl_buildMultiple();
            } else {
                impl_buildNormal();
            }
        },
        loadGroup:function (rowObject,groupBkmk,level) {
            var metaGrid = this.grid.getMetaObj(),
                metaRow,
                obj;
            for (var j = 0;obj = rowObject.objectArray[j];j++) {
                switch (obj.objectType) {
                case YIUI.MetaGridRowObjectType.ROW:
                    metaRow = metaGrid.rows[obj.rowIndex];
                    this.grid.addGridRow(-1, metaRow, null, 0, false);
                    break;
                case YIUI.MetaGridRowObjectType.GROUP:
                    for (var k = 0, size = groupBkmk.getRowCount(); k < size; k++) {
                        level++;
                        this.buildRows(this.grid, groupBkmk.getRowAt(k), level);
                        level--;
                    }
                    break;
                default:
                    break;
                }
            }
        },
        buildRows: function (grid, group, level) {

            // 构建普通行
            var buildNormalRow = function (form, grid, group) {
                var metaGroup = group.getMetaGroup(),
                    metaObj = grid.getMetaObj(),
                    metaRow,
                    rowObj;
                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = metaObj.rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                    case "Group":
                        grid.addGridRow(-1, metaRow, null, level, false);
                        break;
                    case "Detail":
                        level++;
                        var rowCount = group.getRowCount(),
                            start = 0,
                            end = rowCount;

                        if (grid.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                            var curPageIndex = grid.pageInfo.curPageIndex,
                                pageRowCount = grid.pageInfo.pageRowCount;
                            curPageIndex = curPageIndex == null ? 0 : curPageIndex;
                            start = curPageIndex <= 0 ? 0 : curPageIndex * pageRowCount;
                            end = start + pageRowCount > rowCount ? rowCount : start + pageRowCount;
                        }

                        for (var m = start; m < end; m++) {
                            var rowIndex = grid.addGridRow(-1, metaRow, group.getRowAt(m), level, false);
                            grid.getHandler().showDetailRowData(form, grid, rowIndex);
                        }
                        level--;
                        break;
                    }
                }
            }

            if( group.isLeaf ) {
                var doc = this.form.getDocument(),
                    table = doc.getByKey(this.grid.tableKey);
                if (grid.hasTree) {
                    var builder = new YIUI.GridRowTreeBuilder(this.form,this.grid);
                    builder.build(table, group);
                } else if (grid.hasRowExpand) {
                    var builder = new YIUI.GridRowExpandBuilder(this.form,this.grid);
                    builder.build(table, group);
                } else {
                    buildNormalRow(this.form, this.grid, group);
                }
            } else {
                this.loadGroup(group.getMetaGroup(),group,level);
            }
        }
    });

    YIUI.GridMultiBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {

            this.grid.clearGridData();

            var metaObj = this.grid.getMetaObj(),
                rowLayer = metaObj.rowLayer;

            var getRootGroup = function (rowLayer) {
                var o1,o2,metaRow;
                for (var i = 0;o1 = rowLayer.objectArray[i]; i++) {
                    if( o1.objectType == YIUI.MetaGridRowObjectType.AREA ) {
                        for (var k = 0;o2 = o1.objectArray[k];k++) {
                            if( o2.objectType == YIUI.MetaGridRowObjectType.GROUP ) {
                                return o2;
                            }
                        }
                    }
                }
                return o2;
            }

            var rootGroup = getRootGroup(rowLayer),
                count = rootGroup.objectArray.length,
                bkmkMap = this.grid.dataModel.rootBkmk,
                metaGrid = this.grid.getMetaObj(),
                rowIndex,
                rowObj,
                metaRow;

            for( var i = 0;i < count;i++ ) {
                rowObj = rootGroup.objectArray[i];
                if( rowObj.objectType == YIUI.MetaGridRowObjectType.ROW ) {
                    metaRow = metaGrid.rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                    case "Fix":
                        rowIndex = this.grid.addGridRow(-1, metaRow, null, 0, false);
                        this.grid.getHandler().showFixRowData(this.form, this.grid, rowIndex);
                        break;
                    case "Detail":
                        var dimValue = metaRow.dimValue;
                        if( !dimValue ) {
                            continue;
                        }
                        var bkmks = bkmkMap.get(dimValue);
                        if( !bkmks ) {
                            continue;
                        }
                        for( var k = 0,size = bkmks.length;k < size;k++ ) {
                            rowIndex = this.grid.addGridRow(-1, metaRow, bkmks[k], 0, false);
                            this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                        }
                        break;
                    case "Total":
                        this.grid.addGridRow(-1, metaRow, null, 0, false);
                        break;
                    }
                }
            }
        }
    });

    YIUI.GridRowTreeBuilder = YIUI.extend({
        form: null,
        grid: null,
        root: "ROOT",
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {
            var tableKey = this.grid.tableKey;
            var rowMap = this.grid.dataModel.rowMap[tableKey];

            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree;

            if( rowTree.content ) {
                this.impl_buildWithCustomData(table,rowMap);
            } else {
                this.impl_buildWithNoCustomData(table,rowMap);
            }
        },
        impl_buildWithCustomData: function (table,bkmkMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree,
                treeIndex = this.grid.treeIndex,
                treeCell = detailRow.cells[treeIndex];

            var content = rowTree.content;
            var cxt = new View.Context(this.form),
                result = this.form.eval(content,cxt);

            if( !result ) {
                return;
            }

            switch (rowTree.treeType){
                case YIUI.GridTreeType.DICT:

                var columnKey = treeCell.columnKey,
                    IDMap = {},
                    keys = [];

                result.beforeFirst();
                while( result.next() ) {
                    var id = YIUI.TypeConvertor.toLong(result.getByKey(columnKey));
                    if( id > 0 ) {
                        IDMap[id] = result.getBkmk();
                        keys.push(id);
                    }
                }

                var getParentID = function (item) {
                    var table = item.itemTables[item.mainTableKey];
                    return table.itemRows[0]["ParentID"];
                };

                var PIDMap = {},
                    itemKey = treeCell.editOptions.itemKey;

                var items = YIUI.DictService.getItems(itemKey, keys);
                if( !items ) {
                    return;
                }

                var item,parentID,childItems;
                for( var i = 0;item = items[i];i++ ) {
                    parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                    if( parentID == 0 || IDMap[parentID] == null ) {
                        parentID = 0;
                    }
                    childItems = PIDMap[parentID];
                    if( !childItems ) {
                        childItems = [];
                        PIDMap[parentID] = childItems;
                    }
                    childItems.push(item);
                }

                var rootItems = PIDMap["0"];
                if( rootItems ) {
                    this.impl_buildDictTree(PIDMap,bkmkMap,IDMap,result,null,rootItems,rowTree.expand);
                }
                break;
            case YIUI.GridTreeType.COMMON:
                var parent = rowTree.parent,
                    foreign = rowTree.foreign,
                    IDMap = {},
                    relationMap = {},
                    parValue,
                    fgnValue;

                result.beforeFirst();
                while( result.next() ) {
                    parValue = result.getByKey(parent);
                    IDMap[parValue] = result.getBkmk();
                }

                result.beforeFirst();
                while( result.next() ) {
                    parValue = result.getByKey(parent);
                    fgnValue = result.getByKey(foreign);

                    if( fgnValue == null || IDMap[fgnValue] == null ) {
                        fgnValue = this.root;
                    }

                    var values = relationMap[fgnValue];
                    if( !values ) {
                        values = [];
                        relationMap[fgnValue] = values;
                    }

                    values.push(parValue);
                }

                var userDataType = result.getColByKey(parent).getUserType();

                var rootValues = relationMap[this.root];
                if( rootValues ) {
                    this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,result,userDataType,null,rootValues,rowTree.expand);
                }
                break;
            }
        },
        impl_buildWithNoCustomData: function (table,bkmkMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree,
                treeIndex = this.grid.treeIndex,
                treeCell = detailRow.cells[treeIndex];

            switch (rowTree.treeType){
            case YIUI.GridTreeType.DICT:
                var columnKey = treeCell.columnKey,
                    IDMap = {},
                    keys = [];

                table.beforeFirst();
                while( table.next() ) {
                    var id = YIUI.TypeConvertor.toLong(table.getByKey(columnKey));
                    if( id > 0 ) {
                        IDMap[id] = table.getBkmk();
                        keys.push(id);
                    }
                }

                var getParentID = function (item) {
                    var table = item.itemTables[item.mainTableKey],
                        parentID;
                    if (table.tableMode == YIUI.TableMode.HEAD) {
                        parentID = table.itemRows[0]["ParentID"];
                    }
                    return parentID;
                };

                var PIDMap = {},
                    itemKey = treeCell.editOptions.itemKey;

                var items = YIUI.DictService.getItems(itemKey, keys);
                if( !items ) {
                    return;
                }

                var item,parentID,childItems;
                for( var i = 0;item = items[i];i++ ) {
                    parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                    if( parentID == 0 || IDMap[parentID] == null ) {
                        parentID = 0;
                    }
                    childItems = PIDMap[parentID];
                    if( !childItems ) {
                        childItems = [];
                        PIDMap[parentID] = childItems;
                    }
                    childItems.push(item);
                }

                var rootItems = PIDMap["0"];
                if( rootItems ) {
                    this.impl_buildDictTree(PIDMap,bkmkMap,null,null,null,rootItems,rowTree.expand);
                }
                break;
            case YIUI.GridTreeType.COMMON:
                var parent = rowTree.parent,
                    foreign = rowTree.foreign,
                    IDMap = {},
                    relationMap = {},
                    parValue,
                    fgnValue;

                table.beforeFirst();
                while( table.next() ) {
                    parValue = table.getByKey(parent);
                    IDMap[parValue] = table.getBkmk();
                }

                table.beforeFirst();
                while( table.next() ) {
                    parValue = table.getByKey(parent);
                    fgnValue = table.getByKey(foreign);

                    if( fgnValue == null || IDMap[fgnValue] == null ) {
                        fgnValue = this.root;
                    }

                    var values = relationMap[fgnValue];
                    if( !values ) {
                        values = [];
                        relationMap[fgnValue] = values;
                    }

                    values.push(parValue);
                }

                var userDataType = table.getColByKey(parent).getUserType();

                var rootValues = relationMap[this.root];
                if( rootValues ) {
                    this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,table,userDataType,null,rootValues,rowTree.expand);
                }
                break;
            }
        },
        impl_buildCommonTree: function (relationMap,bkmkMap,IDMap,table,userDataType,parentRow,values,expand) {
            var detailRow = this.grid.getDetailMetaRow();
            for( var i = 0,parValue;parValue = values[i];i++ ) {
                var multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(userDataType,parValue));

                var bkmkRow = bkmkMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);

                var rowData = this.grid.getRowDataAt(rowIndex);

                if ( parentRow ) {
                    rowData.treeLevel = parentRow.treeLevel + 1;
                    var childRows = parentRow.childRows;
                    if ( !childRows ) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                } else {
                    rowData.treeLevel = 0;
                }

                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    if( table && IDMap ) {
                        table.setByBkmk(IDMap[parValue]);
                        this.grid.getHandler().showRowData(this.form, this.grid, table, rowIndex);
                    }
                }

                var childValues = relationMap[parValue];
                if( childValues ) {
                    this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,table,userDataType,rowData,childValues,expand);
                } else {
                    rowData.isLeaf = true;
                }
            }
        },
        impl_buildDictTree: function(PIDMap, bkmkMap, IDMap, table, parentRow, items, expand) {
            var detailRow = this.grid.getDetailMetaRow();
            for( var i = 0,item;item = items[i];i++ ) {
                var multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(YIUI.JavaDataType.USER_LONG,item.oid));

                var bkmkRow = bkmkMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);

                var rowData = this.grid.getRowDataAt(rowIndex);

                if ( parentRow ) {
                    rowData.treeLevel = parentRow.treeLevel + 1;
                    var childRows = parentRow.childRows;
                    if ( !childRows ) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                } else {
                    rowData.treeLevel = 0;
                }

                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    if( table && IDMap ) {
                        table.setByBkmk(IDMap[item.oid]);
                        this.grid.getHandler().showRowData(this.form, this.grid, table, rowIndex);
                    }
                }

                var childItems = PIDMap[item.oid];
                if( childItems ) {
                    this.impl_buildDictTree(PIDMap,bkmkMap,IDMap,table,rowData,childItems,expand);
                } else {
                    rowData.isLeaf = true;
                }
            }
        }
    });

    YIUI.GridRowExpandBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {
            var tableKey = this.grid.tableKey;

            var rowMap = this.grid.dataModel.rowMap[tableKey];

            var detailRow = this.grid.getDetailMetaRow(),
                rowExpand = detailRow.rowExpand;

            switch (rowExpand.expandType) {
            case YIUI.RowExpandType.DICT:
                this.expandByDict(rowExpand,rowMap);
                break;
            case YIUI.RowExpandType.FORMULA:
                this.expandByFormula(rowExpand,rowMap);
                break;
            }
        },
        expandByDict: function (rowExpand,rowMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                expandIndex = this.grid.rowExpandIndex,
                expandCell = detailRow.cells[expandIndex];

            var options = expandCell.editOptions,
                itemKey = options.itemKey,
                filter = YIUI.DictHandler.getDictFilter(this.form, expandCell.key, options.itemFilters, itemKey);

            var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);

            var item,multiKey,bkmkRow,rowIndex;
            for( var i = 0;item = items[i];i++ ) {
                multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(YIUI.JavaDataType.USER_LONG,item.oid));

                bkmkRow = rowMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);
                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    this.grid.setValueAt(rowIndex, expandIndex, item.oid);
                }
            }
        },
        expandByFormula: function (rowExpand,rowMap) {
            var content = rowExpand.content;
            if( !content ) {
                return;
            }
            var cxt = new View.Context(this.form),
                result = this.form.eval(content,cxt);

            if( !result ) {
                return;
            }

            var table = this.form.getDocument().getByKey(this.grid.tableKey),
                detailRow = this.grid.getDetailMetaRow();

            var primaryKeys = YIUI.DataUtil.getPrimaryKeys(table),
                indexes = [],types = [];

            YIUI.DataUtil.getIndexesAndTypes(result,primaryKeys,indexes,types);

            var multiKey,bkmkRow,rowIndex;
            result.beforeFirst();
            while ( result.next() ) {
                multiKey = YIUI.DataUtil.makeMultiKey(result,indexes,types);

                bkmkRow = rowMap.get(multiKey);

                rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);
                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    this.grid.getHandler().showRowData(this.form, this.grid, result, rowIndex);
                }
            }
        }
    });

    YIUI.ShowReportGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function (construct) {
            var doc = this.form.getDocument();
            if (doc == null) {
                return;
            }

            if (construct) {
                this.constructGrid();
            }

            var rowGroup = new YIUI.GridRowGroup(this.form, this.grid);
            rowGroup.group();

            var builder = new YIUI.ReportRowBuilder(this.form, this.grid);
            builder.build();

            YIUI.GridLookupUtil.updateFixPos(this.form,this.grid);
        },
        constructGrid: function () {
            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();

                this.grid.initLeafColumns();
                this.grid.initDataModel();

                YIUI.GridLookupUtil.buildCellLookup(this.form, this.grid);// 更新单元格位置信息

                YIUI.ViewUtil.updateFormulaItemsIndex(this.form, this.grid); // 更新计算表达式位置信息
            }

            YIUI.GridUtil.buildGroupHeaders(this.grid);//重建表头
        }
    });

    YIUI.ReportRowBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {

            var self = this;

            var impl_buildMultiple = function () {
                var builder = new YIUI.ReportMultiBuilder(self.form,self.grid);
                builder.build();
            }

            var impl_buildNormal = function () {
                self.grid.clearGridData();

                var metaObj = self.grid.getMetaObj(),
                    rowLayer = metaObj.rowLayer,
                    metaRow,
                    rowObject;

                for (var i = 0;rowObject = rowLayer.objectArray[i]; i++) {
                    switch (rowObject.objectType) {
                        case YIUI.MetaGridRowObjectType.ROW:
                            metaRow = metaObj.rows[rowObject.rowIndex];
                            var rowIndex = self.grid.addGridRow(-1, metaRow, null, 0, false);
                            self.grid.getHandler().showFixRowData(self.form, self.grid, rowIndex);
                            break;
                        case YIUI.MetaGridRowObjectType.AREA:
                            var root = self.grid.dataModel.rootBkmk;
                            self.loadGroup(rowObject, root, 0);
                            break;
                        default:
                            break;
                    }
                }
            }

            if( this.grid.multiple ) {
                impl_buildMultiple();
            } else {
                impl_buildNormal();
            }
        },
        loadGroup:function (rowObject,groupBkmk,level) {
            var metaGrid = this.grid.getMetaObj(),
                metaRow,
                obj;
            for (var j = 0;obj = rowObject.objectArray[j];j++) {
                switch (obj.objectType) {
                    case YIUI.MetaGridRowObjectType.ROW:
                        metaRow = metaGrid.rows[obj.rowIndex];
                        this.grid.addGridRow(-1, metaRow, null, 0, false);
                        break;
                    case YIUI.MetaGridRowObjectType.GROUP:
                        for (var k = 0, size = groupBkmk.getRowCount(); k < size; k++) {
                            level++;
                            this.buildRows(this.grid, groupBkmk.getRowAt(k), level);
                            level--;
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        buildRows: function (grid, group, level) {

            // 构建普通行
            var buildNormalRow = function (form, grid, group) {
                var metaGroup = group.getMetaGroup(),
                    metaObj = grid.getMetaObj(),
                    metaRow,
                    rowObj;
                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = metaObj.rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                        case "Group":
                            grid.addGridRow(-1, metaRow, null, level, false);
                            break;
                        case "Detail":
                            level++;
                            var rowCount = group.getRowCount(),
                                start = 0,
                                end = rowCount;

                            if (grid.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                                var curPageIndex = grid.pageInfo.curPageIndex,
                                    pageRowCount = grid.pageInfo.pageRowCount;
                                curPageIndex = curPageIndex == null ? 0 : curPageIndex;
                                start = curPageIndex <= 0 ? 0 : curPageIndex * pageRowCount;
                                end = start + pageRowCount > rowCount ? rowCount : start + pageRowCount;
                            }

                            for (var m = start; m < end; m++) {
                                var rowIndex = grid.addGridRow(-1, metaRow, group.getRowAt(m), level, false);
                                grid.getHandler().showDetailRowData(form, grid, rowIndex);
                            }
                            level--;
                            break;
                    }
                }
            }

            if( group.isLeaf ) {
                var doc = this.form.getDocument(),
                    table = doc.getByKey(this.grid.tableKey);
                if (grid.hasTree) {
                    var builder = new YIUI.ReportTreeBuilder(this.form,this.grid);
                    builder.build(table, group);
                } else if (grid.hasRowExpand) {
                    var builder = new YIUI.ReportExpandBuilder(this.form,this.grid);
                    builder.build(table, group);
                } else {
                    buildNormalRow(this.form, this.grid, group);
                }
            } else {
                this.loadGroup(group.getMetaGroup(),group,level);
            }
        }
    });

    YIUI.ReportMultiBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {

            this.grid.clearGridData();

            var metaObj = this.grid.getMetaObj(),
                rowLayer = metaObj.rowLayer;

            var getRootGroup = function (rowLayer) {
                var o1,o2,metaRow;
                for (var i = 0;o1 = rowLayer.objectArray[i]; i++) {
                    if( o1.objectType == YIUI.MetaGridRowObjectType.AREA ) {
                        for (var k = 0;o2 = o1.objectArray[k];k++) {
                            if( o2.objectType == YIUI.MetaGridRowObjectType.GROUP ) {
                                return o2;
                            }
                        }
                    }
                }
                return o2;
            }

            var rootGroup = getRootGroup(rowLayer),
                count = rootGroup.objectArray.length,
                bkmkMap = this.grid.dataModel.rootBkmk,
                metaGrid = this.grid.getMetaObj(),
                rowIndex,
                rowObj,
                metaRow;

            for( var i = 0;i < count;i++ ) {
                rowObj = rootGroup.objectArray[i];
                if( rowObj.objectType == YIUI.MetaGridRowObjectType.ROW ) {
                    metaRow = metaGrid.rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                        case "Fix":
                            rowIndex = this.grid.addGridRow(-1, metaRow, null, 0, false);
                            this.grid.getHandler().showFixRowData(this.form, this.grid, rowIndex);
                            break;
                        case "Detail":
                            var dimValue = metaRow.dimValue;
                            if( !dimValue ) {
                                continue;
                            }
                            var bkmks = bkmkMap.get(dimValue);
                            if( !bkmks ) {
                                continue;
                            }
                            for( var k = 0,size = bkmks.length;k < size;k++ ) {
                                rowIndex = this.grid.addGridRow(-1, metaRow, bkmks[k], 0, false);
                                this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                            }
                            break;
                        case "Total":
                            this.grid.addGridRow(-1, metaRow, null, 0, false);
                            break;
                    }
                }
            }
        }
    });

    YIUI.ReportTreeBuilder = YIUI.extend({
        form: null,
        grid: null,
        root: "ROOT",
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {
            var tableKey = this.grid.tableKey;
            var rowMap = this.grid.dataModel.rowMap[tableKey];

            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree;

            if( rowTree.content ) {
                this.impl_buildWithCustomData(table,rowMap);
            } else {
                this.impl_buildWithNoCustomData(table,rowMap);
            }
        },
        impl_buildWithCustomData: function (table,bkmkMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree,
                treeIndex = this.grid.treeIndex,
                treeCell = detailRow.cells[treeIndex];

            var content = rowTree.content;
            var cxt = new View.Context(this.form),
                result = this.form.eval(content,cxt);

            if( !result ) {
                return;
            }

            switch (rowTree.treeType){
                case YIUI.GridTreeType.DICT:

                    var columnKey = treeCell.columnKey,
                        IDMap = {},
                        keys = [];

                    result.beforeFirst();
                    while( result.next() ) {
                        var id = YIUI.TypeConvertor.toLong(result.getByKey(columnKey));
                        if( id > 0 ) {
                            IDMap[id] = result.getBkmk();
                            keys.push(id);
                        }
                    }

                    var getParentID = function (item) {
                        var table = item.itemTables[item.mainTableKey];
                        return table.itemRows[0]["ParentID"];
                    };

                    var PIDMap = {},
                        itemKey = treeCell.editOptions.itemKey;

                    var items = YIUI.DictService.getItems(itemKey, keys);
                    if( !items ) {
                        return;
                    }

                    var item,parentID,childItems;
                    for( var i = 0;item = items[i];i++ ) {
                        parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                        if( parentID == 0 || IDMap[parentID] == null ) {
                            parentID = 0;
                        }
                        childItems = PIDMap[parentID];
                        if( !childItems ) {
                            childItems = [];
                            PIDMap[parentID] = childItems;
                        }
                        childItems.push(item);
                    }

                    var rootItems = PIDMap["0"];
                    if( rootItems ) {
                        this.impl_buildDictTree(PIDMap,bkmkMap,IDMap,result,null,rootItems,rowTree.expand);
                    }
                    break;
                case YIUI.GridTreeType.COMMON:
                    var parent = rowTree.parent,
                        foreign = rowTree.foreign,
                        IDMap = {},
                        relationMap = {},
                        parValue,
                        fgnValue;

                    result.beforeFirst();
                    while( result.next() ) {
                        parValue = result.getByKey(parent);
                        IDMap[parValue] = result.getBkmk();
                    }

                    result.beforeFirst();
                    while( result.next() ) {
                        parValue = result.getByKey(parent);
                        fgnValue = result.getByKey(foreign);

                        if( fgnValue == null || IDMap[fgnValue] == null ) {
                            fgnValue = this.root;
                        }

                        var values = relationMap[fgnValue];
                        if( !values ) {
                            values = [];
                            relationMap[fgnValue] = values;
                        }

                        values.push(parValue);
                    }

                    var userDataType = result.getColByKey(parent).getUserType();

                    var rootValues = relationMap[this.root];
                    if( rootValues ) {
                        this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,result,userDataType,null,rootValues,rowTree.expand);
                    }
                    break;
            }
        },
        impl_buildWithNoCustomData: function (table,bkmkMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                rowTree = detailRow.rowTree,
                treeIndex = this.grid.treeIndex,
                treeCell = detailRow.cells[treeIndex];

            switch (rowTree.treeType){
                case YIUI.GridTreeType.DICT:
                    var columnKey = treeCell.columnKey,
                        IDMap = {},
                        keys = [];

                    table.beforeFirst();
                    while( table.next() ) {
                        var id = YIUI.TypeConvertor.toLong(table.getByKey(columnKey));
                        if( id > 0 ) {
                            IDMap[id] = table.getBkmk();
                            keys.push(id);
                        }
                    }

                    var getParentID = function (item) {
                        var table = item.itemTables[item.mainTableKey],
                            parentID;
                        if (table.tableMode == YIUI.TableMode.HEAD) {
                            parentID = table.itemRows[0]["ParentID"];
                        }
                        return parentID;
                    };

                    var PIDMap = {},
                        itemKey = treeCell.editOptions.itemKey;

                    var items = YIUI.DictService.getItems(itemKey, keys);
                    if( !items ) {
                        return;
                    }

                    var item,parentID,childItems;
                    for( var i = 0;item = items[i];i++ ) {
                        parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                        if( parentID == 0 || IDMap[parentID] == null ) {
                            parentID = 0;
                        }
                        childItems = PIDMap[parentID];
                        if( !childItems ) {
                            childItems = [];
                            PIDMap[parentID] = childItems;
                        }
                        childItems.push(item);
                    }

                    var rootItems = PIDMap["0"];
                    if( rootItems ) {
                        this.impl_buildDictTree(PIDMap,bkmkMap,null,null,null,rootItems,rowTree.expand);
                    }
                    break;
                case YIUI.GridTreeType.COMMON:
                    var parent = rowTree.parent,
                        foreign = rowTree.foreign,
                        IDMap = {},
                        relationMap = {},
                        parValue,
                        fgnValue;

                    table.beforeFirst();
                    while( table.next() ) {
                        parValue = table.getByKey(parent);
                        IDMap[parValue] = table.getBkmk();
                    }

                    table.beforeFirst();
                    while( table.next() ) {
                        parValue = table.getByKey(parent);
                        fgnValue = table.getByKey(foreign);

                        if( fgnValue == null || IDMap[fgnValue] == null ) {
                            fgnValue = this.root;
                        }

                        var values = relationMap[fgnValue];
                        if( !values ) {
                            values = [];
                            relationMap[fgnValue] = values;
                        }

                        values.push(parValue);
                    }

                    var userDataType = table.getColByKey(parent).getUserType();

                    var rootValues = relationMap[this.root];
                    if( rootValues ) {
                        this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,table,userDataType,null,rootValues,rowTree.expand);
                    }
                    break;
            }
        },
        impl_buildCommonTree: function (relationMap,bkmkMap,IDMap,table,userDataType,parentRow,values,expand) {
            var detailRow = this.grid.getDetailMetaRow();
            for( var i = 0,parValue;parValue = values[i];i++ ) {
                var multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(userDataType,parValue));

                var bkmkRow = bkmkMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);

                var rowData = this.grid.getRowDataAt(rowIndex);

                if ( parentRow ) {
                    rowData.treeLevel = parentRow.treeLevel + 1;
                    var childRows = parentRow.childRows;
                    if ( !childRows ) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                } else {
                    rowData.treeLevel = 0;
                }

                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    if( table && IDMap ) {
                        table.setByBkmk(IDMap[parValue]);
                        this.grid.getHandler().showRowData(this.form, this.grid, table, rowIndex);
                    }
                }

                var childValues = relationMap[parValue];
                if( childValues ) {
                    this.impl_buildCommonTree(relationMap,bkmkMap,IDMap,table,userDataType,rowData,childValues,expand);
                } else {
                    rowData.isLeaf = true;
                }
            }
        },
        impl_buildDictTree: function(PIDMap, bkmkMap, IDMap, table, parentRow, items, expand) {
            var detailRow = this.grid.getDetailMetaRow();
            for( var i = 0,item;item = items[i];i++ ) {
                var multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(YIUI.JavaDataType.USER_LONG,item.oid));

                var bkmkRow = bkmkMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);

                var rowData = this.grid.getRowDataAt(rowIndex);

                if ( parentRow ) {
                    rowData.treeLevel = parentRow.treeLevel + 1;
                    var childRows = parentRow.childRows;
                    if ( !childRows ) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                } else {
                    rowData.treeLevel = 0;
                }

                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    if( table && IDMap ) {
                        table.setByBkmk(IDMap[item.oid]);
                        this.grid.getHandler().showRowData(this.form, this.grid, table, rowIndex);
                    }
                }

                var childItems = PIDMap[item.oid];
                if( childItems ) {
                    this.impl_buildDictTree(PIDMap,bkmkMap,IDMap,table,rowData,childItems,expand);
                } else {
                    rowData.isLeaf = true;
                }
            }
        }
    });

    YIUI.ReportExpandBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function (table,group) {
            var tableKey = this.grid.tableKey;

            var rowMap = this.grid.dataModel.rowMap[tableKey];

            var detailRow = this.grid.getDetailMetaRow(),
                rowExpand = detailRow.rowExpand;

            switch (rowExpand.expandType) {
                case YIUI.RowExpandType.DICT:
                    this.expandByDict(rowExpand,rowMap);
                    break;
                case YIUI.RowExpandType.FORMULA:
                    this.expandByFormula(rowExpand,rowMap);
                    break;
            }
        },
        expandByDict: function (rowExpand,rowMap) {
            var detailRow = this.grid.getDetailMetaRow(),
                expandIndex = this.grid.rowExpandIndex,
                expandCell = detailRow.cells[expandIndex];

            var options = expandCell.editOptions,
                itemKey = options.itemKey,
                filter = YIUI.DictHandler.getDictFilter(this.form, expandCell.key, options.itemFilters, itemKey);

            var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);

            var item,multiKey,bkmkRow,rowIndex;
            for( var i = 0;item = items[i];i++ ) {
                multiKey = new YIUI.MultiKey();
                multiKey.addValue(new YIUI.MultiKeyNode(YIUI.JavaDataType.USER_LONG,item.oid));

                bkmkRow = rowMap.get(multiKey);

                var rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);
                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    this.grid.setValueAt(rowIndex, expandIndex, item.oid);
                }
            }
        },
        expandByFormula: function (rowExpand,rowMap) {
            var content = rowExpand.content;
            if( !content ) {
                return;
            }
            var cxt = new View.Context(this.form),
                result = this.form.eval(content,cxt);

            if( !result ) {
                return;
            }

            var table = this.form.getDocument().getByKey(this.grid.tableKey),
                detailRow = this.grid.getDetailMetaRow();

            var primaryKeys = YIUI.DataUtil.getPrimaryKeys(table),
                indexes = [],types = [];

            YIUI.DataUtil.getIndexesAndTypes(result,primaryKeys,indexes,types);

            var multiKey,bkmkRow,rowIndex;
            result.beforeFirst();
            while ( result.next() ) {
                multiKey = YIUI.DataUtil.makeMultiKey(result,indexes,types);

                bkmkRow = rowMap.get(multiKey);

                rowIndex = this.grid.addGridRow(-1, detailRow, bkmkRow, 0, false);
                if( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, rowIndex);
                } else {
                    this.grid.getHandler().showRowData(this.form, this.grid, result, rowIndex);
                }
            }
        }
    });

})();
