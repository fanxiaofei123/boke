/**
 * 超链接控件。
 */
YIUI.Control.Hyperlink = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 自动创建为超链接a。
     */
    autoEl: '<a class="ui-hlk"></a>',

    handler: YIUI.HyperLinkHandler,
    
    behavior: YIUI.HyperLinkBehavior,

    /**
     * String。
     * 超链接地址，也可以是Javascript代码执行。
     */
    //href : 'javascript:void(0);',
    /**
     * String。
     * 在何处打开页面：_blank,_self,_parent,_top,framename。
     */
    target: '_self',
    /**
     * String,参见 YIUI.Hyperlink_TargetType
     */
    targetType: YIUI.Hyperlink_TargetType.NewTab,

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.clickContent = $.isUndefined(meta.onClick) ? "" : meta.onClick.trim();
        this.url = meta.url || null;
        this.targetType = $.isUndefined(meta.targetShowType) ?  this.targetType : meta.targetShowType;
    },
    
    setText: function (text) {
        this.hyperlink.setText(text);
    },
    
    getShowText: function() {
    	return this.hyperlink.getText();
    },

    needClean: function () {
        return false;
    },

    /** 完成超链接的渲染 */
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.hyperlink = new YIUI.Yes_HyperLink({
            el: $this.el,
            url: $this.url,
            targetType: $this.targetType
        });
        this.setValue(this.value);
        this.setTarget(this.targetType);
        this.setURL(this.url);
        this.text = this.value;
        if (this.text) {
            this.hyperlink.setText(this.text);
        } else {
            this.hyperlink.setText(this.caption);
        }
    },

    setTip: function (tip) {
        var tip = this.text || this.caption;
        this.base(tip);
    },
    
    setURL: function(url) {
        if(!url) return;
    	this.url = url;
        var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
        switch(this.targetType) {
            case YIUI.Hyperlink_TargetType.Current:
                showTarget = YIUI.Hyperlink_TargetType.Str_Current;
            case YIUI.Hyperlink_TargetType.NewTab:
                this.el.attr("href", this.url);
                this.el.attr("target", YIUI.Hyperlink_target[showTarget]);
            break;
        }
    },
    
    setTarget: function(targetType) {
    	this.targetType = targetType;
    },

    onSetHeight: function (height) {
        this.base(height);
        this.hyperlink.setHeight(height);
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },
    install: function () {
        var self = this;
        if (this.hyperlink.getText() != "") {
            this.el.click(function () {
                if (!self.enable) return false;
                if(self.url && self.targetType == YIUI.Hyperlink_TargetType.New) {
                    window.open(self.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                } else if(!self.url){
                    self.handler.doOnClick(self.ofFormID, self.clickContent);
                }
            })
        }
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    },

    checkEnd: function(value) {
    	this.value = value;
        this.text = value;
        this.hyperlink.setText(this.text);
	}
	
});
YIUI.reg('hyperlink', YIUI.Control.Hyperlink);