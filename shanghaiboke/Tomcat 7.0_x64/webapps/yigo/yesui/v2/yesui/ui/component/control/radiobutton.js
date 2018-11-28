/**
 * 单选按鈕，一组单选按钮中，只能有个一个按钮时处于选中状态。
 * name形式: ofFormID + '_' + groupKey。
 */
YIUI.Control.RadioButton = YIUI.extend(YIUI.Control, {
	/**
	 * String。
	 * 此控件由radio和label组成，因此自动创建为div。
	 */
    autoEl: '<div class="ui-rdo">',

    handler: YIUI.RadioButtonHandler,
    
    behavior: YIUI.RadioButtonBehavior,
    
    /** 
     * Boolean。
     * 是否默认选中。
     */
    checked : false,
    
    /** 
     * String。
     * 分组名称 ,名称相同，则在一个分组内。
     */
    groupKey : '',
    
    /**
     * String。
     * 单个RadioButton设置的值。
     * 区别于value。
     */
    metaValue: '',
    
    init: function(options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.groupKey = $.isUndefined(meta.groupKey) ? this.groupKey : meta.groupKey;
        this.isGroupHead = $.isUndefined(meta.isGroupHead) ? false : meta.isGroupHead;
        this.metaValue = $.isUndefined(meta.metaValue) ? "" : meta.metaValue;
    },
    
    listeners: {
    	click: function() {
    		var target = this,
            	newValue = target.metaValue;
    		if(!this.isGroupHead) {
    			var form = YIUI.FormStack.getForm(this.ofFormID);
    			target = form.getComponent($(this._group).attr("headKey"));
    		}
            if (typeof newValue == "object" && newValue != null) {
                newValue = $.toJSON(newValue);
            }
            target.setValue(newValue,true,true);
    	}
    },

    setValue:function (value, commit, fireEvent, ignoreChanged, editing) {
		if( !this.isGroupHead )
			return;
		return this.base(value, commit, fireEvent, ignoreChanged, editing);
    },

    checkEnd: function(value) {
        this.value = value;
        var radio,
			radios = $("." + this.ofFormID+ '_' + this.groupKey);
        radios.removeClass("checked").addClass("unchk");
		if( value != null ) {
            for (var i = 0; i < radios.length; i++) {
                radio = radios.eq(i);
                if (radio.attr("value") == value) {
                    radio.removeClass("unchk").addClass("checked");
                }
            }
        }
	},
	
    getValue: function() {
    	return this.value;
    },
    
    setText: function(text) {
    	$("label", this.el).html(text);
    },
    
    getText: function() {
    	return $("label", this.el).html();
    },
    
    getShowText: function() {
    	return this.getText();
    },

    setTip: function (tip) {
        var tip = this.caption;
        this.base(tip);
    },
    
    getFormatEl: function() {
    	return this.el ? $("label", this.el) : null;
    },
    
    onSetHeight: function (height) {
        this.base(height);
        var $wrap = $(".wrap",this.el);
        var valgin = this.format.vAlign;
        switch(valgin) {
        	case 0:
        		$wrap.css({top: "0px"});
                break;
        	case 2:
        		$wrap.css({bottom: "0px"});
                break;
            default:
            	$wrap.css({height: height + "px", lineHeight: height + "px" });
             	var $input = $("span.rdo", this.el);
             	$input.css("margin-top", (height - $input.height()) / 2);
             	break;
        }
        
    },
    
    onSetWidth: function(width) {
    	this.base(width);
    	$("label", this.el).css("width", width - $("span.rdo", this.el).outerWidth());
    },

    setFormatStyle: function(cssStyle) {
    	$("label", this.el).css(cssStyle);
    	$("span.rdo", this.el).css(cssStyle);
	},
	
	setControlValue: function(value) {
    	this.base(value);
        if(value == null){
            return;
        }
		var form = YIUI.FormStack.getForm(this.ofFormID);
		var radios = form.getRadios(this.groupKey);
		for (var i = 0,radio;radio = radios[i]; i++) {
			if(radio.metaValue == value) {
				radio.selected = true;
                break;
			} else {
				radio.selected = false;
			}
		}
	},
	removeAllChk: function(node){
	    node.each(function(){
	    	$(this).removeClass("checked").addClass("unchk");
	    });
	},
	
    onRender: function (ct) {
    	this.base(ct);
    	var $wrap = $("<div class='wrap'></div>");
    	var radio = $('<span class="' + this.ofFormID+ '_' + this.groupKey + ' unchk rdo" id="radio_' + this.id + '" type="radio" value="' + this.metaValue +
            '" name="' + this.ofFormID+ '_' + this.groupKey + '"/>').appendTo($wrap);
        this._group = "ui_" + this.groupKey+ '_' + this.ofFormID;
        var txt = this.caption.replace(/ /g, "&nbsp;");
        $('<label id=label_"' + this.id + ' for="radio_' + this.id + '">' + txt + '</label>').appendTo($wrap);
        $wrap.appendTo(this.el);
        if(this.isGroupHead) {
        	$("<" + this._group + "/>").attr("headKey", this.key).appendTo(this.el);
        } 
        if(this.selected) {
			radio.removeClass("unchk").addClass("checked");
		}
    },
    focus: function () {
        $("span.rdo", this.el).attr("tabindex",0).focus();
    },
    install : function() {
    	this.base();
    	var self = this;
    	$("span.rdo", this.el).click(function(e){
    		dealChk(e, $(this));
    	});
    	
    	$("label",this.el).click(function(e){
    		if($.browser.isIE) return;
    		var span = $("span.rdo", self.el);
    		dealChk(e, span);
    	});
    	
    	function dealChk(e, dom){
    		if(!self.enable || dom.attr("readonly") == "readonly") {
        		e.stopPropagation();
        		return false;
        	}
        	var groupClass = "." + self.ofFormID+ '_' + self.groupKey;
        	self.removeAllChk($(groupClass));
        	var spanClass = dom.attr("class");
        	if (spanClass.indexOf("unchk") > 0) {
        		dom.removeClass("unchk").addClass("checked");
        	} else {
        		dom.addClass("unchk").removeClass("checked");
        	}

			self.fireEvent('click', e);
    	}
        $("span.rdo", this.el).keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('radiobutton', YIUI.Control.RadioButton);