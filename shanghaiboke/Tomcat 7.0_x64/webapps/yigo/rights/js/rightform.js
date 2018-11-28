(function() {
	RTS = RTS || {};
	RTS.Form_Right = function() {
		var rt = {
				el: $("<div class='rts-form'></div>"),
				addRows: function(data) {
					$(".spl-resizer", this.split.el).show();
					//表单的所有可用性、可见性、可操作性
					if(data.fieldData) {
						var field_data = {
								rows: data.fieldData,
								cols: [{
									key: "caption",
									caption: RTS.I18N.formright.caption
								}, {
									key: "key",
									caption: RTS.I18N.formright.key
								}, {
									key: "visible",
									caption: RTS.I18N.formright.visible,
									type: "checkbox",
									index: 0
								}, {
									key: "enable",
									caption: RTS.I18N.formright.enable,
									type: "checkbox",
									index: 1
								}],
								defStatus: data.defStatus,
								allEnableRights: data.hasAllEnableRights,
								allVisibleRights: data.hasAllVisibleRights
						};
						RTS.options.isFFData = true;
						RTS.options.visibleRts = [];
						RTS.options.enableRts = [];
						this.f_field.addRows(field_data);
						RTS.options.isFFData = false;
					}
					
					if(data.optData) {
						var opt_data = {
								rows: data.optData,
								cols: [{
									key: "caption",
									caption: RTS.I18N.formright.caption
								},{
									key: "key",
									caption: RTS.I18N.formright.key
								}, {
									key: "hasRights",
									type: "checkbox",
									caption: RTS.I18N.formright.hasrights
								}],
								allOptRights: data.hasAllOptRights
						};
						RTS.options.isFOData = true;
						RTS.options.optRts = [];
						this.f_opt.addRows(opt_data);
						RTS.options.isFOData = false;
					}
					
					this.resize(this.el.width(), this.el.height());
				},
				render: function(ct) {
					this.el.appendTo(ct);
					var f_field = new RTS.Form_Field();
					var f_opt = new RTS.Form_Opt();
					var split = RTS.Split();
					split.add(f_opt, "50%");
					split.add(f_field, "50%");
					split.render($(".rts-form", ct));
					this.f_field = f_field;
					this.f_opt = f_opt;
					this.split = split;
					$(".spl-resizer", split.el).hide();
				},
				empty: function() {
					this.f_field && this.f_field.empty();
					this.f_opt && this.f_opt.empty();
				},
				setEnable: function(enable) {
					if(!this.f_field || !this.f_opt) return;
					this.f_field.setEnable(enable);
					this.f_opt.setEnable(enable);
				},
				resize: function(width, height) {
//					var ct = this.el.parent();
//					var sel = $(".choose .vw", ct);
//					if(sel.length > 0) {
//						height -= sel.outerHeight();
//					}
					this.el.width(width).height(height);
					this.split.resize(width, height);
				}
		};
		return rt;
	}
})();