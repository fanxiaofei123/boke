(function() {
	RTS = RTS || {};
	RTS.RightsSet = function() {
		var tbr_html = "<div class='rts-tbr'>" +
							"<button class='btn modify'>"+RTS.I18N.rightsset.modify+"</button>" +
							"<button class='btn cancel'>"+RTS.I18N.dict.cancel+"</button>" +
							"<button class='btn save'>"+RTS.I18N.rightsset.save+"</button>" +
						"</div>";
		var html = "<div class='right'>" + tbr_html +
						"<div class='rts-set'></div>" +
					"</div>";
		var el = $(html);
		var options = RTS.options;
		var _this = this;
		var rt = {
				el: el,
				render: function(ct) {
					this.el.appendTo(ct);
					var tab = new RTS.TabPanel();
					var entry = new RTS.Entry();
					var dict = new RTS.Dict();
					var form = new RTS.Form();
					tab.add(entry);
					tab.add(dict);
					tab.add(form);
					tab.render($(".rts-set", el));
					this.tab = tab;
					
					RTS.obj = {
						entry: entry,
						dict: dict,
						form: form
					};

					var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
					var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
					RTS.Service.LoadRightsList(operatorID, roleID).then(function(rights) {
						if(!rights) return;
						
						var entryRts = rights.entry;
						var eData = {
							rows: entryRts,
							cols: [{
								key: "caption",
								caption: RTS.I18N.rightsset.selectAll,
								type: "checkbox",
								showText: true,
								isEntry: true
							}]
						};
						entry.addRows(eData);

						var dictRts = rights.dict;
						var dData = {
							rows: dictRts,
							cols: [{
								key: "caption",
								caption: RTS.I18N.dict.name
							}, {
								key: "key",
								caption: RTS.I18N.rightsset.key
							}]
						};
						dict.addRows(dData);
						
						var formRts = rights.form;
						var fData = {
							rows: formRts,
							cols: [{
								key: "caption",
								caption: RTS.I18N.dict.name
							}, {
								key: "key",
								caption: RTS.I18N.rightsset.key
							}]
						};
						form.addRows(fData);
					});
					this.install();
				},
				resize: function(width, height) {
					this.el.width(width).height(height);
					var tab_h = height - $(".rts-tbr", this.el).outerHeight();
					this.tab.resize(width, tab_h);
				},
				install: function() {
					var _this = this;
					var modify = function() {
						options.modify = true;
						$(".rts-tbr .modify").removeClass("enable");
						$(".rts-tbr .save").addClass("enable");
						$(".rts-tbr .cancel").addClass("enable");
						RTS.USERS.setEnable(false);
						_this.tab.setEnable(false);
						RTS.dictLeft.setEnable(false);
						RTS.formLeft.setEnable(false);
						RTS.entryRight.setEnable(true);
						RTS.dictRight.setEnable(true);
						RTS.formRight.setEnable(true);
						RTS.entryLeft.setEnable(true);
					};
					var isHalfCheck = function(root) {
						var $dr_tbl = RTS.dictRight.$table_el;
						var size = $("[pId='"+root.id+"'] .checkbox:checked", $dr_tbl).length;
						var halfCheck = false;
						var childs = root.children;
						if(size == childs.length) {
							//子节点全选
							for (var i = 0, len = childs.length; i < len; i++) {
								var child = childs[i];
								if(child.children && child.children.length > 0) {
									halfCheck = isHalfCheck(child);
								}
							}
						} else {
							halfCheck = true;
						}
						return halfCheck;
					};
					var getDictChanged = function(roots, allRts, noAllRts, delRts) {
						if(roots.length > 0) {
							for (var i = 0, len = roots.length; i < len; i++) {
								var root = roots[i];
								var row = root.row;
								var chk = $(".checkbox", row);
								var checked = chk.is(":checked");
								
								if(root.changed) {
									if(root.children && root.children.length > 0) {
										//汇总节点
										if(checked) {
											//子节点部分勾选
											noAllRts.push(root.id);
											getDictChanged(root.children, allRts, noAllRts, delRts);
										} else {
											//子节点无勾选
											delRts.push(root.id);
										}
									} else {
										//明细节点
										if(checked) {
											if(options.dict.saveType != 1){
												delRts.push(root.id);
											}											
											allRts.push(root.id);
										} else {
											delRts.push(root.id);
										}
									}
									root.changed = null;
									row.attr('hasRts', checked || null);
								} else {
									if(root.children && root.children.length > 0) {
										getDictChanged(root.children, allRts, noAllRts, delRts);
									}
								}
							}
						}
					};
					var save = function() {
						options.modify = false;
						$(".rts-tbr .modify").addClass("enable");
						$(".rts-tbr .save").removeClass("enable");
						$(".rts-tbr .cancel").removeClass("enable");
						RTS.USERS.setEnable(true);
						_this.tab.setEnable(true);
						RTS.entryLeft.setEnable(false);
						RTS.dictLeft.setEnable(true);
						RTS.formLeft.setEnable(true);
						RTS.entryRight.setEnable(false);
						RTS.dictRight.setEnable(false);
						RTS.formRight.setEnable(false);
						var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
						var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
						var type = options.type;
						switch(type) {
							case RTS.Rights_type.TYPE_ENTRY:
								var $e_tbl = RTS.entryLeft.$table_el;
								var rights = $.toJSON($e_tbl.entryKeys);
								var allRights = $e_tbl.allRights;
								RTS.Service.SaveEntryRights(operatorID, roleID, rights, allRights);
								if(options.e_formKey) {
									var $ff_tbl = RTS.entryRight.f_field.$table_el;
									var $fo_tbl = RTS.entryRight.f_opt.$table_el;
									var formKey = options.formKey;
									var optRts = $.toJSON($fo_tbl.optRts);
									var allOptRts = $fo_tbl.allOptRights;
									var enableRts = $.toJSON($ff_tbl.enableRts);
									var allEnableRts = $ff_tbl.hasAllEnableRights;
									var visibleRts = $.toJSON($ff_tbl.visibleRts);
									var allVisibleRts = $ff_tbl.hasAllVisibleRights;
									RTS.Service.SaveFormRights(operatorID, roleID, formKey, optRts, allOptRts, enableRts, allEnableRts, visibleRts, allVisibleRts);
								}
								break;
							case RTS.Rights_type.TYPE_DICT:
								var $dr_tbl = RTS.dictRight.$table_el;
								var allRts = options.dict.allRights;
								var isChain = options.clickTr.attr("secondaryType") == 5;
								var halfCheckRights = [], delRights = [], addRights = [];
								if(!isChain) {
									var addRts = [], 
										noAllRts = [], 
										delRts = [];
									var roots = $dr_tbl.treeNode.roots;
									getDictChanged(roots, addRts, noAllRts, delRts);
									halfCheckRights = $.toJSON(noAllRts);
									delRights = $.toJSON(delRts);
									addRights = $.toJSON(addRts);
								} else {
									addRights = $.toJSON(options.dict.addRts);
									delRights = $.toJSON(options.dict.delRts);
								}
								var itemKey = options.itemKey;
								var saveType = options.dict.saveType;
								RTS.Service.SaveDictRights(operatorID, roleID, isChain, halfCheckRights, delRights, addRights, allRts, saveType, itemKey)
											.then(function() {
												if(options.dict) {
													options.dict.saveType = 0;
												}
											});
								break;
							case RTS.Rights_type.TYPE_FORM:
								var $ff_tbl = RTS.formRight.f_field.$table_el;
								var $fo_tbl = RTS.formRight.f_opt.$table_el;
								var allOptRts = $fo_tbl.allOptRights;
								var optRts = $.toJSON($fo_tbl.optRts);
								var allEnableRts = $ff_tbl.hasAllEnableRights;
								var enableRts = $.toJSON($ff_tbl.enableRts);
								var allVisibleRts = $ff_tbl.hasAllVisibleRights;
								var visibleRts = $.toJSON($ff_tbl.visibleRts);
								var formKey = options.formKey;
								RTS.Service.SaveFormRights(operatorID, roleID, formKey, optRts, allOptRts, enableRts, allEnableRts, visibleRts, allVisibleRts);
								break;
						}
					};
					var cancel = function() {
						options.modify = false;
						$(".rts-tbr .modify").addClass("enable");
						$(".rts-tbr .save").removeClass("enable");
						$(".rts-tbr .cancel").removeClass("enable");
						RTS.USERS.setEnable(true);
						_this.tab.setEnable(true);
						RTS.entryLeft.setEnable(false);
						RTS.dictLeft.setEnable(true);
						RTS.formLeft.setEnable(true);
						RTS.entryRight.setEnable(false);
						RTS.dictRight.setEnable(false);
						RTS.formRight.setEnable(false);
						if(options.dict) {
							options.dict.saveType = 0;
						}
						var clickTr = null;
						switch(options.type) {
							case RTS.Rights_type.TYPE_ENTRY:
							clickTr = options.e_clickTr;
							break;
							case RTS.Rights_type.TYPE_DICT:
							clickTr = options.d_clickTr;
							break;
							case RTS.Rights_type.TYPE_FORM:
							clickTr = options.f_clickTr;
							break;
						}
						if(clickTr) {
							clickTr.removeClass("sel");
							clickTr.click();
						}
					};
					$(".rts-tbr").click(function(e) {
						var target = $(e.target);
						if(!target.hasClass("enable")) return;
						if(target.hasClass("modify")) {
							modify();
						} else if(target.hasClass("save")) {
							save();
						} else if(target.hasClass("cancel")){
							cancel();
						}
					});
					
				}
		};
		return rt;
	};
})();