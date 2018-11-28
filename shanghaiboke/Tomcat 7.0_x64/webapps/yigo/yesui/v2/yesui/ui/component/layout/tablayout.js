/**
 * TAB布局
 */
YIUI.layout.TabsLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	layout : function(panelWidth, panelHeight) {
		var ct = this.container;
		var body = $(ct.el.children()[1]),
			overflow = body.css('overflow');

		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
        if(ct.items && ct.items.length != 0) {
			var ul = $(ct.el.children("ul")),
				body = $(ct.el.children(".tab-body"));
			var tabPosition = ct.tabPosition;
			switch (tabPosition) {
				case YIUI.DirectionType.TOP: 
				case YIUI.DirectionType.BOTTOM: 
					ul.width(panelWidth);
					// 设置body高度，使滚动条局限在body里，不影响TAB header
					body.height(panelHeight - ul.outerHeight(true));
					body.width(panelWidth);
					break;
				case YIUI.DirectionType.LEFT: 
				case YIUI.DirectionType.RIGHT: 
					body.height(panelHeight);
					var ul_h = ul.outerHeight(true);
					if($.browser.isIE) {
						ul_h = ul.outerWidth();
					}
					body.width(panelWidth - ul_h);
					ul.width(panelHeight);
					break;
			}
			
			tab = ct.items[ct.activeTab];
			if(tab) {
				tab.setWidth(body.width());
				tab.setHeight(body.height());
				if(tab.hasLayout) {
					tab.doLayout(tab.getWidth(), tab.getHeight());
				}
			}
		}
	},
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			item;

//		var realTarget = $('<div></div>').addClass("ui-tabs").appendTo(target),
		// TAB header
		var ul = $("<ul class='ui-tabs-nav tab-head'/>");
		// 添加body使滚动条不影响header
		var body = $("<div class='tab-body'>");
		var tabPosition = ct.tabPosition;
		switch (tabPosition) {
			case YIUI.DirectionType.TOP: 
				ul.addClass("top");
				ul.appendTo(target);
				body.appendTo(target);
				break;
			case YIUI.DirectionType.BOTTOM: 
				ul.addClass("bottom");
				body.appendTo(target);
				ul.appendTo(target);
				break;
			case YIUI.DirectionType.LEFT: 
				ul.addClass("left");
				body.appendTo(target);
				ul.appendTo(target);
				body.css("float", "right");
				break;
			case YIUI.DirectionType.RIGHT: 
				ul.addClass("right");
				body.appendTo(target);
				ul.appendTo(target);
				body.css("float", "left");
				break;
		}

		for(var i=0,len=items.length; i<len; i++) {
			item = items[i];
			item.id = item.id || YIUI.allotId();
			var tabID = "tab_" + item.id;
			var title = item.title;
			if(!title) {
				title = item.caption;
			}
			var _li = $(YIUI.Panel.TabPanel.prototype.tabTemplate.replace(/#\{href\}/g, "#" + tabID).replace(/#\{title\}/g, title)).appendTo(ul);
			_li.addClass("ui-state-default ui-corner-top")
				.attr("role", "tab").attr("aria-controls", tabID);
			$("[href='#"+tabID+"']", _li).addClass("ui-tans-anchor").attr("role", "presentation");
			$("[href='#"+tabID+"'] label", _li).addClass("ui-anchor-label");
			$("[href='#"+tabID+"'] label", _li).attr("title",title);
			var _div = $('<div>').attr('id', tabID).appendTo(body);
			item.container = _div;
			_div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom")
					.attr("role", "tabpanel");
			
			if(ct.activeTab < 0 && item.visible) {
				ct.selectedTab = _li;
				ct.activeTab = i;
				_li.toggleClass("aria-selected");
				_div.toggleClass("aria-show");
				_div.show();
				item.needRender = true;
			} else {
				_div.hide();
				item.needRender = false;
			}

			if(!item.visible) {
				_li.css("display", "none");
			}
		}
	},

	afterRender : function() {
		var container = this.container;
		var body = $(container.el.children()[1]),
			overflow = body.css('overflow');
	},
	
	/**
	 * beforeLayout中已经设置了各个面板的el
	 */
	isValidParent : function(c, target) {
		return true;
	}
});
YIUI.layout['TabLayout'] = YIUI.layout.TabsLayout;