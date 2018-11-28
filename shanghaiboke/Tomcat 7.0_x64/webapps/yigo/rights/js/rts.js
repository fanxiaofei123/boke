var RTS = RTS || {};
RTS.Custom_tag = {
	    UserInfoPane: "UserInfoPane",
	    RoleRights: "RoleRights",
	    OperatorRights: "OperatorRights"
};
RTS.Rights_type = {
	    TYPE_ENTRY: 0,
	    TYPE_DICT: 1,
	    TYPE_FORM: 2
};
RTS.Service = parent.YIUI.RTS_Service;
RTS.I18N = parent.YIUI.I18N;

RTS.isClick = function($tr, $table) {
	var flag = false;
	if($tr.hasClass("title")) {
		flag = true;
	}
	var $selTr = $("tr.sel", $table);
	if($selTr.length > 0) {
		if($selTr.attr("id") == $tr.attr("id")) {
			flag = true;
		}
		$selTr.removeClass("sel");
		$tr.addClass("sel");
	} else {
		$tr.addClass("sel");
	}
	return flag;
};

RTS.checkCtr = function($table, id, isCheck, index) {
	if(!id) return;
	var options = RTS.options;
	var node = $table.treeNode.tree[id], pNode, $chk, tr;
	var children = node.children, child;
	if(!children || children.length == 0) return;
	for (var i = 0, len = children.length; i < len; i++) {
		child = children[i];
		var $ctr = $("[id='"+child.id+"']", $table);
		$chk = $(".checkbox:not([index])", $ctr);
		if(options.isField) {
			if(index > 0) {
				$chk = $(".checkbox[index='"+index+"']", $ctr);
			}
			tr = $chk.parents("tr").eq(0);
			var chkData = {
				id: tr.attr("id")
			};
			if(index == 0) {
				//可见为false时相应的enable为false
				if(!isCheck) {
					$(".checkbox", tr).eq(1).prop("checked", false);
					chkData.enable = false;
				}
				chkData.visible = isCheck;
			}
			if(index == 1) {
				//enable全部为true时相应的visible也为true
				if(isCheck) {
					$(".checkbox", tr).eq(0).prop("checked", true);
					chkData.visible = true;
				} else {
					// 记录子节点可见性
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
				}
				chkData.enable = isCheck;
			}
			if(index == 0) {
				chkData.visible = isCheck;
			} else if(index == 1) {
				chkData.enable = isCheck;
			}
			RTS.setRts(tr.attr("id"), isCheck, $table, chkData);
		} else {
			if($chk.attr("chkstate") > -1) {
				if($chk.attr("chkstate") != isCheck) {
					$chk.removeClass("state0").removeClass("state1").removeClass("state2")
					.addClass("state" + isCheck).attr("chkstate", isCheck);
				}
			}
			RTS.setRts(child.id, isCheck, $table);
		}
//		if(!$chk.attr("chkstate")) {
			$chk.prop("checked", isCheck);
//		}
		RTS.checkCtr($table, child.id, isCheck, index);
	}
};
RTS.checkPtr = function($table, id, isCheck, index) {
	var options = RTS.options;
	var $chk;
	if(id) {
		var pNode = $table.treeNode.tree[id];
		var $pr = $("[id='"+id+"']", $table);
		$chk = $(".checkbox:not([index])", $pr);
//		if(isCheck && $chk.is(":checked") != isCheck) {
		if(/*isCheck && */$chk.attr("chkstate") != isCheck) {
//			$chk.prop("checked", true);
			//半勾状态
			var $ctrs = $("[pid='"+id+"']");
			if($(".checkbox", $ctrs).hasClass("state0") || $(".checkbox", $ctrs).hasClass("state2")) {
				if(!$(".checkbox", $ctrs).hasClass("state1") && !$(".checkbox", $ctrs).hasClass("state2")) {
					$chk.removeClass("state1").removeClass("state2").addClass("state0").attr("chkstate", 0);
				} else {
					$chk.removeClass("state0").removeClass("state1").addClass("state2").attr("chkstate", 2);
				}
			} else if(!$(".checkbox", $ctrs).hasClass("state2")) {
				$chk.removeClass("state2").removeClass("state0").addClass("state1").attr("chkstate", 1);
			}
		}
		if(options.isField) {
			if(index > 0) {
				$chk = $(".checkbox[index='"+index+"']", $pr);
			}
			var tr = $chk.parents("tr").eq(0);
			var chkData = {
				id: tr.attr("id")
			};
			if(index == 0) {
				//可见为false时相应的enable为false
				if(!isCheck) {
//					$(".checkbox", tr).eq(1).prop("checked", false);
				}
//				chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
//				chkData.visible = isCheck;
			}
			if(index == 1) {
				//enable全部为true时相应的visible也为true
				if(isCheck) {
					$(".checkbox", tr).eq(0).prop("checked", true);
					chkData.visible = true;
				}
//				chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
//				chkData.enable = isCheck;
			}
			if(isCheck) {
				$(".checkbox", tr).eq(index).prop("checked", true);
			}
			chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
			chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
			RTS.setRts(tr.attr("id"), isCheck, $table, chkData);
		} else {			
			if(isCheck && $chk.prop("checked") != isCheck) {
				$chk.prop("checked", true);
			}
			
			// 特殊处理操作权限子节点勾选
			var type = options.type;
			switch(type) {
			case RTS.Rights_type.TYPE_ENTRY:
				if($table.attr("isEntry")) {
					RTS.setRts(id, isCheck, $table);
				} else {
					if (isCheck) {
						RTS.setRts(id, isCheck, $table);
					}
				}
				break;
			case RTS.Rights_type.TYPE_DICT:
				RTS.setRts(id, isCheck, $table);
				break;
			case RTS.Rights_type.TYPE_FORM:
				if (isCheck) {
					RTS.setRts(id, isCheck, $table);
				}
				break;
			}
		}
		RTS.checkPtr($table, pNode.parentId, isCheck, index);
	}
};

