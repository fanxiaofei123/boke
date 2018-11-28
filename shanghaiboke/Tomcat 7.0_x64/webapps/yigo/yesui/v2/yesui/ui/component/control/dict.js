/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-21
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */

YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT = YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT;

YIUI.Control.DICT_CKBOXTYPE_SINGLE_SELECT = YIUI.TREEPANEL_CKBOXTYPE_SINGLE_SELECT;

YIUI.Control.Dict = YIUI.extend(YIUI.Control, {

    //dropView是否显示
   	//_hasShow : false,

    /**
     * 用于固定数据源，一次构建完整的字典树
     */
    //dataSource : null,

    /**
     * 是否多选字典
     * @type Boolean
     */
    //multiSelect :  false,
    
    //rootNode : null,

    //字典控件的下拉按钮
    //_dropBtn : null,

    //_textBtn : null,

    //_dropView : null,
    
    //_error : null,

    /**
     * 多选字典，选择模式
     */
    //checkBoxType :   YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT,

    /** 父子节点是否关联 */
    //independent : true,
    
    /**
     * 字典itemKey
     */
    //itemKey : null,
        
    //otherParam:null,
    
    //dictTree: null,
    
    //newNodes: [],
    
    //clicked: false,
 
    //_needReloadIndeterminatedNodes : false,
    
    //_resetTree : true,
	value : null,
	
    handler: YIUI.DictHandler,
    
    behavior: YIUI.DictBehavior,
    
    //字典状态
    stateMask: YIUI.DictStateMask.Enable,
    
    needRebuild: true,
    
    multiSelect: false,

    independent: false,

    pageMaxNum: 10,

	init : function (options){
		//this.itemKey = options["itemKey"];
		//this.otherParam = {"Service":"dictTreeService","Cmd":"getdictchildren","itemKey":this.itemKey};
		//this.autoParam = ["id=parentid","itemKey=layerItemKey"];
		this.base(options);
        
        var meta = this.getMetaObj();
        this.multiSelect = meta.allowMultiSelection || this.multiSelect;
        this.independent = meta.independent || this.independent;
        this.multiSelect = meta.allowMultiSelection || this.multiSelect;
        this.independent = meta.independent || this.independent;
        this.stateMask = meta.stateMask || this.stateMask;
        this.itemFilters = meta.itemFilters || this.itemFilters;
        this.itemKey = meta.itemKey;
        this.root = meta.root;
	},
	
	setEditable: function(editable) {
		this.editable = editable;
    	this.yesDict.setEditable(this.editable);
    },

    getFormatEl: function() {
    	return this.yesDict ? this.yesDict.getInput() : null;
    },

	setBackColor: function(backColor) {
        this.backColor = backColor;
        this.yesDict && this.yesDict.setBackColor(backColor)
	},

	setForeColor: function(foreColor) {
        this.foreColor = foreColor;
        this.yesDict && this.yesDict.setForeColor(foreColor);
	},
	
    setFormatStyle: function(cssStyle) {
        this.yesDict && this.yesDict.setFormatStyle(cssStyle);
	},
	
	setMultiSelect: function(multiSelect) {
		this.multiSelect = multiSelect;
		this.yesDict.setMultiSelect(multiSelect);
	},
	

//	
//	getDictRoot : function(){
//		var dict = this;
//		var data = {};
//		data.formID = dict.ofFormID;
//		data.key = dict.key;
//		
//		data.service = "dictTreeService";
//		data.cmd = "getdictroot";
//		
//		var success = function(result) {
//			if (result ){
//				dict.itemKey = result.itemKey;
//				
//				if(dict.dictTree.rootNode != null){
//					if(dict.dictTree.rootNode.attr('itemKey') == result.itemKey){
//						return;
//					}
//					dict.dictTree.rootNode.remove();
//				}
//				
//				dict.dictTree.createRootNode(result.itemKey,result.itemKey+'_'+result.soid,result.caption);
//			}
//			dict.setDictTreeCheckedNodes();
//		}
//		
//		Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
//		
//	},


    beforeDestroy: function() {
    	this.yesDict && this.yesDict.destroy();
    },

    isNull: function() {
    	var value = this.value;
    	if($.isEmptyObject(value)){
			return true;
		}
		if (value instanceof YIUI.ItemData) {
			return value.oid == 0;
		} else if ($.isArray(value)) {
			for (var i = 0, len = value.length; i < len; i++) {
				if(value[i].oid > 0){
					return false;
				}
			}
			return true;
		}
		return false;
    },

    setTip: function (tip) {
        var tip = tip || this.text;
        this.base(tip);
    },
    
    checkEnd: function(value) {
		this.value = value;
		this.yesDict.setValue(value);
	   
        var _this = this;

        this.handler.getShowCaption(value, this.multiSelect, this.independent)
                    .done(function(text){
                        if( text && !_this.value ) // 可能后台获取标题返回的时候值已经被清空
                            return;
                        _this.setText(text);
                        _this.setTip(text);
                    });
  		// if(value != null) {

    //           var oids, needCaption = false;

  		// 	if(this.multiSelect) {

    //               oids = [];
    //               var text = '';

    //               for (var i = 0, len = value.length; i < len; i++) {
    //                   var v = value[i];

    //                   if(v.oid != 0){
    //                       oids.push(v.oid);
    //                       if(v.hasCaption()){
    //                           text = text + ','+v.getCaption();
    //                       }else{
    //                           needCaption = true;
    //                       }
    //                   }
    //               }


    //               if(!needCaption){
    //                   if(text.length > 0){
    //                       text = text.substring(1);
    //                   }
    //                   this.setText(text);
    //               }else{
    //                   needCaption = true   
    //               }

  		// 	} else if(value.oid == 0){
    //               this.setText('');
    //           } else {
    //               //如果值中已含caption 则直接赋值
    //               if(value.hasCaption()){
    //                   this.setText(value.getCaption());
    //               }else{
    //                   oids = value.oid;
    //                   needCaption = true;
    //               }
  		// 	}

    //           if(needCaption){
    //               var _this = this;
    //               YIUI.DictService.getCaption(this.itemKey, oids).done(function(data){
    //                   _this.setText(data);
    //               });  
    //           }

  		// }else{
    //           this.setText('');
    //       }
  		
  	},
    
    /** 获取控件真实值 */
    getValue: function () {
    	return this.value;
    },
    
    onSetWidth: function(width) {
    	this.yesDict.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesDict.setHeight(height);
    },
    
    getDictTree: function(){
    	return this.yesDict.dictTree;
    },
    
    /** 判断值是否改变 */
  //   isChanged: function(value) {
  //   	this.value;
  //   	var changed = false;
  //   	if(!this.value && value) {
  //   		changed = true;
		// } else if(this.value) {
		// 	if(this.multiSelect) {
		// 		//数组
		// 		if(this.value.length != value.length) {
		// 			changed = true;
		// 		} else {
		// 			for (var i = 0, len = value.length; i < len; i++) {
		// 				var index = this.value.indexOf(value[i]);
		// 				if(index < 0) {
		// 					changed = true;
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	} else {
		// 		changed = !(this.value.oid == value.oid);
		// 	}
		// }
  //   	return changed;
  //   },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;

        var formID = $this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);
    	this.yesDict = new YIUI.Yes_Dict({
    		el: $this.el,
            caption: $this.caption,
    		secondaryType: $this.secondaryType,
    		dataSource: $this.dataSource,
    		independent: $this.independent,
    		multiSelect: $this.multiSelect,
            pageMaxNum: $this.pageMaxNum,
            formKey: form.formKey,
            fieldKey: $this.getMetaObj().key,
    		getItemKey: function() {
    			return $this.itemKey;
    		},
            getStateMask: function(){
                return $this.stateMask;
            },
    		checkDict: function() {
                // var _impl = this;
                return $this.checkDict();
    	    	// return $this.checkDict().then(function(data){
          //           if(data){
          //              _impl.setSelValue($this.value); 
          //           }

          //           _impl.getDictTree().expandNode(_impl.getDictTree().rootNode);
          //       });
    		},
            commitValue:function(value){
                return $this.setValue(value, true, true, false, true);
            },
            isEnable: function() {
            	return $this.enable;
            },
            doSuggest: function(value) {
            	
                var rootValue = null;
                if ($this.getDictTree().rootNode != null) {
                    rootValue = $this.getDictTree().getNodeValue($this.getDictTree().rootNode);
                }

            	var def = $this.handler.doSuggest(form, $this.getMetaObj(), value, $this.getDictTree().dictFilter, rootValue)
			            	.then(function(viewItems) {
			                    if (viewItems.length == 0) {
			                        $this.hasSuggest = false;
			                    } else {
			                    	$this.hasSuggest = true;
			                    }
			                    return viewItems;
			            	});
                return def.promise();
            },
    		valueChange: function(text) {
    			$this.handler.doLostFocus($this, text);
			},
    		beforeExpand: function(tree , treeNode) {
				//var data = {};
				//data.itemKey = $this.itemKey;
				//data.itemDatas = $.toJSON($this.getValue());
				//data.service = "dictService";
				//data.cmd = "getallparentid";

				// var success = function(result) {
				// 	if (result) {
				// 		$.each(result,function(i){
				// 			var nodeId = this.itemKey+'_'+this.oid;
				//  			tree.indeterminatedNodes[nodeId] = this;
				//  		});
				// 	}
				// };
	
				// YIUI.DictService.getAllParentID($this.itemKey , $this.getValue() , success );
				
    		}
    	});
        this.el.addClass("ui-dict");

        this.checkEnd(this.value);
        this.setMultiSelect(this.multiSelect);
        this.setDynamic(this.isDynamic);
        this.setStateMask(this.stateMask);
    },
    
    setStateMask: function(stateMask) {
    	this.stateMask = stateMask;
    },
    
    setDynamic: function(isDynamic) {
    	this.isDynamic = isDynamic;
    },

    focus: function () {
        this.yesDict.focus();
    },
    
    install: function() {
    	this.base();

        var self = this;

        // 焦点策略事件
        $("input",self.el).bind("keydown",function (event) {
            if(!self.enable) {
                return false;
            }
            var keyCode = event.keyCode || event.charCode;
            if( keyCode == 9 || keyCode == 13 || keyCode == 108 ) {
                self.focusManager.requestNextFocus(self);
            }
        });
    	
//    	$("input", self.el).bind("keyup", $.debounce(100, function(e){
//			if(self.multiselect) return;
//			var keyCode = e.keyCode;
//			if(keyCode == 13) {
//				$(this).blur();
//				return;
//			}
//        	var value = $(this).val();
//        	self.handler.doSuggest(self, value);
//            $(document).on("mousedown", function (e) {
//                var target = $(e.target);
//                if (target.closest(self.yesDict.$suggestView).length == 0) {
//                	self.isSuggest = false;
//    		    	$(document).off("mousedown");
//            		self.yesDict.$suggestView.hide();
//                } else {
//                	self.isSuggest = true;
//                }
//            });
//        
//    	}));
//
//    	var self = this;
//    	var index = -1;
//    	var hideDictView = function() {
//    		self.$dictView && self.$dictView.hide();
//			self.selLi = null;
//			$(".selected", self.$dictView).removeClass("selected");
//			self.setText(self.text);
//	    	index = -1;
//    	};
//    	
//        //TODO 移至yes_dict
//    	$("input", self.el).bind("keyup", function(e){
//    		if(self.multiselect) return;
//    		var keyCode = e.keyCode;
//    		if(keyCode == 13) {
//    			if(self.selLi) {
//    				$(".b-txt", self.selLi).click();
//    			} else {
//    				$(this).blur();
//    			}
//    			return;
//    		}
//    		var value = $(this).val();
//
//    		$(document).on("mousedown", function (e) {
//    			var target = $(e.target);
//    			if (target.closest(self.yesDict.$suggestView).length == 0) {
//    				if(self.selLi && self.selLi.length > 0) {
//                    	self.selLi.click();
//                    }
//    				self.isSuggest = false;
//    				$(document).off("mousedown");
//    				self.yesDict.$suggestView.hide();
//    			} else {
//    				self.isSuggest = true;
//    			}
//    			self.selLi = null;
//            	index = -1;
//    		});
//    		
//        	if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
//        	if(keyCode == 13 && self.selLi) {
//		    	index = -1;
//        		self.selLi.click();
//        		return;
//        	}
//        	self.yesDict._dropView.hide();
//        	//self.handler.doSuggest(self, value);
//
//    	});
//
//    	$("input", self.el).bind("keydown", function(e){
//    		var keyCode = e.keyCode;
//            var $suggestView = self.yesDict.$suggestView, $dictView, isAutoView = false;
//            
//            if(!$suggestView.is(":hidden") || (self.yesDict._dropView.is(":hidden") && (keyCode != 40))) {
//            	$dictView = $suggestView;
//            	isAutoView = true;
//            } else {
//            	$dictView = self.yesDict._dropView;
//            }
//            self.$dictView = $dictView;
//            var maxLen = $("li[level != '-1']", $dictView).length;
//            //keyCode == 38 ---> UP Arrow  keyCode == 40 ---> DW Arrow
//            if(keyCode == 38) {
//            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
//            		return;
//            	}
//            	index--;
//            	if(index == -1) index = maxLen - 1;
//            } else if(keyCode == 40) {
//            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
//            		self.isDictView = true;
//            		self.yesDict._dropBtn.click();
//            		var $li_s = $("li .dt-wholerow.sel", self.yesDict._dropView);
//            		$li_s.removeClass("sel");
//            		var $li = $li_s.parents("li").eq(0);
//            		index = $li.index();
//            	}
//            	index++;
//            	if(index == maxLen) index = 0;
//            }else if(keyCode == 9 || keyCode === 13 || keyCode === 108) {
//                self.focusManager.requestNextFocus(self);
//                if (keyCode == 9 && !self.yesDict._dropView.is(":hidden")) {
//                    $(document).mousedown();
//                }
//                e.preventDefault();
//            } else {
//                return;
//            }
//            if (index == -1) return;
//            if(self.selLi) {
//            	self.selLi.removeClass("selected").removeClass("sel");
//            	$(".dt-wholerow", self.selLi).removeClass("sel");
//            }
//            var li = $dictView.find("li[level != '-1']:eq("+index+")");
//            li.addClass("selected");
//            self.selLi = li;
//            self.autoSel = true;
//            $(".dt-wholerow", li).eq(0).addClass("sel");
//            var scrollHeight = self.yesDict._dropView.outerHeight() - self.yesDict._dropView[0].clientHeight;
//            var scrollTop = li.position().top - self.yesDict._dropView.height() + li.height() + scrollHeight;
//            self.yesDict._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
//            
//            if(!isAutoView) {
//            	self.yesDict._textBtn.val($(".b-txt", li).eq(0).text());
//            }
//        	
//    	});
//    	
//    	$("input", self.el).bind("blur", function(e){
//    		index = -1;
//    	});
    },
    
