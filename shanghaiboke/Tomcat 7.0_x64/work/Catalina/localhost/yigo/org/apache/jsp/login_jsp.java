/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.42
 * Generated at: 2018-09-13 05:58:40 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class login_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\t\r\n");
      out.write("<!doctype html>\r\n");
      out.write("<html>\r\n");
      out.write("\t<head>\r\n");
      out.write("\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n");
      out.write("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">\r\n");
      out.write("\t    <meta http-equiv=\"Content-Type\" content=\"application/x-javascript;charset=UTF-8\">\r\n");
      out.write("\t    <title>工作台</title>\r\n");
      out.write("\t   \t<script>\r\n");
      out.write("\t   \t\t//document.cookie = \"myStyle=blue; \" + document.cookie;\r\n");
      out.write("\t   \t</script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"yesui/v2/yesui/ui/loginfile.js?v=20180823\"></script>\r\n");
      out.write("\t\t<script>\r\n");
      out.write("\t\t\twindow.onerror = function(msg) {\r\n");
      out.write("\t\t\t\tmsg = msg.replace(\"Uncaught Error: \", \"\");\r\n");
      out.write("\t\t\t\tvar dialog = $(\"<div></div>\").attr(\"id\", \"error_dialog\");\r\n");
      out.write("\t            dialog.modalDialog(msg, {title: \"错误\", showClose: true, type: \"error\", height: 170, width: 460});\r\n");
      out.write("\t\t\t};\r\n");
      out.write("\t\t\t$(document).ready(function(){\r\n");
      out.write("\t\t\t\tvar defaultVersion = 8.0;\r\n");
      out.write("\t\t\t\tvar ua = navigator.userAgent.toLowerCase();\r\n");
      out.write("\t\t\t\tvar isIE = $.browser.isIE;\r\n");
      out.write("\t\t\t\tvar safariVersion;\r\n");
      out.write("\t\t\t\tvar isTrue = $.cookie(\"isTrue\");\r\n");
      out.write("\t\t\t\tif (isTrue == null) {\r\n");
      out.write("\t\t\t\t\tif (isIE) {\r\n");
      out.write("\t\t\t\t\t\tsafariVersion = ua.match(/msie ([\\d.]+)/);\r\n");
      out.write("\t\t\t\t\t\tif (safariVersion != null) {\r\n");
      out.write("\t\t\t\t\t\t\tsafariVersion = safariVersion[1];\r\n");
      out.write("\t\t\t\t\t\t\tif (safariVersion < defaultVersion) {\r\n");
      out.write("\t\t\t\t\t\t\t\t$.cookie(\"loginURL\", window.location.href);\r\n");
      out.write("\t\t\t\t\t\t\t    var location_pathname = document.location.pathname;\r\n");
      out.write("\t\t\t\t\t\t\t    while (location_pathname.indexOf('/') == 0) location_pathname = location_pathname.substr(1);\r\n");
      out.write("\t\t\t\t\t\t\t    var baseurl = unescape(location_pathname.substr(0));\r\n");
      out.write("\t\t\t\t\t\t\t    var service = baseurl.substring(0, baseurl.indexOf('/'));\r\n");
      out.write("\t\t\t\t\t\t\t\tvar url = [window.location.protocol, '//', window.location.host, '/', service].join('');\r\n");
      out.write("\t\t\t\t\t\t\t\twindow.location.href = url + \"/error.jsp\";\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\r\n");
      out.write("\t        $(function(){\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t<!-- 使用window.navigator.language拿到浏览器当前的语种,用来国际化登陆界面-->\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tvar body = '<div class=\"header\">' +\r\n");
      out.write("\t\t\t\t\t\t\t\t'<div class=\"warpper\">' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<img class=\"login-logo\" src=\"yesui/v2/yesui/ui/res/css/default/images/logo.png\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<span class=\"login-logo-text\">'+ YIUI.I18N.login.title +'</span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t'<div class=\"login-main\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t'<div class=\"warpper\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<img class=\"login_img\" src=\"yesui/v2/yesui/ui/res/css/default/images/login_img.png\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<div class=\"login-loginbox\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<p class=\"login-title\">'+ YIUI.I18N.login.userlogin +'</p>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<p class=\"login-strip\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<span class=\"login-combox-name\">'+ YIUI.I18N.login.username +'</span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<input type=\"text\" class=\"login-username\" value=\"\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'</p>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<div class=\"login-strip login-password-rows\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<span class=\"login-combox-name\">'+ YIUI.I18N.login.password +'</span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<input type=\"password\" class=\"login-password\" value=\"\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<em class=\"login-password-btn login-password-btn-close\"></em>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<div class=\"login_locale login-combox\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<span class=\"login-combox-name\">'+ YIUI.I18N.login.language +'</span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<div class=\"locale_paras locale-combox-content\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t'<p>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t\t'<span class=\"locale-combox-value\">'+ YIUI.I18N.login.select +'</span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t\t'<span class=\"dropDown-locale\"></span>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t'</p>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'<div class=\"login_locale_vw\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t'<ul class=\"locale-combox-list\">'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t\t'</ul>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'<div class=\"login-button\" type=\"button\" value=\"\">' + YIUI.I18N.login.loginbtn + '</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t\t'</div>'+\r\n");
      out.write("\t\t\t\t\t\t\t'</div>';\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t$(document.body).append(body);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t$(\".login-username\").focus();\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tvar addSessionItems = function($div,user,sessionParas){\r\n");
      out.write("\t\t\t\t\tvar data = {\r\n");
      out.write("\t\t\t\t\t\tservice: \"LoadSessionParaItems\",\r\n");
      out.write("\t\t\t\t\t\tuser: user,\r\n");
      out.write("\t\t\t\t\t\tprovider: $div.attr(\"provider\"),\r\n");
      out.write("\t\t\t\t\t\tparas: $.toJSON(sessionParas)\r\n");
      out.write("\t\t\t\t\t};\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar vw = $(\".login_sel_vw\",$div),\r\n");
      out.write("\t\t\t\t\t\t$ul = $(\"ul.login-combox-list\", vw);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t$ul.empty();\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar $cmb = $(\".login_paras .login-combox-value\", $div);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t$cmb.html(\"\").attr(\"value\", null);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);\r\n");
      out.write("\t\t\t\t\tif( !result || $.isEmptyObject(result) ) {\r\n");
      out.write("\t\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar item,\r\n");
      out.write("\t\t\t\t\t\t$li;\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tfor(var i = 0; item = result.items[i]; i++) {\r\n");
      out.write("\t\t\t\t\t\t$li = $(\"<li class='login-combox-item'></li>\");\r\n");
      out.write("\t\t\t\t\t\t$li.attr(\"value\", item.value).html(item.caption);\r\n");
      out.write("\t\t\t\t\t\t$ul.append($li);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvw.delegate(\"li\", \"click\", function(e) {\r\n");
      out.write("\t\t\t\t\t\t$(\".login_sel_vw .sel\",vw).removeClass(\"sel\");\r\n");
      out.write("\t\t\t\t\t\t$(this).addClass(\"sel\");\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tvar caption = $(this).html(),\r\n");
      out.write("\t\t\t\t\t\t\tvalue = $(this).attr(\"value\"),\r\n");
      out.write("\t\t\t\t\t\t\toldVal = $cmb.attr(\"value\");\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tvar fireEvent = false;\r\n");
      out.write("\t\t\t\t\t\tif( value != oldVal && vw.is(\":visible\") ) {\r\n");
      out.write("\t\t\t\t\t\t\tfireEvent = true;\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t$cmb.html(caption).attr(\"value\", value);\r\n");
      out.write("\t\t\t\t\t\tvw.hide();\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tif( fireEvent ) {\r\n");
      out.write("\t\t\t\t\t\t\tvar $divs = $(\".login_org\"),\r\n");
      out.write("\t\t\t\t\t\t\t\tindex = $divs.index($div);\r\n");
      out.write("\t\t\t\t\t\t\t$divs.each(function(i){\r\n");
      out.write("\t\t\t\t\t\t\t\tif( i > index ) {\r\n");
      out.write("\t\t\t\t\t\t\t\t\taddSessionItems($(this),$(\".login-username\").val(),getSessionParas());\r\n");
      out.write("\t\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t$(\".login-combox-item\",$ul).eq(0).click();\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tvar getSessionParas = function(){\r\n");
      out.write("\t\t\t\t\tvar paras = {};\r\n");
      out.write("\t\t\t\t\t$(\".login_org\").each(function(i){\r\n");
      out.write("\t\t\t\t\t\tvar value = $(\".login_paras .login-combox-value\",this).attr(\"value\");\r\n");
      out.write("\t\t\t\t\t\tif( value != null ) {\r\n");
      out.write("\t\t\t\t\t\t\tvar paraKey = $(this).attr(\"para-key\");\r\n");
      out.write("\t\t\t\t\t\t\tparas[paraKey] = value;\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\treturn paras;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tvar handleUserChanged = function($this) {\r\n");
      out.write("\t\t\t\t\tvar newVal = $this.val(),\r\n");
      out.write("\t\t\t\t\t\toldVal = $this.attr(\"oldVal\") || \"\";\r\n");
      out.write("\t\t\t\t\tif( oldVal == newVal ) {\r\n");
      out.write("\t\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t$this.attr(\"oldVal\", newVal);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t$(\".login_org\").each(function(i){\r\n");
      out.write("\t\t\t\t\t\taddSessionItems($(this), newVal, getSessionParas());\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t};\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t$(\"input\").keyup(function(e) {\r\n");
      out.write("\t\t\t\t\tif(e.keyCode == 13) {\r\n");
      out.write("\t\t\t\t\t\t$(this).blur();\r\n");
      out.write("\t\t\t\t\t\t$(\".login-button\").click();\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t// 登陆\r\n");
      out.write("\t\t\t\t$(\".login-button\").click(function() {\r\n");
      out.write("\t\t\t\t\tvar username = $(\".login-username\").val(),\r\n");
      out.write("\t\t\t\t\t\tpassword = $(\".login-password\").val();\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar locale = $(\".locale_paras .locale-combox-value\").attr(\"value\");\r\n");
      out.write("\t\t\t\t\tif( locale ) {\r\n");
      out.write("\t\t\t\t\t\t$.cookie(\"locale\",locale);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tSvr.SvrMgr.doLogin(username, password, getSessionParas());\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t// eg:第一次登陆,使用浏览器locale\r\n");
      out.write("\t\t\t\tvar locale = $.cookie(\"locale\");\r\n");
      out.write("\t\t\t\tif( !locale ) {\r\n");
      out.write("\t\t\t\t\t$.cookie(\"locale\",window.getLang());\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t// 处理回话参数\r\n");
      out.write("\t\t\t\tvar def = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {\r\n");
      out.write("\t\t\t\t\tservice: \"GetLoginDef\"\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tvar paraKey = def.sessionParaKey || \"orgID\",\r\n");
      out.write("\t\t\t\t\tsessionPara = def.sessionPara || def.paras,\r\n");
      out.write("\t\t\t\t\tprovider = def.provider;\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tif( def && sessionPara ) {\r\n");
      out.write("\t\t\t\t\t$(\".login-username\").blur(function() {\r\n");
      out.write("\t\t\t\t\t\thandleUserChanged($(this));\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar addEvent = function($div) {\r\n");
      out.write("\t\t\t\t\t\t$(\".login_paras .dropDown-button\",$div).click(function(e) {\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t\tvar vw = $(\".login_sel_vw\",$div);\r\n");
      out.write("\t\t\t\t\t\t\tif( vw.is(\":visible\") ) {\r\n");
      out.write("\t\t\t\t\t\t\t\treturn vw.slideUp(\"fast\");\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t\tvar parent = $(this).parents(\".login_paras\");\r\n");
      out.write("\t\t\t\t\t\t\tvar left = parent.offset().left,\r\n");
      out.write("\t\t\t\t\t\t\t\ttop = $div.offset().top + $div.height();\r\n");
      out.write("\t\t\t\t\t\t\tvw.css({\r\n");
      out.write("\t\t\t\t\t\t\t\t\"top\": top + \"px\",\r\n");
      out.write("\t\t\t\t\t\t\t\t\"left\": left + \"px\"\r\n");
      out.write("\t\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t\t\tvw.outerWidth(parent.outerWidth());\r\n");
      out.write("\t\t\t\t\t\t\tvw.slideDown(\"fast\");\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t\t$(document).off(\"mousedown\").on(\"mousedown\", function (e) {\r\n");
      out.write("\t\t\t\t\t\t\t\tvar target = $(e.target),\r\n");
      out.write("\t\t\t\t\t\t\t\t\tparaKey = $div.attr(\"para-key\");\r\n");
      out.write("\t\t\t\t\t\t\t\t// 1.选择时或者点击同一个按钮不隐藏\r\n");
      out.write("\t\t\t\t\t\t\t\tif (target.parents(\".login_sel_vw\").length == 0 &&\r\n");
      out.write("\t\t\t\t\t\t\t\t\t\ttarget.parents(\".login_org\").attr(\"para-key\") != paraKey) {\r\n");
      out.write("\t\t\t\t\t\t\t\t\tvw.slideUp(\"fast\");\r\n");
      out.write("\t\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t\t\t$(document).off(\"mousedown\");\r\n");
      out.write("\t\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t};\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar paraHtml = '<div class=\"login_org login-combox\" >' +\r\n");
      out.write("\t                                  '<span class=\"login-combox-name\">组织机构</span>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t  '<div class=\"login_paras login-combox-content\">' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t    '<p>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t      '<span class=\"login-combox-value\">' + YIUI.I18N.login.select + '</span>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t      '<span class=\"dropDown-button\"></span>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t    '</p>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t  '</div>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t  '<div class=\"login_sel_vw\">' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t    '<ul class=\"login-combox-list\">' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t    '</ul>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t  '</div>' +\r\n");
      out.write("\t\t\t\t\t\t\t\t\t'</div>';\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tvar $div,\r\n");
      out.write("\t\t\t\t\t\tpara,\r\n");
      out.write("\t\t\t\t\t\ttitle;\r\n");
      out.write("\t\t            if( def.paras ) {\r\n");
      out.write("\t\t\t\t\t\tvar paras = JSON.parse(def.paras),s;\r\n");
      out.write("\t\t\t\t\t\tfor( var i = 0;s = paras[i];i++ ){\r\n");
      out.write("\t\t\t\t\t\t\tpara = JSON.parse(s);\r\n");
      out.write("\t\t\t\t\t\t\t$div = $(paraHtml).attr(\"para-key\",para.paraKey).attr(\"provider\",para.provider);\r\n");
      out.write("\t\t\t\t\t\t\ttitle = para.paraTitle || '组织机构';\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t\t$(\".login-combox-name\",$div).text(title);\r\n");
      out.write("\t\t\t\t\t\t\t$(\".login_locale\").before($div);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t\taddEvent($div);\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t} else {\r\n");
      out.write("\t\t\t\t\t\t$div = $(paraHtml).attr(\"para-key\",paraKey).attr(\"provider\",provider);\r\n");
      out.write("\t\t\t\t\t\ttitle = def.paraTitle || '组织机构';\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\t$(\".login-combox-name\",$div).text(title);\r\n");
      out.write("\t\t\t\t\t\t$(\".login_locale\").before($div);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\taddEvent($div);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tparaHtml = null;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\tif( def && def.multiLang ) {\r\n");
      out.write("\t\t\t\t\tvar $div = $(\".login_locale\"),\r\n");
      out.write("\t\t\t\t\t\tparent = $(\".locale_paras\"),\r\n");
      out.write("\t\t\t\t\t\tvw = $(\".login_locale_vw\"),\r\n");
      out.write("\t\t\t\t\t\t$ul = $(\"ul.locale-combox-list\", vw);\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\tif( $(\"li\",$ul).length == 0 ) {\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tvar ret = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {\r\n");
      out.write("\t\t\t\t\t\t\tservice: \"GetSupportLang\"\r\n");
      out.write("\t\t\t\t\t\t});\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tif( ret && ret.items ) {\r\n");
      out.write("\t\t\t\t\t\t\tvar item,\r\n");
      out.write("\t\t\t\t\t\t\t\t$li;\r\n");
      out.write("\t\t\t\t\t\t\tfor(var i = 0;item = ret.items[i];i++) {\r\n");
      out.write("\t\t\t\t\t\t\t\tvar $li = $(\"<li class='login-combox-item'></li>\");\r\n");
      out.write("\t\t\t\t\t\t\t\t$li.attr(\"value\", item.value).html(item.caption);\r\n");
      out.write("\t\t\t\t\t\t\t\t$ul.append($li);\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t$(\".locale_paras .dropDown-locale\").click(function(){\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tif( vw.is(\":visible\") ) {\r\n");
      out.write("\t\t\t\t\t\t\treturn vw.slideUp(\"fast\");\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tvar left = parent.offset().left,\r\n");
      out.write("\t\t\t\t\t\t\ttop = $div.offset().top + $div.height();\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t\tvw.css({\r\n");
      out.write("\t\t\t\t\t\t\t\"top\":top + \"px\",\r\n");
      out.write("\t\t\t\t\t\t\t\"left\":left + \"px\"\r\n");
      out.write("\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t\tvw.width(parent.outerWidth());\r\n");
      out.write("\t\t\t\t\t\tvw.slideDown(\"fast\");\r\n");
      out.write("\t\t\t\t\t\t$(document).off(\"mousedown\").on(\"mousedown\", function (e) {\r\n");
      out.write("\t\t\t\t\t\t\tvar target = $(e.target);\r\n");
      out.write("\t\t\t\t\t\t\tif (target.closest(\".login_locale_vw\").length == 0 && !target.hasClass('dropDown-locale')) {\r\n");
      out.write("\t\t\t\t\t\t\t\tvw.slideUp(\"fast\");\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t\t$(document).off(\"mousedown\");\r\n");
      out.write("\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\tvw.delegate(\"li\", \"click\", function(e) {\r\n");
      out.write("\t\t\t\t\t\t$(\".login_locale_vw .sel\").removeClass(\"sel\");\r\n");
      out.write("\t\t\t\t\t\t$(this).addClass(\"sel\");\r\n");
      out.write("\t\t\t\t\t\tvar caption = $(this).html(),\r\n");
      out.write("\t\t\t\t\t\t\tvalue = $(this).attr(\"value\");\r\n");
      out.write("\t\t\t\t\t\t$(\".locale_paras .locale-combox-value\").html(caption).attr(\"value\", value);\r\n");
      out.write("\t\t\t\t\t\t$(\".login_locale_vw\").hide();\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t// 注销后显示上次登录语言\r\n");
      out.write("\t\t\t\t\tvar locale = $.cookie(\"locale\");\r\n");
      out.write("\t\t\t\t\tif( locale ) {\r\n");
      out.write("\t\t\t\t\t\t$(\".login-combox-item[value=\"+locale+\"]\",$ul).click();\r\n");
      out.write("\t\t\t\t\t} else {\r\n");
      out.write("\t\t\t\t\t\t$(\".login-combox-item\",$ul).eq(0).click();\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t} else {\r\n");
      out.write("\t\t\t\t\t$(\".login_locale\").remove();\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t//密码显示\r\n");
      out.write("\t\t\t\t$(\".login-password-btn\").on(\"click\",function(){\r\n");
      out.write("\t\t\t\t\tvar _input =  $(\".login-password\"),\r\n");
      out.write("\t\t\t\t\t\t_type = _input.attr(\"type\");\r\n");
      out.write("\t\t\t\t\tif(_type == \"password\"){\r\n");
      out.write("\t\t\t\t\t\t_input.attr(\"type\",\"text\");\r\n");
      out.write("\t\t\t\t\t\t$(this).addClass(\"login-password-btn-open\")\r\n");
      out.write("\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\t_input.attr(\"type\",\"password\");\r\n");
      out.write("\t\t\t\t\t\t$(this).removeClass(\"login-password-btn-open\")\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t})\t\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\t\r\n");
      out.write("        </script>\r\n");
      out.write("\t</head>\r\n");
      out.write("\t<body>\r\n");
      out.write("\r\n");
      out.write("\t</body>\r\n");
      out.write("</html>\r\n");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
