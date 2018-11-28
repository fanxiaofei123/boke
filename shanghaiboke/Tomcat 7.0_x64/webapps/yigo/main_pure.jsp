<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>工作台</title>
		
		<script type="text/javascript" src="yesui/v2/yesui/ui/allfile.js?v=20180730"></script>
		
		<script type="text/javascript" src="home/menutree.js" defer="defer"></script>
		<script type="text/javascript" src="home/navigation.js" defer="defer"></script>
		<script type="text/javascript" src="home/main.js" defer="defer"></script>
	</head>
	<body>
		<div class="nav"></div>
		<!-- 主体 -->
		<div class="main">
			<div class="mainLeft"></div>
		    <div class="mainMiddle"></div>
		    <div id="form" class="mainRight"></div>
		</div>

		<script type="text/javascript">
			$(function () {
				var nav = $(".nav").navigation();
				var container = new YIUIContainer($("#form"));
				var tree = $(".mainLeft").menuTree(container);

				var place_w = parseInt($("#form").css("padding-left")) + parseInt($("#form").css("padding-right")) + parseInt($("#form").css("margin-left")) + parseInt($("#form").css("margin-right"));
			    var resize = function() {
				    var place_h = parseInt($("#form").css("padding-top")) + parseInt($("#form").css("padding-bottom")) + parseInt($("#form").css("margin-top")) + parseInt($("#form").css("margin-bottom"));
				    $(".mainRight").width($(document.body).width() - $(".mainLeft").outerWidth() - $(".mainMiddle").outerWidth() - place_w);
				    $(".mainLeft,.mainMiddle,.main").height($(document.body).height() - $('.nav').height());
				    $(".mainRight").height($(document.body).height() - $('.nav').height() - place_h);
	    			tree.resetHeight();
	    			nav.resize();
			    };
			    resize();
			    
			    setTimeout(function() {
			    	nav.resize();
			    }, 0);

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
				// 关闭注销session,同步注销,否则请求可能发不出去
				$(window).on('beforeunload',function(e){
					var n = window.event.screenX - window.screenLeft;
					var b = n > document.documentElement.scrollWidth - 20;
					if(b && window.event.clientY < 0 || window.event.altKey) {
						var paras = {
								async:false
							};
						Svr.SvrMgr.doLogout(paras,function(){
							$.cookie("clientID", null);
							$.cookie("oldURL",null);
						});
					}
				});
			});
		</script>
	</body>
</html>