//    getCheckedValue: function(){
//    	var values = [];
//		var dictTree = this.dictTree;
//	  	$.each(this.dictTree.selectionNodes,function(i,val){
//	  		var $node = $('#'+val , dictTree.el);
//	  		var itemData = {};
//	    	itemData.soid = $node.attr('soid');
//	   		itemData.itemKey = $node.attr('itemKey'); 
//	  		values.push(itemData);
//	 	});
//		
//		return values;
//    }
//    ,
//    createRootNode: function(caption, itemKey) {
//    	var rootNode = new Object();
//        rootNode.id = "0";
//        rootNode.name = caption;
//        rootNode.isParent = true;
//        rootNode.open = true;
//        rootNode.isLoaded = true;
//        rootNode.itemKey = itemKey;
//        return rootNode;
//    },
    
//    transDictValue : function($treeNode){
//      var itemData = {};
//      itemData.soid = $treeNode.attr("soid") || 0;
//      itemData.itemKey = $treeNode.attr("itemKey") || this.itemKey;  
//      return $.toJSON(itemData);
//    },
   
    setText: function (text) {
    	this.text = text;
    	this.yesDict && this.yesDict.setText(text);
    } , 
    
    getText: function () {
        return this.yesDict.getText();
    },

    getShowText: function() {
    	return this.getText();
    },

	dependedValueChange: function(targetField, dependedField){

        var formID =this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);

        var meta = this.getMetaObj();

        //动态字典计算itemKey
		if(meta.type == YIUI.CONTROLTYPE.DYNAMICDICT){
			if(meta.refKey && meta.refKey == dependedField){
                this.itemKey = this.handler.getItemKey(form, meta.refKey);
				this.needRebuild = true;
			}
		}
		
		if(!this.needRebuild){
			if(meta.root && meta.root.length > 0){
				if(meta.root == dependedField){
                    //this.handler.getRoot(form, this.root);

					this.needRebuild = true;
				}	
			}
		}

		if(!this.needRebuild){
            var metaFilter = this.handler.getMetaFilter(form, this.key, meta.itemFilters, this.itemKey);
            if(metaFilter){
                if(metaFilter.dependency){
                    var str = ','+metaFilter.dependency+',';
                    if(str.indexOf((','+dependedField+',')) >= 0 ){
                        this.needRebuild = true;
                    }
                }
            }else if(this.getDictTree().dictFilter){
                 this.needRebuild = true;
            }
		}
		
		if(this.needRebuild){
			this.setText("");
			this.setValue(null, true, true, false, true);
            if(this.yesDict){
                this.getDictTree().startRow = 0;
            }
		}
	},
    
    setSecondaryType: function (type) {
        this.yesDict.setSecondaryType(type);
    } , 
    
    checkDict: function() {
    	
        var _this = this;

        if (!_this.needRebuild && typeof(_this.needRebuild) != "undefined") {
            return  $.Deferred(function(defer){
                                    defer.resolve(false);
                                }).promise();
        }

        var formID = _this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);
        var oldItemKey = _this.getDictTree().itemKey;


        _this.getDictTree().dictFilter = _this.handler.getDictFilter(form, _this.key, _this.getMetaObj().itemFilters, _this.itemKey);

        return _this.handler.createRoot(form,
                                 _this.itemKey,
                                 _this.root)
                            .then(function(result){
                                    if (result) {
                                        var rootCaption = result.rootCaption;
                                        var rootItem = result.root;

                                        if (_this.getDictTree().rootNode != null) {
                                            _this.getDictTree().rootNode.remove();
                                        }
                                        if (oldItemKey != _this.itemKey) {
                                            _this.getDictTree().fuzzyValue = null;
                                            _this.getDictTree().startRow = 0;
                                            _this.getDictTree()._searchdiv.find(".findinput").val("");
                                            _this.getDictTree()._footdiv.find(".next").removeClass('disable');
                                            
                                        }

                                        _this.getDictTree().createRootNode(rootItem, rootCaption, rootItem.itemKey + '_' + rootItem.oid, result.secondaryType);
                                        _this.getDictTree().itemKey = _this.itemKey;
                                        _this.setSecondaryType(result.secondaryType);
                                        var resultType = result.secondaryType;
                                        _this.secondaryType = result.secondaryType;
                                        _this.needRebuild = false;

                                        return true;
                                    }
                                    return false
                                });
    }
});
YIUI.reg('dict', YIUI.Control.Dict);
YIUI.reg('compdict', YIUI.Control.Dict);
YIUI.reg('dynamicdict', YIUI.Control.Dict);
