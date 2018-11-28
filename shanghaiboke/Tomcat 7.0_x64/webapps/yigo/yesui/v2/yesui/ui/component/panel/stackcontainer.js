/**
 * StackContainer
 * 以Stack为显示形式的单据容器，单据为Form
 */
YIUI.Panel.StackContainer = YIUI.extend(YIUI.Panel, {
	
	/** 容器中存在的Form，以栈为表现形式 */
	/** forms : [], */
	defaultFormKey: "",
	
	items: [],
	
	init : function(options) {
		this.base(options);
		this.formID = null;
		var formKey = this.defaultFormKey;
		if(formKey) {
	        var container = this;
	        var builder = new YIUI.YIUIBuilder(formKey);
	        builder.setContainer(container);
	        builder.setOperationState(YIUI.Form_OperationState.Default);

	        builder.newEmpty().then(function(emptyForm){
	        	container.form = emptyForm;
	        	container.formID = emptyForm.formID;
	        });
	        container.builder = builder;

		}
	},
    
	onRender: function(ct) {
		this.base(ct);

		var form = this.form;
		var formKey = this.defaultFormKey;
		if(form && form.formKey == formKey) {
			this.builder.builder(form);
		} else if(form) {
			var root = form.getRoot();
			root.render(this.el);
			
			this.items.push(root);
		}

	},
	
	onSetHeight: function(height) {
		this.base(height);
	},
	
	/** 删除原有form，并缓存之 */
//	afterAdd : function(comp) {
//		if(this.items.length >= 2) {
//			this.items.shift();
//		}
//		if(this.el) {
//			// 删除原有界面
//			this.el.empty();
//			if(!this.isReplace) {
//				this.formID && YIUI.FormStack.removeForm(this.formID);
//				this.isReplace = false;
//			}
//		}
//		this.formID = comp.ofFormID;
//	},
	
	/** 删除当前form，并取出之前缓存的form，并显示 */
	remove : function(comp, autoDestroy) {
		this.base(comp, autoDestroy);
	},
	
	beforeDestroy: function() {
		this.formID && YIUI.FormStack.removeForm(this.formID);
	},
	
	getActivePane: function() {
		return YIUI.FormStack.getForm(this.formID);
	},

	build: function(form) {
		if(this.items.length > 0) {
			this.items.shift();
		}
		if(this.el) {
			// 删除原有界面
			this.el.empty();
			if(!this.isReplace) {
				if(this.formID && this.formID != form.formID) {
					YIUI.FormStack.removeForm(this.formID);
					this.isReplace = false;
				}
			}
		}
		this.form = form;
		this.formID = form.formID;
		var rt = form.getRoot();
		this.items.push(rt);
	},

    doLayout: function(panelWidth, panelHeight) {
        this.base(panelWidth, panelHeight);
        if(this.form) {
        	var root = this.form.getRoot();
        	if(root.hasLayout && !$.isString(root.layout)) {
        		root.doLayout(this.getWidth(), this.getHeight());
			}
		}
    },

	renderDom: function(ct) {
		if(this.form) {
			this.form.pFormID = this.ofFormID;
			var root = this.form.getRoot();
			root.render(this.el);
		}
	},
	
	removeForm: function(form) {
        this.remove(form.getRoot());
		this.formID && YIUI.FormStack.removeForm(this.formID);
	}
	
//	close: function(form) {
//		var compID = form.getRoot().id;
//        this.remove(this.get(compID));
//		this.formID && YIUI.FormStack.removeForm(this.formID);
//	}

});
YIUI.reg('stackcontainer', YIUI.Panel.StackContainer);