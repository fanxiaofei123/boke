(function () {
    YIUI.Yes_Combobox = function (options) {
        var Return = {

            id:"",

            //dropView是否显示
            _hasShow: false,

            _needShow : false,

            el: $("<div></div>"),

            _textBtn: $('<input type="text" />'),

            _dropBtn: $('<div/>'),

            _dropView: $('<div/>'),
            
            $suggestView: $('<div/>'),
            
            itemval : 0,
            
            promptText: null,
            /**
             * 是否展开完全
             * */
            isFinishExp: false,

            init: function () {
                this.id = this.id || this.el.attr("id");
                this._textBtn.addClass('txt').appendTo(this.el);
                this._dropBtn.addClass('arrow').appendTo(this.el);
                this._dropView.addClass('cmb-vw').attr("id", this.id + "_view").appendTo($(document.body));
                this.$suggestView.addClass('cmb-autovw cmb-vw').appendTo($(document.body));
                if(this.multiSelect) {
                    this._textBtn.attr('readonly', 'readonly');
                }
                this.temp = "";
            },


            /**
             * 下拉框数据
             */
            items: null,
            /** 是否多选  */
            multiSelect: false,
            sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,
            /**  是否可编辑 */
            editable: false,
            getEl: function () {
                return this.el;
            },
            setEditable: function (editable) {
                this.editable = editable;
            },

            setFormatStyle: function (cssStyle) {
                this._textBtn.css(cssStyle);
            },

            getItemCaption: function (value) {
                if (value == null) return "";
                var caption = this._textBtn.val();

                var arr = new Array();
                arr[0] = value;

                if (this.multiSelect) {
                    arr = value.split(",");
                }

                var caption = new Array();

                for (var index in  arr) {
                    for (var obj in this.items) {
                        if (arr[index] == this.items[obj].value) {
                            caption.push(this.items[obj].caption);
                            break;
                        }
                    }
                }

                return caption.join(',');
            },
            
            /** 设置输入提示 */
            setPromptText: function (promptText) {
                this.promptText = promptText;
                this._textBtn.placeholder(this.promptText);
            },

            setWidth: function (width) {
                this.el.css('width', width + 'px');
                this._textBtn.css('width', width + 'px');
                var left = width - 26 > 0 ? width - 26 : 0;
//                this._dropBtn.css("left", left + "px");
            },

            setHeight: function (height) {
                this.el.css('height', height + 'px');
                this._textBtn.css('height', height + 'px');
                if ($.browser.isIE) {
                    this._textBtn.css('line-height', (height - 3) + 'px');
                }
                this._dropBtn.css({top: (this._textBtn.outerHeight() - 16) / 2 + "px"});
            },

            focus: function () {
                this._textBtn.focus();
            },

            destroy: function () {
                this._dropView.remove();
                this.$suggestView.remove();
            },

            commitValue: $.noop,
            
            doSuggest: $.noop,

            doFocusOut: $.noop,

            isEnable: function() {
                return true;
            },

            hideComboList: function () {
                this._dropView.hide();
                this._hasShow = false;
                this.isFinishExp = false;
                $("li.selected",this._dropView).removeClass("selected");
                $(document).off("mousedown");
                this.commitValue(this.value);
                this.el.removeClass("focus");
            },

            /**
             * 设置下拉内容
             * @param {} items
             */
            setItems: function (items) {
                if (items == null) items = [];
                this.items = items;
                var comboboxListHtml = $('<ul/>'), _li;
                this._dropView.html(comboboxListHtml);
                for (var i = 0, len = items.length; i < len; i++) {
                    var val = items[i].value == undefined ? "" : items[i].value;
                    if (this.multiSelect) {
                        var cap = items[i].caption == undefined ? "" : items[i].caption;
                        //_li = $('<li title="'+cap+'"><input type="checkbox"  itemValue="' + val + '"/><span>' + cap + '</span></li>');
                         _li = $('<li title="'+cap+'"><span class="chk"  itemValue="' + val + '"></span><span class="option">' + cap + '</span></li>');
                    } else {
                        _li = $('<li itemValue="' + val + '" title="'+(items[i].caption || "")+'">' + (items[i].caption || "") + '</li>');
                        
                        if (this.value && this.value == items[i].value) {
                            _li.addClass("sel");
                            this._selectedLi = _li;
                        }
                    }
                    if(i>5){
                        comboboxListHtml.css("height","180px");
                    }
                    comboboxListHtml.append(_li);
                }
            },

            getItems: function(){
                return this.items;
            },

            /**
             * 勾选节点
             * @param {} value
             */
            checkItem: function (value) {
                if ( this.multiSelect ) {
                    var cbs = this._dropView.find('span.chk');
                   // cbs.prop("checked", false);
                    cbs.removeClass("checked");
                    cbs.parent().removeClass("select");
                    if( value ) {
                        var arr = value.split(","),v;
                        for (var i = 0,cb; cb = cbs[i]; i++) {
                            v = $(cb).attr("itemValue");
                            if( arr.indexOf(v) != -1 ) {
                                cb.checked = true;
                                $(cb).addClass("checked");
                            }
                        }
                    }
                }
            },

            setSelValue: function (value) {
                this.value = value;
            },

            getSelValue: function () {
                return this.value;
            },

            setText: function (text) {
                this.text = text;
                this._textBtn.val(this.text);
                this.temp = text;
            },
            getText: function () {
                return this._textBtn.val();
            },
            
            getInput: function() {
                return this._textBtn;
            },

            install: function () {
                var self = this;
                this._dropBtn.mousedown(function(e){
                    self._needShow =  !self._hasShow ? true : false;
                }).click(function (e) {
                    if (!self.isEnable()) {
                        return;
                    }
                    if (self.isFinishExp){
                        return;
                    }
                    self.isFinishExp = true;
                    if (self._hasShow == false) {
                        $(this).addClass("arrowgif");
                        $(this).removeClass("arrow");
                    }
                    self.el.addClass("focus");
                    self._textBtn.focus();
                    if (self._hasShow) {
                        self.itemval = 0;
                        self.hideComboList();
                        return;
                    }

                    self._dropView.children("ul").css("width", "auto");

                    self._hasShow = true;
                    self._needShow = false;

                    self.checkItems().then(function(data){
                        self.checkItem(self.getSelValue());

                        YIUI.PositionUtil.setViewPos(self._textBtn, self._dropView, true);
                        
                        self._dropView.slideDown(300, function(){
                            self._dropBtn.removeClass("arrowgif");
                            self._dropBtn.addClass("arrow");
                            self.isFinishExp = false;
                            var val = self.getText();
                            var items = self._dropView.find("li");
                            if (val == "") {
                                items.removeClass("sel");
                                self._dropView.scrollTop(0);
                            }

                            var ul = self._dropView.children("ul");

                            ul.css("width", self._dropView[0].scrollWidth);

                            if(ul.children().length == 0) {
                                ul.addClass("empty");
                                ul.html(YIUI.I18N.yescombobox.nothing);
                            } else {
                                ul.removeClass("empty");
                            }

                            if (self._selectedLi && (self._selectedLi.attr("itemValue") == self.getSelValue())) {
                                var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
                                var scrollTop = self._selectedLi.position().top - self._dropView.height() + self._selectedLi.height() + scrollHeight;
                                self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
                            } else {
                                $(".sel", self._dropView).removeClass("sel");
                                var $li = $("[itemValue='"+self.getSelValue()+"']", self._dropView);
                                if($li.length > 0) {
                                    self._selectedLi = $li;
                                    $li.addClass("sel");
                                }
                            }

                            $(document).on("mousedown", function (e) {
                                if (self.isFinishExp)
                                    return;
                                var target = $(e.target);
                                if ((target.closest(self._dropView).length == 0 || $("ul li", self._dropView).length == 0)
                                    && (target.closest(self._dropBtn).length == 0)
                                     && (target.closest(self._textBtn).length == 0)){
                                    self.itemval = 0;
                                    self.hideComboList();
                                }
                            });
                        });

                    }, function(error){
                        self._hasShow = false;
                    });
                    e.stopPropagation();
                });
                
                var self = this;
                var hideCombView = function() {
                    self.$combView && self.$combView.hide();
                    self.selLi = null;
                    $(".selected", self.$combView).removeClass("selected");
                };
                this._textBtn.bind("keyup", $.debounce(200, function(e){
                    if(!self.isEnable()) {
                        return false;
                    }

                    if (self._hasShow || !$(this).is(":focus")) {
                        // e.stopPropagation();
                        return false;
                    }
                    if(self.multiSelect) return;
                    var value = $(this).val();
                    var keyCode = e.keyCode;

                    var items = self._dropView.find("li");
                    items.removeClass("sel");
                    if (keyCode != 13) {
                        self.itemval = 0;
                        if (self._hasShow && value != "") {
                            finditem(value,items);
                            // e.stopPropagation();
                            return false;

                        }
                    }

                    if(keyCode == 27) {
                        hideCombView();
                        return;
                    }

                    $(document).on("mousedown", function (e) {
                        var target = $(e.target);
                        if(self.selLi && self.selLi.length > 0) {
                            self.selLi.mouseup();
                        } else if (target.closest(self.$suggestView).length == 0
                                && target.closest(self._textBtn).length == 0) {
                            hideCombView();
                            // var integerVal = self.integerValue;
                            // var editable = self.editable;
                            // var val = self._textBtn.val();
                            // if (editable == true && integerVal == false) {
                            //     self.setText(val);
                            // }
                            $(document).off("mousedown");
                        }
                        self.selLi = null;
                    });

                    if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
                    if(keyCode == 13) {
                        if(self.selLi) {
                            self.selLi.mouseup();
                        }
                        return;
                    }
                    var $view = self.$suggestView;
                    if(value) {
                        self.doSuggest(value).then(function(viewItems) {
                            if (viewItems.length == 0) {
                                $view.empty().hide();
                                return;
                            }
                            var list = $('<ul/>'), _li;
                            $view = $view.html(list);
                            for (var i = 0, len = viewItems.length; i < len; i++) {
                                _li = $('<li itemValue="' + viewItems[i].value + '">' + viewItems[i].caption + '</li>');
                                list.append(_li);
                            }
                            var cityObj = $("input", self.el);
                            var cityOffset = cityObj.offset();
                            $view.css({
                                width: cityObj.outerWidth(),
                                top: cityOffset.top + cityObj.outerHeight(),
                                left: cityOffset.left
                            })
                            self.$combView = $view;
                            $view.show();
                        });
                    } else {
                        $view.empty().hide();
                    }

                }));

                this._textBtn.bind("keydown", function(e){
                    if(!self.isEnable()) {
                        return false;
                    }

                    var $combView;

                    if( !self.$suggestView.is(":hidden") ) {
                        $combView = self.$suggestView;
                    }

                    if( !$combView && !self._dropView.is(":hidden") ) {
                        $combView = self._dropView;
                    }

                    if( !$combView )
                        return;

                    self.$combView = $combView;

                    var maxLen = $("li", $combView).length,
                        li = $("li.selected", $combView),
                        idx = -1;
                   
                    if(maxLen>6){
                        self._dropView.children("ul").css("height", "180px");
                    }
                    var li = $("li.selected", $combView);
                    if( li.length > 0 ) {
                        idx = li.index();
                    } else {
                        li = $("li.sel", $combView);
                        if( li.length > 0 ) {
                            idx = li.index();
                        }
                    }

                    switch (e.keyCode){
                    case 38:  // up
                        idx--;
                        if( idx < 0 )
                            idx = 0;
                        break;
                    case 40: // down
                        idx++;
                        if( idx >= maxLen )
                            idx = 0;
                        break;
                    case 13: // enter
                        if( self.selLi ) {
                            var value = self.selLi.attr("itemValue");
                            self.setSelValue(value);
                            self.commitValue(value);
                        }
                        hideCombView();
                        e.stopPropagation();
                        e.stop = true;
                        break;
                    case 9: // tab
                        $(document).mousedown();
                        break;
                    default:
                        return;
                    }

                    if (idx == -1)
                        return;

                    var li = $combView.find("li:eq("+idx+")");
                    li.addClass("selected").siblings("li").removeClass("selected");

                    self.selLi = li;

                    var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
                    var scrollTop = li.position().top - self._dropView.height() + li.height() + scrollHeight;
                    self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
                });

                this._textBtn.blur(function(e) {
                    if(!self.isEnable()) {
                        return false;
                    }
                    if(self._needShow){
                        self.setText(self.temp);
                        return;
                    }

                    if(self._hasShow){
                        return;
                    }

                    var _this = $(this);
                    var integerVal = self.integerValue;
                    var editable = self.editable;
                    var isHave = false;
                    var val = self._textBtn.val();
                    if(val == self.temp){
                        self.doFocusOut();
                        return;
                    }

                    self.checkItems().then(function(data){
                        var tempVal;
                        var items = self.items;
                        var valins = [];
                        if(self.multiSelect) {
                            var vs = val.split(",");
                            var allin = true;
                            for (var i = 0, len = vs.length; i < len; i++) {
                                var v = vs[i];
                                var isin = false;
                                for (var j = 0; j < items.length; j++) {
                                    var caption = items[j].caption;
                                    if (caption == v) {
                                        isin = true;
                                        valins.push(items[j].value);
                                        continue;
                                    }
                                }
                                if(!isin) {
                                    allin = false;
                                }
                            }
                            isHave = allin;
                        } else {
                            for (var i = 0; i < items.length; i++) {
                                var itemCaption = self.items[i].caption;
                                if (itemCaption != "" && itemCaption == val) {
                                    isHave = true;
                                    tempVal = self.items[i].value;
                                    break;
                                }
                            }
                            if(!tempVal) {
                                tempVal = val;
                            }
                        }
                        if (integerVal || editable == false) {
                            if (isHave == false) {
                                var value = null;
                                if(self.multiSelect) {
                                    value = valins.length == 0 ? null : valins.join(",");
                                    self.setSelValue(value);
                                    self.commitValue(value);
                                } else {
                                    if(tempVal) {
                                        self.setText(self.temp);
                                    } else {
                                        self.setSelValue(value);
                                        self.commitValue(value);
                                    }
                                }
                            } else {
                                self.setSelValue(tempVal);
                                self.commitValue(tempVal);
                            }
                        } else if(editable) {
                            var changed = self.value != tempVal;
                            if(changed) {
                                self.setSelValue(val);
                                self.commitValue(val);
                            }
                        }

                        self.doFocusOut();
                    });

                });

                //节点绑定事件
                this._dropView.delegate("li", "mousedown", function (e) {
                    $(this).parent().find("li").removeClass("sel");
                    if (self.multiSelect) {
                        return;
                    }
                    if (self.isFinishExp) {
                        return;
                    }
                    if (self._selectedLi) {
                        self._selectedLi.removeClass("sel");
                    }
                    $(this).addClass("sel");
                    self._selectedLi = $(this);

                    var value = $(e.target).attr("itemValue");
                    self.setSelValue(value);
                    self.hideComboList();
                });
                
                //节点绑定事件
                this.$suggestView.delegate("li", "mousedown", function (e) {
                    var value = $(e.target).attr("itemValue");
                    self.setSelValue(value);
                    self.$suggestView.hide();
                    self.commitValue(value);
                    self._selectedLi = $("li[itemvalue="+value+"]", self._dropView).addClass("sel");
                    $(document).off("mousedown");
                });
                
                //查询全部
                function finditem(val,items) {
                    var itemval = self.itemval;
                    var len = items.length;
                    if (len != 0) {
                        $.each(items,function(index,elem) {
                            $(elem).parent().find("li").removeClass("sel");
                            if($(elem).find("span").length == 0 && val != "" && $(elem).html().indexOf(val) != -1) {
                                if (itemval == 0) {
                                    $(this).parent().parent().scrollTop(index*26);
                                    $(elem).addClass('sel');
                                    itemval = index;
                                    self.itemFlag = index;
                                    return false;
                                }  
                            } 
                            if ($(elem).find("span").length != 0 && $(elem).find("span").html().indexOf(val) != -1) {
                                if (itemval == 0) {
                                    $(this).parent().parent().scrollTop(index*26);
                                    $(elem).addClass('sel');
                                    itemval = index;
                                    self.itemFlag = index;
                                    return false;
                                 
                                }
                            }
                        });
                    }  
                };
                //回车遍历查找
                function enterFindNext(val,items){
                    var flag = self.itemFlag;
                    for (var i = flag + 1; i < items.length; i++) {
                        var $item = $(items[i]);
                        if ($item.find("span").length == 0) {
                            var isExist = $item.html().indexOf(val) != -1;
                            //isUse = isExist;
                            if (isExist) {
                                $item.parent().parent().scrollTop((i)*26);
                                $item.parent().find("li").removeClass("sel");
                                $item.addClass('sel');
                                self.itemFlag = i;
                                break;
                            }
                        }   
                        if ($item.find("span").length != 0 ) {
                            var isExist = $item.find("span").html().indexOf(val) != -1;
                            //isUse = isExist;
                            if (isExist) {
                                $item.parent().parent().scrollTop((i)*26);
                                $item.parent().find("li").removeClass("sel");
                                $item.addClass('sel');
                                self.itemFlag = i;
                                break;
                            }
                        }   
                    }
                }

                //多选下拉 CheckBox绑定事件
                if (this.multiSelect) {
                    this._dropView.delegate("span.chk", "click", function (e) {
                        if($(this).hasClass("checked")){
                            $(this).removeClass("checked");
                            $(this).parent().removeClass("select");
                        }else{
                            $(this).addClass("checked");
                        }
                        var checkedBoxes = self._dropView.find('span.chk');
                        var caption = checkedBoxes.filter('span.checked').map(function () {
                            return $(this).next().html();
                        }).get().join(',');
                       
                        var value = checkedBoxes.filter('span.checked').map(function () {
                            return $(this).attr("itemValue");
                        }).get().join(',');
                        if(caption == "" && value == ""){
                        	$(this).removeClass("checked");
                            $(this).parent().removeClass("select");
                        }
                        //self._textBtn.val(caption);
                        $(this).parent().siblings('li').removeClass("select");
                        $(this).parent().addClass("select");
                        self.setSelValue(value);
                    });
                }
                
            }
        };

        Return = $.extend(Return, options);
        if(!options.isPortal) {
            Return.init();
        }
        Return.install();
        return Return;
    }
})();