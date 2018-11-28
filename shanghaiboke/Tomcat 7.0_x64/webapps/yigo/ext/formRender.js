(function () {
    YIUI.FormRender = function (options, callback) {
    	
        var Return = {
        	formKey: options.formKey,
        	parameters: options.parameters || {},
        	transmitParas: options.transmitParas || "",
        	OID: options.OID || -1,
        	formula: options.formula,
        	formID: null,
    		doLayout: function(width, height) {
        		var form = YIUI.FormStack.getForm(this.formID);
    			form.getRoot().doLayout(width, height);
    		},
        	render: function(ct) {
        		if($.isString(ct)) {
        			ct = $("#" + ct);
        		}
        		var self = this;
        		ct.el = ct;
        		ct.renderDom = function(form) {
        			form.getRoot().render(this);
        			if(self.formula) {
        		        var cxt = new View.Context(form);
        				form.eval(self.formula, cxt, null);
        			}
        		};
        		ct.build = function(form) {
        			this.empty();
        			if(self.formID && self.formID != form.formID) {
        				YIUI.FormStack.removeForm(ct.formID);
        			}
        			form.setContainer(this);
        			self.formID = form.formID;
        		};
        		ct.removeForm = function(form) {
        			form.getRoot().el.remove();
        			YIUI.FormStack.removeForm(form.formID);
        			if($.isFunction(ct.close)) {
        				ct.close();
        			}
        		};
            	
        		var success = function(jsonObj) {
            		var pFormID;
            		var form = YIUI.FormBuilder.build(jsonObj);
            		if(form.target != YIUI.FormTarget.MODAL) {
            			ct.build(form);
            		}
            		if($.isFunction(callback)) {
            			callback(form);
            		}
            	};
            	var splitPara = function (para) {
			        if (!para) {
			            return null;
			        }
			        para = YIUI.TypeConvertor.toString(para);
			        var mapCallback = {}, len = para.length,
			            key = "", deep = 0, start = 0;
			        for (var i = 0; i < len; i++) {
			            var c = para.charAt(i);
			            if (c == ':' && deep === 0) {
			                key = para.substring(start, i).trim();
			            } else if (c == ',' && deep === 0) {
			                start = ++i;
			            } else if (c == '{') {
			                if (deep === 0) {
			                    start = ++i;
			                }
			                deep++;
			            } else if (c == '}') {
			                deep--;
			                if (deep == 0) {
			                    mapCallback[key] = para.substring(start, i);
			                }
			            }
			        }

			        return mapCallback;
			    };

		        var tsParas = this.transmitParas;
		        var OID = this.OID;
                if(OID > -1) {
                	//打开指定单据
		            var builder = new YIUI.YIUIBuilder(this.formKey);
		            builder.setContainer(ct);
			        builder.setOperationState(YIUI.Form_OperationState.Default);

		            builder.newEmpty().then(function(emptyForm){
		                // YIUI.FormParasUtil.processCallParas(form, emptyForm);

			            var filterMap = emptyForm.getFilterMap();
			            filterMap.setOID(OID);

				        if (tsParas) {
				            tsParas = splitPara(tsParas);
				            for (var key in tsParas) {
				                var value = form.eval(tsParas[key], cxt);
				                emptyForm.setPara(key, value);
				            }
				        }

		                emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));
		                builder.builder(emptyForm);
		            });
                } else {

                    var builder = new YIUI.YIUIBuilder(this.formKey);
			        builder.setContainer(ct);
			        builder.setOperationState(YIUI.Form_OperationState.New);
			        
			        builder.newEmpty().then(function(emptyForm){
			            // YIUI.FormParasUtil.processCallParas(form, emptyForm);

				        if (tsParas) {
				            tsParas = splitPara(tsParas);
				            for (var key in tsParas) {
				                var value = form.eval(tsParas[key], cxt);
				                emptyForm.setPara(key, value);
				            }
				        }

			            emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));

			            builder.builder(emptyForm);

			        });
                }


        	}
        };
        
        return Return;
    }
})();