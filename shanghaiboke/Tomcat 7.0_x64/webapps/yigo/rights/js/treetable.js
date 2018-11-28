"use strict";
(function() {
	RTS = RTS || {};
	RTS.Treetable = function(el, options) {
		var type = options.type;
		var defStatus = false;
		var resetItems = function(rows, pId) {
			var len = rows.length;
			if(len > 0){
				var row = null;
				for(var i=0,len=rows.length;i<len;i++) {
					row = rows[i];
					if(pId) {
						row.pid = pId;
					}
					row.previd = row.previd;
					row.id = row.OID || row.oid || row.key;
					var r_id = row.id;
					if(parent.$.isString(r_id)) {
						r_id = r_id.replace(/\//g, "_");
						row.id = r_id;
					}
				    if(row.items && row.items.length > 0) {
				    	row.hasChild = true;
				    	resetItems(row.items, row.id);
				    } else if(row.nodeType == 1) {
				    	row.hasChild = true;
				    }
				    if(!row.caption) {
					    row.caption = row.key || "";
				    }
				}
			}
		};
		var createRowsHtml = function($table, data, pId) {
			var rows = data.rows, 
				cols = data.cols;
			resetItems(rows, pId);
			return createRows(rows, cols, $table);
		};
		var createRows = function(rows, cols, $table) {
			var html = '';
			var len = rows.length;
			if(len > 0) {
				for(var i=0;i < len;i++) {
					var tr = createRow($table, rows[i], cols);
					html += tr[0].outerHTML;

					var items = rows[i].items;
					var child = "";
					if(items && items.length > 0) {
						html += createRows(items, cols, $table);
					} 
				}
			//} else  {
			//	var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
			//	$table.after(label);
			}
			
			return html;
		};
		var createRow = function($table, rowdata, colModel) {
			var tr = $('<tr id="'+rowdata.id+'"></tr>').attr("oid", rowdata.OID).attr("key", rowdata.key);
			if(rowdata.formKey) {
				tr.attr("formKey", rowdata.formKey);
				tr.attr("formCaption", rowdata.formCaption);
			}
			if(rowdata.rightsRelation) {
				tr.attr("rightsRelation", rowdata.rightsRelation);
				tr.attr("relationCaption", rowdata.relationCaption);
			}
			if(type == RTS.Rights_type.TYPE_DICT) {
				if(rowdata.hasRights && !rowdata.changed) {
					options.dictRts.push(rowdata.id);
					var hasRts = rowdata.hasRights == 0 ? false : true;
					tr.attr('hasRts', hasRts);
				}
			} else if(options.isFFData) {
				if(/*defStatus ||*/ !rowdata.visible) {
					options.visibleRts.push(rowdata.key);
				}
				if(/*defStatus || */!rowdata.enable) {
					options.enableRts.push(rowdata.key);
				}
			} else if(options.isFOData) {
				if(rowdata.hasRights) {
					options.optRts.push(rowdata.key);
				}
			}
			
			if(rowdata.pid != undefined ) {
				tr.attr('pId', rowdata.pid);
			}
			
			if(rowdata.previd != undefined ) {
				tr.attr('previd', rowdata.previd);
			}
				
			if(rowdata.hasChild){
				tr.attr('hasChild', true);
			}
			if(rowdata.secondaryType) {
				tr.attr("secondaryType", rowdata.secondaryType);
			}
			var value, hasRow = false;
			for (var j=0,len=colModel.length;j<len;j++) {
				var col = colModel[j];
				value = rowdata[col.key] || "";
				if(col.type == "checkbox") {
					var cb;
					if(col.isEntry) {
						cb = $("<span class='checkbox state0' chkstate='0'/>");
					} else {
						cb = $("<input type='checkbox' value='"+value+"' class='checkbox' />");
						if(!RTS.options.modify) {
							cb.attr("disabled", "disabled");
						}

						if(value || (type == RTS.Rights_type.TYPE_DICT && RTS.options.dict.allRights)) {
							cb.attr("checked", true);
						} else if(rowdata[col.key] == undefined) {
							cb.addClass("ignore");
						}
						
						if(type == RTS.Rights_type.TYPE_FORM) {
							var index = colModel[j].index;
							if((index == 0 && defStatus) || (index == 1 && defStatus)) {
								cb.attr("checked", true);
							}
						}
						
					}
					
					if(col.key == "enable" && rowdata.disable) {
						cb.attr("enable", "false");
					}
					if(col.index) {
						cb.attr("index", col.index);
					}
					$('<td></td>').append(cb).appendTo(tr);
					if(col.showText) {
						cb.after(value);
					}
				} else {
					$('<td><span>' + value + '</span></td>').appendTo(tr);
				}
			}
            tr.append($("<td class='space'></td>"));
			return tr;
		};
		var createTable = function(el, option, result) {
			if(result.length == 0 || !el) return null;
			el.empty();
			var colModel = result.cols;
			
			defStatus = result.defStatus;

			var ths = "", th, col, i, len, width;

			for (i=0, len=colModel.length; i<len; i++) {
				col = colModel[i];
				th = "<th>" ;

				if(col.type == "checkbox" && !col.hide) {

					var attr = "";
					if(!RTS.options.modify) {
						attr += "disabled='disabled'";
					}
					if(colModel[i].index) {
						attr += "index=" + col.index;
					}
					var cb = "<input type='checkbox' class='checkbox all' "+ attr +" />";
					th += cb;
				}

				th += "<label>" + col.caption + "</label>";

				if(!option.noResize) {
					th += "<span class='r-resize'/>";
				}

				ths += th + "</th>";
			}
			if(!option.noResize) {
				ths += "<th class='space' />";
			}

			var tr = "<tr class='title'> " + ths + " </tr>";

			var h_div = "<div class='t-hdiv'>"
			 			+ "<table cellspacing='0' cellpadding='0' border='0'>"
				 			+ "<thead>"
								+ tr
								+ "</thead>"
						+ "</table>" 
					+ "</div>";

			var tbody = createRowsHtml($table, result);

			var b_tbl = "<table cellpadding='0' cellspacing='0' enable=true><tbody>" + tbody + " </tbody></table>";
			var b_div = "<div class='t-bdiv'>" + b_tbl + "</div>";

			var html = "<div class='rts-tbl'><div class='rts-resize-mark'>&#160;</div><div>" + h_div + b_div + "</div></div>";
			el.append(html);
			
			var $table = $(".t-bdiv table", el);
			if($("tbody tr", $table).length > 0) {
				$table.next("label.empty").remove();
			} else  {
				var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
				$table.after(label);
			}
			
			option = $.extend({
				expandable: true,
				indent: 10,
				firstIndent: 20
			}, option);
			$table = $table.treetable(option);
			
			var chks = $(".t-hdiv tr.title .checkbox", el), childs;
			var $trs = $("tr:not([class~='title'])", $table);
			for (var i = 0, len = chks.length; i < len; i++) {
				switch(type) {
					case RTS.Rights_type.TYPE_DICT:
						if(result.hasAllRights || RTS.options.dict.allRights) {
							chks.eq(i).prop("checked", true);
						}
						break;
					case RTS.Rights_type.TYPE_ENTRY:
					case RTS.Rights_type.TYPE_FORM:
						if((result.allOptRights) || (i == 0 && result.allVisibleRights) || (i == 1 && result.allEnableRights)) {
							chks.eq(i).prop("checked", true);
						}
						if((i == 0 && result.defStatus) || (i == 1 && result.defStatus)) {
							chks.eq(i).prop("checked", true);
						}
						break;
				}			
			}
			return $table;
		};
        var addEmptyRow = function($table, el) {
            var $body = el;
            var $tbody = $("tbody", $table);
            $("tr.space", $tbody).remove();
            var tr_h = $("tr", $tbody).first().outerHeight();
            var body_h = $tbody.outerHeight();
            if(!body_h) {
                var len = $("tr", $tbody).length;
                body_h = 0;
                for (var i = 0; i < len; i++) {
                    body_h +=  $("tr", $tbody).eq(i).outerHeight();
                }
            }
            var client_h = ($body[0].clientHeight || $body.height());
            var total_h = (client_h - body_h - $("thead", $table).outerHeight());
            var count = Math.ceil( total_h / 30);
            var last_h = total_h - (count - 1) * 30;
            if(count <= 0) return;
            for (var i = 0; i < count; i++) {
                var $tr = $("<tr></tr>").addClass("space").appendTo($tbody);
                var index = $tr.index() + 1;
                if(index % 2 == 0) {
                    $tr.addClass("even");
                }

                var size = $("thead tr th", $table).length;
                for (var m = 0; m < size; m++) {
                	 var $td = $('<td></td>');
                     $tr.append($td);
				}

				if(!option.noResize) {
	                $tr.append($("<td class='space'></td>"));
				}

                if(i == count - 1) {
                    $tr.addClass("last");
                    $("td", $tr).height(last_h);
                    var h = client_h - $tbody.height();
                    if(h > 0 && h < tr_h) {
                        $("td", $tr).height(last_h + h);
                    }
                } else {
                    $tr.outerHeight(30);
                }
            }
        };
		var rt = {
				el: el,
				_table: null,
				create: function(option, result) {
					this._table = createTable(el, option, result);
					this.install(option);
					return this._table;
				},
				createRowsHtml: function($table, data, pId) {
					return createRowsHtml($table, data, pId);
				},
				addEmptyRow: function() {
					var tbl = this._table;
					addEmptyRow(tbl, tbl.parent());
				},
				removeAll: function() {
					if(this._table) {
						this._table.removeAll();
						if(this._table.next("label.empty").length == 0) {
							var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
							this._table.after(label);
						}
					}
				},
				resize: function(width, height) {
		            var hDiv = $(".t-hdiv", el);
		            var bDiv = $(".t-bdiv", el);

					var h = height - hDiv.outerHeight();
					bDiv.css("height", h + "px");

					var th = $("th:not([class~='space'])", hDiv);
					if((th.length > 0) && (th[0].style.width == "" || th.length == 1)) {
						var w = ((width - 1)/th.length).toFixed(2);
						th.css("width", w + "px");
					} else {
						$("th.space", hDiv).css("width", "100%");
					}
					var td = $("tr:first td:not([class~='space'])", bDiv);
					if((td.length > 0) && (td[0].style.width == "" || td.length == 1)) {
						var w = ((width - 1)/td.length).toFixed(2);
						td.css("width", w + "px");
					}
	                hDiv.scrollLeft(0);
	                bDiv.scrollLeft(0);

				},
				install: function(option) {
		            var  _this = this;
		            var hDiv = this.hDiv = $(".t-hdiv", el);
		            var bDiv = this.bDiv = $(".t-bdiv", el);

		            var getOffset = function (iCol) {     //获取某个列的位置信息
		                var tbl = this, $th = $("th", tbl.el).eq(iCol);
		                var ret = [$th.position().left + $th.outerWidth()];

		                ret[0] -= tbl.bDiv.scrollLeft();
		                ret.push(tbl.hDiv.position().top);
		                ret.push(tbl.bDiv.offset().top - $(tbl.hDiv).offset().top);
		                return ret;
		            };

					$(".r-resize", el).off("mousedown").mousedown(function (e) {
	                    var th = $(this).parents("th");
	                    var ci = parseInt(th.index());
	                    dragStart.call(_this, ci, e, getOffset.call(_this, ci));
	                });

			        bDiv.scroll(function() {
			            var left = bDiv.scrollLeft();
			            if(left >= 0) {
			                hDiv.scrollLeft(left);
			                if(bDiv[0].clientWidth != bDiv[0].scrollWidth) {
			                    var scroll_w = bDiv.width() - bDiv[0].clientWidth;
			                    $(".space", hDiv).outerWidth(scroll_w || "100%");
			                }
			            }
			        })

					var dragStart = function (i, e, y) {  //修改列大小，拖动开始
						var _this = this;
                        var gridLeftPos = _this.bDiv.offset().left;
                        _this.resizing = { idx: i, startX: e.clientX, sOL: e.clientX - gridLeftPos };
                        _this.hDiv.css("cursor" , "col-resize");

                        _this.curGbox = $(".rts-resize-mark", _this.el);
                        _this.curGbox.css({display: "block", left: e.clientX - gridLeftPos, top: y[1], height: y[2]});
                        document.onselectstart = function () {  //不允许选中文本
                            return false;
                        };

						// 监听鼠标拖动、鼠标松开事件
						$(document).off('mousemove').off('mouseup.splitter')
					  		.on('mousemove', null, _this, dragMove)
					  		.on('mouseup.splitter', null, _this, dragEnd);
                    };
                    var dragMove = function (e) {      //修改列大小，拖动中
						var _this = e.data;
                        if (_this.resizing) {
                            var diff = e.clientX - _this.resizing.startX, 
                            	th = $("th", _this.hDiv)[_this.resizing.idx],
                                newWidth = (th.cWidth || $(th).outerWidth()) + diff;
                            if (newWidth > 33) {
                                _this.curGbox.css({left: _this.resizing.sOL + diff/* - _this.bDiv[0].scrollLeft*/});
                                _this.newWidth = $("table", _this.hDiv).width() + diff;
                                th.newWidth = newWidth;
                            }
                        }
                    };
                    var dragEnd = function (e) {         //修改列大小，拖动结束
						var _this = e.data;
                        _this.hDiv.css("cursor", "default");
                        if (_this.resizing) {
                            var idx = _this.resizing.idx, 
	                            th = $("th", _this.hDiv)[idx], 
	                            nw = th.newWidth || $(th).outerWidth();
                            nw = parseInt(nw, 10);
                            _this.resizing = false;
                            _this.curGbox && _this.curGbox.css({display: "none"});

                            th.cWidth = nw;
                            th.style.width = nw + "px";

                            // $("tr.first td:eq("+idx+")", _this.bDiv).css("width", nw + "px");
                            $("tr:eq(0) td:eq("+idx+")", _this.bDiv).css("width", nw + "px");
                            $(".space", _this.el).css("width", "100%");
                            var tblwidth = _this.newWidth || 100;

                            _this.hDiv[0].scrollLeft = _this.bDiv[0].scrollLeft;
                        }
                        _this.curGbox = null;
		  				$(document).off('mousemove', dragMove).off('mouseup.splitter', dragEnd);
                        document.onselectstart = function () {  //允许选中文本
                            return true;
                        };
                    };


                    $(".t-hdiv .checkbox.all", el).click(function(e) {
                    	_this._table.target = $(this);
                    	option.onSelect(_this._table, $(this).parents("tr").eq(0));
                    });

				}
				
		};
		return rt;
	};
})();