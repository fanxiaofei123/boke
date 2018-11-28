/**
 * 文本编辑框，主要是提供文本字符类型数据输入
 * 1、可以自定义文本输入最大字符长度（默认为255），一个中文也只算一个字符，例如：12abc好12,这个为8个字符长度
 * 2、可以自定义文本显示为全大写或全小写,默认为无限制，大小写都可输入
 * 3、可以自定义不可输入字符。例如：定义不可输入字符串为：“a2v:,A”,则字符串中的字母数字符号都不可输入，键盘按键按下后都没有反应。
 * 另外，特别需要注意的是一些转义字符，例如单引号（'），双引号（"），这些转义字符定义时需要加斜杠。
 * 例如，定义为：“A?:,\'\"”，则单引号和双引号都不可输入。
 * 注意：不可输入字符区分中英文字符，比如“\"”这是英文的双引号，“\””这时中文的双引号。
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */

(function () {
    YIUI.Yes_TextEditor = function (options) {
        var Return = {
            /**
             * String。
             * HTML默认创建为input。
             * IE8-不支持input标签动态setAttribute。
             */
            el: $("<span></span>"),

            _input: "",

            types: {
                txt: $("<input type='text'/>"),
                pwd: $("<input type='password'/>")
            },

            inputType: null,

            /**
             * Number。
             * 允许输入的最大长度。
             */
            maxLength: 255,

            /**
             * Number。
             * 输入字符大小写。
             */
            textCase: YIUI.TEXTEDITOR_CASE.NONE,

            /**
             * String。
             * 不允许输入的字符集合。
             */
            invalidChars: null,

            /**
             * String。
             * 当输入框为空时，显示的输入提示。
             */
            promptText: null,

            /**
             * Boolean。
             * 是否去除首尾多余空格。
             */
            trim: true,

            /**
             * Boolean。
             * 光标进入默认全选。
             */
            selectOnFocus: true,

            /**
             * 掩码，为固定长度字符串。
             * 规定：
             *  9 : 任意数字，[0-9]
             *  a : 任意英文字母，[A-Za-z]
             *  * : 任意数字、英文字母，[A-Za-z0-9]
             *  _ : 控件里显示的占位符
             * 当掩码中需要包含9、a、*、\时，使用转义\9、\a、\*、\\。
             */
            mask: null,

            /**
             * String。
             * 右侧图标url。
             */
            icon: null,

            /**
             * String。
             * 左侧内嵌文本。
             */
            embedText: null,

            preIcon: null,

            init: function () {
                if (this.inputType == "password") {
                    this._input = this.types.pwd;
                    this.el.addClass("pw");
                } else {
                    this._input = this.types.txt;
                }
                this._input.appendTo(this.el);

                if (this.icon) {
                    this.setIcon(this.icon);
                } else {
                    this.setClearable(true);
                }
                this.setValue(this.value)
                this.setTextCase(this.textCase);
                this.setMaxLength(this.maxLength);
                this.preIcon && this.setPreIcon(this.preIcon);
                //设置输入框输入时遇到不可输入字符时，不允许其输入
                this.promptText && this.setPromptText(this.promptText);
                this.embedText && this.setEmbedText(this.embedText);
                this.setMask(this.mask);
            },
		    
		    isEnable: function() {
		    	return true;
		    },

            setMask: function (mask) {
                this.mask = mask;
                if (this.mask) {
                    this._input.mask(this.mask);
                }
            },

            getInput: function () {
                return this._input;
            },

            focus: function () {
                this._input.focus();
            },

            setInput: function (type) {
                this._input.attr("type", type);
            },

            setValue: function (value) {
                this.value = value;

                // if (this.getEl()) {
                //     this._input.val(value);
                // }
            },

            setText: function (value) {
                if (this.getEl()) {
                    this._input.val(value);
                }
            },

            getValue: function () {
                var val = this._input.val();
//                return this.textCase == YIUI.TEXTEDITOR_CASE.UPPER ? val.toUpperCase() : (this.textCase == YIUI.TEXTEDITOR_CASE.LOWER ? val.toLowerCase() : val);
                return val;
            },

            // setRequired: function (required) {
            //     if (required) {
            //         this.getEl().addClass('ui-required');
            //     } else {
            //         this.getEl().removeClass('ui-required');
            //     }
            // },

            setBackColor: function (backColor) {
                this.backColor = backColor;
                this._input.css({
                    'background-image': 'none',
                    'background-color': backColor
                })
            },

            setForeColor: function (foreColor) {
                this.foreColor = foreColor;
                this._input.css('color', foreColor);
            },

            setFormatStyle: function (cssStyle) {
                this._input.css(cssStyle);
            },

            setHeight: function (height) {
                this.getEl().css('height', height + 'px');
                this._input.css('height', height + 'px');
                if ($.browser.isIE) {
                    this._input.css('line-height', (height - 2) + 'px');
                    if(this.promptText) {
                    	$("input.placeholder", this.getEl()).css('line-height', (height - 2) + 'px');
                    }
                }
                if (this.embedText) {
                    $(".embed", this.getEl()).css('height', height + 'px');
                    $(".embed", this.getEl()).css('line-height', height + 'px');
                }
                if (this.preIcon) {
                    var icon = $(".pre-icon", this.getEl());
                    icon.css('top', (this.getEl().height() - icon.height()) / 2 + 'px');
                }
            },

            setWidth: function (width) {
                var pi, em;
                if (this.preIcon) {
                    pi = $(".pre-icon", this.getEl());
                }
                var el = this.getEl(),
                    inputPadding, embedPdding;
                if (this.preIcon) {
                    inputPadding = pi.outerWidth() + 8;
                } else {
                    inputPadding = 8;
                }
                if (this.embedText) {
                    em = $(".embed", this.getEl());
                    em.css('padding-left', inputPadding + 'px');
                    inputPadding = em.outerWidth();
                }
                this._input.css('padding-left', inputPadding + 'px');
                this.getEl().css('width', width + 'px');
                this._input.css('width', width + 'px');
                if($.browser.isIE && this.promptText) {
                	$("input.placeholder", this.getEl()).css({
                		width: width + 'px',
                		'padding-left': inputPadding + 'px'
                	});
                }
            },

            /**
             * input外层wrap了一层span。
             */
            getEl: function () {
                return this.el;
            },

            /** 设置输入字符大小写 */
            setTextCase: function (textCase) {
                var el = this._input;
                this.textCase = textCase;
                if (textCase === YIUI.TEXTEDITOR_CASE.UPPER) {
                    el.addClass('uppercase');
                } else {
                    el.removeClass('uppercase');
                }
                if (textCase === YIUI.TEXTEDITOR_CASE.LOWER) {
                    el.addClass('lowercase');
                } else {
                    el.removeClass('lowercase');
                }
            },
            /**
             * 设置不允许输入的字符
             * 如果validChars存在，则忽略
             */
            setInvalidChars: function (invalidChars) {
                if ($.isString(invalidChars)) {
                    this.invalidChars = invalidChars;
                }
            },
            /** 设置允许输入的最大长度 */
            setMaxLength: function (maxLength) {
                if ($.isNumeric(maxLength) && maxLength > 0) {
                    this.maxLength = maxLength;
                }
            },

            /**
             * 设置右侧图标。
             */
            setIcon: function (icon) {
                this.icon = icon;
                $('<span class="icon" />').css('background-image', 'url("Resource/' + icon + '")').appendTo(this.getEl());
            },

            setPreIcon: function (preIcon) {
                this.preIcon = preIcon;
                var $this = this.getEl();
                $('<span class="pre-icon" />').css('background-image', 'url("Resource/' + preIcon + '")').appendTo($this);
            },

            /**
             * 设置左侧内嵌文本。
             */
            setEmbedText: function (embedText) {
                if (embedText != "" && embedText !== null) {
                    $(".embed", this.getEl()).remove();
                    this.embedText = embedText;
                    var width = this._input.outerWidth(),
                        el = this.getEl(),
                        embed = $('<span class="embed" />').html(embedText).prependTo(el),
                        inputPadding, embedPdding;
//                    if (this.preIcon) {
//                        inputPadding = $(".pre-icon", this.getEl()).outerWidth() + embed.outerWidth() + 10;
//                        embedPdding = $(".pre-icon", this.getEl()).outerWidth() + 25;
//                    } else {
//                        inputPadding = embed.outerWidth();
//                        embedPdding = 10;
//                    }
//                    embed.css('padding-left', embedPdding + 'px');
//                    this._input.css('padding-left', inputPadding + 'px');
//                    this._input.css({width: width + 'px'});
                }
            },

            /** 设置输入提示 */
            setPromptText: function (promptText) {
                this.promptText = promptText;
                this._input.placeholder(this.promptText);
            },

            setClearable: function (isClearable) {
                var el = this.getEl(), input = this._input;
                if (isClearable) {
                    $("<span class='clear'/>").appendTo(el);
                } else {
                    $(".clear", el).remove();
                    input.css({paddingRight: "2px"});
                }
            },
            setSelOnFoc: function (selOnFoc) {
                this.selectOnFocus = selOnFoc;
            },

            finishInput: function () {
                var self = this, curValue = this._input.val();
                if (self.trim) {
                    curValue = $.trim(curValue);
                    this._input.val(curValue);
                }
                if (curValue != YIUI.TypeConvertor.toString(self.value)) {
                    self.setValue(curValue);
                    self.commitValue(curValue);
                    // if (self.required) {
                    //     var required = (curValue == "");
                    //     self.setRequired(required);
                    // }
                }
            },

            commitValue: $.noop,
            
            doFocusOut: $.noop,
             
            install: function () {
                var self = this;
                var input = this._input;
                var icon = $("span.clear", this.el);
                icon.mousedown(function () {
                    if(!self.isEnable()) return false;
                    input.val('').focus();
                    icon.hide();
                }).hide();
                input.on('click',function () {
                    if(!self.isEnable()) return false;
                	self._input.addClass("focus");
                	if (self.needSelectAll) {
                        this.select();
                        self.needSelectAll = false;
                    }
                }).on('focusin',function () {
                    if(!self.isEnable()) return false;
                    if (self.selectOnFocus) {
                        self.needSelectAll = self.selectOnFocus;
                    }
                }).keyup(function () {
                    if(!self.isEnable()) return false;
                    if ($(this).val()) {
                        icon.show();
                    } else {
                        icon.hide();
                    }
                }).keydown(function (event) {
                    if(!self.isEnable()) return false;
                	var key = event.keyCode || event.which;
                //	var isSelect = false;

                    var nKeyCode = event.keyCode || event.which;
                    if (nKeyCode >= 37 && nKeyCode <= 40){
                        return;
                    }

               // 	if(document.selection) {
                //		isSelect = document.selection.createRange().text.length > 0;
                //	} else {
                //		isSelect = (this.selectionEnd - this.selectionStart) > 0;
               // 	}

                    if (event.ctrlKey) {
                        if (key == 86) {

                            window.setTimeout(function () {
                                self.finishInput();
                            }, 0);
                        }
                    }
                }).focus(function () {
                    if(!self.isEnable()) return false;
                    if (!$.isDefined($(this).attr('readonly')) && $(this).val()) {
                        icon.show();
                    }
                }).on("focusout",function () {
                    if(!self.isEnable()) return false;
                    self.finishInput();
                    self._input.removeClass("focus");
                    icon.hide();
                    self.doFocusOut();  
                }).filterInput(this.invalidChars, this.textCase, this.maxLength);
            }
        };

        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        } else {
        	Return._input = $("input", Return.el);
        	Return.setMaxLength(Return.maxLength);
        	Return.promptText && Return.setPromptText(Return.promptText);
        }
        Return.install();
        return Return;
    }

})();