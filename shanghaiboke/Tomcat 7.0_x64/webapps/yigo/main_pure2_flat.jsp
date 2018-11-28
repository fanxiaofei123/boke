<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>工作台</title>
		<script type="text/javascript" src="yesui/v2/yesui/ui/allfile.js"></script>
		
	</head>
	<body>
		<div class="nav">
			<!-- <div class="blend"></div>
					    <div class="app-box">
				<div class="app-box-btn"></div>
				<ul class="app-list">
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
					<li class="app-items"><a></a></li>
				</ul>
					    </div>
					
					    <div class="logo"></div>
					    <div class="navRight">
					    	<div class="nav-field-box user">
					<div class="nav-field-btn"></div>
					<div class="nav-field-content">
						<div class="arrow-top"></div>
						<ul class="nav-field-list">
							<li class="nav-field-items">
								<a class="logout">注销</a>
							</li>
							<li class="nav-field-items">
								<a class="exit">退出</a>
							</li>
							<li class="nav-field-items">
								<a class='modifyPwd'>修改密码</a>
							</li>
						</ul>
					</div>
					    	</div>
					    	<div class="nav-field-box setting">
					<div class="nav-field-btn"></div>
					<div class="nav-field-content">
						<div class="arrow-top"></div>
						<ul class="nav-field-list">
							<li class="nav-field-items">
								<a class="about">系统信息</a>
							</li>
						</ul>
					</div>
					    	</div>
					    </div>	 -->
		</div>
		<!-- 主体 -->
		<div class="main">
			<div class="mainLeft"></div>
		    <div class="mainMiddle"></div>
		    <div id="form" class="mainRight"></div>
		</div>

		<script type="text/javascript">
			$(function () {
				$(".nav").navigation();
				var container = new YIUIContainer($("#form"));
				var tree = $(".mainLeft").menuTree(container);

				var place_w = parseInt($("#form").css("padding-left")) + parseInt($("#form").css("padding-right")) + parseInt($("#form").css("margin-left")) + parseInt($("#form").css("margin-right"));
			    var resize = function() {
				    var place_h = parseInt($("#form").css("padding-top")) + parseInt($("#form").css("padding-bottom")) + parseInt($("#form").css("margin-top")) + parseInt($("#form").css("margin-bottom"));
				    $(".mainRight").width($(document.body).width() - $(".mainLeft").outerWidth() - $(".mainMiddle").outerWidth() - place_w);
				    $(".mainLeft,.mainMiddle,.main").height($(document.body).height() - $('.nav').height());
				    $(".mainRight").height($(document.body).height() - $('.nav').height() - place_h);
	    			tree.resetHeight();
			    };
			    resize();

			    //移动条
			    var bool = false;
			    $('.mainMiddle').mousedown(function (event) {
			        bool = true;
			    });
			    $('body').mouseup(function () {
			        bool = false;
			    });
			    $(".main").mousemove(function (event) {
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
			            container.doLayout($(".mainRight").width(), $(".mainRight").height());
			        }
			    });
			    $(window).resize(function () {
			        resize();
			        container.doLayout($(".mainRight").width(), $(".mainRight").height());
			    });
			    //nav功能按钮显示隐藏
				/*showDideItems(".app-box-btn",".app-list");
				showDideItems(".nav-field-btn",".nav-field-content");
				function showDideItems(btnClass,domClass){
					$(btnClass).click(function(){
						$(this).next(domClass).slideDown();
					})
					$(domClass).parent().mouseleave(function(){
						$(this).find(domClass).slideUp();
					})
				}*/
				
				
			    //nav功能按钮显示隐藏end
			});
		</script>
	</body>
</html>
