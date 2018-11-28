(function() {
	RTS = RTS || {};
	RTS.Entry_Left = function() {
		var $e_tr = null;
		var choose = function(type) {
			var $tr = $e_tr;
			var formKey = $tr.attr("formKey");

			var lis = $(".choose .vw li", RTS.entryRight.el);
			var val = type || 0;
			if(type == undefined || type == 1) {
				var r_Key = $tr.attr("rightsRelation");
				if(r_Key) {
					formKey = r_Key;
					val = 1;
					$(".choose", RTS.entryRight.el).show();
					lis.eq(1).text($tr.attr("relationCaption"));
					lis.eq(0).text($tr.attr("formCaption"));
				} else {
					$(".choose", RTS.entryRight.el).hide();
				}
			}

			lis.removeClass("sel");
			var li = $(".choose .vw li[value='"+val+"']", RTS.entryRight.el).addClass("sel");
			$(".choose .multi-sel .txt").val(li.text());
			
			if(!formKey) {
				RTS.entryRight.empty();
				RTS.entryRight.el.hide();
				return;
			}
			RTS.entryRight.el.show();
			RTS.options.e_clickTr = $tr;
			RTS.options.formKey = formKey;
			RTS.options.e_formKey = formKey;

			var formKey = formKey;
			var operatorID = RTS.options.tag == RTS.Custom_tag.OperatorRights ? RTS.options.id : -1;
			var roleID = RTS.options.tag == RTS.Custom_tag.RoleRights ? RTS.options.id : -1;
			RTS.Service.LoadFormRightsData(operatorID, roleID, formKey).then(function(data) {
				RTS.entryRight.addRows(data);
			});
			
		};
		var e_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				RTS.options.type = RTS.Rights_type.TYPE_ENTRY;
				var target = $table.target;
				if(target.hasClass("checkbox")) {
					//entry勾选
					if(target.hasClass("readonly")) return;
					if($tr.hasClass("title")) {
						var allRights = $(".checkbox", $tr).is(":checked");
						$table.allRights = allRights;
						if(allRights) {
							$(".checkbox", $table).removeClass("state2").removeClass("state0").addClass("state1").attr("chkstate", 1);
							var trs = $("tbody tr", $table);
							if(!$table.entryKeys) $table.entryKeys = [];
							for (var i = 0, len = trs.length; i < len; i++) {
								var key = trs.eq(i).attr("key");
								$table.entryKeys.push(key);
							}
						} else {
							$(".checkbox", $table).removeClass("state1").addClass("state0").attr("chkstate", 0);
							$table.entryKeys = [];
						}
						return;
					}
					var id = $tr.attr("id");
					var isCheck = $(".checkbox", $tr).is(":checked");
					
					var state = $(".checkbox", $tr).attr('chkstate') == 0 ? 1 : 0;
					$(".checkbox", $tr).attr('chkstate', state);
					if(state > 0) {
						$(".checkbox", $tr).removeClass("state0").removeClass("state2").addClass("state1");
					} else {
						$(".checkbox", $tr).removeClass("state1").removeClass("state2").addClass("state0");
					}
					RTS.setRts(id, state, $table);
					RTS.checkCtr($table, id, state);
					RTS.checkPtr($table, $tr.attr("pid"), state);
					
					var hasState0 = $("tbody .checkbox", $table).hasClass("state0");
					if(hasState0) {
						$(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")).prop("checked", false);
					} else {
						$(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")).prop("checked", true);
					}
				} else {
					//行选择
					if(!RTS.options.id) return;
					if(rt.enable) {
						return;
					}
					var flag = RTS.isClick($tr, $table);
					if(flag) return;
					
					$e_tr = $tr;
					choose();
				}
			}
		};

		var addPtrs = function(key, $ptrs, $table) {
			var tree = $table.treeNode.tree;
			var node = tree[key];
			var pId = node.parentId;
			if(pId) {
				var index = 0;
				for (var i = 0, len = $ptrs.length; i < len; i++) {
					if($ptrs[i] == pId) {
						index = i;
					}
				}
				if(index > 0) {
					$ptrs.splice(index, 0, key);
				} else {
					$ptrs.push(key);
				}
			} else {
				$ptrs.push(key);
			}
		};
		
		
		var rt = {
				el: $("<div class='entry-left'></div>"),
				render: function(ct) {
					this.el.appendTo(ct);
				},
				choose: function(type) {
					choose(type);
				},
				checkItems: function(data) {
					var $table = this.$table_el;
					if(data.allRights) {
						$(".checkbox", $table).removeClass("state0").addClass("state1").attr("chkstate", 1);
						$(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")).prop("checked", true);
						var trs = $("tbody tr", $table);
						if(!$table.entryKeys) $table.entryKeys = [];
						for (var i = 0, len = trs.length; i < len; i++) {
							var key = trs.eq(i).attr("key");
							$table.entryKeys.push(key);
						}
						
					} else {
						$(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")).prop("checked", false);
						var entryKeys = data.entryKeys, entryKey;
						$table.entryKeys = entryKeys;
						
						var $ptrs = [];
						for (var i = 0, len = entryKeys.length; i < len; i++) {
							entryKey = entryKeys[i];
							var id = entryKey.replace(/\//g, "_");
							var tr = $("[id='"+id+"']", $table);
							var $chk = $(".checkbox", tr);
							var state = 1;
							$chk.removeClass("state0");
							if(tr.attr("hasChild") == "true") {
								addPtrs(id, $ptrs, $table);
							} else {
								$chk.addClass("state1");
								$chk.attr("chkstate", 1);
							}
						}
						
						for (var i = 0, len = $ptrs.length; i < len; i++) {
							var pId = $ptrs[i];
							var $ptr = $("[id='"+$ptrs[i]+"']", $table);
							var _pchk = $("[pId='"+pId+"'] .checkbox", $table);
							var hasState0 = _pchk.hasClass("state0");
							var hasState1 = _pchk.hasClass("state1");
							var hasState2 = _pchk.hasClass("state2");
							if(hasState0 && !hasState1 && !hasState2) {
								var _chk = $(".checkbox", $ptr)
								if(!_chk.hasClass("state0")) {
									_chk.addClass("state0");
								}
								continue;
							} else if (hasState1 && !hasState0 && !hasState2) {
								$(".checkbox", $ptr).addClass("state1").attr("chkstate", 1);
							} else {
								$(".checkbox", $ptr).addClass("state2").attr("chkstate", 2);
							}
						}
					}
				},
				addRows: function(data) {
					var tbl = new RTS.Treetable($(".entry-left"), RTS.options);
					e_opt.noResize = true;
					this.$table_el = tbl.create(e_opt, data);
					this.$table_el.attr("isEntry", true);
					this.setEnable(false);
					this.$table = tbl;
					this.resize(this.el.width(), this.el.height());
				},
				setEnable: function(enable) {
					var $tbl = this.$table_el;
					var chks = $(".checkbox:not([class~='ignore'])", this.$table_el);
					if(enable) {
						chks.removeClass("readonly");
					} else {
						chks.addClass("readonly");
					}
					this.enable = enable;
//					$tbl.attr("enable", enable);
					$(".t-hdiv tr.title .checkbox", this.el).prop("disabled", !enable);
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