var setEntryRts = function(id, state, $table) {
	var type = RTS.options.type;
	
	if((state == 0) && $table.allRights) {
		$table.allRights = false;
	}
	//是否有所有权限
	if(!$table.entryKeys)  $table.entryKeys= [];
	var entryKeys = $table.entryKeys;
	
	var key = $("#"+id, $table).attr("key");
	if(state > 0) {
		entryKeys.push(key);
	} else {
		$(".t-hdiv tr.title .checkbox", $table.parents(".rts-tbl")).prop("checked", false);

		if($("[id='"+id+"'] .checkbox", $table).attr("chkstate") == 2) return;
		for (var i = 0, len = entryKeys.length; i < len; i++) {
			if(entryKeys[i] == key) {
				entryKeys.splice(i, 1);
				break;
			}
		}
	}
	
};
var setDictRts = function(id, isCheck, $table) {
	var options = RTS.options;
	var node = $table.treeNode.tree[id];
	var hasRts = node.row.attr('hasRts') == undefined ? false : true;
//	if($(".checkbox", node.row).is(":checked") == isCheck && isCheck != hasRts && !node.changed) {
//		node.changed = true;
//	}
	node.changed = true;

	var isChain = options.clickTr.attr("secondaryType") == 5;
	if(!isChain) return;
	
	var addRts = options.dict.addRts;
	var delRts = options.dict.delRts;
	var dictRts = options.dictRts;
	var isAdd = true;
	for (var i = 0, len = dictRts.length; i < len; i++) {
		if(dictRts[i] == id) {
			isAdd = false;
			break;
		}
	}
	if(isCheck) {
		//选中
		if(isAdd) {
			addRts.push(id);
		} else {
			for (var i = 0, len = delRts.length; i < len; i++) {
				if(delRts[i] == id) {
					delRts.splice(i, 1);
					break;
				}
			}
		}
	} else {
		//取消
		if(isAdd) {
			for (var i = 0, len = addRts.length; i < len; i++) {
				if(addRts[i] == id) {
					addRts.splice(i, 1);
					break;
				}
			}
		} else {
			delRts.push(id);
		}

	}
};

var setFormRts = function(id, isCheck, $table, chkData) {
	if(chkData) {
		var enable = chkData.enable;
		var visible = chkData.visible;
		var enableExist = false;
		var visibleExist = false;
		for (var i = 0, len = $table.enableRts.length; i < len; i++) {
			if($table.enableRts[i] == chkData.id) {
				enableExist = true;
				if(enable) {
					$table.enableRts.splice(i, 1);
				}
				break;
			}
		}
		if(!enableExist && !enable) {
			$table.enableRts.push(chkData.id);
			$table.hasAllEnableRights = false;
		}
		for (var i = 0, len = $table.visibleRts.length; i < len; i++) {
			if($table.visibleRts[i] == chkData.id) {
				visibleExist = true;
				if(visible) {
					$table.visibleRts.splice(i, 1);
				}
				break;
			}
		}
		if(!visibleExist && !visible) {
			$table.visibleRts.push(chkData.id);
			$table.hasAllVisibleRights = false;
		}
	} else {
		var optExist = false;
		for (var i = 0, len = $table.optRts.length; i < len; i++) {
			if($table.optRts[i] == id) {
				optExist = true;
				if(!isCheck) {
					$table.optRts.splice(i, 1);
				}
			}
		}
		if(!optExist && isCheck) {
			$table.optRts.push(id);
			$table.hasAllOptRights = false;
		}
	}
};
RTS.setRts = function(id, isCheck, $table, chkData) {
	var options = RTS.options;
	var type = options.type, $table;
	switch(type) {
		case RTS.Rights_type.TYPE_ENTRY:
			if($table.attr("isEntry")) {
				setEntryRts(id, isCheck, $table);
			} else {
				setFormRts(id, isCheck, $table, chkData);
			}
			break;
		case RTS.Rights_type.TYPE_DICT:
			setDictRts(id, isCheck, $table, chkData);
			break;
		case RTS.Rights_type.TYPE_FORM:
			setFormRts(id, isCheck, $table, chkData);
			break;
	}
}

