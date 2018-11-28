<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>百度地图</title>

		<link rel="stylesheet" href="yesui/ui/plugin/css/map/css/baidumap.css" />
		
		<script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="common/util/typeconvertor.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/baidumap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/gaodemap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/maputils.js"></script>

		<style type="text/css">
			body, html, .bd_map {
				width: 100%;
				height: 100%;
				overflow: hidden;
				margin:0;
				font-family:"微软雅黑";
				font-size: 12px;
			}
			
		</style>
	</head>
	<body>
		<div id="bd_map" class="bd_map">
		</div>
		
		<script type="text/javascript">
	        var paras = {};	
	        var map, form, control, app;
			function initialize() {
				$.getScript("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js", function() {
						var options = $.extend({
							id: "bd_map"
						}, paras);
						map = new BDMap(options);

						if(parent && parent.YIUI) {
							form = parent.YIUI.FormStack.getForm(paras.formID);
							control = form.getComponent(paras.ctlKey);
							setEnable(control.isEnable());
							 
				            if(form.postShow) {
				            	form.eval(form.postShow, {form: form});
				            }

				            /* 
				            var opts = {};
				            opts.service = "PureMap";
				            opts.cmd = "GetMapInfo";
				            opts.oid = paras.oid;
				            opts.tableKey = paras.tableKey;
				            opts.columnKey = paras.columnKey;
				            var info = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, opts);
				            showMapInfo(info); */
						}
						app && app.initialize();
					});
			}

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

			  	var url = "http://api.map.baidu.com/api?v=2.0&callback=initialize&ak=" + paras.ak;
		        $.getScript(url);

			}
			window.onload = loadScript;
		
			/** 绘制标记点 */
			function drawMarker(marker) {
				map.drawMarker(marker)
			}
			
			/** 绘制折线 */
			function drawPolyline(polyline) {
				map.drawPolyline(polyline);
			}

			/** 绘制多边形 */
			function drawPolygon(polygon) {
				map.drawPolygon(polygon);
			}

			function clearMap() {
				map.clear();
			}

			function getMapInfo() {
				var mapInfo = map.getMapInfo();
				return mapInfo;
			}

			function showMapInfo(mapInfo) {
				map.showMapInfo(mapInfo);
			}

			function setEnable(enable) {
				map.setEnable(enable);
			}

			function setDriveRoute(start, end, waypoints, path) {
				map.setDriveRoute(start, end, waypoints, path);
			}
		</script> 
	</body>
</html>
