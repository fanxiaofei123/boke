/*(function () {
	$.fn.extend({
		navigation: function() {
			var nav = this.get(0);
			var html = "<div class='blend'></div>" +
						"<div class='nav-left'>" +
							"<div class='nav-left-icon'></div>" +
						"</div>" +
						"<span class='logo-text'>Yigo应用11</span>" +
						"<div class='navRight'>" +
							"<label class='org_lbl' ></label>" +
							"<span class='login_username'>朱文文</span>" +
							"<span class='set-btn about'></span>" +
							"<div class='userBox'>" +
								"<div class='userImg'><span class='userIcon'></span></div>" +
								"<div class='userImgbox'>" +
									"<a class='logout'>" +
										"<span>注销</span>" +
									"</a>" +
									"<a class='exit'>" +
										"<span>退出</span>" +
									"</a>" +
									"<a class='modifyPwd'>" +
										"<span>修改密码</span>" +
									"</a>" +
								"</div>" +
							"</div>" +
						"</div>";
			nav.innerHTML = html;

		    $(".login_username", nav).html($.cookie("userName"));

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

		    var buildApp = function() {
			    var url = window.location.href;
			    var appResult = Svr.SvrMgr.getAppList();
				var status = appResult.status;
				window.setStatus(status);
			    var paras;
			    var appKey;
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
			    } else {
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
		    };

		    var install = function() {
				$('.userBox span').click(function () {
			        $(".userImgbox").slideDown()
			    })
			    $('.userBox').mouseleave(function () {
			        $(".userImgbox").slideUp()
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

			    $(".logout", nav).click(function(e) {
			    	Svr.SvrMgr.doLogout().done(function() {
					    $.cookie("clientID", null);
					    $.cookie("oldURL",null);
					    window.location.reload();
				    });
			    })
			    $(".exit", nav).click(function(e) {
			    	Svr.SvrMgr.doLogout().done(function() {
				    	$.cookie("clientID", null);
		 			    $.cookie("oldURL",null);
					    window.location.replace("about:blank");
				    });
			    })
			    $(".modifyPwd", nav).click(function(e) {

			    	var formKey = "ChangePassWord";
			        var builder = new YIUI.YIUIBuilder(formKey);
			        builder.setTarget(YIUI.FormTarget.MODAL);
			        builder.newEmpty().then(function(emptyForm){			     
			            builder.builder(emptyForm);
			        });
			    })

				var about = function() {
					var params = {service: "GetSystemInfo"};
				    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);

				 	var html_about = "<div class='sys-about'><table>" +
										"<tbody>" +
							 				"<tr row='1'>" +
								 				"<td col='0' colspan='1' rowspan='1'> 版本：&nbsp; </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" + result.Ver + "</td>" +
							 				"</tr>" +
							 				"<tr row='2'>" +
								 				"<td col='0' colspan='1' rowspan='1'> 创建号：&nbsp; </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" + result.BuildID + "</td>" +
							 				"</tr>" +
							 				"<tr row='3'>" +
							 					"<td col='0' colspan='2' rowspan='1'> 上海博科资讯股份有限公司  </td>" +
							 				"</tr>" +
							 				"<tr row='4'>" +
							 					"<td col='0' colspan='2' rowspan='1'> 授权于：博科资讯 &ensp; 过期时间：2017-06-01  </td>" +
							 				"</tr>" +
							 				"<tr row='5'>" +
								 				"<td col='0' colspan='1' rowspan='1'> </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" +
								 					"<button class='ok'><span class='txt'>确定</span></button>" +
								 				"</td>" +
							 				"</tr>" +
						 				"</tbody>" +
					 				"</table></div>";
					          
			        
					var dialogDiv = $("<div class='modifyPwd abtCo' id='modifyPwd'></div>");
				    
				    dialogDiv.modalDialog(null, {title: "关于Yigo", showClose: false, width: "260px", height: "180px"});
				    dialogDiv.dialogContent().html(html_about);
				    
				    $(".ok", dialogDiv).click(function() {
				    	dialogDiv.close();
				    });
				};
			    $(".about", nav).click(function(e) {
			    	about();
			    })
		    };
			
			buildApp();
			install();

		}
	});	
})();*/
(function () {
	$.fn.extend({
		navigation: function() {
			var nav = this.get(0);

		    $(".login_username", nav).html($.cookie("userName"));

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

		    var buildApp = function() {
			    var url = window.location.href;
			    var appResult = Svr.SvrMgr.getAppList();
				var status = appResult.status;
				window.setStatus(status);
			    var paras;
			    var appKey;
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
			    } else {
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
		    };

		    var install = function() {
				$('.userBox span').click(function () {
			        $(".userImgbox").slideDown()
			    })
			    $('.userBox').mouseleave(function () {
			        $(".userImgbox").slideUp()
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

			    $(".logout", nav).click(function(e) {
			    	Svr.SvrMgr.doLogout().done(function() {
					    $.cookie("clientID", null);
					    $.cookie("oldURL",null);
					    window.location.reload();
				    });
			    })
			    $(".exit", nav).click(function(e) {
			    	Svr.SvrMgr.doLogout().done(function() {
				    	$.cookie("clientID", null);
		 			    $.cookie("oldURL",null);
					    window.location.replace("about:blank");
				    });
			    })
			    $(".modifyPwd", nav).click(function(e) {

			    	var formKey = "ChangePassWord";
			        var builder = new YIUI.YIUIBuilder(formKey);
			        builder.setTarget(YIUI.FormTarget.MODAL);
			        builder.newEmpty().then(function(emptyForm){			     
			            builder.builder(emptyForm);
			        });
			    })

				var about = function() {
					var params = {service: "GetSystemInfo"};
				    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);

				 	var html_about = "<div class='sys-about'><table>" +
										"<tbody>" +
							 				"<tr row='1'>" +
								 				"<td col='0' colspan='1' rowspan='1'> 版本：&nbsp; </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" + result.Ver + "</td>" +
							 				"</tr>" +
							 				"<tr row='2'>" +
								 				"<td col='0' colspan='1' rowspan='1'> 创建号：&nbsp; </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" + result.BuildID + "</td>" +
							 				"</tr>" +
							 				"<tr row='3'>" +
							 					"<td col='0' colspan='2' rowspan='1'> 上海博科资讯股份有限公司  </td>" +
							 				"</tr>" +
							 				"<tr row='4'>" +
							 					"<td col='0' colspan='2' rowspan='1'> 授权于：博科资讯 &ensp; 过期时间：2017-06-01  </td>" +
							 				"</tr>" +
							 				"<tr row='5'>" +
								 				"<td col='0' colspan='1' rowspan='1'> </td>" +
								 				"<td col='1' colspan='1' rowspan='1'>" +
								 					"<button class='ok'><span class='txt'>确定</span></button>" +
								 				"</td>" +
							 				"</tr>" +
						 				"</tbody>" +
					 				"</table></div>";
					          
			        
					var dialogDiv = $("<div class='modifyPwd abtCo' id='modifyPwd'></div>");
				    
				    dialogDiv.modalDialog(null, {title: "关于Yigo", showClose: false, width: "260px", height: "180px"});
				    dialogDiv.dialogContent().html(html_about);
				    
				    $(".ok", dialogDiv).click(function() {
				    	dialogDiv.close();
				    });
				};
			    $(".about", nav).click(function(e) {
			    	about();
			    })
		    };
			
			buildApp();
			install();

		}
	});	
})();