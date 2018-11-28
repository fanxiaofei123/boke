/**
 * TAB页面板
 */
"use strict";
YIUI.Panel.TabPanel = YIUI.extend(YIUI.Panel, {

    /**
     * 使用tabs布局
     */
    layout: 'TabLayout',

    /**
     * TAB title模板
     */
    tabTemplate: '<li><a href="#{href}"><label>#{title}</label></a></li>',
    
    /**
     * 默认显示的TAB页的index
     */
    activeTab : -1,
    
    selectedTab: null,
    
	height: "100%",
	
	tabPosition: YIUI.DirectionType.TOP,
	
	setTabPosition: function(tabPosition) {
		this.tabPosition = tabPosition;
	},
    
    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-tabpnl");
    	this.tabPosition && this.setTabPosition(this.tabPosition);
    	if(this.height == "pref") {
    		this.height = "100%";
    	}
    },
    
    /**
     * 添加面板时，如果已渲染，添加header和body
     */
    afterAdd: function (comp) {
        if (!this.rendered) return;

        var title = comp.title || item.caption,
            id = comp.id || YIUI.allotId(),
			tabID = "tab_" + id,
            li = $(this.tabTemplate.replace(/#\{href\}/g, "#" + tabID).replace(/#\{title\}/g, title)),
            tabs = this.getEl(),
	        head = tabs.children(".ui-tabs-nav"),
	        body = tabs.children(".tab-body");
        $("[href='#"+tabID+"']", li).addClass("ui-tans-anchor").attr("role", "presentation");
        $("[href='#"+tabID+"'] label", li).addClass("ui-anchor-label");
        head.append(li);
        var _div = $('<div id='+ tabID +'></div>').appendTo(body);
        comp.el.appendTo(_div);
        _div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").toggleClass("aria-show")
			.attr("role", "tabpanel");
        
        li.addClass("ui-state-default ui-corner-top").attr("role", "tab").toggleClass("aria-selected")
        	.attr("aria-controls", tabID);
        
        if(this.selectedTab) {
        	this.selectedTab.toggleClass("aria-selected");
        	$("#"+this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
        }
        this.setActiveTab(comp);
        this.layout.layout(this.getWidth(), this.getHeight());
        this.selectedTab = li;
    },

    changeCaption: function (comp) {
        if(!this.el) return;
        var key = comp.key;
        var _li = $("[aria-controls='tab_"+ comp.id +"']", this.el);

        var found = false,i,len;
        for (i = 0, len = this.items.length; i < len; i++) {
            if ( this.items[i] == comp ) {
                found = true;
                break;
            }
        }
        if( found ) {
            $("li:eq("+i+") label", this.el).attr("title",comp.caption).text(comp.caption);
        }
    },
    
    reduceVisible: function(visible, comp) {
    	if(!this.el) return;
    	var key = comp.key;
		var _li = $("[aria-controls='tab_"+ comp.id +"']", this.el);
		
		var found = false;
		for (var i = 0, len = this.items.length; i < len; i++) {
			var tmpComp = this.items[i];
			if ( tmpComp == comp) {
				found = true;
				break;
			}
		}
		if(!found) return;
		
		if(visible) {
			var lis = $("li:not(':hidden')", this.el);
			if(lis.length == 0 && !this.el.is(":hidden")) {
				this.setTabSel($("a", _li));
			} 
			_li.show();
		} else {
			var id = _li.attr('aria-controls');
    		$("#"+id).removeClass("aria-show");
			_li.hide();
			
			if(this.selectedTab && (_li.attr("aria-controls") != this.selectedTab.attr("aria-controls"))) return;
			var $li_p = _li.prevAll().not(":hidden").last();
			var $li_n = _li.nextAll().not(":hidden").first();
			var $li_s = null;
			if($li_p.length > 0) {
				$li_s = $li_p;
			} else if($li_n.length > 0) {
				$li_s = $li_n;
			}
			if(!$li_s) {
                this.selectedTab = null;
                return;
            }
			this.setTabSel($("a", $li_s));
		}
    },
    
    setTabSel: function(target, event) {
    	var _this = this;
    	if(target.hasClass('ui-anchor-label') || target.hasClass('ui-tans-anchor')) {
    		var $sel_li = target.closest('li');
    		var tabID = $sel_li.attr('aria-controls');
    		
    		if(_this.selectedTab && _this.selectedTab.attr("aria-controls") == $sel_li.attr("aria-controls")) {
    			if(event) {
    				if(event.stopPropagation) {
    					event.stopPropagation();
    				} else {
    					event.cancelBubble = true;
    				}
    			}
    			return false;
    		} else {
    			var form = YIUI.FormStack.getForm(_this.ofFormID);
                var cxt = new View.Context(form);
        		var tab = _this.get(tabID.substr(4));
        		if(!tab.rendered && tab.visible) {
        			tab.needRender = true;
        			tab.render();
        		}
        		var active = tab.active;
        		if(active) {
        			form.eval(active, cxt);
        		}

    			if(!$sel_li.hasClass("aria-selected")) {
    				$sel_li.addClass("aria-selected");
    			}
    			if(!$sel_li.is(":hidden") && _this.selectedTab && _this.selectedTab.attr("aria-controls") != $sel_li.attr("aria-controls")) {
    				_this.selectedTab.removeClass("aria-selected");
    				$("#" + _this.selectedTab.attr("aria-controls")).removeClass("aria-show");
    			}
        		$("#"+tabID).addClass("aria-show").show();
        		_this.setActiveTab(tabID);

        		if(tab.rendered) {
        			_this.layout.layout(_this.getWidth(), _this.getHeight());
        		}
        		_this.selectedTab = $sel_li;
				if(_this.itemChanged) {
					form.eval(_this.itemChanged, cxt);
				}
    		}
    		
    	}
    },

    /**
     * 添加事件
     */
    install: function () {
        var _this = this;
        _this.el.children("ul").click(function(event) {
        	var target = $(event.target);
        	_this.setTabSel(target, event);
        	event.stopPropagation();
        	return false;
        });
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
    			if(tab == "tab_" + this.items[i].getId()) {
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
    }
   
});
YIUI.reg('tabpanel', YIUI.Panel.TabPanel);