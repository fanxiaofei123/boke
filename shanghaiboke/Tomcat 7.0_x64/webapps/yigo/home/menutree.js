(function () {
	$.fn.extend({
		menuTree: function(container) {
			var tree = this.get(0);
			var html = "<div class='searchBox'>" +
							"<div class='btn'>" +
								"<input type='text' class='searchtext' placeholder='"+YIUI.I18N.menutree.inputKeyWords+"' autocomplete='off' />" +
								"<button class='search'></button>" +
							"</div>" +
						"</div>" +
						"<div class='matchItems'><ul></ul></div>" +
						"<div class='appItems'><ul></ul></div>" +
						"<div id='listBox' style='height: 500px;'></div>";
			tree.innerHTML = html;

			var mainTree = null;
			var appKey;
		    var url = window.location.href;
		    if (url.indexOf("appkey=") != -1) {
		   		var index =  url.lastIndexOf("appkey=")+7;
		    	var indexEnd = url.indexOf("&",index);
		    	if (indexEnd == -1) {
		    		indexEnd = url.length;
		    	}
		    	appKey = url.substring(index,indexEnd);
		    	paras = {
	    			appKey:appKey
		    	};
		    }
			YIUI.MetaService.getEntry(null, appKey).then(function(result){
	    		var rootEntry = result.entry;
				var caption = result.caption;
				$(".nav .logo-text").html(caption);
				mainTree = new YIUI.MainTree(rootEntry, $("#listBox"), container);
			    //滚动条
				$('#listBox').scrollbar({
					events : [{
						obj : $('.tm a'),
						ev : 'click'
					},{
						obj : $(window),
						ev : 'resize'
					},{
						obj : $('.mainMiddle'),
						ev : 'drag'
					}]
				});
			});

		    var self = this;
		    YIUI.MetaService.getPreLoadItems()
		    	.then(function(paths){
		    		if( paths ) {
                        for(var i = 0, len = paths.length; i < len; i++) {
                            window.openEntry({path: paths[i]});
                        }
					}
		    	});


	        YIUI.MenuTree = {};
	        YIUI.MenuTree.reload = function(entryPath) {
	            YIUI.MetaService.getEntry(entryPath).then(function(result){
	                var entry = result.entry;
	                mainTree.reload(entry);
	            });
	        };

			var install = function() {
            	var index = -1;
            	var searchtext = $(".searchBox .searchtext");
				var searchItems = function() {
					var searchValue = searchtext.val();
			        if (searchValue) {
			            var matchItems = $.map(mainTree._data, function (value, i) {
			                return (value._visible && value.name.indexOf(searchValue) > -1 && !value.children) ? value : null;
			            })
			            $(".matchItems ul").children().remove();
            			index = -1;
			            for (var i = 0, len = matchItems.length; i < len; i++) {
			                var _li = $("<li></li>");
			                var parentID = matchItems[i].parentID,
			                        parentNode, pName = "";
			                if (parentID) {
			                    parentNode = mainTree.getTreeNode(parentID);
			                    pName = "(" + parentNode.name + ")";
				                $("<a></a>").addClass("item").text(matchItems[i].name + pName).data("id",
				                        matchItems[i].id).appendTo(_li);
				                _li.appendTo($(".matchItems ul"));
			                }
			            }
						if(matchItems.length > 0) {
				            $(".matchItems").addClass("open");
						} else {
							$(".matchItems").removeClass("open");
						}
			        } else {
			            $(".matchItems ul").children().remove();
						$(".matchItems").removeClass("open");
			        }
				};
			    searchtext.focusin(function (e) {
			        searchItems();
			    });
			    searchtext.keyup(function (e) {
            		var keyCode = e.keyCode;
            		if(keyCode == 38 || keyCode == 40 || keyCode == 13) return;
			        searchItems();
			    })
            	searchtext.bind("keydown", function(e){
            		var keyCode = e.keyCode;
                    var $view = $(".matchItems ul");
                    var maxLen = $("li", $view).length;
                    if(maxLen == 0) return;
                    if(keyCode == 38) {
                    	index--;
                    	if(index == -1) index = maxLen - 1;
                    } else if(keyCode == 40) {
                    	index++;
                    	if(index == maxLen) index = 0;
                    } else if (keyCode == 9 || keyCode === 13 || keyCode === 108) {
                        if (keyCode == 9) {
                            $(document).mousedown();
                        } else if(keyCode === 13) {
                        	$("li.hover a", $view).click();
                        	e.stopPropagation();
                        }
                        e.preventDefault();
                    } else {
                        return;
                    }
                    if (index == -1) return;

                    $(".matchItems li").removeClass("hover");
                    var _li = $(".matchItems li").eq(index);
                    _li.addClass("hover");

            	});

			    var selected = function(node) {
			        if (node.parentID) {
			            var parent = mainTree.getTreeNode(node.parentID);
			            if (!$("#" + parent.id).hasClass("open")) {
			                $("#" + parent.id).click();
			                if (parent.parentID) {
			                    selected(parent);
			                }
			            }
			        } else {
			        	$("#"+node.id).click();
			        }
			    }
			    $(".matchItems").delegate('.item', 'click', function () {
			        var id = $(this).data("id");
			        var node = mainTree.getTreeNode(id);
			        selected(node);
			        $("#" + id).dblclick();
			        $(".matchItems").removeClass("open");
			    })
			  

			    $(document).on("mousedown", function (e) {
			        var target = $(e.target);
			        if ((target.closest($(".matchItems")).length == 0)
			                && (target.closest($(".searchBox .search")).length == 0)
			                && (target.closest($(".searchBox .searchtext")).length == 0)) {
			            $(".matchItems").removeClass("open");
			        }
			
			    });

			    $(document).keydown(function (event) {
			        var keyCode = event.charCode || event.keyCode || 0;
			        if (keyCode == 20) {
	                    document.isCapeLook = !document.isCapeLook;
	                } else if (keyCode == 8) {
	                    var el = (event.srcElement || event.target),
	                            isNotEditEle = (el.type != "text" && el.type != "textarea" && el.type !== "password"),
	                            isOnlyRead = (el.readOnly == true);
	                    if (isNotEditEle || isOnlyRead) {
	                        if (event.returnValue) {
	                            event.keyCode = 0;
	                            event.returnValue = false;
	                        }
	                        if (event.preventDefault) {
	                            event.preventDefault();
	                        }
	                        return false;
	                    }
	                }
			    });
			};

			install();

			this.resetHeight = function() {
				var height = $(tree).height() - $('.searchBox').height();
				$("#listBox").height(height);
			};
			return this;
		}
	});
})();