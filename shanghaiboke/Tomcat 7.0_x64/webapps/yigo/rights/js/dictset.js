(function() {
	RTS = RTS || {};
	RTS.Dict = function() {
		var _this = this;
		var rt = {
				el: $("<div class='rts-dict'/>"),
				id: "id_dict_set",
				type: RTS.Rights_type.TYPE_DICT,
				caption: RTS.I18N.rightsset.dictRights,
				render: function(ct) {
					this.el.appendTo(ct);
					var d_left = new RTS.Dict_Left();
					var d_right = new RTS.Dict_Right();
					var split = RTS.Split();
					split.add(d_left, "30%");
					split.add(d_right, "70%");
					split.render(this.el);
					this.split = split;
					this._right = d_right;
					this.d_left = d_left;
					RTS.dictLeft = d_left;
					RTS.dictRight = d_right;
				},
				empty: function() {
					this._right && this._right.empty();
				},
				addRows: function(data) {
					this.d_left.addRows(data);
				},
				resize: function(width, height) {
					this.el.width(width).height(height);
					this.split.resize(width, height);
				}
		};
		return rt;
	};
})();