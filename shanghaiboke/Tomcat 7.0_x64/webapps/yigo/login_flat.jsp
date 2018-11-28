<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	    <meta http-equiv="Content-Type" content="application/x-javascript;charset=UTF-8">
	    <title>工作台</title>
	   	<script>
	   		document.cookie = "myStyle=green;" + document.cookie;
	   	</script>
		
		<script type="text/javascript" src="yesui/v2/yesui/ui/loginfile.js"></script>
		<link rel="stylesheet" href="yesui/v2/yesui/ui/res/css/flat/core.css">
		
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
				var doEnter = function($this) {
					var oldVal = $this.attr("oldVal");
					if(oldVal == $this.val()) {
						return;
					} else {
						$this.attr("oldVal", $this.val());
					}
		        	var vw = $(".login_sel_vw"), $ul = $("ul.login-combox-list", vw)/*.empty()*/;
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
					Svr.SvrMgr.doLogin(username, password, paras);
				}); 
				if(hasSession) {
					$(".login-username").blur(function() {
						doEnter($(this));
					});
					$(".login_paras .dropDown-button").click(function(e) {
						var _paras = $(this).closest(".login_paras");
						var vw = $(".login_sel_vw");
						var $div = $(this).parents(".login_paras");
						var left = $div.offset().left;
						var top = $(".login_org").offset().top + $(".login_org").height();
						_paras.addClass("focus");
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
			                	_paras.removeClass("focus");
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
				});

				//背景轮播
				function bgPlay(){
					var $item = $('.login-items .login-item'),
					    _now = 0;
					setInterval(function(){
						_now = ++_now % 2;
						$item.fadeOut(1000);
						$item.eq(_now).fadeIn(1000);	
					},5000)
				}
				bgPlay();

				//文本输入框样式切换
				setTextInput();
				function setTextInput(){
					var $username = $('.login-username');
					$username.blur()
						.on('focus',function(){
							var $this = $(this);
							if($this.val() === "用户名") $this.val("");
							$this.removeClass("default-color");
						})
						.on("blur",function(){
							var $this = $(this);
							if($this.val() === ""){
								$this.val("用户名").addClass("default-color");
							};
							
						})
				}

				//密码输入框切换
				setPasswordInput();
				function setPasswordInput(){
					var $text = $('.login-password-text'),
						$password = $('.login-password');
					$text
						.on('focus',function(){
							$(this).hide();
							$password.css('display','block').focus();	
						})
					$password
						.on('blur',function(){
							var $this = $(this);
							if($this.val() === ""){
								$this.hide();
								$text.css('display','block').val("密码");
							}
						})						
				}
				$(".login-username").focus();

			});
			
        </script>
	</head>
	<body>
		<div class="login-main">
			<div class="login-items">
				<div class="login-item item1"></div>
				<div class="login-item item2"></div>
			</div>
			<img class="login-logo" src="yesui/v2/yesui/ui/res/css/flat/images/logo_white.png">
			<div class="login-wrap">
				<div class="login-container">
					<div class="login-loginbox">
						<div class="opcity"></div>
						<p class="login-title">登录Yigo账号</p>
						<p class="login-strip">	
							<input type="text" class="login-username default-color" value="用户名">
						</p>
						<p class="login-strip">
							<input type="text" class="login-password-text default-color" value="密码">
							<input type="password" class="login-password" value=""  autocomplete="off">
						</p>
    					<div class="login_paras login-combox-content login_org">
    						<span class="login-combox-value">数据源</span>
    						<span class="dropDown-button"></span>
    					</div>
    					<div class="login-button" type="button" value="登录">登录</div>
					</div>
				</div>
			</div>
		</div>

		<div class="login-footer">本系统由博科企业提供    Copyright © Bokesoft 1991-2016     沪ICP备05008428号    |    帮助中心    |    客服电话：400-720-3088</div>

		<div class='login_sel_vw'>
    		<ul class="login-combox-list">
    			<li>1111111111</li>
    			<li>1111111111</li>
    			<li>1111111111</li>
    		</ul>
    	</div>
	</body>
</html>
