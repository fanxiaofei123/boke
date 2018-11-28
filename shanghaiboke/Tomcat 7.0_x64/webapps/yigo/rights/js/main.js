(function() {
	RTS = RTS || {};
	
	RTS.MainUI = function(ct) {
		var _this = this;
		var init = function(ct) {
			ct.append($("<div class='rts-main'>"));
			var l_item = new RTS.USERS();
			var r_item = new RTS.RightsSet();
			var split = RTS.Split();
			split.add(l_item, "25%");
			split.add(r_item, "75%");
			split.render($(".rts-main", ct));
			RTS.USERS = l_item;
			_this.split = split;
		};
		var rt = {
				resize: function(width, height) {
					_this.split.resize(width, height);
				}
		};
		init(ct);
		return rt;
	};

})();