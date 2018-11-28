/**
 * 表格单元格字典编辑器
 * @type {*}
 */
YIUI.CellEditor.CellDict = YIUI.extend(YIUI.CellEditor, {
    handler: YIUI.DictHandler,
    
    //字典状态
    stateMask: YIUI.DictStateMask.Enable,

    multiSelect: false,
        
    independent: false,

    pageMaxNum: 10,

    itemKey: null,

    init: function (opt) {

        this.id = opt.id;
        this.metaObj = opt.editOptions;
        this.itemKey = this.metaObj.itemKey;
        this.stateMask = $.isUndefined(this.metaObj.stateMask) ? this.stateMask : this.metaObj.stateMask;
        this.root = $.isUndefined(this.metaObj.root) ? this.root : this.metaObj.root;
        this.multiSelect = this.metaObj.allowMultiSelection || this.multiSelect;
        this.independent = this.metaObj.independent || this.independent;
        this.key = opt.key;
    },
    onRender: function (parent) {
        this.base(parent);

        var self = this;
        var formID = this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);

        this.yesCom = new YIUI.Yes_Dict({

            id: self.id,
            independent: self.independent,
            multiSelect: self.multiSelect,
            pageMaxNum: self.pageMaxNum,
            formKey: form.formKey,
            fieldKey: self.key,

            getItemKey: function () {
                return self.getItemKey();
            },

            getStateMask: function(){
                return self.stateMask;
            },

            commitValue: function(value){
                return self.saveCell(value);
            },

            doFocusOut: function(){
                return self.doFocusOut();
            },

            checkDict: function () {
                        
                var _this = self;

                if (!_this.needRebuild && typeof(_this.needRebuild) != "undefined") {
                    return  $.Deferred(function(defer){
                                            defer.resolve(false);
                                        }).promise();
                }

                var formID = _this.ofFormID;
                var form = YIUI.FormStack.getForm(formID);
                var oldItemKey = _this.getDictTree().itemKey;
                var itemKey = _this.getItemKey();

                _this.itemKey = itemKey;

                _this.getDictTree().dictFilter = _this.handler.getDictFilter(form, _this.key, _this.metaObj.itemFilters, itemKey);

                return _this.handler.createRoot(form,
                                         _this.getItemKey(),
                                         _this.root)
                                    .then(function(result){
                                            if (result) {
                                                var rootCaption = result.rootCaption;
                                                var rootItem = result.root;

                                                if (_this.getDictTree().rootNode != null) {
                                                    _this.getDictTree().rootNode.remove();
                                                }
                                                if (oldItemKey != _this.itemKey) {
                                                    _this.getDictTree().fuzzyValue = null;
                                                    _this.getDictTree().startRow = 0;
                                                    _this.getDictTree()._searchdiv.find(".findinput").val("");
                                                    _this.getDictTree()._footdiv.find(".next").removeClass('disable');
                                                    
                                                }

                                                _this.getDictTree().createRootNode(rootItem, rootCaption, rootItem.itemKey + '_' + rootItem.oid, result.secondaryType);
                                                _this.getDictTree().itemKey = _this.itemKey;
                                                _this.setSecondaryType(result.secondaryType);
                                                var resultType = result.secondaryType;
                                                _this.secondaryType = result.secondaryType;
                                                _this.needRebuild = false;

                                                return true;
                                            }
                                            return false
                                        });
            },

            doLostFocus: function (text) {
            },
            
            beforeExpand: function (tree, treeNode) {
            }
        });
        this.yesCom.getEl().addClass("ui-dict");

        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },
    getDictTree: function(){
        return this.yesCom.dictTree;
    },
    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    getValue: function () {
        return this.yesCom.getSelValue();
    },
    focus: function () {
        this.yesCom.focus();
    },
    setValue: function (value) {
        this.yesCom.setValue(value);
    },
    getInput: function () {
        return this.yesCom._textBtn;
    },
    setText: function (caption) {
        this.yesCom.text = caption;
        this.yesCom.setText(caption);
    },
    getText: function () {
        return this.yesCom.getText();
    },
    beforeDestroy: function () {
        this.yesCom.destroy();
    },
    getMetaObj: function() {
        return this.metaObj;
    },
    setSecondaryType: function (type) {
        this.yesCom.setSecondaryType(type);
    },

    getItemKey: function(){
        return this.itemKey;
    }
});