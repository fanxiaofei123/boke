/**
 * WEB打印服务代理
 */
YIUI.PrintService = (function () {
	var Return = {
	    print: function(form, reportKey, fillEmptyPrint, doc){
	    	form.refreshParas();
  
	    	var paras = {
	    		service: "WebPrintService",
	    		cmd: "PrintPDF",
	    		formKey: form.getFormKey(),
	    		reportKey: reportKey,
	    		fillEmptyPrint: fillEmptyPrint,
	    		doc: $.toJSON(doc)
            };
        	paras.parameters = form.getParas().toJSON();

        	var formID = form.formID;
            return Svr.Request.getData(paras)
            			.then(function(url){
                            YIUI.Print.print(url, formID);
                        });
	    },

	    batchPrint: function(form, formKey, reportKey, OIDs){
	    	form.refreshParas();
  
	    	var paras = {
	    		service: "WebPrintService",
	    		cmd: "BatchPrintPDF",
	    		formKey: formKey,
	    		reportKey: reportKey,
	    		OIDs: $.toJSON(OIDs)
            };
        	paras.parameters = form.getParas().toJSON();

        	var formID = form.formID;
            return Svr.Request.getData(paras)
            			.then(function(url){
                            YIUI.Print.print(url, formID);
                        });
	    },

	    printPreview: function(form, reportKey, fillEmptyPrint, doc){
			form.refreshParas();
	        var formKey = form.getFormKey();

	        var paras = {
	    		service: "WebPrintService",
	    		cmd: "PrintPDF",
	    		formKey: formKey,
	    		reportKey: reportKey,
	    		fillEmptyPrint: fillEmptyPrint,
	    		doc: $.toJSON(doc)
            };

	        paras.parameters = form.getParas().toJSON();

            return Svr.Request.getData(paras)
            			.then(function(url){
                            url = url.replace(/\\/g, "/");
					        var opts = {
					            formKey: formKey,
					            url: url
					        };
					        new YIUI.PrintPreview(opts);
                        });
	    }
	}
	return Return;
})();