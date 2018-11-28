//分隔线拖动  对左右两侧的区域进行重新布局显示
(function() {
	RTS = RTS || {};
	RTS.Resize = function(el, left, right) {
		//鼠标按下，开始拖动
		var resizeStart = function(event) {
		  	event.preventDefault();

		  	var layout = event.data.layout,
		  		ct = event.data,
		  		splitter = $(this),
		  		region = parseInt(splitter.attr('region')),
		  		firstItem = ct.items[region],
		  		secondItem = ct.items[region + 1],
		  		resize = layout.resize,
		  		vertical = ct.orientation !== 'horizontal'; // 是否是上下拆分
		  	
		  	layout.container = ct;
		  	
		  	// 判断此分隔条是否允许拖动
		  	if(ct.splitSizes && (ct.splitSizes[region].resizable === false || ct.splitSizes[region+1].resizable === false)) {
		  		return;
		  	}
		  	
		  	firstItem.el.after($("<div class='spl-mask' />"));
		  	secondItem.el.after($("<div class='spl-mask' />"));

		  	// 存储分隔条最初的位置、鼠标最初的位置
		  	resize.splitter = splitter;
		  	resize.startPos = splitter.cssNum(!vertical ? 'left' : 'top', 0);
		  	resize.startMouse = !vertical ? event.screenX : event.screenY;

		  	// 添加position，以动态移动分隔条
		  	splitter.addClass('r-moving');

		  	// 监听鼠标拖动、鼠标松开事件
		  	$(document).off('mousemove').off('mouseup.splitter')
		  		.on('mousemove', null, layout, resizeMove)
		  		.on('mouseup.splitter', null, layout, resizeStop);
		};

		//鼠标拖拽过程
	  	var resizeMove = function(event) {
		  	event.preventDefault();

		  	var layout = event.data,
				ct = layout.container,
		  		resize = layout.resize,
		  		splitter = resize.splitter,
		  		region = parseInt(splitter.attr('region')),
		  		els = ct.getRenderTarget().children('.spl-item'),
		  		first = $(els[region]),
		  		second = $(els[region + 1]),
		  		vertical = ct.orientation !== 'horizontal',
		  		current = !vertical ? event.screenX : event.screenY,
		  		delta = current - resize.startMouse,
		  		minSize = layout.regionMinSize;

		  	// 计算，保证各面板不会被拖动地太小
		  	if(vertical) {
			  	if(first.height() + delta < minSize) {
					delta = minSize - first.height();
			  	} else if(second.height() - delta < minSize) {
				  	delta = second.height() - minSize;
			  	}
		  	} else {
			  	if(first.width() + delta < minSize) {
				  	delta = minSize - first.width();
			  	} else if(second.width() - delta < minSize) {
				  	delta = second.width() - minSize;
			  	}
		  	}

		  	// 记录实际应该拖动的大小，在resizeStop中使用
		  	resize.delta = delta;

		  	// 实时的移动分隔条
		  	splitter.css(!vertical?'left':'top', resize.startPos + delta);
	  	};

	  	//鼠标松开，重新设置各分区大小
	  	var resizeStop = function(event) {
		  	event.preventDefault();
		  	var layout = event.data,
		  		ct = layout.container,
		  		resize = layout.resize,
		  		splitter = resize.splitter,
		  		region = parseInt(splitter.attr('region')),
		  		el = ct.getRenderTarget(),
		  		els = el.children('.spl-item'),
		  		first = $(els[region]),
		  		second = $(els[region + 1]),
		  		firstItem = ct.items[region],
		  		secondItem = ct.items[region + 1],
		  		vertical = ct.orientation !== 'horizontal',
		  		minSize = layout.regionMinSize,
		  		delta = resize.delta || 0,
		  		panelWidth = ct.getWidth(),
		  		panelHeight = ct.getHeight();

	  		$(".spl-mask", el).remove();
	  		// 解除监听鼠标事件
	  		$(document).off('mousemove', resizeMove).off('mouseup.splitter', resizeStop);

	  		if(delta !== 0) {
		  		// 重设受影响的面板大小
		  		if(vertical) {
		  			first.height(first.height() + delta);
		  			second.height(second.height() - delta);
					firstItem.setHeight($.getReal("100%", first.height()));
					secondItem.setHeight($.getReal("100%", second.height()));
		  			panelHeight -= ct.layout.getPlaceholderHeight();
					ct.splitSizes[region].size = first.height();
					ct.splitSizes[region + 1].size = "100%";
		  		} else {
		  			first.width(first.width() + delta);
		  			second.width(second.width() - delta);
					firstItem.setWidth($.getReal("100%", first.width()));
					secondItem.setWidth($.getReal("100%", second.width()));
		  			panelWidth -= ct.layout.getPlaceholderWidth();
					ct.splitSizes[region].size = first.width();
					ct.splitSizes[region + 1].size = "100%";
		  		}
		  		if(firstItem.hasLayout){
		  			firstItem.doLayout(firstItem.getWidth(), firstItem.getHeight());
		  		}
		  		if(secondItem.hasLayout){
		  			secondItem.doLayout(secondItem.getWidth(), secondItem.getHeight());
		  		}
	  		
	  		}
		  	// 大小修改完毕后，删除分隔条的position样式
		  	splitter.removeClass('r-moving');
		  	splitter.css(!vertical?'left':'top', 0);

		  	// 清空中间结果，以供下次拖动使用
		  	$.destroy(resize);
	  	}
		  
	  	var rt = {
		  	reg: function(el) {
		  		//注册。。。
			  	el.off('mousedown').on('mousedown', null, this, resizeStart);
		  	}
	  	};
	  	return rt;
	}
})();


  