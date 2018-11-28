/**
 * 此文件中仅包含对jQuery的扩展
 */
(function () {
	var v = '?v=20180823';
	var root = "yesui/v2/";

	var getCookie = function(key){
		var arr,reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return unescape(arr[2]);
		}
		return null;
	}
	
	window.getLang = function () {
		var local = (navigator.language || navigator.userLanguage).toLowerCase();
		var idx = local.indexOf("-");
		return local.substring(0,idx) + "-" + local.substring(idx + 1).toUpperCase();
    }

	var myStyle = getCookie("myStyle") || 'default';
	
	var local = getCookie("locale") || getLang();

    // 设置到cookie
    document.cookie = "locale=" + local;

	//IE 下兼容console
	if(/msie/.test(navigator.userAgent.toLowerCase()) || /rv:([\d.]+)\) like gecko/.test(navigator.userAgent.toLowerCase())){
		document.write("<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/fauxconsole/fauxconsole.js"+v+"'></script>");
	}

	var file = "<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/scrollbar/scrollbar.css"+v+"' />" +
				
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/login.css"+v+"' />" +
				
				"<script type='text/javascript' src='"+root+"common/jquery/jquery-1.10.2.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jstz-1.0.4.min.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/ext/jsext.js"+v+"'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/yes-ui.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/yiuiconsts.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/itemdata.js"+v+"' defer='defer'></script>" + 

				"<script type='text/javascript' src='"+root+"yesui/ui/language/i18n.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/i18N.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/plug-in.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/headinfos.js"+v+"'></script>" + 
				
				"<script type='text/javascript' src='"+root+"yesui/base/jQueryExt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/prototypeExt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/request.js"+v+"'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/svrmgr.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/format/dateformat.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/Base64Utils.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.placeholder.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.cookie.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.json-2.3.min.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/resize.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/modaldialog.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/scrollbar/jquery_scrollbar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/jsbn.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/prng4.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rng.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rsa.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/BASE_64.js"+v+"' defer='defer'></script>"
				
	document.write(file);
}());
