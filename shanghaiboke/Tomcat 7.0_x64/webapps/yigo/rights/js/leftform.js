(function() {
	RTS = RTS || {};
	RTS.Form_Left = function() {

		var html = "<div class='form'>" +
						"<div class='search'>" +
							"<span class='rts-txted'><input type='text'/></span>" +
							"<button class='rts-btn'></button>" +
						"</div>" +
						"<div class='rts-form-left'></div>" +
					"</div>";
		var el = $(html);

		var f_opt = {
			theme : 'default',
			expandLevel : 1,
			firstIndent: 0,
			onSelect : function($table, $tr) {
				if(!RTS.options.id) return;
				var flag = RTS.isClick($tr, $table);
				if(flag) return;
				RTS.options.clickTr = $tr;
				RTS.options.f_clickTr = $tr;
				RTS.options.type = RTS.Rights_type.TYPE_FORM;
				var formkey =  $tr.attr("id");
				RTS.options.formKey = formkey;
				
				var formKey = formkey;
				var operatorID = RTS.options.tag == RTS.Custom_tag.OperatorRights ? RTS.options.id : -1;
				var roleID = RTS.options.tag == RTS.Custom_tag.RoleRights ? RTS.options.id : -1;
				
				RTS.Service.LoadFormRightsData(operatorID, roleID, formKey).then(function(data) {
					RTS.formRight.addRows(data);
				});
			}
		};
		
		var rt = {
				el: el,
				render: function(ct) {
					this.el.appendTo(ct);
					this.install();
				},
				addRows: function(data) {
					var tbl = new RTS.Treetable($(".rts-form-left"), RTS.options);
					tbl.create(f_opt, data);
					this.$table = tbl;
				},
				setEnable: function(enable) {
					this.$table._table.attr("enable", enable);
					$(".search input", this.el).attr("readonly", !enable);
					$(".search .rts-btn", this.el).attr("disabled", !enable);
				},
				resize: function(width, height) {
					var el = this.el;
					this.el.width(width).height(height);
					var txt = $(".rts-txted", el);
					var btn = $(".rts-btn", el);
					txt.outerWidth(width - btn.outerWidth() - 10);
					var input = $("input", txt);
					input.width(txt.width());
					var content = $(".rts-form-left", this.el);
					var c_h = height - $(".search", this.el).outerHeight();
					content.css("height", c_h);
					this.$table && this.$table.resize(width, c_h);
				},
				install: function() {
					var _this = this;
					this.el.delegate(".search .rts-btn", "click", function() {
						var value = $(".search input", _this.el).val();
						RTS.loopSearch(value, _this.$table._table);
					});
				}
		};
		return rt;
	}
})();