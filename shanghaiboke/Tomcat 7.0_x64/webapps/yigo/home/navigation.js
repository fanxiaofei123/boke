(function () {
	$.fn.extend({
		navigation: function() {
			var nav = this.get(0);
			/*var html = "<div class='blend'></div>" +
						"<div class='nav-left'>" +
							"<div class='nav-left-icon'></div>" +
						"</div>" +
						"<span class='logo-text'>Yigo应用</span>" +
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
						"</div>";*/

	//***********************************************************					

			var html = '<div class="nav-left">' + 
							'<div class="app-box-btn"></div>'+
					    '</div>' +
					    '<div class="logo"></div>' + 
					    "<span class='logo-text'>"+YIUI.I18N.navigation.application+"</span>" +
					    '<div class="navRight">' + 
					    	'<div class="nav-field-box user">' + 
								'<div class="nav-field-btn"></div>' +
								'<div class="nav-field-content">' +
									'<div class="arrow-top"></div>' +
									'<ul class="nav-field-list">' +
										'<li class="nav-field-items"><a class="logout">'+YIUI.I18N.userinfopane.appLogout+'</a>	</li>' + 
										'<li class="nav-field-items"><a class="exit">'+YIUI.I18N.userinfopane.appExit+'</a></li>' + 
										'<li class="nav-field-items"><a class="modifyPwd">'+YIUI.I18N.userinfopane.appChangePWD+'</a></li>' +
									'</ul>' +
								'</div>' +
					    	'</div>' +
					    	'<div class="nav-field-box setting">' +
								'<div class="nav-field-btn"></div>' + 
								'<div class="nav-field-content">' +
									'<div class="arrow-top"></div>' +
									'<ul class="nav-field-list">' +
										'<li class="nav-field-items">' + 
											'<a class="about">'+YIUI.I18N.navigation.aboutSys+'</a>' +
										'</li>' +
									'</ul>' +
								'</div>' +
					    	'</div>' + 
					    	"<label class='org_lbl' ></label>" +
							"<span class='login_username'>"+YIUI.I18N.navigation.userName+"</span>" +
					    '</div>';

			nav.innerHTML = html;

		    $(".login_username", nav).html($.cookie("userName"));

//			window.setStatus = function(status) {
//				if(status) {
//					var org_lbl = $(".navRight label.org_lbl");
//					var html_text = "";
//					for(var i = 0, len = status.length; i < len; i++) {
//						var statu = status[i];
//						html_text += "<p>" + statu.text + "</p>";
//					}
//					org_lbl.html(html_text);
//					window.org_status = status;
//				}
//			};

//			window.updateStatusInfo = function(key, text) {
//				var status = window.org_status;
//				if(status) {
//					var org_lbl = $(".navRight label.org_lbl");
//					var lbl_text = "";
//					for(var i = 0, len = status.length; i < len; i++) {
//						var s = status[i];
//						if(key == s.key) {
//							lbl_text += " " + text;
//						} else {
//							lbl_text += " " + s.text;
//						}
//					}
//					org_lbl.html(lbl_text);
//				}
//			};
//			window.refreshStatusInfo = function(key) {
//				var status = window.org_status;
//				if(status) {
//					var org_lbl = $(".navRight label.org_lbl");
//					var lbl_text = "";
//					for(var i = 0, len = status.length; i < len; i++) {
//						var s = status[i];
//						lbl_text += " " + s.text;
//					}
//					org_lbl.html(lbl_text);
//				}
//			};

		    var buildApp = function() {
			    var url = window.location.href;
			    
			    YIUI.MetaService.getAppList().then(function(serverList) {
				    var paras;
//				    var appKey;
//				    if (url.indexOf("appkey=") != -1) {
//				   		var index =  url.lastIndexOf("appkey=")+7;
//				    	var indexEnd = url.indexOf("&",index);
//				    	if (indexEnd == -1) {
//				    		indexEnd = url.length;
//				    	}
//				    	appKey = url.substring(index,indexEnd);
//				    	paras = {
//			    			appKey:appKey
//				    	};
//				    } else {
//				    	appKey = serverList.defaltKey;
//				    }
					var serverList = serverList.servers;
					
					//加载appItems
					var defalutURl = $.cookie("oldURL");
					if (serverList) {
						for (var i = 0; i < serverList.length; i++) {
							var _li = $("<li></li>");
							var _a = $("<a></a>");
							_a.html(serverList[i].caption || "test");
							_a.attr("id",serverList[i].key);
//							if (serverList[i].key == appKey) {
//								_li.addClass("infoitem");
//							}
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
			    });
			    
			    YIUI.MetaService.getClientAppStatusInfo().then(function(status) {
			    	YIUI.AppDef.setStatus(status);
			    });
			    
		    };

		    var install = function() {
				$('.nav-field-btn').click(function () {
			        $(this).next().slideDown();
			    })
			    $('.nav-field-box').mouseleave(function () {
			         $(this).find(".nav-field-content").slideUp()
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
				    Svr.Request.getData({service: "GetSystemInfo"}).then(function(result) {
					 	var html_about = "<div class='sys-about'><table>" +
											"<tbody>" +
								 				"<tr row='1'>" +
									 				"<td col='0' colspan='1' rowspan='1'>"+ YIUI.I18N.navigation.appVer+"&nbsp; </td>" +
									 				"<td col='1' colspan='1' rowspan='1'>" + result.Ver + "</td>" +
								 				"</tr>" +
								 				"<tr row='2'>" +
									 				"<td col='0' colspan='1' rowspan='1'> "+ YIUI.I18N.navigation.appBuildID+"&nbsp; </td>" +
									 				"<td col='1' colspan='1' rowspan='1'>" + result.BuildID + "</td>" +
								 				"</tr>" +
								 				"<tr row='3'>" +
								 					"<td col='0' colspan='2' rowspan='1'> "+ YIUI.I18N.navigation.appCopyRights+" </td>" +
								 				"</tr>" +
								 				"<tr row='4'>" +
								 					"<td col='0' colspan='2' rowspan='1'></td>" +
								 				"</tr>" +
								 				"<tr row='5'>" +
									 				"<td col='0' colspan='1' rowspan='1'> </td>" +
									 				"<td col='1' colspan='1' rowspan='1'>" +
									 					"<button class='ok'><span class='txt'>"+ YIUI.I18N.button.ok+"</span></button>" +
									 				"</td>" +
								 				"</tr>" +
							 				"</tbody>" +
						 				"</table></div>";
						          
//					 	 授权于：博科资讯 &ensp; 过期时间：2017-06-01  
						var dialogDiv = $("<div class='modifyPwd abtCo' id='modifyPwd'></div>");
					    dialogDiv.modalDialog(null, {title: YIUI.I18N.navigation.appAbout, showClose: false, width: "260px", height: "180px"});
					    dialogDiv.dialogContent().html(html_about);
					    $(".ok", dialogDiv).click(function() {
					    	dialogDiv.close();
					    });
					    Svr.Request.getData({service: "SystemInfo", cmd: "GetLicenseInfo"}).then(function(result) {
					    	$("div.sys-about tr[row='4'] td").html(result.licenseTo);
					    });
				    });
				};
			    $(".about", nav).click(function(e) {
			    	about();
			    })
		    };
			
			buildApp();
			install();

			var rt = {
					resize: function() {
						var width = $(nav).width();
						var w = $(".nav-left", nav).outerWidth() + $(".logo", nav).outerWidth() + $(".logo-text", nav).outerWidth() 
								+ $(".nav-field-box", nav).outerWidth() + $(".nav-field-box.user", nav).outerWidth() 
								+ $(".nav-field-box.user", nav).outerWidth() + $(".login_username.setting", nav).outerWidth() + 30;
						$(".org_lbl", nav).css("max-width", (width - w));
					}
			};
			return rt;
		}
	});	
})();