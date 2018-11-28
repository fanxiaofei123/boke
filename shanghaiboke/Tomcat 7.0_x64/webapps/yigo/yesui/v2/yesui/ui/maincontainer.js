(function() {
	YIUI.TabContainer = function(){
		var Return = {

			    /**
			     * TAB title模板
			     */
			    tabTemplate: '<li><a href="#{href}"><label style="float: left;">#{title}</label><span class="ui-icon ui-icon-close">Remove Tab</span></a></li>',
			    
			    /**
			     * 默认显示的TAB页的index
			     */
			    activeTab : -1,
			    
			    selectedTab: null,

			    _hasShow : false,
			    
			    /**
				 * String。
				 * render控件时，为控件自动创建的DOM标签。
				 */
				autoEl : '<div></div>',
				
				items: [],
			    
			    /** 关闭tab页 */
			    close: function(comp) {
			    	this.removeTimermsg(comp);
			    	var li = $("[aria-controls="+comp.id+"]", this.el);
			    	var _index = li.index();
			    	if(li.hasClass("aria-selected") && this.activeTab != _index) {
			    		this.activeTab = _index > 0 ? _index - 1 : 0;
			    	} else if((this.activeTab == _index && this.activeTab != 0) || _index < this.activeTab) {
			    			this.activeTab -= 1;
			    	}
			        this.remove(comp);
			        if(this.items.length > 0) {
				    	this.el.removeClass("empty");
			        } else {
				    	this.el.addClass("empty");
			        }  
			    },
			    //清理关闭timerArray,timerContent
			    removeTimermsg: function(comp){
			    	var D = comp.ofFormID.toString().length;
			    	for ( var t in timerArray) {
			        	if(comp.ofFormID == t.substring(0,D)) {
			        		window.clearInterval(timerArray[t]);
			        		delete timerArray[t];
			        	}
			        }
			    	
			    },
			    
			    closeAll: function() {
			    	var head = $("ul.ui-tabs-nav", this.el),
			        body = this.el.children(".ui-tabs-body");
			    	head.empty();
			    	body.empty();

			    	if(this.items) {
			    		for (var i = 0, len = this.items.length; i < len; i++) {
							var item = this.items[i];
							item.destroy();
						}
			    	}
					this.items = [];
					this.activeTab = -1;
			    	YIUI.FormStack.removeAll();
			    	this.el.addClass("empty");
			    	this._dropBtn.removeClass("show");
			    	this._dropView.removeClass("showList");
			    	$("ul", this._dropView).empty();
			    },
			    
			    removeForm: function(form) {
			    	this.close(form.getRoot());
			    },
			    
			    //初始化启动定时器
			    initTimer: function(form) {
			    	var timertaskcol = form.timerTask;
			    	
	                if (timertaskcol != undefined || timertaskcol != null) {
	                	var newcxt = {"form":form};
	                	var KeyArray = new Array();
	                	var i = 0;
	                	for (var t in timertaskcol) {
	                		if (timerContent[form.formID + t] == undefined) {
	                			var enable = timertaskcol[t].startOnload == undefined ? true : timertaskcol[t].startOnload;
	                			timerContent[form.formID + t] = enable;
	                		}
	                		KeyArray[i] = t;
	                		i++;
	                    }
	                	var timerNum = KeyArray.length;
	                	var timerAr = new Array();
	                	for (var k = 0;k < timerNum; k++) {
	                		var enable = timertaskcol[KeyArray[k]].startOnload == timerContent[form.formID + KeyArray[k]] ? timertaskcol[KeyArray[k]].startOnload : timerContent[form.formID + KeyArray[k]];
	                		if (timertaskcol[KeyArray[k]].repeat) {
	                			
	                			timerAr[k] = new timerTask(timertaskcol[KeyArray[k]].key,enable,newcxt,timertaskcol[KeyArray[k]].delay,timertaskcol[KeyArray[k]].period,(timertaskcol[KeyArray[k]].content).trim(),form);
	                			timerAr[k].startTimer();
	                		}
	                		
	                		if (!timertaskcol[KeyArray[k]].repeat&& enable) {
	                			var timer = new timerTask(null, null, newcxt,timertaskcol[KeyArray[k]].delay, null, (timertaskcol[KeyArray[k]].content).trim(), form);
	                			timer.startOnce();
	                		}
	                	}
	                }
			    },
			    
			    /**
			     * 添加面板时，如果已渲染，添加header和body
			     */
			    afterAdd: function(comp) {
			        if (!this.rendered) return;
			        var form = YIUI.FormStack.getForm(comp.ofFormID);
			        var title = form.getAbbrCaption(),
		            	tabs = this.getEl(),
			        	head = $("ul.ui-tabs-nav", tabs.children(".ui-tabs-header")),
			        	body = tabs.children(".ui-tabs-body"),
			        	id = comp.id || YIUI.allotId(),
			        	li = $(this.tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{title\}/g, title));
			        if(form.isStack) {
			        	var $li = this.selectedTab;
			        	var tab = this.items[this.activeTab];
			        	var stack = tab.stack = tab.stack || [];
			        	stack.push(comp.id);
			        	tab.activeItem = comp;
			        	var div = $("#" + $li.attr("aria-controls"));
			        	div.toggleClass("aria-show");
			        	var ct = div.parent();
				        comp.el = $('<div id='+ id +'></div>').appendTo(body);
				        comp.el.addClass("tabcnt-cont ui-corner-bottom").toggleClass("aria-show");
				        $("label", $li).html(title);
				        $li.attr("aria-controls", id);
			        	return;
			        }
			        
			        $("[href='#"+id+"']", li).addClass("ui-tans-anchor");
			        $("[href='#"+id+"'] label", li).addClass("ui-anchor-label");
			        
			        if(form.entryPath) {
			        	li.attr("formKey", form.formKey);
			        	li.attr("paras", form.entryParas);
			        }
			        
			        li.data("key", this.key);
			        head.append(li);
			        comp.el = $('<div id='+ id +'></div>').appendTo(body);
			        /*var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
			        errDiv.prependTo(comp.el);
			        form.setErrDiv(errDiv);*/
			        comp.el.addClass("tabcnt-cont ui-corner-bottom").toggleClass("aria-show");
			        li.addClass("ui-state-default ui-tabcontainer").toggleClass("aria-selected").attr("aria-controls", comp.id);
			       
			        if(this.selectedTab && this.selectedTab.attr("aria-controls") != li.attr("aria-controls")) {
			        	this.selectedTab.toggleClass("aria-selected");
			        	$("#"+this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
			        }
			        this.setActiveTab(comp);
//			        this.layout(this.getWidth(), this.getHeight());
			        this.selectedTab = li;
			        
			        //var _li = $("<li/>").attr("aria-controls", li.attr("aria-controls")).html($("label", li).text());
			    	//$("ul", this._dropView).append(_li);
			    	
			    	this.setDropBtnView();
			    	//this.setTabListColor();
			    	this.el.removeClass("empty");
			    	this.initTimer(form);
			    },
			    
			    /** 设置下拉列表的向上向左的偏移 */
			    setDropViewLeft: function() {
			    	this._dropView.css({
			    		"top": this._dropBtn.offset().top + this._dropBtn.height(),
			    		"left": document.body.clientWidth - this._dropView.outerWidth()
					});
			    },
			    
			    clearSelect: function() {
			    	if(this.selectedTab) {
						this.selectedTab.toggleClass("aria-selected");
						$("#" + this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
						this.selectedTab = null;
					}
			    },

			    /** 设置当前需要显示的tab页
			     * @param li: 需要显示的tab页
			     */
			    setSelectedTab: function(li) {
			    	if(!this.selectedTab) {
						li.toggleClass("aria-selected");
			    	} else if(this.selectedTab.attr("aria-controls") == li.attr("aria-controls")) {
						return;
					} else {
						li.toggleClass("aria-selected");
						this.selectedTab.toggleClass("aria-selected");
						$("#" + this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
					}
					
					var tab = this.get(li.attr('aria-controls'));
					$("#"+tab.id).toggleClass("aria-show");
					this.setActiveTab(tab);
					this.selectedTab = li;
					this.layout(this.getWidth(), this.getHeight());
			    	this.setTabListColor();
			    	
			    },
			    
			    /** 设置点击下拉列表的按钮是否显示 */
			    setDropBtnView: function() {
			    	this._dropView.removeClass("showList");
			    	var li = $(".ui-tabs-header li", this.el).last();
			        if(li.length == 0 || !this.selectedTab) return;
			        if(li.position().left + li.width() <= $(".ui-tabs-header", this.el).width()) {
			        	this._dropBtn.removeClass("show");
			        } else {
			        	this._dropBtn.addClass("show");
			        }
			    },
			    
			    /** 设置列表中tab项显示与被隐藏项的样式区别 */
			    setTabListColor: function() {
			    	var _left = $(".ui-tabs-header", this.el).offset().left;
			    	var _childs = $(".ui-tabs-header li", this.el), _child, selectedLi;
			    	for (var i = 0, len = _childs.length; i < len; i++) {
			    		_child = _childs.eq(i);
			    		selectedLi = $("li[aria-controls = "+ _child.attr("aria-controls") +"]", this._dropView);
			    		if(_child.offset().left >= _left && _child.offset().left <= _left + $(".ui-tabs-header", this.el).width() ) {
			    			selectedLi.addClass("lightColor");
			    			
			    		} else {
			    			selectedLi.removeClass("lightColor");
			    			
			    		}
					}
			    },
			    
			    addListitem: function(){
			    	var _left = $(".ui-tabs-header", this.el).offset().left;
			    	var _childs = $(".ui-tabs-header li", this.el), _child, selectedLi;
			    	var _ul = $("<ul/>");
			    	for (var i = 0, len = _childs.length; i < len; i++) {
			    		_child = _childs.eq(i);
			    		var left =  _child.offset().left;
			    		if(!(left >= _left && left + _child.outerWidth() <= _left + $(".ui-tabs-header", this.el).width() )) {
			    			var _li = $("<li></li>");
			    			_child.attr("aria-controls");
			    			_li.html($("label", _child).html());
			    			_li.attr("aria-controls", _child.attr("aria-controls"));
			    			//if($("li[aria-controls="+ _child.attr("aria-controls") +"]").length == 0);
			    			//_li.appendTo($("ul", this._dropView));
			    			_li.appendTo(_ul);
			    		}
					}
			    	this._dropView.html(_ul);
			    },
			    
			    /**
			     * 添加事件
			     */
			    install: function() {
			        var _this = this;
			        $(".ui-tabs-header", _this.el).delegate("li", "click", function(event) {
			        	var target = $(event.target);
			        	if(target.hasClass('ui-icon-close')) {
							var target = $(event.target);
							var itemId = target.closest('li').attr('aria-controls');
							YIUI.EventHandler.doCloseForm(_this.get(itemId));
			        	} else {
			            	_this.setSelectedTab(target.closest('li'));
			        	}
			        	event.stopPropagation();
			        	return false;
			        });

                    $(".ui-tabs-header", _this.el).delegate(".ui-tabs-nav li a","mouseenter mouseleave",function (event) {
                    	if( event.type === 'mouseenter' ) {
							$(this).off("mouseup").on("mouseup",function (e) {
								if( e.button == 2 ) {

                                    // 阻止默认右键
                                    document.oncontextmenu = function (e) {
                                        var ev = e || window.event;
                                        if( ev.preventDefault ) {
                                            ev.preventDefault();
                                        } else {
                                            ev.returnValue = false;
                                            ev.cancelBubble = true;
                                        }
                                        return false;
                                    }

                                    var menu = $(".contextmenu");
                                    if( menu.length == 0 ) {
                                    	var html = "<div id='contextmenu' class='contextmenu'>" +
														"<ul class='menu-field-list'>" +
															"<li class='menu-field-items'>" +
																"<a>" + YIUI.I18N.grid.closeAll + "</a>" +
															"</li>" +
														"</ul>" +
													"</div>";
                                        menu = $(html);

                                        $(".menu-field-list li a",menu).on("click",function () {
                                            var options = {
                                                msg: YIUI.I18N.grid.whetherCloseAll,
                                                msgType: YIUI.Dialog_MsgType.YES_NO
                                            };
                                            var dialog = new YIUI.Control.Dialog(options);
                                            dialog.render();
                                            dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                                                _this.closeAll();
                                            });
                                            menu.hide();
                                        });

                                        $(document.body).append(menu);
                                    }
                                    menu.css({
                                        left: e.clientX + "px",
                                        top: e.clientY + "px"
                                    });

                                    menu.show();

                                    $(document).off("mousedown").on("mousedown",function (e) {
                                    	var stop = $(e.target).hasClass("menu-field-list");
                                    	if( !stop ) {
                                    		stop = $(e.target).parents('.menu-field-list').length > 0;
										}
                                    	if( stop )
                                    		return;
                                        $(".contextmenu").hide();
                                        $(document).off("mousedown");

                                        // 恢复右键
                                        document.oncontextmenu = function (e) {
                                            var ev = e || window.event;
                                            return ev.returnValue = true;
                                        }

                                    });
								}
                            });
						} else {
                            $(this).off("mouseup");
						}
                    });

			        _this._dropBtn.click(function(event) {
			        	if(!$(this).hasClass("show")) return;
			        	if(_this._hasShow){
				            _this.hideTabList();
					        _this._dropView.removeClass("showList");
				            return;
				        } else {
					        _this._dropView.addClass("showList");
				        }
			        	_this.addListitem();
				        _this.setDropViewLeft();
					    _this._dropView.slideDown("fast");
				        _this._dropView.css( "z-index", $.getZindex( _this._dropBtn ) + 1 );
				        
				        $(document).on("mousedown",function(e){
				            var target = $(e.target);
				            if((target.closest(_this._dropView).length == 0)
				                &&(target.closest(_this._dropBtn).length == 0)){
				                _this.hideTabList();
				                _this._dropView.removeClass("showList");
				            }
				        });
				
				        _this._hasShow = true;
				        event.stopPropagation();
			        });
			        _this._dropView.delegate("li", "click", function(event) {
			        	var aria_controls = $(this).attr("aria-controls");
			        	var _li = $("li[aria-controls = " + aria_controls + "]", _this.el);
			        	_this.setSelectedTab(_li);
			        	_this.hideTabList();
			        });
			        
			        $(".ui-tabs-body", _this.el).delegate(".errorinfo .closeIcon", "click", function() {
			        	$(this).parent().hide();
			        	var panel = $(this).parents(".aria-show");
			        	_this.items[_this.activeTab].doLayout(panel.width(), panel.height());
			        });

			        // 操作快捷键
					$(document).bind("keydown", function (e) {
                        var idx = _this.activeTab;
                        if( idx == null || idx < 0 ) {
                        	return;
						}
						var	item = _this.items[idx],
                            form = YIUI.FormStack.getForm(item.ofFormID);

                        form.defaultToolBar && form.defaultToolBar.handleShortcuts(e);
					});
			    },
			    
			    /** 隐藏下拉列表 */
			    hideTabList: function() {
			    	this._dropView.hide();
			        this._hasShow = false;
			    },
			    
			    /**
				 * 控件在items中的位置
				 * @param comp
				 */
				indexOf : function(comp) {
					var items = this.items;
					for(var i= 0,len=items.length;i<len;i++) {
						if(items[i] === comp) {
							return i;
						}
					}
					return -1;
				},
				
				closeTo: function(key) {
					var f,form;
			    	for(var i = this.items.length -1 ; i >=0; i--){
			    		f = this.items[i];
						form = YIUI.FormStack.getForm(f.ofFormID);
						if(form.formKey == key){
							break;
						}
						this.removeForm(form);
			    	}
				},
				
			    /**
			     * 删除面板
			     */
			    remove: function (comp, autoDestroy) {
			        if (!comp) return;
			        var id = comp.getId();
			        var formId = comp.ofFormID;
			        var index = this.indexOf(comp);
					if(index === -1) {
						// 控件不在面板中
						return;
					}
			        var tabs = this.getEl();
			        YIUI.FormStack.removeForm(formId);
			        $('#' + id, tabs).remove();
					// 如果不需要销毁，就只是删除DOM
					if(autoDestroy === false) {
						comp.getEl().remove();
					} else {
						comp.destroy();
					}
					// 恢复默认右键事件
                    document.oncontextmenu = function (e) {
                        var ev = e || window.event;
                        return ev.returnValue = true;
                    }
					var tab = this.items[this.activeTab];
					this.items.splice(index, 1);
					if(tab.stack && tab.stack.length > 0) {
			        	var stack = tab.stack;
			        	var c_index = stack.indexOf(id);
			        	var i = -1;
		        		if(c_index == 0 && stack.length > 1) {
		        			i = 1;
		        		} else if(c_index > 0) {
		        			i = c_index - 1;
		        		}
		        		var activeTab = null;
		        		if(i > -1) {
			        		var activeItem = this.get(stack[i]);
				        	tab.activeItem = activeItem;
				        	activeTab = activeItem;
		        		} else {
				        	tab.activeItem = null;
				        	activeTab = tab;
		        		}
			        	var title = activeTab.abbrCaption || '';
			        	activeTab.el.toggleClass("aria-show");
			        	var $li = this.selectedTab;
		        		$("label", $li).html(title);
				        $li.attr("aria-controls", activeTab.id);
			        	stack.splice(c_index, 1);
					} else {
				        $('[aria-controls=' + id + ']', tabs).remove();
				        $("li[aria-controls=" + id + "]", this._dropView).remove();
				        this.setDropBtnView();
				        if($(".ui-tabs-body", tabs).children(".tabcnt-cont").length <= 0) {
				        	this.activeTab = -1;
				        	return;
				        }
				        tab = this.items[this.activeTab];
				        if(this.selectedTab && this.selectedTab.attr("aria-controls") == id) {
				        	tab.el.toggleClass("aria-show");
				            $("li[aria-controls = "+tab.id+"]").toggleClass("aria-selected");
				        }
				        this.selectedTab = $("li[aria-controls = "+tab.id+"]");
					}
					this.layout(this.getWidth(), this.getHeight());
			    },
			    
			    /**
			     * 设置当前需要显示的TAB页
			     * @param tab: 可以是TAB页的index、id、或TAB页的panel对象
			     */
			    setActiveTab : function(tab) {
			    	var index = -1;
			    	if($.isNumeric(tab)) {
			    		if(tab < 0 && tab > this.items.length - 1) return;
			    		index = tab;
			    	} else if($.isString(tab)) {
			    		for(var i=0;i<this.items.length;i++) {
			    			if(tab == this.items[i].getId()) {
			    				index = i;
			    				break;
			    			}
			    		}
			    	} else if($.isObject(tab)) {
			    		for(var i=0;i<this.items.length;i++) {
			    			if(tab == this.items[i]) {
			    				index = i;
			    				break;
			    			}
			    		}
			    	} 
			    	if(index != -1) {
			    		if(this.activeTab != index) {
			    			this.activeTab = index;
			    		} 
			    	}
			    },
			

				/**
				 * 添加控件
				 * 如果面板渲染完成后，需要添加控件，调用方式：
				 *  panel.add(comp);
				 *  panel.doLayout();
				 * @param comp 可以是单个控件或控件数组
				 */
				add : function(comp) {
					if($.isArray(comp)) {
						var _this = this;
						$.each(comp, function(i) {
							_this.add(this);
						});
						return;
					}
					if(this.get(comp.id)) return;

					var c = this.lookupComponent(comp);
					this.items.push(c);
					this.afterAdd(c);
				},

				/**
				 * 获取某个item
				 * @param comp 可能是控件id， 也可能是控件在items中的index
				 */
				get : function(comp) {
					if($.isNumeric(comp)) {
						return this.items[comp];
					} else if($.isString(comp)) {
						var items = this.items,
							item;
						for(var i= 0,len=items.length;i<len;i++) {
							item = items[i];
							if(item && item.id === comp) {
								return item;
							}
						}
					}
					return null;
				},
				
				/**
				 * 设置组件宽度。
				 * @param width：Number类型。
				 */
				setWidth : function(width) {
					if(!width || !$.isNumeric(width) || width <= 0)
						return;

					if(!this.rendered) {
						this.width = width;
						return;
					}

					var lastSize = this.lastSize;
					if(lastSize.width !== width) {
						lastSize.width = width;
						this.onSetWidth(width);
					}
				},

				// private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
				onSetWidth : function(width) {
					this.el.css("width", width);
				},

				/**
				 * 获取组件宽度。
				 * @return Number。
				 */
				getWidth : function() {
					if(this.rendered) {
						return this.getEl().width();
					}
					return this.width;
				},

				/**
				 * 设置组件高度。
				 * @param height：Number。
				 */
				setHeight : function(height) {
					if(!height || !$.isNumeric(height) || height <= 0)
						return;

					if(!this.rendered) {
						this.height = height;
						return;
					}

					var lastSize = this.lastSize;
					if(lastSize.height !== height) {
						lastSize.height = height;
						this.onSetHeight(height);
					}
				},

				// private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
				onSetHeight : function(height) {
					this.el.css("height", height);
				},
				
				/**
				 * 获取组件高度。
				 * @return Number。
				 */
				getHeight : function() {
					if(this.rendered) {
						return this.getEl().height();
					}
					return this.height;
				},
				
				/**
				 * 根据传入参数，返回对应的控件
				 * @param comp 可能是控件id，或者json对象
				 * @returns YIUI.Component 如果参数是string，则将其作为控件id，返回已有的控件；
				 *                          如果参数是json，则根据此json创建控件。
				 */
				lookupComponent : function(comp) {
					if($.isString(comp)) {
						return YIUI.ComponentMgr.get(comp);
					} else if(!(comp instanceof YIUI.Component)) {
						return YIUI.create(comp, this.defaultType);
					}
					return comp;
				},

				/** 
				 * 重新布局子组件位置
				*/
				doLayout: function(panelWidth, panelHeight) {
					if ( this.layout ) {
						this.layout(panelWidth, panelHeight);
					}
				},
				
				/** 
				 * 渲染所有的子组件
				*/
				onRenderChildren: function() {
					this.el.addClass('ui-panel');
					this.doRenderChildren();
				},
				
				/**
				 * 容器渲染完成后，所有子控件的render和layout
				 * @param shallow 如果是true，不做子控件的doLayout，只做最外层的
				 * @param force 如果是true，当容器不显示在界面上的时候，也强制执行layout
				 */
				doRenderChildren: function(form){
					if(!this.html) {
						var rendered = this.rendered;
						if(rendered){
							this.layoutRender(form);
						}
						this.hasLayout = true;
						this.doLayout(this.getWidth(), this.getHeight());
					}
				},
				
				/**
				 * 把控件渲染到container中
				 * @param container：jQuery，当前控件的父节点。
				 */
				render : function(container) {
					if(!this.rendered) {
						this.rendered = true;
						this.container = container ? $(container)
								: (this.container ? $(this.container) : $.getBody());
						this.onRender(this.container);
						this.onRenderChildren();
						
						this.install();
					}
				},
				
				/**
				 * 控件渲染到界面，不包含items的渲染。
				 */
				onRender : function(ct) {
					var el = this.el;
					this.el.addClass("ui-tabcnt empty");
					// 如果未定义ct，且组件el已定义，取ct为el的parentNode
					if(el && (!ct || ct.length == 0)) {
						this.container = ct = $(el).parent();
					}
					if(!el && this.autoEl) {
						if($.isString(this.autoEl)) {
							el = $(this.autoEl);
						}
					}
					if(el) {
						if(!el.attr('id')) {
							el.attr('id', this.getId());
						}
						this.el = $(el);
						// 如果发现el已经在DOM树中，不再进行插入
						if(this.el.parents('body')[0] != $.getBody()[0]) {
							ct.append(this.el);
						}
					}


				},
				
				layoutRender : function(form) {
			        var target = this.getRenderTarget();
					if(this.prepared || this.beforeLayoutRender() !== false) {
						this.prepared = true;
						this.onLayoutRender(form, this, target);
					}
			    },
			    
			    /** 返回jQuery对象 */
				getRenderTarget : function(){
					return this.getEl();
				},
				
				/**
				 * 返回使用的jQueryUI对象的dom。
				 * @return jQuery。
				 */
				getEl : function() {
					return this.el;
				},

			    // private
			    onLayoutRender : function(form, ct, target){
			        if(form) {
			        	var c = form.getRoot(),
			        	itemTarget = c.container || this.getRenderTarget();
			        	if(c && (!c.rendered)){
			        		this.renderItem(c, itemTarget);
			        	}
			        }
			    },
			    
			    /** 把控件c渲染到target中 */
			    renderItem : function(c, target){
			        if(c && !c.rendered){
			            c.doRender(target);
			        } else if(c && !this.isValidParent(c, target)){
			            target.insertBefore(c.getEl());
			            c.container = target;
			        }
			    },

				layout : function(panelWidth, panelHeight) {
					var ct = this;
			        if(ct.items && ct.items.length != 0) {
						var ul = $("ul.ui-tabs-nav", ct.el),
							body = $(ct.el.children(".ui-tabs-body"));

						var diff = body.width() - panelWidth;

				    	body.width(panelWidth);
						// 设置body高度，使滚动条局限在body里，不影响TAB header
						body.height(panelHeight - ul.outerHeight(true));
				    	$(".ui-tabs-header", this.el).width(panelWidth - 30);
						
						var tab = ct.items[ct.activeTab];
						if(tab && tab.rendered) {
							if(tab.activeItem) {
								tab = tab.activeItem;
							}
							var b_w = body.width();
							var b_h = body.height();
							tab.setWidth(b_w);
							tab.setHeight(b_h);
							if(tab.hasLayout) {
								tab.doLayout(b_w, b_h);
							}
							
							var selTab = ct.selectedTab;
							var diff_left = selTab.offset().left - $(".ui-tabs-header", ct.el).offset().left;
							var reset = selTab.offset().left < $(".ui-tabs-header", ct.el).width() && diff_left < 0;


							if(diff < 0) {
								var s_Left = $(".ui-tabs-header", ct.el).scrollLeft();
								$(".ui-tabs-header", ct.el).scrollLeft(s_Left + diff);
							} else if(selTab && (selTab.offset().left > $(".ui-tabs-header", ct.el).width() || reset)) {
								var scrollLeft = selTab.position().left - $(".ui-tabs-header", ct.el).width() + selTab.width();
								$(".ui-tabs-header", ct.el).scrollLeft(scrollLeft);
							}
						}
					}
			        
			        ct.setDropBtnView();
			        ct.setTabListColor();
				},
				beforeLayoutRender : function() {
					var ct = this,
						target = ct.getRenderTarget(),
						items = ct.items,
						item;

					var ul = $('<ul/>');
					var header = $("<div></div>").addClass("ui-tabs-header").appendTo(target).append(ul);
					
					var tabs_list = ct._dropBtn = $("<span></span>").addClass("ui-tabs dropdownBtn").appendTo(target);
					ct._dropView = $('<div><ul/></div>').addClass('ui-tabs tabs-list');
					$(document.body).append(ct._dropView);
					
					ul.addClass("ui-tabs-nav ui-corner-all");

					// 添加body使滚动条不影响header
					var body = $('<div>').addClass('ui-tabs-body').appendTo(target);

					for(var i=0,len=items.length; i<len; i++) {
						item = items[i];
						item.id = item.id || YIUI.allotId();
						if(!item.title) {
							item.title = item.caption;
						}
						var _li = $(YIUI.Panel.TabPanel.prototype.tabTemplate.replace(/#\{href\}/g, "#" + item.id).replace(/#\{title\}/g, item.title)).appendTo(ul);
						if(i == 0) {
							ct.selectedTab = _li;
							ct.activeTab = 0;
						} else {
						}
						_li.addClass("ui-state-default ui-corner-top").attr("aria-controls", item.id);
						$("[href='#"+item.id+"']", _li).addClass("ui-tans-anchor");
						$("[href='#"+item.id+"'] label", _li).addClass("ui-anchor-label");
						var _div = $('<div>').attr('id', item.id).appendTo(body);
						item.container = _div;
						_div.addClass("ui-tabs-panel ui-corner-bottom");
						
						if(i == 0) {
							_li.toggleClass("aria-selected");
							_div.toggleClass("aria-show");
						}

					}
				},

				afterLayoutRender : function() {
					var container = this.container;
					var body = $(container.el.children()[1]),
						overflow = body.css('overflow');
				}

		}
		return Return;
	};

})();
var timerTask = function(key,enable,cxt,delay,period,content,form){
	this.enable = enable;
	this.cxt = cxt;
	this.delay = delay;
	this.period = period;
	this.content = content;
	this.form = form;
	this.key = key
}
timerContent = {};
timerArray = {};
timerTask.prototype = {
		startTimer : function(){
			var enable = this.enable;
			var cxt = this.cxt;
			var form = this.form;
			var period = this.period;
			var delay = this.delay;
			var content = this.content;
			var key = this.key;
			setTimeout(function(){
				timerArray[form.formID + key] = setInterval(function(){
					var timerkey = timerArray[form.formID + key];
					if (window.tab.ofFormID == form.formID && enable == true && $(".dialog-mask").length <= 0) {
						try {
							form.eval(content,cxt,null);
						} catch(err) {
							clearInterval(timerkey);		
						}
					} 	               
        		},period);        
            },delay);

		},
		startOnce: function(){
			var delay = this.delay;
			var cxt = this.cxt;
			var form = this.form;
			var content = this.content;
			setTimeout(function(){
				form.eval(content,cxt,null);
			},delay);
		}
}