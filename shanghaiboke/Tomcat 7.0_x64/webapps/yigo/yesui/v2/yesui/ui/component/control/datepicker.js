/**
 * 日期控件，主要是用于显示日期及时间
 */
YIUI.Control.DatePicker = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 此控件由自动渲染为div。
     */
    autoEl: '<div></div>',

    handler: YIUI.DatePickerHandler,
    
    behavior: YIUI.DatePickerBehavior,

    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.isOnlyDate = meta.onlyDate || this.isOnlyDate;
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setFormatStr: function () {
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        this.datePicker.setEditable(editable);
    },

    /**
     * 设置背景色
     */
    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.datePicker && this.datePicker.getInput().css({
            'background-image': 'none',
            'background-color': backColor
        })
    },
    
    getFormatEl: function() {
        return this.datePicker ? this.datePicker.getInput() : null;
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.datePicker && this.datePicker.getInput().css(cssStyle);
    },

    setText: function (text) {
        if (text && text.length > 0) {
            text = text.replace(/-/g, "/");
            var date = new Date(text);
            this.text = date.Format(this.formatStr);
            this.datePicker.setText(this.text);
        } else {
            this.text = text;
            this.datePicker.setText(this.text);
        }
    },

    getText: function () {
        var text = this.text || "";
        if (text != "" && this.isOnlyDate) {
            text += " 00:00:00";
        }
        return text;
    },

    getShowText: function() {
    	return this.getText();
    },

    changeToVal: function (text) {
        if (this.getText() != "") {
            text = text.replace(/-/g, "/");
            return new Date(text);
        } else {
            return null;
        }
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        $this.formatStr && this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            el: $this.el,
            formatStr: $this.formatStr,
            isOnlyDate: $this.isOnlyDate,
            isEnable: function() {
            	return $this.enable;
            },
            commitValue: function(value) {
        		$this.setValue(value, true, true);
            }
        });
        this.el.addClass("ui-dp");

        if (this.value) {
        	var value = null;
        	if(this.value instanceof Date) {
        		value = this.value;
        	} else if($.isNumeric(this.value)) {
        		value = new Date(parseInt(this.value));
        	} else {
        		value = new Date(this.value);
        	}
            this.setValue(value, false, false);
            
            var text = this.value.Format(this.formatStr);
            this.setText(text);
        }
    },

    afterRender: function () {
        this.base();
    },
    onSetWidth: function (width) {
        this.datePicker.setWidth(width);
    },

    onSetHeight: function (height) {
        this.datePicker.setHeight(height);
    },

    beforeDestroy: function () {
    	this.datePicker && this.datePicker.getDropView().remove();
    },

    focus: function () {
        this.datePicker && this.datePicker.focus();
    },
    
    checkEnd: function(value) {
    	this.value = value;
		var text = "";
        if(this.value) {
        	text = this.value.Format(this.formatStr);
        }
        this.setText(text);
    },
    
    install: function () {
        this.base();
        var self = this;
//        this.datePicker.getInput().on('blur', function (event) {
//                var curText = event.target.value;
//                if (curText != self.text) {
//                    self.setValue(self.changeToVal(curText), true, true);
//                }
//            });
//        this.datePicker.getDropView().blur(function (event) {
//            var curText = self.datePicker.getInput().val();
//            if (curText != self.text) {
//                self.setValue(self.changeToVal(curText), true, true);
//            }
//        });
        this.datePicker.getInput().keydown(function (event) {
        	if(!self.enable) {
        		return false;
        	}
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
})
;
YIUI.reg('datepicker', YIUI.Control.DatePicker);