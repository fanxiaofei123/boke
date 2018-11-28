(function() {
	RTS = RTS || {};
	RTS.TabPanel = function() {
		var rt = {
				items: [],
				el: null,
				enable: true,
				add: function(item) {
					this.items.push(item);
				},
				render: function(ct) {
					var items = this.items;
					var el = $("<div class='tab'/>").appendTo(ct);
					this.el = el;
					var ul = $("<ul class='tab-ul'>").appendTo(el);
					var body = $("<div class='tab-body'/>").appendTo(el);
					for (var i = 0, len = items.length; i < len; i++) {
						var item = items[i];
						var _li = $("<li class='"+(i==0 ? "sel" : "")+"' ref=tab_"+item.id+" r_type='"+item.type+"'><a>"+item.caption+"</a></li>").appendTo(ul);
						var _itemCt = $("<div class='tab-item "+(i==0 ? "show" : "")+"' id=tab_"+item.id+"></div>").appendTo(body);
						item.ct = _itemCt;
						item.render(_itemCt);
						item.ctID = "tab_"+item.id;
						if(i == 0) {
							this.selTabID = "tab_"+item.id;
						}
					}
					this.install();
				},
				resize: function(width, height) {
					this.el.width(width).height(height);
					var ul = $("ul", this.el);
					var body = $(".tab-body", this.el);
					body.outerHeight(height - ul.outerHeight());
					var items = this.items;
					for (var i = 0, len = items.length; i < len; i++) {
						var item = items[i];
						item.resize && item.resize(body.width(), body.height());
					}
				},
				setEnable: function(enable) {
					this.enable = enable;
				},
				install: function() {
					var _this = this;
					this.el.delegate("ul.tab-ul li", "click", function(event) {
						if(!_this.enable) return;
						var li = $(this);
						var type = li.attr("r_type");
						RTS.options.type = parseInt(type);
						var ref = li.attr("ref");
						var oldRef = _this.selTabID;
						if(oldRef) {
							if(oldRef == ref) {
			        			event.stopPropagation();
		            			return false;
			        		} else {
			        			$("li[ref='"+oldRef+"']").toggleClass("sel");
								$("#" + oldRef).toggleClass("show");
			        		}

						}
	        			$("li[ref='"+ref+"']").toggleClass("sel");
						$("#" + ref).toggleClass("show");
						_this.selTabID = ref;
						
						var index = li.index();
						var item = _this.items[index];
						if(item) {
							var body = $(".tab-body", this.el);
							item.resize(body.width(), body.height());
						}
		        		
			        	event.stopPropagation();
			        	return false;
					
					});
				}
		};
		return rt;
	};
})();