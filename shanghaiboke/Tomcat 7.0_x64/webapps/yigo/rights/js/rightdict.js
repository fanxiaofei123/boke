(function() {
	RTS = RTS || {};
	RTS.Dict_Right = function() {
		var options = RTS.options;
		var dr_opt = {
			theme : 'default',
			expandLevel : 1,
			beforeExpand : function(node) {
		    	var def = $.Deferred();
				var id = node.attr('id');
				var expanded = node.attr('expanded');
				if(expanded) {
					return def.promise();
				}
				var _this = this;
				var parentID = id;
				var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
				var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
				return RTS.Service.dictExpand(operatorID, roleID, options.itemKey, parentID).then(function(newData) {
					var $dr_tbl = RTS.dictRight.$table._table;
					var dictData = newData.data;
					var item = $dr_tbl.treeNode.tree[id];
					var changed = item.changed;
					var checked = false;
					
					var data = {
						rows: dictData,
						cols: [{
								key: "code",
								caption: RTS.I18N.rightsset.code
							}, {
								key: "name",
								caption: RTS.I18N.dict.name
							}, {
								key: "hasRights",
								type: "checkbox",
								caption: RTS.I18N.rightsset.hasRights
							}],
						hasAllRights: newData.hasAllRights
					}
					
					var table = new RTS.Treetable(null, RTS.options);
					var html = table.createRowsHtml($dr_tbl, data, id);
					$dr_tbl.addChilds(html);
					node.attr("expanded", "expanded");
					if(changed) {
						checked = $(".checkbox", node).is(":checked");
						if(dictData.length > 0) {
							for (var i = 0, len = dictData.length; i < len; i++) {
								var $id = dictData[i].oid;
								var $item = $dr_tbl.treeNode.tree[$id];
								var hasRts = dictData[i].hasRights == 0 ? false : true;
								$item.changed = true;
								if(hasRts != checked) {
									if(checked) {
										$(".checkbox", $item.row).prop("checked", true);
										options.dict.addRts.push($id);
									} else {
										$(".checkbox", $item.row).prop("checked", false);
										options.dict.delRts.push($id);
									}
								}
							}
						}
					}
				});
			},
			onSelect : function($table, $tr) {
				if(!$table.target.hasClass("checkbox")) return;
				RTS.setChecked($table);
				var checked = $(".checkbox", $tr).is(":checked");
				if(!checked && options.dict.allRights) {
					options.dict.allRights = false;
					options.dict.saveType = 1;
				}
			}
		};

		var getChainDictData = function(itemKey, pageNum, fuzzyValue) {
			var startRow = pageNum * options.maxRows;
			var maxRows = options.maxRows;
			var pageIndicatorCount = options.pageIndicatorCount;
			var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
			var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
			return RTS.Service.getChainDictData(operatorID, roleID, itemKey, startRow, maxRows, pageIndicatorCount, fuzzyValue).then(function(chainData) {
				var data = {
					rows: chainData.data,
					cols: [{
							key: "code",
							caption: RTS.I18N.rightsset.code
						}, {
							key: "name",
							caption: RTS.I18N.dict.name
						}, {
							key: "hasRights",
							type: "checkbox",
							caption: RTS.I18N.rightsset.hasRights
						}],
					hasAllRights: chainData.hasAllRights,
					totalRowCount: chainData.totalRowCount
				}
				return data;
			});
		}
		var rt = {
				el: $("<div class='dict'><div class='rts-dict-right'></div></div>"),
				isChain: false,
				itemKey: null,
				map: {},
				render: function(ct) {
					this.el.appendTo(ct);
					this.install();
				},
				empty: function() {
					this.$table && this.$table.removeAll();
					$(".rts-dict-right", this.el).empty();
				},
				addRows: function(newData) {
					this.map = {};
					if(!newData) return;
					var $el = this.el;
					var tbl = null;
					if(this.isChain) {
						this.empty();
						$el.removeClass("normal");
						if($(".fuzzy", $el).length == 0) {
							var html = "<div class='fuzzy'>" +
											"<span class='rts-txted'><input type='text'/></span>" +
											"<button class='rts-btn'></button>" +
										"</div>";
							$el.prepend(html);
						}
						var count = newData.rows.length;
						var itemKey = this.itemKey;
				    	var _this = this;
						this.needResize = true;
						var page = $(".rts-dict-right", $el).pagination({
							pageSize: options.maxRows,
							//总记录数
					        totalNumber: count,
					        showPages: true,
					        showPageDetail: false,
					        showFirstButton: false,
					        showLastButton: false,
					        pageIndicatorCount: options.pageIndicatorCount,
					        pageChanges: function(pageNum) {
								var fuzzyVal = $(".fuzzy input", $el).val();
								var content = this.content;
								var _page = this;
								
								var tbl2 = _this.map[pageNum];
								if(!tbl2) {
									getChainDictData(itemKey, pageNum, fuzzyVal).then(function(data) {
										options.dictRts = [];
										_this.$table_el = tbl.create(dr_opt, data);
										_this.map[pageNum] = _this.$table_el;
										page.setTotalRowCount(pageNum*options.maxRows + data.totalRowCount);
										if(_this.needResize) {
											_this.resize(_this.el.width(), _this.el.height());
											_this.needResize = true;
										}
									});
								} else {
									$(".rts-dict-right .paginationjs-content", _this.el).empty().append(tbl2);
									_this.$table_el = tbl2;
								}
					        }
						});
						$el = page.content;
						tbl = new RTS.Treetable($el, options);
						this.pagination = page;
				    	var pagesH = $(".paginationjs-pages", $el).is(":hidden") ? 0 : $(".paginationjs-pages", $el).outerHeight();
				    	var realHeight = $el.height() - pagesH;
				    	page.content.css("height", realHeight);
				        options.setTotalRowCount = function(pageNum, totalRowCount) {
							page.setTotalRowCount(totalRowCount);
				        };
					} else {
						$el.addClass("normal");
						$(".fuzzy", $el).remove();
						tbl = new RTS.Treetable($(".rts-dict-right", $el), options);
						this.$table_el = tbl.create(dr_opt, newData);
					}
					this.$table = tbl;
					this.resize(this.el.width(), this.el.height());
					tbl.isChain = this.isChain;
					options.dictRts = [];
				},
				setEnable: function(enable) {
					if(!this.$table) return;
					var chks = $(".checkbox:not([class~='ignore'])", this.el);
					if(enable) {
						chks.removeAttr("disabled");
					} else {
						chks.attr("disabled", "disabled");
					}
				},
				resize: function(width, height) {
					this.el.width(width).height(height);
					var content = $(".rts-dict-right", this.el);
					var fuzzy = $(".fuzzy", this.el);
					var t_h = height;
					if(fuzzy.length > 0) {
						var txt = $(".fuzzy .rts-txted", this.el);
						var btn = $(".fuzzy .rts-btn", this.el);
						txt.outerWidth(width - btn.outerWidth() - 10);
						var c_height = height - fuzzy.outerHeight();
						content.outerHeight(t_h);
				    	var pagesH = $(".paginationjs-pages", content).outerHeight();
				    	t_h = c_height - pagesH;
				    	$(".paginationjs-content", content).css("height", t_h);
					} else {
						content.outerHeight(height);
					}
					this.$table && this.$table.resize(width, t_h);
				},
				install: function() {
					var $el = this.el;
					var _this = this;
					$el.delegate(".fuzzy .rts-btn", "click", function() {
						var isChain = options.clickTr.attr("secondaryType") == 5;
						if(isChain) {
//							$el = $(".paginationjs-content", $el);
							var pageNum = 0;
							var value = $(".fuzzy input", $el).val().toLowerCase();
							getChainDictData(options.itemKey, pageNum, value).then(function(data) {
								_this.$table && _this.$table.removeAll();
								options.dictRts = [];
								_this.$table_el = _this.$table.create(dr_opt, data);
//								_this.$table = tbl;
								_this.pagination.setTotalRowCount(pageNum*options.maxRows + data.totalRowCount);
							});
						} else {
							RTS.loopSearch(value, _this.$table_el);
						}
					});
				}
		};
		
		return rt;
	}
})();