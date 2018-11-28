/**
 * User: chenzs
 * Date: 14-2-14
 * Time: 下午2:58
 * 整个界面对象，包含所有信息
 */
YIUI.Form = YIUI.extend({
    init: function (metaForm) {
        this.formID = YIUI.Form_allocFormID();
        this.metaForm = metaForm;
        this.setOperationState(metaForm.initState == YIUI.Form_OperationState.Edit ? metaForm.operationState : metaForm.initState);

        this.type = metaForm.type;
        this.operations = metaForm.operations;
        // this.metaOpts = metaForm.metaOpts;// 只有可见可用的配置
        this.defTbr = metaForm.defTbr;
        this.formKey = metaForm.formKey;
        this.templateKey = metaForm.templateKey;
        this.caption = metaForm.caption;
        this.abbrCaption = metaForm.abbrCaption;
        this.formulaCaption = metaForm.formulaCaption;
        this.formulaAbbrCaption = metaForm.formulaAbbrCaption;
        this.target = metaForm.target;
        this.mainTableKey = metaForm.mainTableKey;
        this.onLoad = metaForm.onLoad;
        this.onClose = metaForm.onClose;
        this.confirmClose = metaForm.confirmClose;
        var rootObj = metaForm.root;
        this.standalone = metaForm.standalone;
        this.relations = metaForm.relations;
        this.macroMap = metaForm.macroMap;
        this.statusItems = metaForm.statusItems;
        this.paraGroups = metaForm.paraGroups;
        this.sysExpVals = metaForm.sysExpVals;
//        this.filterMap = metaForm.filterMap;
        this.dependency = metaForm.dependency;
        this.paras = metaForm.paras;
        this.callParas = metaForm.callParas;
        this.paraCollection = metaForm.paraCollection;
        this.checkRules = metaForm.checkRules;
        this.subDetailInfo = metaForm.subDetailInfo;
        this.mapGrids = metaForm.mapGrids;
        this.errorInfo = metaForm.errorInfo;
        this.dataObjectKey = metaForm.dataObjectKey;
        //this.refObjectKey = metaForm.refObjectKey;
        //this.refTableKey = metaForm.refTableKey;
        this.postShow = metaForm.postShow;
        this.parser = new View.Parser(this);
        // this.uiProcess = new YIUI.UIProcess(this);
        this.focusManager = new FocusPolicy(this);
        // this.viewDataMonitor = new YIUI.ViewDataMonitor(this);
        this.result = null;
        this.eventList = {};
        this.timerTask = metaForm.timerTask;
        this.metaComps = metaForm.metaComps;
   //     this.metaCells = metaForm.metaCells;
        // this.metaOpts = metaForm.metaOpts;
        this.buddyKeys = metaForm.buddyKeys || [];

        this.popWidth = metaForm.popWidth;
        this.popHeight = metaForm.popHeight;
        this.topMargin = metaForm.topMargin;
        this.bottomMargin = metaForm.bottomMargin;
        this.leftMargin = metaForm.leftMargin;
        this.rightMargin = metaForm.rightMargin;
        this.projectKey = metaForm.projectKey;

        var options = {
            form: this,
            rootObj: rootObj,
            focusManager:this.focusManager
        };

        this.mergeOptContainer = null;

        this.formAdapt = new YIUI.FormAdapt(options);
        this.formAdapt.load();

        var fm = new FilterMap();
        var map = this.formAdapt.LVMap.concat(this.formAdapt.gridMap);
        for (var i = 0, len = map.length; i < len; i++) {
            var key = map[i].key;
            var tableKey = map[i].tableKey;

            if(tableKey){
                var comp = this.getComponent(key);
                var meta = comp.getMetaObj();

                var controlType = meta.type;

                var loadType =  YIUI.PageLoadType.NONE;
                var pageIndicatorCount = 5;
                if(controlType == YIUI.CONTROLTYPE.LISTVIEW){
                    loadType = comp.loadType;
                }else if (controlType == YIUI.CONTROLTYPE.GRID){
                    loadType = meta.pageLoadType;
                    pageIndicatorCount = meta.pageIndicatorCount;
                }

                if(loadType == YIUI.PageLoadType.DB) {
                    var tblKey = meta.tableKey;
                    var tblDetail = new TableFilterDetail();
                    tblDetail.setTableKey(tblKey);
                    tblDetail.setStartRow(0);
                    tblDetail.setMaxRows(meta.pageRowCount);
                    tblDetail.setPageIndicatorCount(pageIndicatorCount);
                    fm.addTblDetail(tblDetail);
                }
            }

        }
        this.filterMap = fm;

        YIUI.FormStack.addForm(this);
    },

    getRadios: function(groupKey) {
        return this.formAdapt.getRadios(groupKey);
    },

    isError:function () {
        return this.errorInfo.error;
    },

    hasEnableRight:function (fieldKey) {
        return fieldKey && this.formRights && (this.formRights.allEnableRights || $.inArray(fieldKey,this.formRights.enableRights) == -1);
    },

    hasVisibleRight:function (fieldKey) {
        return fieldKey && this.formRights && (this.formRights.allVisibleRights || $.inArray(fieldKey,this.formRights.visibleRights) == -1);
    },

    hasOptRight:function (optKey) {
        return optKey && this.formRights && (this.formRights.allOptRights || $.inArray(optKey,this.formRights.optRights) != -1);
    },

    initViewDataMonitor: function () {
        this.viewDataMonitor = new YIUI.ViewDataMonitor(this);
    },

    getMergeOptContainer: function () {
        return this.mergeOptContainer;
    },

    getCaption: function() {
        var caption = "";
        var formula = this.formulaCaption;
        if (formula) {
            var cxt = new View.Context(this);
            caption = this.eval(formula, cxt);
        }
        if (!caption && this.caption) {
            caption = this.caption;
        }
        return caption;
    },

    getAbbrCaption: function() {
        var abbr = "";
        var formula = this.formulaAbbrCaption;
        if (formula) {
            var cxt = new View.Context(this);
            abbr = this.eval(formula, cxt);
        }
        if (!abbr) {
            abbr = this.abbrCaption;
        }
        if (!abbr) {
            abbr = this.getCaption();
        }
        return abbr;
    },

    doOnLoad: function() {
        var onLoad = this.onLoad;
        if(onLoad) {
            var cxt = new View.Context(this);
            this.eval(onLoad, cxt);
        }

        return this.doOptQueue();
    },

    setOptQueue: function(optQueue) {
        this.optQueue = optQueue;
    },

    doOptQueue: function() {
        var optQueue = this.optQueue;
        if(optQueue) {
            return optQueue.doOpt();
        }
        return $.Deferred(function(def){
            def.resolve(false);
        });
    },

    setOperationEnable:function (key,enable) {
        if( !this.defaultToolBar || !this.hasOptRight(key) )
            return;
        this.defaultToolBar.setItemEnable(key,enable);
    },

    setOperationVisible:function (key,visible) {
        if( !this.defaultToolBar || !this.hasOptRight(key) )
            return;
        this.defaultToolBar.setItemVisible(key,visible);
    },

    getMetaComp: function(key) {
        return this.metaComps[key];
    },

    // getMetaOpt: function(key) {
    //     return this.metaOpts[key];
    // },

    // getMetaCell: function(key) {
    //     return this.metaCells[key];
    // },

    setOID: function(oid) {
        this.filterMap.setOID(oid);
    },

    getOID: function() {
        var document = this.getDocument();
        if(document) {
            return document.oid;
        } else {
            return this.filterMap.getOID();
        }
    },

    setSysExpVals: function(key, value) {
        if (!this.sysExpVals) {
            this.sysExpVals = {};
        }
        this.sysExpVals[key] = value;
    },

    getSysExpVals: function(key) {
        if (this.sysExpVals) {
            return this.sysExpVals[key];
        }
        return null;
    },

    removeSysExpVals: function (key) {
        if( this.sysExpVals ) {
            delete this.sysExpVals[key];
        }
    },

    isStandalone: function () {
        return this.standalone;
    },
    setResult: function (result) {
        this.result = result;
    },
    getResult: function () {
        return this.result;
    },

    getFormAdapt: function () {
        return this.formAdapt;
    },
    //
    // addOpt: function(tbr, expOpts, optMap) {
    // 	if(!expOpts || !expOpts.items) return;
    // 	var items = expOpts.items;
    //
    //     var metaTbl = tbr.getMetaObj();
    //     var metaItems = metaTbl.metaItems;
    //     $.extend(metaItems, expOpts.metaItems)
    // 	for (var i = 0, len = items.length; i < len; i++) {
    // 	var item = items[i];
    // 	item.formID = expOpts.formID;
    // 	tbr.items.push(item);
    // 	optMap[item.key] = {
    // 		barKey: this.defTbr,
    // 		opt: item
    // 	};
    // }
    // this.cFormID = expOpts.formID;
    // this.hasMerge = true;
    // },
    //
    // delOpt: function(tbr, expOpts, optMap) {
    // 	var items = expOpts.items;
    // var len = items.length;
    // var len2 = tbr.items.length;
    // tbr.items.splice(len2 - len, len);
    //
    //     var metaTbl = tbr.getMetaObj();
    //     var metaItems = metaTbl.metaItems;
    //
    // this.hasMerge = false;
    // for (var i = 0, len = items.length; i < len; i++) {
    // 	var item = items[i];
    // 	delete optMap[item.key];
    //        delete metaItems[item.key];
    // }
    // },

    getOptMap: function () {
        return this.formAdapt.getOptMap();
        // var expOpts = this.expOpts;
        // if(this.mergeOpt) {
        // 	if(this.cFormID) {
        // 		var cFormID = expOpts.formID;
        // 	var cForm = YIUI.FormStack.getForm(cFormID);
        // 	this.delOpt(this.defaultToolBar, expOpts, optMap);
        // 		if(!cForm) {
        // 		this.cFormID = null;
        // 		} else {
        // 		expOpts.formID = cForm.formID;
        // 		this.addOpt(this.defaultToolBar, expOpts, optMap);
        // 		}
        // 	} else if(!this.hasMerge) {
        // 	this.addOpt(this.defaultToolBar, expOpts, optMap);
        // 	}
        // }
        // return optMap;
    },

    setError: function (error, errorMsg, errorSource) {
        this.errorInfo = {error: error, errorMsg: errorMsg, errorSource: errorSource};
        if (error) {
            this.showErrMsg(errorMsg);
        } else {
            this.hideErrMsg();
        }
    },
    getCellSubDtlComps: function (gridKey, cellKey) {
        var map = this.formAdapt.getCellSubDtlCompMap();
        if (map == null) return null;
        var gridMap = map[gridKey];
        if (gridMap == null) return null;
        return gridMap[cellKey];
    },
    getGridInfoMap: function () {
        return this.formAdapt.getGridMap();
    },
    getListViewMap: function () {
        return this.formAdapt.getListViewMap();
    },
    getGridInfoByTableKey: function (tableKey) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.tableKey == tableKey) {
                return grid;
            }
        }
    },
    getGridInfoByKey: function (key) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.key == key) {
                return grid;
            }
        }
    },
    getListView: function (arg) {
        return this.formAdapt.getListView(arg);
    },

    getGrid: function (arg) {
    	return this.formAdapt.getGrid(arg);
    },

    setDefaultToolBar: function (toolBar) {
        this.defaultToolBar = toolBar;
    },

    getComponentList: function () {
        return this.formAdapt.getCompList();
    },
    getComponent: function (comKey) {
        return this.formAdapt.getComp(comKey);
    },
    getCompByDataBinding: function(tableKey,columnKey) {
        var compList = this.formAdapt.compList,com;
        for( var key in compList ){
            com = compList[key];
            if( com.tableKey === tableKey && com.columnKey === columnKey )
                return com;
        }
        return null;
    },
    getPanel: function (key) {
        return this.formAdapt.getPanel(key);
    },
    setFormKey: function (formKey) {
        this.formKey = formKey;
    },
    getFormKey: function () {
        return this.formKey;
    },
    setTemplateKey: function(templateKey) {
        this.templateKey = templateKey;
    },
    getTemplateKey: function() {
        return this.templateKey;
    },
    setCaption: function (caption) {
        this.caption = caption;
    },
    getDataObjectKey: function () {
        return this.dataObjectKey;
    },
    getDataObject: function(){
        return this.metaForm.dataObject;
    },
    getRoot: function () {
        return this.formAdapt.getRoot();
    },
    setDocument: function (document) {
        this.document = document;
    },
    getDocument: function () {
        return this.document;
    },

    grids: [],// 需要重新refresh的表格

    showDocument: function () {

        var _this = this;
   
        if( !_this.impl_show ) {
            _this.impl_show = function (commit) {
                var showData = new YIUI.ShowData(_this);
                showData.show();

                if( _this.rendered ) {
                    for( var i = 0,grid;grid = this.grids[i];i++ ) {
                        grid.refreshGrid();
                    }
                    this.grids.length = 0;
                } else {
                    _this.render();
                }

                if( _this.metaForm.initFocus != false ) {
                    _this.initFirstFocus();
                }

                var eventCB = _this.getEvent(YIUI.FormEvent.ShowDocument);
                if(eventCB){
                    eventCB(YIUI.FormEvent.ShowDocument, _this);
                }

                if(_this.postShow) {
                    var cxt = {form: _this};
                    _this.eval(_this.postShow, cxt);
                }
                YIUI.LoadingUtil.hide();
            }
        }

        // 每次更新权限数据
        var info = this.getSysExpVals(YIUI.BPMKeys.WORKITEM_INFO);
        var workitemID = -1;
        if( info ) {
        	workitemID = info.WorkitemID;
            if( info.IgnoreFormState &&
                _this.getSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW) == YIUI.BPMConstants.WORKITEM_VIEW )
                _this.setOperationState(YIUI.Form_OperationState.Edit);
        }

        var formKey = _this.metaForm.formKey;

        var params = {
            formKey: formKey,
            OID: _this.getOID(),
            workitemID: workitemID,
            parameters: _this.getParas().toJSON()
        };

        if( _this.document ) {
            var doc = YIUI.DataUtil.toJSONDoc(_this.document);
            params.document = $.toJSON(doc);
        }

        YIUI.RightsService.loadFormRights(formKey,params).then(function (rights) {
             _this.setFormRights(rights);
             !_this.isDestroyed && _this.impl_show();
        });
    },
    setWillShow: function(show) {
        this.show = show;
    },
    willShow: function() {
        return this.show;
    },
    setComponentValue: function (key, value, fireEvent) {
        this.formAdapt.setCompValue(key, value, fireEvent);
    },
    setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
        this.formAdapt.setCellValByIndex(key, rowIndex, colIndex, value, fireEvent);
    },
    getCellValByIndex: function (key, rowIndex, colIndex) {
        return this.formAdapt.getCellValByIndex(key, rowIndex, colIndex);
    },
    setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
        this.formAdapt.setCellValByKey(key, rowIndex, colKey, value, fireEvent);
    },
    getCellValByKey: function (key, rowIndex, colKey) {
        return this.formAdapt.getCellValByKey(key, rowIndex, colKey);
    },
    setCellBackColor: function (key, rowIndex, colIndex, color) {
        var comp = this.getComponent(key);
        var type = comp == undefined ? -1 : comp.type;
        switch (type) {
            case YIUI.CONTROLTYPE.GRID:
                comp.setCellBackColor(rowIndex, colIndex, color);
                break;
            default:
                break;
        }
    },
    setCellForeColor: function (key, rowIndex, colIndex, color) {
        var comp = this.getComponent(key);
        var type = comp == undefined ? -1 : comp.type;
        switch (type) {
            case YIUI.CONTROLTYPE.GRID:
                comp.setCellForeColor(rowIndex, colIndex, color);
                break;
            default:
                break;
        }
    },
    setFocusCell: function (key, rowIndex, colIndex) {
        var comp = this.getComponent(key);
        var type = comp == undefined ? -1 : comp.type;
        switch (type) {
            case YIUI.CONTROLTYPE.GRID:
                comp.setFocusCell(rowIndex, colIndex);
                break;
            default:
                break;
        }
    },
    getValue: function (key) {
        var com = this.getComponent(key);
        var cellLocation = this.getCellLocation(key);
        var row,column,value = null;
        if ( cellLocation ) {
            com = this.getComponent(cellLocation.key);
            switch ( com.getMetaObj().type ) {
                case YIUI.CONTROLTYPE.GRID:
                    row = cellLocation.row;
                    if( row == null || row == -1 ) {
                        row = com.getFocusRowIndex();
                    }
                    value = com.getValueAt(row,cellLocation.column);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    row = com.getFocusRowIndex();
                    value = com.getValue(row,cellLocation.column);
                    break;
            }
        } else { // 直接写表格key,取焦点行列值
            com = this.getComponent(key);
            switch ( com.getMetaObj().type ) {
                case YIUI.CONTROLTYPE.GRID:
                    var row = com.getFocusRowIndex(),
                        column = com.getFocusColIndex();
                    if( row != -1 && column != -1 ) {
                        value = com.getValueAt(row,column);
                    }
                    break;
                default:
                    value = com.getValue();
                    break;
            }
        }
        return value;
    },
    getCellLocation: function (key) {
        return this.formAdapt.getCellLocation(key);
    },
    getColumnInfo: function (key) {
        return this.formAdapt.getColumnInfo(key);
    },
    setFilterMap: function (filterMap) {
        this.filterMap = filterMap;
    },
    getFilterMap: function () {
        return this.filterMap;
    },
    getMainTableKey: function () {
        return this.mainTableKey;
    },
    setCondParas: function (conParas) {
        this.conParas = conParas;
    },
    getCondParas: function () {
        return this.conParas == null ? {} : this.conParas;
    },
    setInitOperationState: function (initOperationState) {
        this.initOperationState = initOperationState;
    },
    getInitOperationState: function () {
        return this.initOperationState;
    },
    setOperationState: function (operationState) {
        this.operationState = operationState;
    },
    getOperationState: function () {
        return this.operationState;
    },
    // setOperationEnable: function (key, enable) {
    //     var opts = this.getOptMap();
    //     var opt = opts[key];
    //     var barKey = opt.barKey;
    //     var toolbar = this.getComponent(barKey);
    //     toolbar.setItemEnable(key, enable);
    // },
    resetUIStatus: function (mask) {
        this.getUIProcess().resetUIStatus(mask);
    },
    getUIProcess: function () {
        return this.viewDataMonitor.getUIProcess();
    },
    getViewDataMonitor:function(){
        return this.viewDataMonitor;
    },
    setDefContainer: function (defContainer) {
        this.formAdapt.setDefContainer(defContainer);
    },
    getDefContainer: function () {
        return this.formAdapt.getDefContainer(this.defCtKey);
    },
    setContainer: function (container) {
        var self = this;
        this.formAdapt.setContainer(container);
//        self.initFirstFocus();
    },
    render: function() {
        var self = this;
        var ct = self.getContainer();
        if( ct && ct.el ) {
            ct.renderDom(self);
            if(self.defCtKey) {
                var ct = self.getComponent(self.defCtKey);
                ct && self.setDefContainer(ct);
            }
            self.rendered = true;

            var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
            var rootEl = self.getRoot().getEl();
            errDiv.prependTo(rootEl);
            self.setErrDiv(errDiv);
        }
    },
    getContainer: function () {
        return this.formAdapt.getContainer();
    },
    newCxt: function () {
        var cxt = new View.Context(this);
        return cxt;
    },
    getRelations: function () {
        return this.dependency.relations;
    },
    setPara: function (key, value) {
        this.paras.put(key, value);
    },
    getPara: function (key) {
        return this.paras != null ? this.paras.get(key) : null;
    },
    setCallPara: function (key, value) {
        this.callParas.put(key, value);
    },
    getCallPara: function (key) {
        return this.callParas.get(key);
    },
    getParaCollection: function () {
        return this.paraCollection;
    },
    getParas: function () {
        if (this.paras == undefined) {
            this.paras = {};
        }
        return this.paras;
    },
    getCallParas: function () {
        if (this.callParas == undefined) {
            this.callParas = {};
        }
        return this.callParas;
    },
    refreshParas: function () {
        return this.getUIProcess().refreshParas();
    },
