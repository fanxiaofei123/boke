<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%
	String formID2 = request.getParameter("formID");
%>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>Form测试</title>
		
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	    <meta http-equiv="Content-Type" content="application/x-javascript;charset=UTF-8">
	    <script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="common/jquery/jstz-1.0.4.min.js"></script>
		
		<script type="text/javascript">
		      
		    function openEntry () {  
	
				var option = {
					path: "Warehouse/Test/TestWebBrowser2"
				};
				//打开菜单项
				parent.openEntry(option);
		        
		    }  
		    function test () {  
		       var div = document.getElementById ("myDiv");
		       var nv=Math.random()+"";
		       $(div).attr("ddd", "false");

		       div.innerHTML = "false......";
		       
		       console.log("clientID === " + $.cookie("clientID"));
		    }  
	  </script> 
	  
	</head>
	
	<body onload="AddListeners();"> 
	  <button onclick="openEntry();">===openEntry===</button> 
	  <button onclick="test();">===remove false===</button> 
	  <div id="myDiv" class="Old Attribute" style="height: 400px;"> 
	    231111111111 
	    
	  </div> 
	</body> 
</html>
