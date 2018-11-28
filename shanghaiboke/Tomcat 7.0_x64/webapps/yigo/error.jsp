<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type='text/javascript' src='common/jquery/jquery-1.10.2.js'></script>
<script type='text/javascript' src='yesui/ui/plugin/js/jquery.cookie.js'></script>
<link rel="stylesheet" href="yesui/ui/res/css/error.css">
<title>出错啦！！</title>
<script type="text/javascript">
$(function(){
	var url = $.cookie("loginURL");
	$(".inner a").html("继续前往"+url);
	$(".inner a").on("click",function(){
		$.cookie("isTrue",true,{expires:10});
		location.href = url
	});
})
</script>

</head>
<body>
	<div class="outer">
		
		<div class="inner">
			<div class = "img"></div>
			<h2>您的浏览器版本过低</h2>
			<p>yigo平台支持的最低浏览器标准为IE8，为了您有更舒心的操作体验，请使用高版本浏览器。</p>
			<a></a>
		</div>
	</div>

</body>
</html>