/**
 * 文本域，主要是提供文本字符类型数据输入
 */

YIUI.Control.TextArea = YIUI.extend(YIUI.Control, {
    
    autoEl: '<span/>',

    handler: YIUI.TextAreaHandler,
    
    behavior: YIUI.TextAreaBehavior,
    yestextarea:null,

    /**
     * Number。
     * 允许输入的最大长度。
     */
    maxLength: 10000,

    checkEnd: function(value) {
        this.yestextarea.value = value;
        if (this.el) {
            this.yestextarea._input.val(value);
        }
    },
    
    getShowText: function() {
        return this.value;
    },

    setTip: function (tip) {
        var tip = $("textarea", this.el).val();
        this.base(tip);
    },
    
    getFormatEl: function() {
        return this.yestextarea ? this.yestextarea._input : null;
    },
    
    onSetHeight: function(height) {
        this.yestextarea.setHeight(height);
//      if($.browser.isIE) {
//          this.yestextarea._input.css('line-height',(height-2)+'px');
//      }
    },
    
    onSetWidth: function(width) {
        this.yestextarea.setWidth(width);
    },
    
    /**
     * input外层wrap了一层span。
     */
    getOuterEl : function() {
        return this.el;
    },

    /** 设置允许输入的最大长度 */
    setMaxLength : function(maxLength) {
        this.maxLength = maxLength;
        this.yestextarea.setMaxLength(maxLength);
    },
    
    setFormatStyle: function(cssStyle) {
        this.yestextarea.setFormatStyle(cssStyle);
    },
    
    setForeColor: function (foreColor) {
        this.yestextarea.setForeColor(foreColor);
    },
    
    /** 
     * 控件渲染到界面，不包含items的渲染。
     */
    onRender: function (parent) {
        this.base(parent);
        var option = this.getMetaObj();
        if (option.maxLength!=null) {
            this.maxLength = option.maxLength;
        }
        var el = this.el;
        el.addClass("ui-txta");
        var $this = this;
        this.yestextarea = new YIUI.Yes_TextArea({
            el: $this.el,
            value: $this.value,
            maxLength:$this.maxLength,
            setValue: function (value) {
                this.value = value;
                this._input.val(value);
            },
            isEnable: function() {
            	return $this.enable;
            },
            commitValue: function(value){
                 $this.setValue(value, true, true);
            }
        });

        this.setMaxLength(this.maxLength);
        this.setValue(this.value);
        
    },

    afterRender : function() {
        this.base();
        if(this.mask) {
            this.yestextarea._input.mask(this.mask);
        }
    },
    
    focus: function () {
        this.yestextarea._input.focus();
    },
    install: function() {
        this.base();
        var self = this;
        this.yestextarea._input.keydown(function(event){
            if(!self.enable) return false;
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9) {
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });  
    }

});
YIUI.reg('textarea', YIUI.Control.TextArea);
