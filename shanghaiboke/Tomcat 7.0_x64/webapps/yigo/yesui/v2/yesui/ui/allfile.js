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

	var myStyle = getCookie("myStyle");
	if(!myStyle){
		myStyle = 'default';
	}
	var local = getCookie("locale");
	if(!local){
		local = 'zh-CN';
	}
	
	//IE 下兼容console
	if(/msie/.test(navigator.userAgent.toLowerCase()) || /rv:([\d.]+)\) like gecko/.test(navigator.userAgent.toLowerCase())){
		document.write("<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/fauxconsole/fauxconsole.js"+v+"'></script>");
	}

	var file = "<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/fullcalendar/fullcalendar.css"+v+"'>" + 
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/fullcalendar/fullcalendar.css"+v+"'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/bootstrap/bootstrap.css"+v+"'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/datepicker/css/datepicker.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/smartspin/smartspinner.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/paginationjs/pagination.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css"+v+"'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css"+v+"' />" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/scrollbar/scrollbar.css"+v+"' />" +
				
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/main.css"+v+"'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/core.css"+v+"'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/grid.css"+v+"'>" +
				
//				"<script type='text/javascript' src='"+root+"common/jquery/jquery-3.1.1.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jquery-1.10.2.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jstz-1.0.4.min.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/ext/jsext.js"+v+"'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/yes-ui.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/yiuiconsts.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/itemdata.js"+v+"' defer='defer'></script>" + 

				// "<script type='text/javascript' src='"+root+"yesui/ui/language/i18n.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/i18N.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/plug-in.js"+v+"' defer='defer'></script>" +
				
			
				"<script type='text/javascript' src='"+root+"common/cache/lru/lrucache.js"+v+"' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"common/cache/dict/dictlrucache.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/cache/indexeddb/indexeddbproxy.js"+v+"' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"common/cache/dict/dictindexeddb.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/datacache.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/dictcacheproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/docserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/metaserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/remoteserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/rightsserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/bpmserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/datamapserviceproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/printserviceproxy.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/data/datatype.js"+v+"' defer='defer'></script>" +



				// "<script type='text/javascript' src='"+root+"common/exception/ViewException.js"+v+"' defer='defer'></script>" +
				// "<script type='text/javascript' src='"+root+"common/exception/BPMException.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/exception/localestringtable.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/exception.js"+v+"' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"common/exception/view/stringtable.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/view/viewexception.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/view/zh-CN-strings.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/view/en-US-strings.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/view/ja-JP-strings.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/exception/bpm/stringtable.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/bpm/bpmexception.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/bpm/zh-CN-strings.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/bpm/en-US-strings.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/bpm/ja-JP-strings.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/base/jQueryExt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/prototypeExt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/request.js"+v+"'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/svrmgr.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/parser.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/valimpl.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/exprutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/funimplmap.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/datautil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/headinfoutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/numericutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/typeconvertor.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/util/gridlookuputil.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/util/subdetailutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/yesjsonutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/totalrowcountutil.js"+v+"' defer='defer'></script>" +


				"<script type='text/javascript' src='"+root+"yesui/svr/purehandler.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/basehandler.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/attachmenthandler.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/buttonhandler.js"+v+"' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/svr/handler/textbuttonhandler.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/comboboxhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/checkboxhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dicthandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/datepickerhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dropdownbuttonhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/gridhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/hyperlinkhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/imagehandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/listviewhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/numbereditorhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/passwordeditorhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/radiobuttonhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/splitbuttonhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/searchboxhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/textareahandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/texteditorhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/toolbarhandler.js"+v+"' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/svr/handler/treehandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dialoghandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dictviewhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/filechooserhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/mapdrawhandler.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/richeditorhandler.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/stepeditorhandler.js"+v+"' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/basebehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/buttonbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/checkboxbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/comboboxbehavior.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/checklistboxbehavior.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/datepickerbehavior.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/dictbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/gridbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/hyperlinkbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/imagebehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/listviewbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/numbereditorbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/radiobuttonbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/splitbuttonbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/searchboxbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/textareabehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/texteditorbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/utcdatepickerbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/richeditorbehavior.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/stepeditorbehavior.js"+v+"' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/format/dateformat.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/format/utcdateformat.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/format/decimalformat.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/format/numberformat.js"+v+"' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/svr/format/textformat.js"+v+"' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/service/dictserviceproxy.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/Base64Utils.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/uiutils.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/batchutils.js"+v+"' defer='defer'></script>" + 
			    

			   	"<script type='text/javascript' src='"+root+"yesui/ui/util/viewutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/fileutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/rightsutil.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/loadingutil.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/filtermap.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/opt.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/showdata.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/fun/basefun.js"+v+"' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/objectloop.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/vparser.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/workiteminfo.js"+v+"' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/statusproxy.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/abstractuiprocess.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/process/uienableprocess.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uicalcprocess.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uicheckruleprocess.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uivisibleprocess.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uidependencyprocess.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uiparaprocess.js"+v+"' defer='defer'></script>" +
				
				
				
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/inplacetoolbar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/bpminplacetoolbar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/loadworkiteminplacetoolbar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/batchoperationinplacetoolbar.js"+v+"' defer='defer'></script>" +
				

				"<script type='text/javascript' src='"+root+"yesui/ui/headinfos.js"+v+"' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/uiprocess.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/process/viewdatamonitor.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/paras.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/ppobject.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/formstack.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/form.js"+v+"' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/focuspolicy.js"+v+"' defer='defer'></script>" + 
			    "<script type='text/javascript' src='"+root+"yesui/ui/formadapt.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/formbuilder.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/appdef.js"+v+"' defer='defer'></script>" + 
				
				"<script type='text/javascript' src='"+root+"yesui/ui/printpreview.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/positionutil.js"+v+"' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/ui/builder/yiuibuilder.js"+v+"' defer='defer'></script>" + 

				//工具类 供他人直接渲染单据
				//"<script type='text/javascript' src='"+root+"yesui/svr/formutils.js"+v+"' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/ui/formRender.js"+v+"' defer='defer'></script>" + 

                //组件
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesbutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yeshyperlink.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesimage.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yestextarea.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yestexteditor.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yeslabel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesnumbereditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yescheckbox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdict.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdatepicker.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yescombobox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdialog.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesstepeditor.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/componentmgr.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/component.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/conditionparas.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/control.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/toolbar.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/treemenubar.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/databinding.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/button.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/richeditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/buttongroup.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dropdownbutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/splitbutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/calendar.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/checkbox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/combobox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/datepicker.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dict.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dicttree.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dictview.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dictquerypanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/hyperlink.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/imagelist.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/label.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/listview.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/numbereditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/image.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/radiobutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/texteditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/textarea.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/textbutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/statusbar.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/treeview.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/passwordeditor.js"+v+"' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/ui/component/control/tree.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/attachment.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/separator.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/chart.js"+v+"' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/component/control/bpmgraph.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/custom.js"+v+"' defer='defer'></script>" + 
                "<script type='text/javascript' src='"+root+"yesui/ui/component/control/flatcanvas.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/userinfopane.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/rightsset.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dialog.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/filechooser.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/mapdraw.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/utcdatepicker.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/searchbox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/webbrowser.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/stepeditor.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/control/gantt.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/gridsumutil.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/grid.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/griddef.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/columnexpand.js"+v+"' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/showgriddata.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/gridutil.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/rowgroup.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celleditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celltextarea.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celltexteditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellnumbereditor.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldatepicker.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellutcdatepicker.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellcombobox.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldict.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldynamicdict.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellimage.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celltextbutton.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/autolayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/borderlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/columnlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/fluidcolumnlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/gridlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tablayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tab.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/splitlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/flexflowlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/flowlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tablelayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/fluidtablelayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/wizardlayout.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/panel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/borderlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/columnlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/flowlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/flexflowlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/fluidcolumnlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/fluidtablelayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/gridlayoutpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/splitpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabpanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabpanelex.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/treepanel.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabcontainer.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabexcontainer.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/stackcontainer.js"+v+"' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/wizardpanel.js"+v+"' defer='defer'></script>" +

        		"<script type='text/javascript' src='"+root+"yesui/ui/custom.js"+v+"' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/ui/maincontainer.js"+v+"'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/maintree.js"+v+"'></script>" + 
				
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/print/jquery.printarea.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/raphael-src.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.cookie.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.json-2.3.min.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js"+v+"' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/decimal/decimal.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/decimal/bignumber.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/picture/ajaxfileupload.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.placeholder.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/lib/bean-min.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/lib/underscore-min.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Flotr.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/DefaultOptions.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Color.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Date.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/DOM.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/EventAdapter.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Text.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Graph.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Axis.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Series.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Series.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/lines.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/bars.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/points.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/pie.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/candles.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/markers.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/radar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/bubbles.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/gantt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/timeline.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/download.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/selection.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/spreadsheet.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/grid.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/hit.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/crosshair.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/labels.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/legend.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/titles.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/datepicker/js/datepicker.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/smartspin/smartspinner.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/resize.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/modaldialog.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/paginationjs/pagination.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/picture/jquery_photoCut.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/treetable/jquery.treetable.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/pdf/pdfobject.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/scrollbar/jquery_scrollbar.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/jsbn.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/prng4.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rng.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rsa.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/BASE_64.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/gantt/gantt.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/pako/pako.js"+v+"' defer='defer'></script>" + 
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flatcanvas/snap.svg.js"+v+"' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flatcanvas/flatcanvas.plugin.js"+v+"' defer='defer'></script>" +
				"<script type='text/javascript' src='project/extend.js"+v+"' defer='defer'></script>";

	document.write(file);
}());
