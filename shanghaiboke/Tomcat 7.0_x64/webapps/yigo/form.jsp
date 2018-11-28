<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>Form测试</title>

		<script type="text/javascript" src="yesui/v2/yesui/ui/allfile.js"></script>

		<!-- 
		<script type="text/javascript" src="home/menutree.js" defer="defer"></script>
		<script type="text/javascript" src="home/navigation.js" defer="defer"></script>
		<script type="text/javascript" src="home/main.js" defer="defer"></script>     

		 -->


		<script type="text/javascript" src="ext/formRender.js" defer="defer"></script>       
		
		<script type="text/javascript">
	        var paras = {};
			function loadScript() {
		        var str = window.location.search.substr(1);
		        if(str) {
		        	var args = str.split("&");
		        	for (var i = 0, len = args.length; i < len; i++) {
						var str = args[i];
						var arg = str.split("=");
						var key = arg[0];
						var val = arg[1];
						paras[key] = val;
					}
		        }
			}

			loadScript();

			window.onLoad = document.onreadystatechange = function() {
				if(!document.readyState || document.readyState == "loaded" || document.readyState == "complete") {
				    var fr = new YIUI.FormRender(paras);
				    var ct = $("#i_content");
				    fr.render(ct);
				}
			}

	        window.onerror = function(msg) {
				YIUI.LoadingUtil.hide();
	            msg = msg.replace("Uncaught Error:", "");
	            var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: YIUI.I18N.title.error, showClose: true, type: "error", height: 170, width: 460});
	        };

	        // window.openEntry = function(node) {
	        //     YIUI.EventHandler.doTreeClick(node, YIUI.MainContainer);
	        // };
	        
	        // window.exec = function(formID, formula) {
	        //     var form = YIUI.FormStack.getForm(formID);
	        //     var result = form.eval(formula, {form: form});
	        //     return result;
	        // };

			window.history.forward(-1);
		</script>

		<!-- 
		<script language="javascript" for="window" event="onload" defer >
	       
			if(document.readyState == "complete") {
				console.log("complete...");
			} 


		</script> -->
		
	</head>
	<body>
		<div id="i_content" class="content" style="height: 100%; width: 100%;">
		    
		</div>
		
	</body>
</html>
