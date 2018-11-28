	<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	    <meta http-equiv="Content-Type" content="application/x-javascript;charset=UTF-8">
	    <title>工作台</title>
	   	<script>
	   		//document.cookie = "myStyle=blue; " + document.cookie;
	   	</script>
		<script type="text/javascript" src="yesui/v2/yesui/ui/loginfile.js?v=20180823"></script>
		<script>
			window.onerror = function(msg) {
				msg = msg.replace("Uncaught Error: ", "");
				var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 170, width: 460});
			};
			$(document).ready(function(){
				var defaultVersion = 8.0;
				var ua = navigator.userAgent.toLowerCase();
				var isIE = $.browser.isIE;
				var safariVersion;
				var isTrue = $.cookie("isTrue");
				if (isTrue == null) {
					if (isIE) {
						safariVersion = ua.match(/msie ([\d.]+)/);
						if (safariVersion != null) {
							safariVersion = safariVersion[1];
							if (safariVersion < defaultVersion) {
								$.cookie("loginURL", window.location.href);
							    var location_pathname = document.location.pathname;
							    while (location_pathname.indexOf('/') == 0) location_pathname = location_pathname.substr(1);
							    var baseurl = unescape(location_pathname.substr(0));
							    var service = baseurl.substring(0, baseurl.indexOf('/'));
								var url = [window.location.protocol, '//', window.location.host, '/', service].join('');
								window.location.href = url + "/error.jsp";
							}
						}
					}
				}
			});
		
	        $(function(){

				<!-- 使用window.navigator.language拿到浏览器当前的语种,用来国际化登陆界面-->

				var body = '<div class="header">' +
								'<div class="warpper">' +
									'<img class="login-logo" src="yesui/v2/yesui/ui/res/css/default/images/logo.png">'+
									'<span class="login-logo-text">'+ YIUI.I18N.login.title +'</span>'+
								'</div>'+
							'</div>'+
							'<div class="login-main">'+
								'<div class="warpper">'+
									'<img class="login_img" src="yesui/v2/yesui/ui/res/css/default/images/login_img.png">'+
									'<div class="login-loginbox">'+
									'<p class="login-title">'+ YIUI.I18N.login.userlogin +'</p>'+
									'<p class="login-strip">'+
										'<span class="login-combox-name">'+ YIUI.I18N.login.username +'</span>'+
										'<input type="text" class="login-username" value="">'+
									'</p>'+
									'<div class="login-strip login-password-rows">'+
										'<span class="login-combox-name">'+ YIUI.I18N.login.password +'</span>'+
										'<input type="password" class="login-password" value="">'+
										'<em class="login-password-btn login-password-btn-close"></em>'+
									'</div>'+
									'<div class="login_locale login-combox">'+
										'<span class="login-combox-name">'+ YIUI.I18N.login.language +'</span>'+
										'<div class="locale_paras locale-combox-content">'+
											'<p>'+
												'<span class="locale-combox-value">'+ YIUI.I18N.login.select +'</span>'+
												'<span class="dropDown-locale"></span>'+
											'</p>'+
										'</div>'+
										'<div class="login_locale_vw">'+
											'<ul class="locale-combox-list">'+
											'</ul>'+
										'</div>'+
									'</div>'+
									'<div class="login-button" type="button" value="">' + YIUI.I18N.login.loginbtn + '</div>'+
									'</div>'+
								'</div>'+
							'</div>';

				$(document.body).append(body);

				$(".login-username").focus();

				var addSessionItems = function($div,user,sessionParas){
					var data = {
						service: "LoadSessionParaItems",
						user: user,
						provider: $div.attr("provider"),
						paras: $.toJSON(sessionParas)
					};

					var vw = $(".login_sel_vw",$div),
						$ul = $("ul.login-combox-list", vw);

					$ul.empty();

					var $cmb = $(".login_paras .login-combox-value", $div);

					$cmb.html("").attr("value", null);

					var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
					if( !result || $.isEmptyObject(result) ) {
						return;
					}

					var item,
						$li;

					for(var i = 0; item = result.items[i]; i++) {
						$li = $("<li class='login-combox-item'></li>");
						$li.attr("value", item.value).html(item.caption);
						$ul.append($li);
					}

					vw.delegate("li", "click", function(e) {
						$(".login_sel_vw .sel",vw).removeClass("sel");
						$(this).addClass("sel");

						var caption = $(this).html(),
							value = $(this).attr("value"),
							oldVal = $cmb.attr("value");

						var fireEvent = false;
						if( value != oldVal && vw.is(":visible") ) {
							fireEvent = true;
						}

						$cmb.html(caption).attr("value", value);
						vw.hide();

						if( fireEvent ) {
							var $divs = $(".login_org"),
								index = $divs.index($div);
							$divs.each(function(i){
								if( i > index ) {
									addSessionItems($(this),$(".login-username").val(),getSessionParas());
								}
							});
						}
					});

					$(".login-combox-item",$ul).eq(0).click();
				}

				var getSessionParas = function(){
					var paras = {};
					$(".login_org").each(function(i){
						var value = $(".login_paras .login-combox-value",this).attr("value");
						if( value != null ) {
							var paraKey = $(this).attr("para-key");
							paras[paraKey] = value;
						}
					});
					return paras;
				}

				var handleUserChanged = function($this) {
					var newVal = $this.val(),
						oldVal = $this.attr("oldVal") || "";
					if( oldVal == newVal ) {
						return;
					}
					$this.attr("oldVal", newVal);

					$(".login_org").each(function(i){
						addSessionItems($(this), newVal, getSessionParas());
					});
				};

				$("input").keyup(function(e) {
					if(e.keyCode == 13) {
						$(this).blur();
						$(".login-button").click();
					}
				});

				// 登陆
				$(".login-button").click(function() {
					var username = $(".login-username").val(),
						password = $(".login-password").val();

					var locale = $(".locale_paras .locale-combox-value").attr("value");
					if( locale ) {
						$.cookie("locale",locale);
					}

					Svr.SvrMgr.doLogin(username, password, getSessionParas());
				});

				// eg:第一次登陆,使用浏览器locale
				var locale = $.cookie("locale");
				if( !locale ) {
					$.cookie("locale",window.getLang());
				}

				// 处理回话参数
				var def = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {
					service: "GetLoginDef"
				});

				var paraKey = def.sessionParaKey || "orgID",
					sessionPara = def.sessionPara || def.paras,
					provider = def.provider;

				if( def && sessionPara ) {
					$(".login-username").blur(function() {
						handleUserChanged($(this));
					});

					var addEvent = function($div) {
						$(".login_paras .dropDown-button",$div).click(function(e) {

							var vw = $(".login_sel_vw",$div);
							if( vw.is(":visible") ) {
								return vw.slideUp("fast");
							}

							var parent = $(this).parents(".login_paras");
							var left = parent.offset().left,
								top = $div.offset().top + $div.height();
							vw.css({
								"top": top + "px",
								"left": left + "px"
							});
							vw.outerWidth(parent.outerWidth());
							vw.slideDown("fast");

							$(document).off("mousedown").on("mousedown", function (e) {
								var target = $(e.target),
									paraKey = $div.attr("para-key");
								// 1.选择时或者点击同一个按钮不隐藏
								if (target.parents(".login_sel_vw").length == 0 &&
										target.parents(".login_org").attr("para-key") != paraKey) {
									vw.slideUp("fast");
								}
								$(document).off("mousedown");
							});
						});
					};

					var paraHtml = '<div class="login_org login-combox" >' +
	                                  '<span class="login-combox-name">组织机构</span>' +
									  '<div class="login_paras login-combox-content">' +
									    '<p>' +
									      '<span class="login-combox-value">' + YIUI.I18N.login.select + '</span>' +
									      '<span class="dropDown-button"></span>' +
									    '</p>' +
									  '</div>' +
									  '<div class="login_sel_vw">' +
									    '<ul class="login-combox-list">' +
									    '</ul>' +
									  '</div>' +
									'</div>';

					var $div,
						para,
						title;
		            if( def.paras ) {
						var paras = JSON.parse(def.paras),s;
						for( var i = 0;s = paras[i];i++ ){
							para = JSON.parse(s);
							$div = $(paraHtml).attr("para-key",para.paraKey).attr("provider",para.provider);
							title = para.paraTitle || '组织机构';

							$(".login-combox-name",$div).text(title);
							$(".login_locale").before($div);

							addEvent($div);
						}
					} else {
						$div = $(paraHtml).attr("para-key",paraKey).attr("provider",provider);
						title = def.paraTitle || '组织机构';

						$(".login-combox-name",$div).text(title);
						$(".login_locale").before($div);

						addEvent($div);
					}

					paraHtml = null;
				}

				if( def && def.multiLang ) {
					var $div = $(".login_locale"),
						parent = $(".locale_paras"),
						vw = $(".login_locale_vw"),
						$ul = $("ul.locale-combox-list", vw);

					if( $("li",$ul).length == 0 ) {

						var ret = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {
							service: "GetSupportLang"
						});

						if( ret && ret.items ) {
							var item,
								$li;
							for(var i = 0;item = ret.items[i];i++) {
								var $li = $("<li class='login-combox-item'></li>");
								$li.attr("value", item.value).html(item.caption);
								$ul.append($li);
							}
						}
					}

					$(".locale_paras .dropDown-locale").click(function(){

						if( vw.is(":visible") ) {
							return vw.slideUp("fast");
						}

						var left = parent.offset().left,
							top = $div.offset().top + $div.height();

						vw.css({
							"top":top + "px",
							"left":left + "px"
						});
						vw.width(parent.outerWidth());
						vw.slideDown("fast");
						$(document).off("mousedown").on("mousedown", function (e) {
							var target = $(e.target);
							if (target.closest(".login_locale_vw").length == 0 && !target.hasClass('dropDown-locale')) {
								vw.slideUp("fast");
							}
							$(document).off("mousedown");
						});
					});
					vw.delegate("li", "click", function(e) {
						$(".login_locale_vw .sel").removeClass("sel");
						$(this).addClass("sel");
						var caption = $(this).html(),
							value = $(this).attr("value");
						$(".locale_paras .locale-combox-value").html(caption).attr("value", value);
						$(".login_locale_vw").hide();
					});
					// 注销后显示上次登录语言
					var locale = $.cookie("locale");
					if( locale ) {
						$(".login-combox-item[value="+locale+"]",$ul).click();
					} else {
						$(".login-combox-item",$ul).eq(0).click();
					}
				} else {
					$(".login_locale").remove();
				}

				//密码显示
				$(".login-password-btn").on("click",function(){
					var _input =  $(".login-password"),
						_type = _input.attr("type");
					if(_type == "password"){
						_input.attr("type","text");
						$(this).addClass("login-password-btn-open")
					}else{
						_input.attr("type","password");
						$(this).removeClass("login-password-btn-open")
					}
				})	
			});
			
        </script>
	</head>
	<body>

	</body>
</html>
