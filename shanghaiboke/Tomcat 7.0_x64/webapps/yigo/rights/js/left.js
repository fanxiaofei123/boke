(function() {
	RTS = RTS || {};
	RTS.USERS = function() {
		var options = RTS.options;
		var itemKey = "Role";
		if(options.tag == RTS.Custom_tag.OperatorRights) {
			itemKey = "Operator";
		}
		var html = "<div class='user'>" +
						"<div class='search'>" +
							"<span class='rts-txted'><input type='text'/></span>" +
							"<button class='rts-btn'></button>" +
						"</div>" +
						"<div class='rts-users'></div>" +
					"</div>";
		var el = $(html);
		
		var emptyAll = function() {
			var $dr_tbl = RTS.dictRight.$table_el;
			$dr_tbl && $dr_tbl.removeAll();
			if(RTS.formRight && RTS.formRight.f_field && RTS.formRight.f_opt) {
				var $ff_tbl = RTS.formRight.f_field.$table_el;
				var $fo_tbl = RTS.formRight.f_opt.$table_el;
				$ff_tbl && $ff_tbl.removeAll();
				$fo_tbl && $fo_tbl.removeAll();
			}
			if(RTS.entryRight && RTS.entryRight.f_field && RTS.entryRight.f_opt) {
				var $ff_tbl = RTS.entryRight.f_field.$table_el;
				var $fo_tbl = RTS.entryRight.f_opt.$table_el;
				$ff_tbl && $ff_tbl.removeAll();
				$fo_tbl && $fo_tbl.removeAll();
			}
		};
		
		var user_opt = {
			theme : 'default',
			expandLevel : 1,
			firstIndent: 0,
			onSelect : function($table, $tr) {
				var flag = RTS.isClick($tr, $table);
				if(flag) return;
				
				$(".rts-tbr .modify").addClass("enable");

				options.id = $tr.attr("id");
//					emptyAll();

				$(".checkbox").removeClass("state0").removeClass("state1").removeClass("state2").addClass("state0");
				$(".checkbox").attr("chkstate", 0);
				
				var paras = {
					cmd: "LoadEntryRightsData",
					service: "SetRightsService",
				}
				var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
				var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
				RTS.Service.LoadEntryRightsData(operatorID, roleID).then(function(data) {
					$table.allRights = data.allRights;
					RTS.obj.dict.empty();
					RTS.obj.form.empty();
					RTS.obj.entry.checkItems(data);
					options.clickTr = $tr;
					if(options.e_clickTr) {
						options.e_clickTr.removeClass("sel");
						options.e_clickTr.click();
					}
					if(options.d_clickTr) {
						options.d_clickTr.removeClass("sel");
						options.d_clickTr.click();
					}
					if(options.f_clickTr) {
						options.f_clickTr.removeClass("sel");
						options.f_clickTr.click();
					}
				});
			}
		};
		
		var getUserList = function(result) {
			for (var i = 0; i < result.data.length; i++) {
				var oid = result.data[i].OID;
				if(oid == options.userID || oid == 21 || oid == 11) {
					result.data.splice(i, 1);
					i--;
				}
			}
			var totalRowCount = result.totalRowCount;
			var data = {
				rows: result.data,
				cols: [{
					key: "Code",
					caption: RTS.I18N.dict.code
				}, {
					key: "Name",
					caption: RTS.I18N.dict.name
				}],
				totalRowCount: totalRowCount
			};
			return data;
		};
		
		var rt = {
				el: el,
				render: function(ct) {
					this.el.appendTo(ct);
					var self = this;
					var maxRows = options.maxRows;
					var pageIndicatorCount = options.pageIndicatorCount;
					var fuzzyValue = $(".rts-txted input", el).val();
					RTS.Service.getUserData(0, maxRows, pageIndicatorCount, fuzzyValue, itemKey).done(function(result) {
						var data = getUserList(result);
						var tbl_el = $(".rts-users");
						var pagination = tbl_el.pagination({
							pageSize: maxRows,
							//总记录数
					        totalNumber: result.totalRowCount,
					        showPages: true,
					        showPageDetail: false,
					        showFirstButton: false,
					        showLastButton: false,
					        pageIndicatorCount: pageIndicatorCount,
					        pageChanges: function(pageNum) {
					        	fuzzyValue = $(".rts-txted input", el).val();
					        	var _this = this;
								RTS.Service.getUserData(pageNum, maxRows, pageIndicatorCount, fuzzyValue, itemKey).done(function(result) {
									var data = getUserList(result);
									self.$tbl.removeAll();
									options.dictRts = [];
									self.$tbl.create(user_opt, data);
									_this.setTotalRowCount(pageNum*maxRows + data.totalRowCount, false);
							    	
									self.resize(el.width(), el.height());
								});
					        }
						});
						var tbl = new RTS.Treetable(pagination.content, options);
						tbl.create(user_opt, data);
						self.$tbl = tbl;
						self.pagination = pagination;
						// self.resize(el.width(), el.height());
					});
					this.install();
				},
				setEnable: function(enable) {
					this.$tbl._table.attr("enable", enable);
					$(".search input", this.el).attr("readonly", !enable);
					$(".search .rts-btn", this.el).attr("disabled", !enable);
				},
				resize: function(width, height) {
					var el = this.el;
					el.width(width).height(height);
					var txt = $(".rts-txted", el);
					var btn = $(".rts-btn", el);
					txt.outerWidth(width - btn.outerWidth() - 10);
					var input = $("input", txt);
					input.width(txt.width());

					var c_height = height - $(".search", el).outerHeight();
					var pagesH = 0;
					if(!$(".paginationjs-pages", el).is(":hidden")) {
						pagesH = $(".paginationjs-pages", el).outerHeight();
					}
			    	var realHeight = c_height - pagesH;
			    	$(".paginationjs-content", el).css("height", realHeight);
			    	
					this.$tbl && this.$tbl.resize(width, c_height);
				},
				install: function() {
					var self = this;
					var tr_first = null;
					var tr_normal = null;
					var hasClick = false;
					$(".rts-btn", self.el).click(function(e) {
						if(!hasClick) {
							hasClick = true;
							tr_first = $("tr", self.$tbl._table).eq(0);
							tr_normal = $("tr", self.$tbl._table).eq(1);

							var first = tr_first.clone();
							first.addClass("first").attr({
								id: null,
								oid: null
							});
							$("td", first).empty();
							first.prependTo(self.$tbl._table);
						}

						var fuzzyValue = $(".rts-txted input", self.el).val();
						var maxRows = options.maxRows;
						var pageIndicatorCount = options.pageIndicatorCount;
						var pageNum = 0;
						RTS.Service.getUserData(pageNum, maxRows, pageIndicatorCount, fuzzyValue, itemKey).done(function(result) {
							var data = getUserList(result);
							var table = self.$tbl._table;
							var td = $("tr", table).eq(0).children("td:not(.space)");

							var rows = data.rows;
							options.dictRts = [];
							$("tbody tr:not(.first)", table).remove();
							table.next("label.empty").remove();
							if(rows.length > 0 ) {
								// table.removeAll();
								for (var i = 0, len = rows.length; i < len; i++) {
									var row = rows[i];
									var tr = null;
									var tds = [];
									// if(i == 0) {
									// 	tr = tr_first.clone();
									// } else {
										tr = tr_normal.clone();
									// }
									tr.attr({
										id: row.OID,
										oid: row.OID
									});
									tds = $("td", tr);
									
									var code = $("span:not(.indenter)", tds.eq(0));
									var name = $("span", tds.eq(1));
									code.text(row.Code);
									name.text(row.Name);
									$("tbody", table).append(tr);
									options.dictRts.push(row.OID);
								}
							} else {
								self.$tbl.removeAll();
							}
							// self.$tbl.removeAll();
							// options.dictRts = [];
							// self.$tbl.create(user_opt, data);

							self.pagination.setTotalRowCount(pageNum*options.maxRows + data.totalRowCount, false);
						});
						emptyAll();
						options.id = null;
					});
				}
		};
		return rt;
	}
})();