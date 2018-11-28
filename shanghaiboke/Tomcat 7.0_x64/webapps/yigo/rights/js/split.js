(function() {
	RTS.Split = function() {
		//鼠标按下，开始拖动
		var resizeStart = function(event) {
		  	event.preventDefault();

		  	var ct = event.data,
		  		splitter = $(this),
		  		region = parseInt(splitter.attr('region')),
		  		firstItem = ct.items[region],
		  		secondItem = ct.items[region + 1],
		  		resize = ct.resize; // 是否是上下拆分
		  	
		  	firstItem.el.after($("<div class='spl-mask' />"));
		  	secondItem.el.after($("<div class='spl-mask' />"));
		  	// 存储分隔条最初的位置、鼠标最初的位置
		  	resize.splitter = splitter;
		  	var v = parseFloat(splitter.css("left"));
            var pos = $.isNumeric(v) ? v : 0;
		  	resize.startPos = pos;
		  	resize.startMouse = event.screenX;
		  	// 添加position，以动态移动分隔条
		  	splitter.addClass('r-moving');
		  	// 监听鼠标拖动、鼠标松开事件
		  	$(document).off('mousemove').off('mouseup.splitter')
		  		.on('mousemove', null, ct, resizeMove)
		  		.on('mouseup.splitter', null, ct, resizeStop);
		};

		//鼠标拖拽过程
		var resizeMove = function(event) {
			event.preventDefault();

		  	var ct = event.data,
		  		resize = ct.resize,
		  		splitter = resize.splitter,
		  		region = parseInt(splitter.attr('region')),
		  		els = ct.el.children('.spl-item'),
		  		first = $(els[region]),
		  		second = $(els[region + 1]),
		  		current = event.screenX,
		  		delta = current - resize.startMouse,
		  		minSize = ct.regionMinSize;

		  	// 计算，保证各面板不会被拖动地太小
		  	if(first.width() + delta < minSize) {
	  			delta = minSize - first.width();
	  		} else if(second.width() - delta < minSize) {
	  			delta = second.width() - minSize;
	  		}
		  	// 记录实际应该拖动的大小，在resizeStop中使用
		  	resize.delta = delta;
		  	// 实时的移动分隔条
		  	splitter.css('left', resize.startPos + delta);
		};

		  //鼠标松开，重新设置各分区大小
		var resizeStop = function(event) {
		  	event.preventDefault();
		  	var ct = event.data,
		  		resize = ct.resize,
		  		splitter = resize.splitter,
		  		region = parseInt(splitter.attr('region')),
		  		el = ct.el,
		  		els = el.children('.spl-item'),
		  		first = $(els[region]),
		  		second = $(els[region + 1]),
		  		firstItem = ct.items[region],
		  		secondItem = ct.items[region + 1],
		  		minSize = ct.regionMinSize,
		  		delta = resize.delta || 0,
		  		panelWidth = ct.el.width(),
		  		panelHeight = ct.el.height();

		  	$(".spl-mask", el).remove();
		  	// 解除监听鼠标事件
		  	$(document).off('mousemove', resizeMove).off('mouseup.splitter', resizeStop);

		  	if(delta !== 0) {
		  		// 重设受影响的面板大小
		  		first.width(first.width() + delta);
	  			second.width(second.width() - delta);
	  			panelWidth -= ct.getPlaceholderWidth();
				ct.splitSizes[region].size = first.width();
				ct.splitSizes[region + 1].size = "100%";
		  		if(firstItem.resize){
		  			firstItem.resize(first.width(), first.height());
		  		}
		  		if(secondItem.resize){
		  			secondItem.resize(second.width(), second.height());
		  		}
		  		
		  	}
		  	// 大小修改完毕后，删除分隔条的position样式
		  	splitter.removeClass('r-moving');
		  	splitter.css('left', 0);

		  	// 清空中间结果，以供下次拖动使用
		  	destroy(resize);
		};

	    /**
	     * 清理对象，删除对象obj与其所有属性之间的关联。
	     */
	    var destroy = function (obj) {
	        for (var i in obj) {
	            delete obj[i];
	        }
	    }
		var rt = {
				resizerSize : 6,
				
				splitSizes: [],
				
				items: [],
				
				el: null,

				/**
				 * 拖放时每个区域的最小尺寸
				 */
				regionMinSize : 50,
				
				add: function(item, size) {
					this.items.push(item);
					this.splitSizes.push(size);
				},
				
				render: function(ct) {
					ct.empty();
					this.el = $("<div class='rts-split'></div>").appendTo(ct);
					var items = this.items,
						splits = this.splitSizes,
						split,
						item,
						_div;
					for(var i= 0, len = splits.length; i<len; i++) {
						split = splits[i];
						item = items[i];
						var item_ct = $("<div class='spl-item'/>").appendTo(this.el);
						if(item) {
							item.ct = item_ct;
							item.render(item_ct);
						}
						if(i < len - 1) {
							$("<div class='spl-resizer' region='" + i + "'></div>").appendTo(this.el);
						}
					}
					this.install();
				},
				
				resize: function(panelWidth, panelHeight) {
					var el = this.el,
						items = this.items,
						item,
						children = el.children(".spl-item"),
						resizer = el.children(".spl-resizer"),
						splits = this.splitSizes;
					panelWidth -= this.resizerSize * (splits.length - 1);
					for (var i = 0, len = resizer.length; i < len; i++) {
						resizer.eq(i).height(panelHeight);
					}
					for (var i = 0, len = children.length; i < len; i++) {
						var child = children.eq(i);
						var width = $.getReal(splits[i], panelWidth);
						child.outerWidth(width).outerHeight(panelHeight);
					}
					// 如果控件高度或宽度未设置，默认充满该Split区域
					for (var i = 0, len = items.length; i < len; i++) {
						item = items[i];
						var item_ct = item.ct;
						item.resize && item.resize(item_ct.width(), item_ct.height());
					}
				},
				
				getPlaceholderWidth : function() {
					var items = this.items;
					var width = this.resizerSize * (items.length - 1);
					return width;
				},
				
			    install : function() {
			    	this.el.children(".spl-resizer").off('mousedown').on('mousedown', null, this, resizeStart);
				}
				
		};
		return rt;
		
	};

})();