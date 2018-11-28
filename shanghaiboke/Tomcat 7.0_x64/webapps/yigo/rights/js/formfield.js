(function() {
	RTS = RTS || {};
	RTS.Form_Field = function() {
		var options = RTS.options;
		var setFormChecked = function($table, index) {
			var target = $table.target;
			var $cks = $("tr.title .checkbox", $table), $chk, tmp;
			var checked = target.is(":checked");
			if(!index) {
				index = 0;
				$table.hasAllVisibleRights = checked;
				if(!checked) {
					$(".checkbox", target.parents("tr")).eq(1).prop("checked", false);
					$table.hasAllEnableRights = false;
				}
			} else {
				$table.hasAllEnableRights = checked;
				if(checked) {
					$(".checkbox", target.parents("tr")).eq(0).prop("checked", true);
					$table.hasAllEnableRights = true;
				}
			}
			var $trs = $("tr:not([class~='title'])", $table);
			if(target.parents("tr").hasClass("title")) {
				for (var i = 0, len = $trs.length; i < len; i++) {
					var $tr = $trs.eq(i);
					$chk = $(".checkbox:not([class~='ignore'])", $tr).eq(index);
					if($chk.length == 0 || $chk.attr("enable") == "false") continue;
					$chk.prop("checked", checked);
					var tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!checked) {
							$(".checkbox", tr).eq(1).prop("checked", false);
						}
						chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
						chkData.visible = checked;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(checked) {
							$(".checkbox", tr).eq(0).prop("checked", true);
						}
						chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
						chkData.enable = checked;
					}
					RTS.setRts(tr.attr("id"), checked, $table, chkData);
				}
			} else {
				var tr = target.parents("tr").eq(0);
				var chkData = {
					id: tr.attr("id")
				}
				if(index == 0) {
					//可见为false时相应的enable为false
					if(!checked) {
						$(".checkbox", tr).eq(1).prop("checked", false);
					}
					chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
					chkData.visible = checked;
				}
				if(index == 1) {
					//enable全部为true时相应的visible也为true
					if(checked) {
						$(".checkbox", tr).eq(0).prop("checked", true);
					}
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
					chkData.enable = checked;
				}
				var pid = tr.attr("pid");
				
				RTS.setRts(tr.attr("id"), checked, $table, chkData);
				RTS.checkCtr($table, tr.attr("id"), checked, index);
				RTS.checkPtr($table, tr.attr("pid"), checked, index);				
				
				var chks =  $(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")), childs;
				var $trs = $("tr:not([class~='title'])", $table);
				for (var i = 0, len = chks.length; i < len; i++) {
					var isAllCk = true;
					if(i != 0) {
						childs = $(".checkbox[index='"+i+"'].checkbox:not([enable='false']):not([class ~='ignore'])", $trs);
					} else {
						childs = $(".checkbox:not([index]):not([enable='false']):not([class ~='ignore'])", $trs);
					}
					var length = childs.length;
					if(length == 0) {
						chks.eq(i).attr("enable", "false");
						break;
					}
					for (var j = 0; j < length; j++) {
						var cked = childs.eq(j).is(":checked");
						if(!cked) isAllCk = false;
					}
					if(!isAllCk) {
						chks.eq(i).prop("checked", false);
						if(i == 0) {
							$table.hasAllVisibleRights = isAllCk;
						} else {
							$table.hasAllEnableRights = isAllCk;
						}
					}
					
				}
			}
		};

		var ff_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					options.isField = true;
					var target = $table.target;
					var index = target.attr("index") || 0;
					setFormChecked($table, index);
					options.isField = false;
				}
			}
		};
		
		var rt = {
				el: $("<div class='rts-form-field'></div>"),
				render: function(ct) {
					this.el.appendTo(ct);
				},
				addRows: function(data) {
					var opts = $.extend({}, RTS.options, {type: RTS.Rights_type.TYPE_FORM});
					var tbl = new RTS.Treetable(this.el, opts);
					this.$table_el = tbl.create(ff_opt, data);
					this.$table = tbl;

					this.$table_el.enableRts = options.enableRts;
					this.$table_el.visibleRts = options.visibleRts;
					
//					if(data.isEnableDef) {
//						this.$table_el.hasAllEnableRights = false;
//					} else {
						this.$table_el.hasAllEnableRights = data.hasAllEnableRights;
//					}
//					if(data.isVisibleDef) {
//						this.$table_el.hasAllVisibleRights = false;
//					} else {
						this.$table_el.hasAllVisibleRights = data.hasAllVisibleRights;
//					}
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