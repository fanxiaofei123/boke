<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>Form测试</title><%-- 
		<script type="text/javascript" src="test2.html"></script>--%>
		
		<!-- #include file="test2.html" -->
		<%-- 
		<jsp:include page="test2.html"></jsp:include> --%>
		<!-- 
		<object type='text/html' data="test2.html" style="width: 0; height: 0;"></object> 
		 -->
		<script type="text/javascript" src="yesui/ui/allfile.js"></script>
		
		<script type="text/javascript">

		window.onerror = function(msg) {
			var dialog = $("<div></div>").attr("id", "error_dialog");
            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 170, width: 460});
		};
		
		$(function () {
		    $(".login_username").html($.cookie("username"));
		    //侧边栏隐藏
		    $("#logoBtn").click(function () {
		            $(".navLeft").toggle();
		            $(this).removeClass('logoBtn1').addClass('logoBtn')
		    })
		
		    $('.userBox span').click(function () {
		        $(".userImgbox").slideDown();
		    })
		    $('.userBox').mouseleave(function () {
		        $(".userImgbox").slideUp();
		    })
		
		
		    $(document).keydown(function (event) {
		        var keyCode = event.charCode || event.keyCode || 0;
		        if (keyCode == 20) {
                    document.isCapeLook = !document.isCapeLook;
                } else if (keyCode == 8) {
                    var el = (event.srcElement || event.target),
                            isNotEditEle = (el.type != "text" && el.type != "textarea" && el.type !== "password"),
                            isOnlyRead = (el.readOnly == true);
                    if (isNotEditEle || isOnlyRead) {
                        if (event.returnValue) {
                            event.keyCode = 0;
                            event.returnValue = false;
                        }
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        return false;
                    }
                }
		    });
				
		});
		
		function logout() {
		    Svr.SvrMgr.doLogout();
		    $.cookie("clientID", null);
		}
		function exit() {
		    Svr.SvrMgr.doLogout();
		    $.cookie("clientID", null);
		    window.location.replace("about:blank");
		}
		
		function modifyPwd() {
		    
	        var paras = {formKey: "ChangePassWord", cmd: "PureShowForm", async: false};
	        var jsonObj = Svr.SvrMgr.dealWithPureForm(paras);
	        YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL);
		}

		function about() {
			var params = {service: "GetSystemInfo"};
		    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
	        
			var dialogDiv = $("<div class='modifyPwd' id='modifyPwd'></div>");
		    var version = new YIUI.Control.Label({
		        x: 0,
		        y: 1,
		        caption: "版本： "
		    });
		
		    var versionTxt = new YIUI.Control.Label({
		        x: 1,
		        y: 1,
		        caption: result.Ver
		    });
		    
		    var create = new YIUI.Control.Label({
		        x: 0,
		        y: 2,
		        caption: "创建号： "
		    });
		
		    var createTxt = new YIUI.Control.Label({
		        x: 1,
		        y: 2,
		        caption: result.BuildID
		    });
		    
		    var company = new YIUI.Control.Label({
		        x: 0,
		        y: 3,
		        colspan: 2,
		        topMargin: 0,
		        caption: "上海博科资讯股份有限公司"
		    });
		
		    var OK = new YIUI.Control.Button({
		        x: 0,
		        y: 0,
		        listeners: null,
		        value: '确定'
		    });
		    var cancel = new YIUI.Control.Button({
		        x: 1,
		        y: 0,
		        listeners: null,
		        value: '取消'
		    });

		    var gp = new YIUI.Panel.GridLayoutPanel({
		        x: 0,
		        y: 4,
		        colspan: 2,
	    		columnGap : 15,
	    		widths : ["50%", "50%"],
	    		minWidths : ["-1", "-1"],
	    		heights : [25],
	    		items : [OK, cancel]
		    });
		    
		    var gridpanel = new YIUI.Panel.GridLayoutPanel({
		    	rowGap : 5,
	    		columnGap : 15,
	    		width: 240,
	    		widths : ["30%", "70%"],
	    		minWidths : ["-1", "-1"],
	    		heights : [5, 25, 25, 25, 25],
	    		items : [version, versionTxt, create, createTxt, company, gp]
		    });
		    dialogDiv.modalDialog(null, {title: "关于Yigo", showClose: false, width: "260px", height: "160px"});
		    gridpanel.el = dialogDiv.dialogContent();
		    gridpanel.render();
		    dialogDiv.addClass("abtCo");
		    OK.el.unbind();
		    cancel.el.unbind();
		    OK.el.click(function() {
		    	dialogDiv.close();
		    });
		    cancel.el.click(function() {
		    	dialogDiv.close();
		    });
		}
		
		window.history.forward(-1);
		</script>
		
	</head>
	<body>
		<div class="nav">
		    <div class="navLeft"></div>
		    <div class="logoBtn" id="logoBtn"></div>
		    <div class="navRight">
		        <div class="userBox">
		            <div class="userImg"><span class="userIcon"></span></div>
		            <span class="login_username">朱文文</span>
		
		            <div class="userImgbox">
		                <a href="#" onclick="logout()">
		                    <div>注销</div>
		                </a>
		                <a href="#" onclick="exit()">
		                    <div>退出</div>
		                </a>
		                <a href="#" onclick="modifyPwd()">
		                    <div>修改密码</div>
		                </a>
						<a href="#" onclick="about()"><div>关于Yigo</div></a>
		
		            </div>
		        </div>
		    </div>
		</div>
		
		<br/>
		<label style="margin-left: 10px;">container: </label>
		<input type="text" id="txt_c" value="div1"/>
		<label>formKey: </label>
		<input type="text" id="txt_fk"/>
		<label>oid: </label>
		<input type="text" id="txt_1"/>
		<br/>
		<br/>
		<label style="margin-left: 10px;">formula: </label>
		<textarea rows="3" cols="60"  id="txt_exp" ></textarea>
		<button id="btn2" onClick="clickfun()" style="vertical-align: top;">将Form显示到指定区域...</button>
		<br/>
		<p style="color: red; margin-left: 10px;">
			打开单据(非序事簿)若oid缺省，则为新增状态
		</p>
		<script>
			function clickfun() {
				var container = $("#txt_c").val();
				var oid = $("#txt_1").val();
				var formKey = $("#txt_fk").val();
				var formula = $("#txt_exp").val();
				var options = {
					//formKey: formKey,
					formKey: "TestHeadControl",
					oid: oid,
					formula: formula
				};
				var ct = $("#" + container);
				/* ct.close = function() {
					window.opener = null;
        			window.open("", "_self");
        			window.close();
				} */
				var fr = new YIUI.FormRender(options);
				fr.render(ct);
				
			}
		</script>
		<div id="div1" style="height: 600px !important; width: 48%; border: 1px solid green; margin-top: 10px; display: inline-block; float: left; margin-left: 10px;">
			ID: div1  
		</div>
		<div id="div2" style="height: 600px !important; width: 48%; border: 1px solid orange; margin-top: 10px; display: inline-block; float: left; margin-left: 10px;">
			ID: div2   
		</div>
		
		
		<div class="loading mask" style="display: none;"></div>
		<div class="loading image" style="position: absolute; display: none;">
		    <img alt='loading' src='yesui/ui/res/images/loading.gif'>
		</div>
	</body>
</html>
