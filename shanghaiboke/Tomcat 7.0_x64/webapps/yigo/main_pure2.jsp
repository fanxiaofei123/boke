<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>工作台</title>
		
		<script type="text/javascript" src="yesui/v1/ui/allfile.js"></script>
		
		<script type="text/javascript">

			window.onerror = function(msg) {
				$(".loading").hide();
				msg = msg.replace("Uncaught Error: ", "");
				var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 170, width: 460});
			};
			/* 
			window.onbeforeunload = function() {
				var n = window.event.screenX - window.screenLeft;
				var b = n > document.documentElement.scrollWidth - 20;
				if(b && window.event.clientY < 0 || window.event.sltKey) {
					alert("关闭，非刷新");
					window.event.returnValue = "关闭了。。。";
				}
			}; */
			/* 
			window.onunload = function() {
				var warning = "确认退出？？？？";
				alert(warning);
			}; */
			
			$(function () {
			    $(".login_username").html($.cookie("userName"));

			    var place_w = parseInt($("#form").css("padding-left")) + parseInt($("#form").css("padding-right")) + parseInt($("#form").css("margin-left")) + parseInt($("#form").css("margin-right"));
			    var place_h = parseInt($("#form").css("padding-top")) + parseInt($("#form").css("padding-bottom")) + parseInt($("#form").css("margin-top")) + parseInt($("#form").css("margin-bottom"));
			    
			    //自适应高度，宽度
			    $(".mainRight").width($(document.body).width() - $(".mainLeft").outerWidth() - $(".mainMiddle").outerWidth() - place_w);
			    $(".mainLeft,.mainMiddle,.main").height($(document.body).height() - $('.nav').height());
			    $(".mainRight").height($(document.body).height() - $('.nav').height() - place_h);
			    $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
			    $(window).resize(function () {
			        $(".mainLeft,.mainMiddle,.main").height($(document.body).height() - $('.nav').height());
			        $(".mainRight").height($(document.body).height() - $('.nav').height() - place_h);
			        $(".mainRight").width($(document.body).width() - $('.mainLeft').outerWidth() - $(".mainMiddle").outerWidth() - place_w);
			        $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
			        YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
			    })
			    $('.userBox span').click(function () {
			        $(".userImgbox").slideDown()
			    })
			    $('.userBox').mouseleave(function () {
			        $(".userImgbox").slideUp()
			    })
			
			    var YIUIContainer = {};
			    YIUIContainer.panel = function (type) {
			        if (type == "tab") {
			            return new YIUI.TabContainer();
			        }
			    };
			
			    YIUIContainer.container = new YIUIContainer.panel("tab");
			    
			    YIUIContainer.container.el = $("#form");
			    YIUIContainer.container.render();
			    YIUIContainer.el = YIUIContainer.container.el;
			    YIUIContainer.build = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.add(form.getRoot());
			            YIUIContainer.container.doRenderChildren();
			        	form.setContainer(YIUIContainer);
			        }
			    };
			    YIUIContainer.removeForm = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.removeForm(form);
			        }
			    };
				
			    YIUIContainer.renderDom = function() {
		        	YIUIContainer.container.doRenderChildren();
				};

			    YIUIContainer.closeAll = function() {
			    	if (YIUIContainer.container) {
			            YIUIContainer.container.closeAll();
			        }
			    };
			    
			    YIUIContainer.closeTo = function(targetKey) {
			    	if (YIUIContainer.container) {
			            YIUIContainer.container.closeTo(targetKey);
			        }
			    };
			    YIUI.MainContainer = YIUIContainer;
			    var url = window.location.href;
			    var appResult = Svr.SvrMgr.getAppList();
			    var result;
			    var appKey;
			    if (url.indexOf("appkey=") != -1) {
			   		var index =  url.lastIndexOf("appkey=")+7;
			    	var indexEnd = url.indexOf("&",index);
			    	if (indexEnd == -1) {
			    		indexEnd = url.length;
			    	}
			    	appKey = url.substring(index,indexEnd);
			    	var paras = {
			    			appKey:appKey,
			    	};
			    	result = Svr.SvrMgr.loadTreeMenu(paras);
			    } else {
			    	result = Svr.SvrMgr.loadTreeMenu();
			    	appKey = appResult.serverList.defaltKey;
			    }
				var serverList = appResult.serverList.servers;
				
				//加载appItems
				var defalutURl = $.cookie("oldURL");
				if (serverList) {
					for (var i = 0; i < serverList.length; i++) {
						var _li = $("<li></li>");
						var _a = $("<a></a>");
						_a.html(serverList[i].caption);
						_a.attr("id",serverList[i].key);
						if (serverList[i].key == appKey) {
							_li.addClass("infoitem");
						}
						var href;
						if (serverList[i].url.indexOf("?") != -1) {
							href = serverList[i].url + "&appkey=" + serverList[i].key;
						} else {
							serverList[i].url = serverList[i].url == "null" ? defalutURl : serverList[i].url;
							if (serverList[i].url.indexOf("?") != -1) {
								href = serverList[i].url + "&appkey=" + serverList[i].key;
							} else {
								href = serverList[i].url + "?appkey=" + serverList[i].key;
							}
						}
						_a.attr("href",href);
						_a.appendTo(_li);
						_li.appendTo($(".appItems ul"));
					}
				}
				var rootEntry = result.entry;
				var status = appResult.status;
				window.setStatus(status);
				var caption = result.caption;
				$(".logo-text").html(caption);
				var mainTree = new YIUI.MainTree(rootEntry, $("#listBox"), YIUIContainer);
				YIUI.MenuTree = {};
				YIUI.MenuTree.reload = function(entryPath) {
					var result = Svr.SvrMgr.loadTreeMenu({rootEntry: entryPath});
					var entry = result.entry;
					var status = appResult.status;
					window.setStatus(status);
					mainTree.reload(entry);
				};
	
			    $(".searchBox .searchtext").focusin(function () {
			        //$('.searchtext').val("");
			    })
			    $(".searchBox .searchtext").keyup(function () {
			        var searchValue = $('.searchtext').val();
			        if (searchValue) {
			            var matchItems = $.map(mainTree._data, function (value, i) {
			                return value.name.indexOf(searchValue) > -1 ? value : null;
			            })
			            $(".matchItems ul").children().remove();
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
			    })
			
			    $(".matchItems").delegate('.item', 'click', function () {
			        var id = $(this).data("id");
			        var node = mainTree.getTreeNode(id);
			        selected(node);
			        $("#" + id).dblclick();
			        $(".matchItems").removeClass("open");
			    })
			  
			    
			    $(".nav-left").click(function(e) {
			    	$(".appItems").show();
			    	e.stopPropagation();
			    })
			    $(document).click(function( e ) {
			    	if ($(".appItems").css("display") == "block") {
			    		$(".appItems").hide();
			    	}
			    })
			    $(".appItems ul li a").click(function(e) {
			    	var _this =$(this);
			    	var key = _this.attr("id");
			    	$.cookie("infokey",key);
			    	$(".appItems").hide();
			    	e.stopPropagation();
			    })
			
			    function selected(node) {
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
			    //移动条
			    var bool = false;
			
			    $('.mainMiddle').mousedown(function (event) {
			        bool = true;
			
			    })
			    $('body').mouseup(function () {
			        bool = false;
			
			    });
			
			    $('.main').mousemove(function (event) {
			        if (bool == true) {
			            var x = event.pageX;
			            if (x <= 175) {
			                x = 175;
			            }
			            if (($(document.body).width() - x) < 175) {
			                x = $(document.body).width() - 175;
			            }
			            $('.mainLeft').width(x).show();
			            $('.mainMiddle').css({left: x});
			            $('.mainLeft').width(x);
			            var $s_btn = $('.mainLeft .searchBox .search');
			            var $s_txt = $('.mainLeft .searchBox .searchtext');
			            $s_txt.width(x - $s_btn.width() - 20);
			            $('.mainRight').width($(document.body).width() - x - $(".mainMiddle").outerWidth() - place_w);
			            $('.matchItems').width($('.searchtext').width());
			
			            YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
			
			        }
			    });
			    

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
			    
		        var paras = {
	                cmd: "GetPreLoadItems",
	                service: "PureMeta"
	            };
	            var items = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
	            for(var i = 0, len = items.length; i < len; i++) {
	            	var item = items[i];
	            	var path = item.path;
	            	openEntry({path: path});
	            }
	            
			});
					
			function openEntry(node) {
				YIUI.EventHandler.doTreeClick(node, YIUI.MainContainer);
			}
			
			function exec(formID, formula) {
				var form = YIUI.FormStack.getForm(formID);
				var result = form.eval(formula, {form: form});
				return result;
			}
			
			function logout() {
			    Svr.SvrMgr.doLogout();
			    $.cookie("clientID", null);
			    $.cookie("oldURL",null);
			    window.location.reload();
			}
			function exit() {
			    Svr.SvrMgr.doLogout();
			    $.cookie("clientID", null);
			    $.cookie("oldURL",null);
			    window.location.replace("about:blank");
			}
			
			function modifyPwd() {
		        var paras = {formKey: "ChangePassWord", cmd: "PureShowForm", async: false};
		        var jsonObj = Svr.SvrMgr.dealWithPureForm(paras);
		        YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL);
			}
	
			function about() {
				var params = {service: "GetSystemInfo"};
			    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
		        
				var dialogDiv = $("<div class='modifyPwd' id='modifyPwd'></div>");
			    var version = new YIUI.Control.Label({
			    	metaObj: {
				        x: 0,
				        y: 1
			    	},
			        caption: "版本： "
			    });
			
			    var versionTxt = new YIUI.Control.Label({
					metaObj: {
				        x: 1,
			       		y: 1
			    	},
			        caption: result.Ver
			    });
			    
			    var create = new YIUI.Control.Label({
					metaObj: {
				        x: 0,
			       		y: 2
			    	},
			        caption: "创建号： "
			    });
			
			    var createTxt = new YIUI.Control.Label({
					metaObj: {
				        x: 1,
			        	y: 2
			    	},
			        caption: result.BuildID
			    });
			    
			    var company = new YIUI.Control.Label({
					metaObj: {
			        	x: 0,
			        	y: 3,
			        	colspan: 2
			    	},
			        topMargin: 0,
			        caption: "上海博科资讯股份有限公司"
			    });
			
			    var OK = new YIUI.Control.Button({
					metaObj: {
				        x: 0,
			       		y: 0
			    	},
			        listeners: null,
			        value: '确定'
			    });
			    var cancel = new YIUI.Control.Button({
					metaObj: {
				        x: 1,
			        	y: 0
			    	},
			        listeners: null,
			        value: '取消'
			    });
	
			    var gp = new YIUI.Panel.GridLayoutPanel({
					metaObj: {
				        x: 0,
			        	y: 4,
			        	colspan: 2,
		    			columnGap : 15
			    	},
		    		widths : ["50%", "50%"],
		    		minWidths : ["-1", "-1"],
		    		heights : [25],
		    		items : [OK, cancel]
			    });
			    
			    var gridpanel = new YIUI.Panel.GridLayoutPanel({
					metaObj: {
			    		rowGap : 5,
		    			columnGap : 15
			    	},
		    		width: 240,
		    		widths : ["30%", "70%"],
		    		minWidths : ["-1", "-1"],
		    		heights : [5, 25, 25, 25, 25],
		    		items : [version, versionTxt, create, createTxt, company, gp]
			    });
			    dialogDiv.modalDialog(null, {title: "关于Yigo", showClose: false, width: "260px", height: "160px"});
			    gridpanel.el = dialogDiv.dialogContent();
			    gridpanel.render();
			    dialogDiv.addClass("abtCo");
			    OK.el.unbind();
			    cancel.el.unbind();
			    OK.el.click(function() {
			    	dialogDiv.close();
			    });
			    cancel.el.click(function() {
			    	dialogDiv.close();
			    }); 
			}
			
			
			window.setStatus = function(status) {
				if(status) {
					var items = status.items;
					var org_lbl = $(".navRight label.org_lbl");
					var lbl_text = "";
					for(var i = 0, len = items.length; i < len; i++) {
						var item = items[i];
						lbl_text += " " + item.text;
						
					}
					org_lbl.html(lbl_text);
					window.org_status = items;
				}
			};
			window.updateStatusInfo = function(key, text) {
				var status = window.org_status;
				if(status) {
					var org_lbl = $(".navRight label.org_lbl");
					var lbl_text = "";
					for(var i = 0, len = status.length; i < len; i++) {
						var s = status[i];
						if(key == s.key) {
							lbl_text += " " + text;
						} else {
							lbl_text += " " + s.text;
						}
					}
					org_lbl.html(lbl_text);
				}
			};
			window.refreshStatusInfo = function(key) {
				var status = window.org_status;
				if(status) {
					var org_lbl = $(".navRight label.org_lbl");
					var lbl_text = "";
					for(var i = 0, len = status.length; i < len; i++) {
						var s = status[i];
						lbl_text += " " + s.text;
					}
					org_lbl.html(lbl_text);
				}
			};
			window.history.forward(-1);
		</script>
		
	</head>
	<body>
		<div class="nav">
			<div class="blend"></div>
		    <div class="nav-left">
				<div class="nav-left-icon"></div>
		    </div>
		    <span class="logo-text">Yigo应用</span>
		    <div class="navRight">
		    	<label class="org_lbl" ></label>
		    	<span class="login_username">朱文文</span>
		    	<span class="set-btn" onclick="about()"></span>
		        <div class="userBox">
		            <div class="userImg"><span class="userIcon"></span></div>
		            <div class="userImgbox">
		                <a onclick="logout()">
		                    <span>注销</span>
		                </a>
		                <a onclick="exit()">
		                    <span>退出</span>
		                </a>
		                <a onclick="modifyPwd()">
		                    <span>修改密码</span>
		                </a>
		            </div>
		        </div>
		    </div>
		</div>
		
		<!-- 主体 -->
		<div class="main">
		    <div class="mainLeft">
		        <div class="searchBox">
			        <div class="btn">
			        	<input type="text" class="searchtext" placeholder="请输入关键词..." autocomplete="off"><!-- 
			         --><button class="search"></button>      
		        	</div>
		        </div>
		        <div class="matchItems">
		            <ul></ul>
		        </div>
		        <div class="appItems">
		            <ul></ul>
		        </div>
		        <div id="listBox" style="height: 500px;"></div>
		    </div>
		    <div class="mainMiddle"></div>
		    <div id="form" class="mainRight"></div>
		</div>
		
		<div class="loading mask" style="display: none;"></div>
		<div class="loading image" style="position: absolute; display: none;">
		    <img alt='loading' src='yesui/v1/yesui/ui/res/images/loading.gif'>
		</div>
	</body>
</html>
