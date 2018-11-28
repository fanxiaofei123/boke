<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	    <meta http-equiv="Content-Type" content="application/x-javascript;charset=UTF-8">
	    <title>工作台</title>
	   	<script>
	   		//document.cookie = "myStyle=blue; " + document.cookie;
	   	</script>
		<script type="text/javascript" src="yesui/v2/yesui/ui/loginfile.js"></script>
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
				//设置是否显示组织机构
	        	var hasSession = true;
				//组织机构值保存字段
	        	var paraKey = "OrgID";
	        	
				var input = $("input");
				$(".login-username").focus();
				var doEnter = function($this) {
					var oldVal = $this.attr("oldVal");
					if(oldVal == $this.val()) {
						return;
					} else {
						$this.attr("oldVal", $this.val());
					}
		        	var vw = $(".login_sel_vw"), $ul = $("ul.login-combox-list", vw).empty();
					var data = {
			            service: "LoadSessionParaItems",
			            user: $(".login-username").val()
			        };
			        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
			        if(!result || $.isEmptyObject(result)) return;
			        var items = result.items;
			        var len = items.length, $ul;
			        if(len > 0) {
			        	var $f_li = null;
			        	for(var i = 0; i < len; i++) {
			        		var item = items[i];
			        		var $li = $("<li class='login-combox-item'></li>");
			        		if(i == 0) {
			        			$f_li = $li;
			        		}
			        		$li.attr("value", item.value).html(item.caption);
			        		$ul.append($li);
			        	}
			        	$f_li.click();
			        }
				};
				input.keyup(function(e) {
					var keyCode = e.keyCode;
					if(keyCode == 13) {
						if($(this).hasClass("login-username")) {
							//doEnter($(this));
							$(this).blur();
						}
						$(".login-button").click();
					}
				});
				$(".login-button").click(function() {
					var username = $(".login-username").val(),
						password = $(".login-password").val();
					var paras = {};
					paras[paraKey] = $(".login_paras .login-combox-value").attr("value");

					var locale = $(".locale_paras .locale-combox-value").attr("value");
					if( locale ) {
						$.cookie("locale",locale);
					}

					Svr.SvrMgr.doLogin(username, password, paras);
				}); 
				if(hasSession) {
					$(".login-username").blur(function() {
						doEnter($(this));
					});
					$(".login_paras .dropDown-button").click(function(e) {
						var vw = $(".login_sel_vw");
						var $div = $(this).parents(".login_paras");
						var left = $div.offset().left;
						var top = $(".login_org").offset().top + $(".login_org").height();
						vw.css({
							"top": top + "px",
							"left": left + "px"
						});
						vw.outerWidth($div.outerWidth());
						vw.show();
			            $(document).on("mousedown", function (e) {
			                var target = $(e.target);
			                if (target.closest($(".login_sel_vw")).length == 0) {
			                	$(".login_sel_vw").hide();
						    	$(document).off("mousedown");
			                }
			            });
					});
					$(".locale_paras .dropDown-locale").click(function(){
						var $div = $(this).parents(".locale_paras"),
							left = $div.offset().left,
							top = $(".login_locale").offset().top + $(".login_locale").height();
						var vw = $(".login_locale_vw"),
							$ul = $("ul.locale-combox-list", vw);
			            vw.css({
							"top":top + "px",
							"left":left + "px"
						});
						if( $("li",$ul).length == 0 ) {
							var $li = $("<li class='login-combox-item'></li>");
							$li.attr("value", "zh-CN").html("中文");
							$ul.append($li);

							$li = $("<li class='login-combox-item'></li>");
							$li.attr("value", "en-US").html("英文");
							$ul.append($li);

							$li = $("<li class='login-combox-item'></li>");
							$li.attr("value", "ja-JP").html("日文");
							$ul.append($li);
						}
						vw.width($div.outerWidth());
						vw.show();
						$(document).on("mousedown", function (e) {
							var target = $(e.target);
							if (target.closest($(".login_locale_vw")).length == 0) {
								$(".login_locale_vw").hide();
								$(document).off("mousedown");
							}
						});
					});
					$(".login_sel_vw").delegate("li", "click", function(e) {
						$(".login_sel_vw .sel").removeClass("sel");
						$(this).addClass("sel");
						$(".login_paras .login-combox-value").html($(this).html());
						$(".login_paras .login-combox-value").attr("value", $(this).attr("value"));
	                	$(".login_sel_vw").hide();
					});
					$(".login_locale_vw").delegate("li", "click", function(e) {
						$(".login_locale_vw .sel").removeClass("sel");
						$(this).addClass("sel");
						$(".locale_paras .locale-combox-value").html($(this).html());
						$(".locale_paras .locale-combox-value").attr("value", $(this).attr("value"));
						$(".login_locale_vw").hide();
					});
				} else {
					$(".login_org").remove();
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

    	<div class="header">
    		<div class="warpper">
				<img class="login-logo" src="yesui/v2/yesui/ui/res/css/default/images/logo.png"><!-- 
			 --><span class="login-logo-text">让世界上没有难做的系统</span>
    		</div>	
    	</div>
    	<div class="login-main">
			<div class="warpper">
				<img class="login_img" src="yesui/v2/yesui/ui/res/css/default/images/login_img.png"><!-- 
				
				 --><div class="login-loginbox">
					<p class="login-title">用户登录</p>
					<p class="login-strip"><span>用<i class="half-word"></i>户<i class="half-word"></i>名</span><input type="text" class="login-username" value=""></p> 
		            <div class="login-strip login-password-rows">
		            	<span>密<i class="two-word"></i>码</span><!-- 
		             --><input type="password" class="login-password" value="">
		             	<em class="login-password-btn login-password-btn-close"></em>
		            </div>
					<div class="login_org login-combox" >
						<span class="login-combox-name">组织机构</span>
						<div class="login_paras login-combox-content">
							<p>
								<span class="login-combox-value">请选择</span>
								<span class="dropDown-button"></span>
							</p>
						</div>
			        </div>
					<div class="login_locale login-combox" >
						<span class="login-combox-name">语言</span>
						<div class="locale_paras locale-combox-content">
							<p>
								<span class="locale-combox-value">请选择</span>
								<span class="dropDown-locale"></span>
							</p>
						</div>
					</div>

					<div class="login-button" type="button" value="登录">登&emsp;录</div>
				</div>

			</div>
    	</div>
		
		<div class='login_sel_vw'>
	   		<ul class="login-combox-list">
	   		</ul>
	   	</div>

		<div class='login_locale_vw'>
			<ul class="locale-combox-list">
			</ul>
		</div>

	</body>
</html>
