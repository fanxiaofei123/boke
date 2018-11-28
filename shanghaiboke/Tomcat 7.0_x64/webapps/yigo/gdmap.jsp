<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>高德地图</title>
		
		<script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/map/baidumap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/gaodemap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/maputils.js"></script>
		
		<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/><!-- 
		<script src="http://webapi.amap.com/maps?v=1.3&key=ygTSWdgQ4H7ycNYxtTr3Ej5Ym5k8fqSn"></script> -->
		<script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>
		
		<script type="text/javascript">
	        var paras = {};	
			function initialize() {
				var options = $.extend({
					id: "bd_map"
				}, paras);
				map = new GDMap(options);
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

			  	var url = "http://webapi.amap.com/maps?v=1.3&callback=initialize&key=" + paras.key;
				loadJs(url,function(){
					// loadJs("http://cache.amap.com/lbs/static/addToolbar.js");
				}); 

			}
			  
			window.onload = loadScript;

			function loadJs(url,callback){  
			    var script = document.createElement('script');  
			    script.type = 'text/javascript';  
			    script.src = url;   
			    document.body.appendChild(script);  
			    script.onload = script.onreadystatechange = function(){  
			        // alert(script.readyState);  
			        if(script.readyState  && script.readyState != 'loaded' && script.readyState != 'complete') return ;  
			        script.onreadystatechange = script.onload = null  
			        if(callback) callback();  
			    }  
			      
			      
			}  
			
			function setMapDisplay(points, type) {
				points = window.eval(points);
				map.setMapDisplay(points, 2);
			}

			function drawMarker(marker) {
				map.drawMarker(marker);
			}
			
			function drawPolyline(polyLine) {
				map.drawPolyline(polyLine);
			}

			function drawPolygon(polygon) {
				map.drawPolygon(polygon);
			}

			function startDrawPolygon() {
				map.startDraw();
			}

			function setOverlays(overlays) {
				map.setOverlays(overlays);
			}
			function getOverlays()  {
				map.getOverlays() ;
			}

			function editPolygon() {
				map.editPolygon();
			}

			function disablePolygon() {
				map.disablePolygon();
			}

			function getPath() {
				var points = map.getDrawPoints();
				$("#path").val(points);
			}

			function clearMap() {
				map.clear();
			}

			function getMapInfo() {
				var mapInfo = map.getMapInfo();
				$("#area").val(mapInfo);
				return mapInfo;
			}

			function showMapInfo(mapInfo) {
				var info = {"overlays":[{"id":"","type":"marker","position":"116.403545,39.797574"},{"path":"116.369505,39.876029;116.277519,39.807776;116.303965,39.756319;116.438495,39.745668;116.512084,39.764306","type":"polyline"},{"path":"116.441493,39.879383;116.375575,39.705805;116.56509,39.722707","type":"polygon"}],"center":"116.394801,39.810848","zoom":11}
				map.showMapInfo(info);
			}

			function showTool() {
				map.showDrawTool();
			} 
			function closeTool() {
				map.closeDrawTool();
			}

			function setEnable(enable) {
				map.setEnable(enable);
			}

		</script> 
		<style type="text/css">
			.BMapLib_box.BMapLib_circle, .BMapLib_box.BMapLib_rectangle {
				display: none;
			}
			.BMap_noprint.search_box .search_txt {
				height: 40px;
				line-height: 40px;
				width: 200px;
				display: inline;
				/*position: relative;*/
				padding: 0;
			    margin: 0;
			    border: none;
		        outline: 0;
		        padding-left: 10px;
			    /*margin-left: 50px;*/
			    float: left;
			}
			.BMap_noprint.search_box .search_btn {
				height: 40px;
				width: 57px;
				display: inline;
				/*position: absolute;*/
			    border: none;
			    background: url('http://webmap0.map.bdstatic.com/wolfman/static/common/images/new/searchbox_f175577.png') no-repeat 0 -75px #3385ff;
			    /*margin-left: 5px;*/
			    float: left;
			}
			.BMap_noprint.search_box {
				cursor: pointer;
				border: none;
			    height: 40px;
			}
			.BMapLib_Drawing .BMapLib_Drawing_panel {
				border: none;
			}
		</style>
	</head>
	<body>
		<div id="bd_map" style="height: 500px; width: 600px;">
		    
		</div>
		<button onclick="setMapDisplay()">显示地图区域</button>
		<button onclick="startDrawPolygon()">开始绘制</button>
		<button onclick="editPolygon()">编辑</button>
		<button onclick="disablePolygon()">结束绘制</button>
		<button onclick="getPath()">获取边界集合</button>
		<button onclick="clearMap()">清除地图</button>
		<button onclick="showTool()">显示工具栏</button>
		<button onclick="closeTool()">隐藏工具栏</button>
		<br/>
		<br/>
		<input type="text" id="path"></input>

		<br/>
		<br/>

		<button onclick="drawMarker('116.403545,39.797574')">显示单个标记点</button>

		<button onclick="drawMarker('116.369505,39.876029;116.277519,39.807776;116.303965,39.756319;116.438495,39.745668;116.512084,39.764306')">显示标记点</button>
		
		<button onclick="drawPolyline('116.369505,39.876029;116.277519,39.807776;116.303965,39.756319;116.438495,39.745668;116.512084,39.764306')">显示折线</button>
		<button onclick="drawPolygon('116.369505,39.876029;116.277519,39.807776;116.303965,39.756319;116.438495,39.745668;116.512084,39.764306')">显示多边形</button>

		<br/>
		<br/>

			<button onclick="getMapInfo()">获取MapInfo</button>
			<button onclick="showMapInfo()">显示MapInfo</button>
			<button onclick="setEnable(true)">Enbale----True</button>
			<button onclick="setEnable(false)">Enbale----False</button>
		<br/>
		<br/>

		<textarea id="area" style="height: 100px; width: 1000px;">
			
		</textarea>
	</body>
	
	<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
</html>
