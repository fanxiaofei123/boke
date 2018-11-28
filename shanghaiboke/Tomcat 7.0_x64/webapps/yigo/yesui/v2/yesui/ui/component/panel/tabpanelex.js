/**
 * TAB页面板
 */
YIUI.Panel.TabPanelEx = YIUI.extend(YIUI.Panel.TabPanel, {
	
	listeners : {
    	//点击关闭图标
    	closetab : function (e) {
	        var target = $(e.target);
	        var itemId = target.closest('li').attr('aria-controls');
	        var _index = target.closest('li').index() - 2;
        	if((this.activeTab == _index && this.activeTab != 0) || _index < this.activeTab) {
	        	this.activeTab -= 1;
        	}
	        this.remove(this.get(itemId));
	    }

    },
    
    afterRender: function(){
		this.base();
		var el = this.el;
		var head = $('.ui-tabs-nav', el);
		head.addClass('ui-tabs-ex');
		var li = "<li><img alt="+YIUI.I18N.tabpanelex.picture+" src='Resource/file.png'><label class='ui-tabs-nav-label' style='vertical-align: middle;'>"+YIUI.I18N.tabpanelex.materialOrder+"</label></li>"
				 + "<li class='customView_li' style='float: right;'></li>";
		head.prepend(li);
	},
	
	remove: function (comp, autoDestroy) {
		this.base(comp, autoDestroy);
        var tab;
		if($(".tab-body", tabs).children().length <= 0) {
        	$(".ui-tabs-nav-label", tabs).html(YIUI.I18N.tabpanelex.materialOrder);
        } else {
        	tab = this.items[this.activeTab];
			$(".ui-tabs-nav-label", tabs).html(tab.title);
        }
	},
	
	setActiveTab : function(tab) {
		this.base(tab);
		if(index != -1 && this.rendered) {
			$(".ui-tabs-nav-label", this.el).html(tab.title);
    	}
		
	}
    
});
YIUI.reg('tabpanelex', YIUI.Panel.TabPanelEx);