//    setWorkitemInfo: function (workitemInfo) {
//        this.workitemInfo = workitemInfo;
//    },
//    getWorkitemInfo: function () {
//        return this.workitemInfo;
//    },
    setErrDiv: function (errDiv) {
        this.errDiv = errDiv;
        var self = this;
        window.setTimeout(function () {
            if (!self.isDestroyed) {
                self.setError(self.errorInfo.error, self.errorInfo.errorMsg, self.errorInfo.errorSource);
            }
        }, 0);
    },
    showErrMsg: function (msg) {
        if (!this.errDiv) {
            return;
        }
        $("label", this.errDiv).text(msg);
        this.errDiv.show();

        var ct = this.getContainer().el.children(".ui-tabs-body");
        if( ct.length == 0 ) {
            ct = this.getContainer().el;
        }
        var newH = ct.height() - this.errDiv.height();
        var newW = ct.width();
        this.getRoot().doLayout(newW, newH);
    },
    hideErrMsg: function () {
        if (!this.errDiv) {
            return;
        }
        this.errDiv.hide();

        var ct = this.getContainer().el.children(".ui-tabs-body");
        if( ct.length == 0 ) {
            ct = this.getContainer().el;
        }
        var newH = ct.height();
        var newW = ct.width();
        this.getRoot().doLayout(newW, newH);
    },
    reloadTable: function (key) {
        var document = this.getDocument();
        var filterMap = this.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DETAIL);
        var condParas = this.getCondParas();
        var paras = {};
        paras.service = "PureOpt";
        paras.cmd = "ReloadTable";
        paras.tableKey = key;
        paras.formKey = this.formKey;
        paras.filterMap = $.toJSON(filterMap);
        paras.condParas = $.toJSON(condParas);
        var table = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (table) {
            document.remove(key);
            document.add(key, table);
        }
    },
    initFirstFocus: function () {
        var size = this.formAdapt.getOrderList().length;
        this.focusManager.focusNextNode(0,size);
    },
    getParentForm: function () {
        return YIUI.FormStack.getForm(this.pFormID);
    },
    fireClose: function () {
        if (this.type != YIUI.Form_Type.Entity) {
            this.close();
            return true;
        }

        if (this.operationState == YIUI.Form_OperationState.Default || this.operationState == YIUI.Form_OperationState.Delete) {
            this.close();
            return true;
        }
        
        if (!this.confirmClose) {
        	this.close();
            return true;
        }
        
        var options = {
            msg: YIUI.I18N.form.closeInterface,
            msgType: YIUI.Dialog_MsgType.YES_NO
        };
        var dialog = new YIUI.Control.Dialog(options);
        dialog.render();
        var $form = this;
        dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
            $form.close();
        });
        dialog.regEvent(YIUI.Dialog_Btn.STR_NO, function () {
        });
    },
    close: function () {
        var onClose = this.onClose;
        if(onClose) {
            var cxt = new View.Context(this);
            this.eval(onClose, cxt);
        }

        var callback = this.getEvent(YIUI.FormEvent.Close);
        if (callback) {
            callback(YIUI.FormEvent.Close, this);
        }

        this.getContainer().removeForm(this);
    },
    eval: function (formula, context, callback) {
        if (formula) {
            //异步调用可能 form 已destory
            if(this.parser){
                return this.parser.eval(formula, context, callback);
            } else{
                console.error('form is destroyed ' + formula +'  formKey'+this.formKey);
            }
        }
        return null;
    },
    eval2: function(formula, syntaxTree, evalContext, scope) {
        if ( formula ) {
            return this.parser.eval2(formula, syntaxTree, evalContext, scope);
        }
        return null;
    },
    evalByTree: function (tree, context, callback) {
        if (tree !== null && tree !== undefined) {
            return this.parser.evalByTree(tree, context, callback);
        }
        return null;
    },
    getSyntaxTree: function (script) {
        if (script.length == 0) {
            return null;
        } else {
            return this.parser.getSyntaxTree(script);
        }
    },
    toJSON: function () {
        var json = {};
        var jsonArr = this.formAdapt.toJSON();
        json.key = this.formKey;
        json.items = jsonArr;
        json.filterMap = this.getFilterMap();
        json.condParas = this.getCondParas();
        json.operationState = this.operationState;
        return $.toJSON(json);
    },
    destroy: function () {
        // this.uiProcess = null;
        this.parser = null;
        this.document = null;
        this.dependency = null;
        this.isDestroyed = true;

        YIUI.Print.del(this.formID);
    },

    regEvent: function (key, callback) {
        if (!this.eventList) {
            this.eventList = {};
        }
        this.eventList[key] = callback;
    },

    getEvent: function (key) {
        var event = null;
        if (this.eventList) {
            event = this.eventList[key]
        }
        return event;
    },

    removeEvent: function (key) {
        if (this.eventList) {
            delete this.eventList[key];
        }
    },

    getTabCompList: function () {
        return this.formAdapt.getOrderList();
    },

    getFocusManager: function () {
        return this.focusManager;
    },

    dealTabOrder: function () {
        var orderList = this.formAdapt.getOrderList(),com;
        orderList.sort(function (comp1, comp2) {
            return comp1.tabOrder - comp2.tabOrder;
        });
        orderList = orderList.concat(this.formAdapt.getUnOrderList() || []);
        for (var i = 0, len = orderList.length; i < len; i++) {
            orderList[i].setTabIndex(i);
        }
        this.formAdapt.orderList = orderList;
        this.formAdapt.unOrderList = null;
    },
    setFormRights: function (rights){
        this.formRights = rights;
    },
    getFormRights: function (){
        return this.formRights || null;
    },
    getProjectKey: function(){
        return this.metaForm.projectKey
    }
});

