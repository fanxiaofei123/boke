(function() {
	RTS = RTS || {};
	RTS.Form_Opt = function() {
		var options = RTS.options;
		var fo_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					RTS.setChecked($table);
				}
			}
		};
		
		var rt = {
				el: $("<div class='rts-form-opt'></div>"),
				render: function(ct) {
					this.el.appendTo(ct);
				},
				addRows: function(data) {
					var opts = $.extend({}, RTS.options, {type: RTS.Rights_type.TYPE_FORM});
					var tbl = new RTS.Treetable(this.el, opts);
					this.$table_el = tbl.create(fo_opt, data);
					this.$table = tbl;
					this.$table_el.optRts = options.optRts;
					this.$table_el.hasAllOptRights = data.hasAllOptRights;
				},
				empty: function() {
					this.$table && this.$table.removeAll();
				},
				setEnable: function(enable) {
					var chks = $(".checkbox:not([class~='ignore'])", this.el);
					if(enable) {
						chks.removeAttr("disabled");
					} else {
						chks.attr("disabled", "disabled");
					}
				},
				resize: function(width, height) {
					this.el.css({
						width: width,
						height: height
					});
					this.$table && this.$table.resize(width, height);
				}
		};
		return rt;
	}
})();