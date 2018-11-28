(function() {
	RTS = RTS || {};
	RTS.Form = function() {
		var rt = {
				el: $("<div class='form'/>"),
				id: "id_form_set",
				type: RTS.Rights_type.TYPE_FORM,
				caption: RTS.I18N.rightsset.formRights,
				empty: function() {
					this._right.empty();
				},
				render: function(ct) {
					this.el.appendTo(ct);
					var f_left = new RTS.Form_Left();
					var f_right = new RTS.Form_Right();
					var split = RTS.Split();
					split.add(f_left, "30%");
					split.add(f_right, "70%");
					split.render(this.el);
					this.split = split;
					this._right = f_right;
					this.f_left = f_left;
					RTS.formLeft = f_left;
					RTS.formRight = f_right;
				},
				addRows: function(data) {
					this.f_left.addRows(data);
				},
				resize: function(width, height) {
					this.el.width(width).height(height);
					this.split.resize(width, height);
				}
		};
		return rt;
	};
})();