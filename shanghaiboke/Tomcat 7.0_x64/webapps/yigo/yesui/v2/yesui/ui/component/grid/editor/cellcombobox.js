/**
 * 下拉框编辑器
 */
YIUI.CellEditor.CellComboBox = YIUI.extend(YIUI.CellEditor, {

    editable: false,

    multiSelect: false,

    integerValue: false,

    def: null,

    init: function (opt) {
        this.id = opt.id;
        var meta = opt.editOptions;
        this.multiSelect = (meta.cellType == YIUI.CONTROLTYPE.CHECKLISTBOX);
        this.editable = $.isUndefined(meta.editable) ? this.editable : meta.editable;
        this.integerValue = $.isUndefined(meta.integerValue) ? this.integerValue : meta.integerValue;
        this.meta = meta;
    },
    onRender: function (parent) {
        this.base(parent);


        var self = this;
             
        var getComboboxItems = function(){
            if(self.def == null){
                var form = YIUI.FormStack.getForm(self.ofFormID);
                self.def = YIUI.ComboBoxHandler.getComboboxItems(form, self.meta)
                    .then(function(items){
                        self.setItems(items);
                        self.def = null;
                    });
            }
            return self.def;
        }


        this.yesCom = new YIUI.Yes_Combobox({
            id:self.id,
            multiSelect: this.multiSelect,
            integerValue: this.integerValue,
            editable: this.editable,

            checkItems : function(){
                return getComboboxItems();
            },

            doSuggest: function(value) {
                var def = $.Deferred();
                var _this = this;
                
                this.checkItems().done(function() {
                    var items = _this.items, viewItems = [], exp = ".*";
                    for (var i = 0, len = value.length; i < len; i++) {
                    	exp += value.charAt(i);
                    	exp += ".*";
                    }
                    var reg = new RegExp(exp,"i");
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].caption != null) {
                            if (items[i].caption.match(reg)) viewItems.push(items[i]);
                        }
                          if (viewItems.length == 5) break;
                      }
                    def.resolve(viewItems);
                });
                return def.promise();
            },
            
            commitValue : function (value){
                self.saveCell(value);
            },

            doFocusOut: function(){
                return self.doFocusOut();
            }
        });

        this.yesCom.getEl().addClass("ui-cmb");

        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },


    setItems: function(items) {
        //this.items = items;
        this.yesCom.setItems(items);
    },

    setValue: function (value) {
        this.base(value);
        this.yesCom.setSelValue(value);
    },

    getValue: function () {
    	var value = this.yesCom.getSelValue();
    	if (this.integerValue) {
    		value = YIUI.TypeConvertor.toInt(value);
    	}
    	return value;
    },

    focus: function () {
        this.yesCom.focus();
    },

    getText: function () {
        return this.yesCom.getText();
    },

    setText: function (text) {
        this.yesCom.setText(text);
    },

    getInput: function () {
        return this.yesCom._textBtn;
    },
    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    beforeDestroy: function () {
        this.yesCom.destroy();
    }
});