//自动生成formID
var formID = 1;
YIUI.Form_allocFormID = function () {
    return formID++;
};

YIUI.MetaForm = YIUI.extend({
    init: function (jsonObj) {
        this.operationState = jsonObj["operationState"] ? jsonObj["operationState"] : YIUI.Form_OperationState.Default;
        this.initState = jsonObj["initState"] || YIUI.Form_OperationState.Default;
        this.type = jsonObj["type"] || YIUI.Form_Type.Normal;
        this.operations = jsonObj["operations"];
        // this.metaOpts = jsonObj["metaOpts"];
        this.defTbr = jsonObj["defTbr"];
        this.formKey = jsonObj["key"];
        this.caption = jsonObj["caption"];
        this.abbrCaption = jsonObj["abbrCaption"];
        this.formulaCaption = jsonObj["formulaCaption"];
        this.formulaAbbrCaption = jsonObj["formulaAbbrCaption"];
        this.target = jsonObj["target"];
        this.mainTableKey = jsonObj["mainTableKey"];
        this.onLoad = jsonObj["onLoad"];
        this.onClose = jsonObj["onClose"];
        this.scriptCollection = jsonObj["scriptCollection"];
        this.cellTypeGroup = jsonObj["cellTypeGroup"];

        this.templateKey = jsonObj["templateKey"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];

        var root = block["root"];
        root.topMargin = jsonObj["topMargin"];
        root.bottomMargin = jsonObj["bottomMargin"];
        root.leftMargin = jsonObj["leftMargin"];
        root.rightMargin = jsonObj["rightMargin"];
        root.abbrCaption = jsonObj["abbrCaption"];
        root.hAlign = jsonObj["hAlign"];
        root.height = "100%";
        this.root = root;
        this.authenticate = jsonObj["authenticate"];
        this.standalone = jsonObj["standalone"] || false;
        this.initFocus = jsonObj["initFocus"];
        this.confirmClose = jsonObj["confirmClose"];
        this.relations = jsonObj["relations"];
        this.macroMap = jsonObj["macroMap"];
        this.statusItems = jsonObj["statusItems"];
        this.paraGroups = jsonObj["paraGroups"];
        this.sysExpVals = jsonObj["sysExpVals"];
        this.dependency = jsonObj["dependency"];
        this.paras = new YIUI.Paras(jsonObj["parameters"]);
        this.callParas = new YIUI.Paras(jsonObj["callParameters"]);
        this.paraCollection = jsonObj["paraCollection"];
        this.checkRules = jsonObj["checkRules"];
        this.subDetailInfo = jsonObj["subDetailInfo"];
        this.mapGrids = jsonObj["mapGrids"];
        this.errorInfo = {error: jsonObj["isError"], errorMsg: jsonObj["errorMsg"], errorSource: jsonObj["errorSource"]};
        this.dataObject = jsonObj["dataObject"] || {};
        this.dataObjectKey = this.dataObject.key || null;
        //this.refObjectKey = jsonObj["refObjectKey"] || null;
        //this.refTableKey = jsonObj["refTableKey"] || null;
        this.postShow = jsonObj["postShow"] || null;
        this.timerTask = jsonObj["timerTask"];
        this.metaComps = jsonObj["metaComps"] || {};
      //  this.metaCells = jsonObj["metaCells"] || {};
        this.buddyKeys = jsonObj["buddyKeys"] || [];

        this.popWidth = jsonObj["popWidth"];
        this.popHeight = jsonObj["popHeight"];
        this.topMargin = jsonObj["topMargin"];
        this.bottomMargin = jsonObj["bottomMargin"];
        this.leftMargin = jsonObj["leftMargin"];
        this.rightMargin = jsonObj["rightMargin"];
        this.projectKey = jsonObj["projectKey"];

    },

    getComponent: function(key) {
        return this.metaComps[key];
    }
});