RTS.setChecked = function($table) {
	var options = RTS.options;
	var target = $table.target;
	var $cks = $("tr.title .checkbox", $table), $chk, tmp;
	var checked = target.is(":checked");
	var $trs = $("tr:not([class~='title'])", $table);
	if(target.parents("tr").hasClass("title")) {
		for (var i = 0, len = $trs.length; i < len; i++) {
			$chk = $(".checkbox", $trs.eq(i));
			if($chk.attr("enable") == "false") continue;
			$chk.prop("checked", checked);
			var tr = $chk.parents("tr").eq(0);
			RTS.setRts(tr.attr("id"), checked, $table);
		}
		
		var type = options.type;
		switch(type) {
			case RTS.Rights_type.TYPE_DICT:
				if(checked) {
					options.dict.allRights = true;
					options.dict.saveType = 1;
				} else {
					options.dict.allRights = false;
					options.dict.saveType = -1;
				}
				break;
			case RTS.Rights_type.TYPE_FORM:
				if(checked) {
					$table.allOptRights = true;
				} else {
					$table.allOptRights = false;
				}
				break;
		}
	} else {
		var tr = target.parents("tr").eq(0);
		var pid = tr.attr("pid");

		RTS.setRts(tr.attr("id"), checked, $table);
		RTS.checkCtr($table, tr.attr("id"), checked);
		RTS.checkPtr($table, tr.attr("pid"), checked);				
		
		var isAllCk = true;
		var cks = $(".checkbox:not([enable='false'])", $trs);
		for (var i = 0, len = cks.length; i < len; i++) {
			var cked = cks.eq(i).is(":checked");
			if(!cked) isAllCk = false;
		}
		if(!isAllCk) {
			$(".checkbox", $("tr[class~='title']", $table.parents(".rts-tbl"))).prop("checked", false);
			if($table.allOptRights) {
				$table.allOptRights = false;
			}
		}
	}
};

RTS.loopSearch = function(value, $table) {
	if($table.searchValue == value) {
		$table.searches++;
	} else {
		$table.searches = 1;
		$table.searchValue = value;
	}
	var $trs = $("tr:gt(0)", $table), $tr, $tds, $td, txt, exist, searchIndex = 0, isFirst = true, $firstTr, hasClick = false;
	var container = $table.parent();
	for (var i = 0, len = $trs.length; i < len; i++) {
		$tr = $trs.eq(i);
		$tds = $("td", $tr);
		exist = false;
		for (var j = 0, length = $tds.length; j < length; j++) {
			$td = $tds.eq(j);
			txt = $td.text().toLowerCase();
			if(txt.indexOf(value) > -1) {
				if(isFirst) {
					$firstTr = $tr;
					isFirst = false;
				}
				exist = true;
				searchIndex++;
				continue;
			}
		}
		if(exist) {
			if($table.searches == searchIndex) {
				var top = $tr.position().top - (container.height() - $("thead", container).height());
				if(top > 0) {
					container.scrollTop(top + container.scrollTop());
				} else {
					container.scrollTop(0);
				}
				$tr.click();
				hasClick = true;
				break;
			}
		}
	}
	if(!hasClick && $firstTr) {
		container.scrollTop(0);
		var top = $firstTr.position().top - (container.height() - $("thead", container).height());
		if(top > 0) {
			container.scrollTop(top + container.scrollTop());
		}
		$firstTr.click();
		$table.searches = 1;
	}
};

$.isString = function (v) {
    return v && typeof v == 'string';
};
/**
 * 获取真实高度、宽度等值。
 * @param value 可能形如：10、'10px'、'10%'、其他。
 * @param parentValue Number类型。父节点的高度、宽度等值。
 * @return 如果算出真实值，返回Number类型值；否则，返回'auto'。
 */
$.getReal = function (value, parentValue) {
    if (!$.isDefined(value) || value == null || value <= 0)
        return 'auto';
    var real;
    if ($.isNumeric(value) && value > 1) {
        real = value;
    } else if ($.isNumeric(value) && value <= 1) {
        var percent = parseFloat(value, 10);
        real = parentValue * percent;
    } else if ($.isPercentage(value)) {
        var percent = parseFloat(value, 10) / 100;
        real = parentValue * percent;
    } else {
        real = parseInt(value, 10);
    }
    // IE中浮点数会有问题
    return Math.floor(real);
};

$.isDefined = function (v) {
    return typeof v != 'undefined';
};
$.isPercentage = function (v) {
    return v && /^(\d{1,2}%)$|^(100%)$/.test(v);
};