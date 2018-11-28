(function () {
	var obj = {
		NoTableData: "表{1}无关联数据",
		NoBindingTableData: "组件{1}关联的表{2}无数据",
		NoPrintTemplateDefined: "表单{1}无打印模板定义",
		CircleDependency: "表单{1}存在循环计算",
		GridExpandOrGroupInGridPage: "表格有行列拓展或者分组,不允许分页",
		ExistGroupRowInGridPage: "表格分页情况下存在分组行（汇总行）",
		DefaultFormulaValueExistBothInCellAndEmb: "表格行单元格与子表单同时定义了计算表达式",
		OuterColumnMustBeTitle: "有列拓展的列最外层的列需要定义为title类型",
		UndefinedPageLoadType: "分页类型定义错误",
		UnableToGetCellBehavior: "无法获取表格单元格的动态行为",
		CheckRuleNotPass: "组件{1}检查规则不通过",
		EmbedSubBindingError: "表格子表单定义错误",
		FormulaIdentifierError: "表达式标识符定义错误",
		DataBindingError: "组件数据绑定错误,未找到对应数据源",
		NoRowSelected: "表格未选定行",
		SequenceNoDefine: "序号列未定义",
		LayerOrHiddernNoDefine: "配置错误,表格层次数据显示时,Layer及Hidden字段必须同时存在",
		ShowLayerDataNotAllowGridExpand: "表格层次数据显示，不支持列扩展",
		RequiredError: "{1} 不能为空",
		NoComponentFound: "组件未定义",
		ForeignFieldsInequality: "过滤关联的源字段与目标字段个数不一致",
		NoTableFound: "未找到数据表",
		NoEmptyRowFound: "下推的目标单中的表格未找到空白行",
		GridTreeColumnDefineError: "表格树形列类型定义错误",
		UndefinedRowExpandType: "未定义的行拓展类型",
		RefOperationNotDefined: "表单{1}引用的操作{2}未定义",
		NoDetailRowDefine: "表格未定义明细行",
		ComponentNotExists: "{1} 不存在",
		NoRefDetailTableKeyDefine: "定制单元格表单的数据源未定义RefDetailTableKey",
		NoRefTableKeyDefine: "表格行的子明细表单的数据源未定义RefTableKey",
		NoExpandSourceGet: "列拓展自定义的拓展来源未计算出结果,请检查配置",
		UndefinedSubDetailLinkType: "未定义的子明细关联方式",
		NoSubDetailsInEmptyRow: "请先编辑表格数据行,再输入子明细",
		NoGridOrListViewFound: "未找到对应的表格或者ListView",
		CellMergeDefineError: "合并单元格定义的行类型不一致",
		SourceTypeDefineError: "下拉项来源定义错误",
		NoCellCannotSetValue: "非单元格无法设值",
		CannnotGetNoCellValue: "无法获取非单元格值",
		CompdictCannotSetMultidict: "复合字典{1}不能设定为多选字典.",
		DynamicdictItemkeyNull: "动态字典{1}的itemKey字段为空",
		CompdictItemkeyNull: "复合字典{1}的itemKey字段为空",
		NoComponent: "tagName为{1}的控件不存在！",
		NoWidthOrHeight: "宽度或高度未定义",
		NoKeyTargetBill: "下推的目标单据的key为空!",
		ExceedValueMaxAccuracy: "超出最大数值精度！",
		DateDiffParamError: "DateDiff公式传入参数有误,请检查配置!",
		NoComponentKey: "控件{1}未找到，请确认配置",
		NeedPrimarysDefined: "表格是后台分页类型且有选择字段,当数据源表无OID列时需要定义业务主键列",
		TypeFormulaNeeded: "动态单元格需要定义类型表达式",
		TypeGroupUnDefined: "表单{1}没有动态单元格相关定义",
		TypeDefUnDefined: "与{1}匹配的动态单元格定义未找到",
		TypeDefKeyColumnUndefined: "动态单元格标识列{1}未定义",
		TypeDefKeyEmpty: "数据中动态单元格标识为空",
		UnknownDetailType: "未知的明细数据类型{1}",
		ExpandSourceUndefined: "表格列{1}未定义拓展源,无法确定拓展类型",
		ExpandColumnKeyUndefined: "表格列 {1}未定义拓展数据源",
		ViewFormOnly: "方法{1}只在View类型的表单下适用",
		DeleteRowWithSubDetail: "确定删除当前行及其子明细数据?",
		DeleteRowWithChildRows: "确定删除当前行及其子行数据?",
		DeleteAllSelectRows: "确定删除所有选中行?",
		ConfirmClose: "是否确定关闭当前界面 ?",
		UnSupportRowExpandType: "不支持的行拓展类型 {1}",
		NoEntryRights: "无菜单入口权限 {1}",
		ListViewNotFound: "叙事簿未找到ListView组件",
		ItemKeyColumnUndefined: "动态字典或复合字典{1}数据源ItemKey列未定义",
		DictDataError: "字典{1}值类型错误,普通字典为long,多选字典为String",
		AttachmentExceedMaxSize: "上传的文件大小超出最大值限制{1}KB",
		ConnectFailed: "连接服务器失败,请检查网络连接,并尝试重新连接",
		FormCheckError: "{1} 有错误",
		GridRowError: "{1} 第 {2} 行有错误",
		GridCellError: "{1} 第 {2} 行 {3} 有错误",
		GridCellRequired: "{1} 第 {2} 行 {3} 必填",
		
		VeCannotNull: "ve不能为空",
		NoLoadHandlerClass: "{1}没有载入处理类",
		DictRootNodeCalcError: "字典根节点计算错误",
		ItemkeyNotAgreeWithCurrent: "字典根节点itemKey{1}与当前字典itemKey{2}不一致",
		ItemkeyNoCompDict: "itemkey: {1}不是复合字典",
		NoDict: "ItemKey: {1}的字典不存在/NoDict: ",
		NoComponentBudilderClass: "{1},{2} 没有对应的组件创建类",
		UnitNotSupportType: "IUnitConverter 不支持的类型:{1}",
		NotSupportType: "不支持的类型:{1}/NotSupportType: ",
		DictInputValueTypeError: "字典控件传入的值类型错误:{1}",
		TimeError: "错误的时间:{1}/TimeError: ",
		filterDependenceUntreatedType: "filterDependence中未处理的类型:{1} ",
		CompdictNotDataBinding: "多选复合字典:{1} 不允许有数据绑定字段",
		UnEqualParamNum: "参数个数不一致",
		AttachmentTypeError: "附件类型 {1} 不在可以上传的类型内"
	};

	YIUI.ViewException["zh-CN"] = obj;
})();
	