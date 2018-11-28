(function() {
	RTS = RTS || {};
	RTS.Entry = function() {
		var rt = {
				el: $("<div class='rts-entry'></div>"),
				id: "id_entry_set",
				type: RTS.Rights_type.TYPE_ENTRY,
				caption: RTS.I18N.rightsset.entryRights,
				checkItems: function(value) {
					this._entry.checkItems(value);
				},
				render: function(ct) {
					this.el.appendTo(ct);
					var e_left = new RTS.Entry_Left();
					var e_right = new RTS.Form_Right();
					var split = RTS.Split();
					split.add(e_left, "30%");
					split.add(e_right, "70%");
					split.render(this.el);
			  	
					var multi = "<div class='choose'>" +
									"<div class='multi-sel'>" +
										"<input type='text' class='txt' disabled='disabled'/>" +
										"<span class='arrow'></span>" +
									"</div>" +
									"<div class='vw'><ul>" + 
										"<li value='0'>EntryForm</li>" +
										"<li value='1'>RelationForm</li>" +
									"</ul></div>" +
								"</div>";
					e_right.el.prepend(multi);
					
					this.split = split;
					this._entry = e_left;
					RTS.entryRight = e_right;
					RTS.entryLeft = e_left;

					e_right.el.hide();
					this.install();
				},
				addRows: function(data) {
					this._entry.addRows(data);
				},
				
				resize: function(width, height) {
					this.el.width(width).height(height);
					this.split.resize(width, height);
				},
				install: function() {
					var _this = this;
					var view = $(".choose .vw", this.el);
					$(".choose .multi-sel", this.el).click(function(e) {
						if(RTS.options.modify) return;
						view.toggleClass("show");
                        $(document).on("mousedown", function (e) {
                            var target = $(e.target);
                            if (target.closest($(".choose", _this.el)).length == 0) {
                            	view.removeClass("show");
                		    	$(document).off("mousedown");
                            }
                        });
					});
					var lis = $(".choose .vw li", this.el);
					lis.click(function(e) {
						lis.removeClass("sel");
						var li = $(this);
						li.addClass("sel");
						var value = li.attr("value");
						$(".choose .multi-sel .txt", this.el).val(li.text());
						RTS.entryLeft.choose(value);
						view.removeClass("show");
					});
				}
		};
		return rt;
	}
})();