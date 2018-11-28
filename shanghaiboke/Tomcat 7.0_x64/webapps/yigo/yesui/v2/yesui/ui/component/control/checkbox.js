/**
 * 复选框控件。
 */
YIUI.Control.CheckBox = YIUI.extend(YIUI.Control, {

    autoEl: "<div></div>",

    handler: YIUI.CheckBoxHandler,

    behavior: YIUI.CheckBoxBehavior,

    /**
     * 是否默认选中
     */
    checked: false,

    text: "",
    
    value: false,

    setText: function (text) {
        this.text = text;
        this.checkbox.setText(text);
    },

    getText: function () {
        return  this.text;
    },
    
    getShowText: function() {
    	return this.getText();
    },

    setTip: function (tip) {
        var tip = this.caption;
        this.base(tip);
    },

    onSetHeight: function (height) {
        this.base(height);
        this.checkbox.setHeight(height);
    },

    onSetWidth: function (width) {
        this.base(width);
        this.checkbox.setWidth(width);
    },

    getFormatEl: function() {
    	return this.el ? $("label", this.el) : null;
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.checkbox.getLabel().css(cssStyle);
        $("span", this.el).css(cssStyle);
    },

    checkEnd: function(value) {
    	this.value = value;
        this.checkbox.setChecked(YIUI.TypeConvertor.toBoolean(this.value));
    },
    
    isNull: function() {
    	return YIUI.TypeConvertor.toBoolean(this.value) == false;
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.checkbox = new YIUI.Yes_CheckBox({
            el: $this.el,
            commitValue : function (value){
            	$this.setValue(value, true, true);
    	    }
        });
        this.el.addClass("ui-chk");

        this.checkbox.setChecked(YIUI.TypeConvertor.toBoolean(this.value));
        var txt = this.caption.replace(/ /g, "&nbsp;");
        this.checkbox.setText(txt);
        this.checkbox.setEnable(this.enable);
    },

    focus: function () {
        this.checkbox && this.checkbox.getCheckBox().attr("tabindex",0).focus();
    },

    install: function () {
        this.base();
        var self = this;
        /*this.checkbox.getCheckBox().change(function (e) {
            var value = this.checked;
            self.setValue(value, true, true);
        });*/
        this.checkbox.getCheckBox().click(function(event) {
        	if(!self.enable) {
        		event.stopPropagation();
        		return false;
        	}
        });
        this.checkbox.getCheckBox().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {   //Enter
                self.checkbox.getCheckBox().click();
                event.preventDefault();
            } else if (keyCode === 9) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('checkbox', YIUI.Control.CheckBox);
