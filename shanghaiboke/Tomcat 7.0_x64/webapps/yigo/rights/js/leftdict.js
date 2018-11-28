(function() {
	RTS = RTS || {};
	RTS.Dict_Left = function() {
		var options = RTS.options;
		var html = "<div class='dict'>" +
						"<div class='search'>" +
							"<span class='rts-txted'><input type='text'/></span>" +
							"<button class='rts-btn'></button>" +
						"</div>" +
						"<div class='rts-dict-left'></div>" +
					"</div>";
		var el = $(html);
		
		var d_opt = {
			theme : 'default',
			expandLevel : 1,
			firstIndent: 0,
			onSelect : function($table, $tr) {
				if(!options.id) return;
				var flag = RTS.isClick($tr, $table);
				if(flag) return;
				options.clickTr = $tr;
				options.d_clickTr = $tr;
				
				options.type = RTS.Rights_type.TYPE_DICT;
				options.itemKey = $tr.attr("id");
				
				options.dict = {
					addRts: [],
					delRts: [],
					saveType: 0,
					allRights: false
				};
				
				var id = $tr.attr("id");
				var itemKey = id;
				var isChain = $tr.attr("secondaryType") == 5;
				RTS.dictRight.isChain = isChain;
				RTS.dictRight.itemKey = itemKey;
				var operatorID = options.tag == RTS.Custom_tag.OperatorRights ? options.id : -1;
				var roleID = options.tag == RTS.Custom_tag.RoleRights ? options.id : -1;
				var startRow = 0;
				var maxRows = options.maxRows;
				var pageIndicatorCount = options.pageIndicatorCount;
				var fuzzyValue = "";
				RTS.Service.LoadDictRightsData(operatorID, roleID, itemKey, isChain, startRow, fuzzyValue, maxRows, pageIndicatorCount).then(function(data) {
					var dictData = {
							rows: data.data,
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
							hasAllRights: data.hasAllRights
						};
						options.dict.allRights = data.hasAllRights;
						RTS.dictRight.addRows(dictData);
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
					var tbl = new RTS.Treetable($(".rts-dict-left", this.el), options);
					tbl.create(d_opt, data);
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
					var content = $(".rts-dict-left", this.el);
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