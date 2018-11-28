YIUI.ViewException = (function (code, message) {

    /**
     * 视图异常类
     * 大类编号:800B
     */
    var view_code = {
        serialVersionUID: 1,
        // 0001 - 表无关联数据
        NO_TABLE_DATA: 0x0001,
        // 0002 - 组件绑定的表不存在
        NO_BINDING_TABLE_DATA: 0x0002,
        // 0003 - 表单无打印模板定义
        NO_PRINT_TEMPLATE_DEFINED: 0x0003,
        // 0004 - 表达式的计算关系存在环路
        CIRCLE_DEPENDENCY: 0x0004,
        // 0005 - 表格分页情况下做列扩展
        GRID_view_codeAND_OR_GROUP_IN_GRID_PAGE: 0x0005,
        // 0006 - 表格分页情况下存在分组行（汇总行）
        EXIST_GROUPROW_IN_GRIDPAGE: 0x0006,
        // 0008 - 列拓展最外层的列须是title类型
        OUTER_COLUMN_MUSTBE_TITLE: 0x0008,
        // 0009 - 没有定义的控件类型
        UNDEFINED_COMPONENT_TYPE: 0x0009,
        // 000A - 表格分页类型定义错误
        UNDEFINED_PAGE_LOAD_TYPE: 0x000A,
        // 000B - 无法获取单元格的动态行为
        UNABLE_TO_GET_CELL_BEHAVIOR: 0x000B,
        // 000C - 界面存在检查规则错误
        COMPONENT_CHECK_ERROR: 0x000C,
        // 000D - 表格子表单绑定错误
        SUB_DETAIL_BINDING_ERROR: 0x000D,
        // 000E - 表达式标识符定义错误
        FORMULA_IDENTIFIER_ERROR: 0x000E,
        // 000F - 组件数据绑定错误,未找到对应数据源
        DATA_BINDING_ERROR: 0x000F,
        // 0010 - 未选定表格行
        NO_ROW_SELECTED: 0x0010,
        // 0011 - 序号字段未定义
        SEQUENCE_NO_DEFINE: 0x0011,
        // 0012 - 表格层次数据显示时，Layer及Hidden字段必须同时存在
        LAYER_OR_HIDDEN_NO_DEFINE: 0x0012,
        // 0013 - 表格层次数据显示不支持列扩展
        SHOW_LAYERDATA_NOTALLOW_GRID_view_codeAND: 0x0013,
        // 0014 - 界面存在必填错误
        COMPONENT_REQUIRED: 0x0014,
        // 0015 - 组件未定义
        NO_COMPONENT_FOUND: 0x0015,
        // 0016 - 未找到数据表
        NO_TABLE_FOUND: 0x0016,
        // 0017 - 表格过滤关联的源字段与目标字段个数不一致
        FOREIGN_FIELDS_INEQUALITY: 0x0017,
        // 0018 - 下推的目标单中表格未找到空白行
        NO_EMPTY_ROW_FOUND: 0x0018,
        // 0019 - 表格树形列类型定义错误
        GRID_TREE_COLUMN_DEFINE_ERROR: 0x0019,
        // 001A - 未定义的表格行拓展类型
        UNDEFINED_ROW_view_codeAND_TYPE: 0x001A,
        // 001B - 引用的操作未定义
        REF_OPERATION_NOT_DEFINED: 0x001B,
        // 001C - 表格未定义明细数据行
        NO_DETAIL_ROW_DEFINE: 0x001C,
        // 001D - 组件不存在
        COMPONENT_NOT_EXISTS: 0x001D,
        // 001E - 定制单元格表单的数据源未定义RefDetailTableKey
        NO_REFDETAILTABLEKEY_DEFINE: 0x001E,
        // 001F - 表格行的子明细表单的数据源未定义RefTableKey
        NO_REFTABLEKEY_DEFINE: 0x001F,
        // 002A - 列拓展自定义的拓展来源未计算出结果
        NO_view_codeANDSOURCE_RESULT_GET: 0x002A,
        // 002B - 未定义的子明细关联方式
        UNDEFINED_SUBDETAIL_LINKTYPE: 0x002B,
        // 002C - 请先编辑表格数据行,再输入子明细
        NO_SUBDETAILS_IN_EMPTYROW: 0x002C,
        // 002D - 未找到对应的表格或者ListView
        NO_GRID_OR_LISTVIEW_FOUND: 0x002D,

        //web端添加 
        //非单元格无法设置
        // 002E - 下拉项来源定义错误
        NO_CELL_CANNOT_SET_VALUE: 0x002E,
        //无法获取非单元格值
        CANNNOT_GET_NO_CELL_VALUE: 0x002F, 
        //复合字典不能设置为多选字典
        COMPDICT_CANNOT_SET_MULTIDICT: 0x0030, 
        //动态字典的itemKey字段为空
        DYNAMICDICT_ITEMKEY_NULL: 0x0031,
        //复合字典的itemKey字段为空
        COMPDICT_ITEMKEY_NULL: 0x0032,
        //控件不存在
        NO_COMPONENT: 0x0033,
        //宽度或高度未定义
        NO_WIDTH_OR_HEIGHT: 0x0034,
        //下推的目标单据的key为空 
        NO_KEY_TARGET_BILL: 0x0035,
        //超出最大数值精度
        Exceed_Value_Max_Accuracy: 0x0036,
        //DateDiff公式传入参数有误,请检查配置
        Date_Diff_Param_Error: 0x0037,
        //控件key不存在
        NO_COMPONENT_KEY: 0x0038,
        //合并单元格定义的行类型不一致
        CELL_MERGE_DEFINE_ERROR: 0x0039,
        //下拉项来源定义错误
        SOURCETYPE_DEFINE_ERROR: 0x0040,
        //表格有选择字段且没有OID列时,需要定义业务关键字来定位行
        PRIMARYKEYS_UNDEFINED: 0x0041,
        //动态单元格需要定义类型表达式,否则无法确定单元格类型
        TYPE_FORMULA_NEEDED: 0x0042,
        //动态单元格组未定义
        TYPE_GROUP_UNDEFINED: 0x0043,
        //指定结果的单元格类型未定义
        TYPE_DEF_UNDEFINED: 0x0044,
        //动态单元格标识列未定义
        TYPE_DEF_KEYCOLUMN_UNDEFINED: 0x0045,
        //数据中动态单元格标识为空
        TYPEDEFKEY_EMPTY: 0x0046,
        //未知的明细类型
        UNKNOWN_DETAIL_TYPE: 0x0047,
        //列拓展未定义拓展源,无法确定拓展类型
        view_codeAND_SOURCE_UNDEFINED: 0x0048,
        //数据拓展数据列未定义
        view_codeAND_COLUMNKEY_UNDEFIND: 0x0049,
        //只支持在表单类型为View的情况下使用
        VIEW_FORM_ONLY: 0x0050,
        //不支持的行拓展类型
        UNSUPPORT_ROWview_codeAND_TYPE: 0x0051,
        //叙事簿未找到ListView组件 
        LISTVIEW_NOT_FOUND_IN_VIEW: 0x0052,
        //无入口权限
        NO_ENTRYRIGHTS: 0x0053,
        //动态字典或者复合字典数据源需要增加一列用于存储ItemKey
        ITEMKEY_COLUMN_UNDEFINED: 0x0054,
        //字典值错误
        DICT_DATA_ERROR: 0x0055,
        //客户端数字证书找不到
        CLIENT_CERTIFICATE_NOT_FOUND: 0x0056,
        //服务器连接失败
        CONNECT_FAILED: 0x0057,
        // 表单检查规则错误
        FORM_CHECK_ERROR: 0x0058,
        // 表格行检查错误
        GRID_ROW_ERROR: 0x0059,
        // 表格单元格检查错误
        GRID_CELL_ERROR: 0x0060,
        // 表格单元格必填
        GRID_CELL_REQUIRED: 0x0061,
        // ve不能为空
        VE_CANNOT_NULL: 0x0062,
        // 没有载入处理类
        NO_LOAD_HANDLER_CLASS: 0x0063,
        // 字典根节点计算错误
        DICT_ROOT_NODE_CALC_ERROR: 0x0064,
        // 字典根节点itemKey与当前字典itemKey不一致
        ITEMKEY_NOT_AGREE_WITH_CURRENT: 0x0065,
        // 不是复合字典
        ITEMKEY_NO_COMPDICT: 0x0066,
        // ItemKey的字典不存在
        NO_DICT: 0x0067,
        // 没有对应的组件创建类
        NO_COMPONENT_BUILDER_CLASS: 0x0068,
        //不支持的类型：
        NOT_SUPPORT_TYPE: 0x0070,
        //字典控件传入的值类型错误
        DICT_INPUT_VALUE_TYPE_ERROR: 0x0071,
        //错误的时间
        TIME_ERROR: 0x0072,
        //filterDependence中未处理的类型
        FILTER_DEPEND_UNTREATED_TYPE: 0x0073,
        //多选复合字典不允许有数据绑定字段
        COMPDICT_NOT_DATA_BINDING: 0x0074,
        //参数个数不一致
        UNEQUAL_PARAM_NUM: 0x0075
    };

    var StringTable = YIUI.StringTable.View;

    var getGroupCode = function() {
        return 0x800B;
    };

    var errorInfo = new HashMap();
    errorInfo.put(view_code.NO_TABLE_DATA, StringTable.NoTableData);
    errorInfo.put(view_code.NO_BINDING_TABLE_DATA, StringTable.NoBindingTableData);
    errorInfo.put(view_code.NO_PRINT_TEMPLATE_DEFINED, StringTable.NoPrintTemplateDefined);
    errorInfo.put(view_code.CIRCLE_DEPENDENCY, StringTable.CircleDependency);
    errorInfo.put(view_code.GRID_view_codeAND_OR_GROUP_IN_GRID_PAGE, StringTable.Gridview_codeandOrGroupInGridPage);
    errorInfo.put(view_code.EXIST_GROUPROW_IN_GRIDPAGE, StringTable.ExistGroupRowInGridPage);
    errorInfo.put(view_code.OUTER_COLUMN_MUSTBE_TITLE, StringTable.OuterColumnMustBeTitle);
    errorInfo.put(view_code.UNDEFINED_COMPONENT_TYPE, StringTable.UndefinedComponentType);
    errorInfo.put(view_code.UNDEFINED_PAGE_LOAD_TYPE, StringTable.UndefinedPageLoadType);
    errorInfo.put(view_code.UNABLE_TO_GET_CELL_BEHAVIOR, StringTable.UnableToGetCellBehavior);
    errorInfo.put(view_code.COMPONENT_CHECK_ERROR, StringTable.CheckRuleNotPass);
    errorInfo.put(view_code.SUB_DETAIL_BINDING_ERROR, StringTable.SubDetailBindingError);
    errorInfo.put(view_code.FORMULA_IDENTIFIER_ERROR, StringTable.FormulaIdentifierError);
    errorInfo.put(view_code.DATA_BINDING_ERROR, StringTable.DataBindingError);
    errorInfo.put(view_code.NO_ROW_SELECTED, StringTable.NoRowSelected);
    errorInfo.put(view_code.SEQUENCE_NO_DEFINE, StringTable.SequenceNoDefine);
    errorInfo.put(view_code.LAYER_OR_HIDDEN_NO_DEFINE, StringTable.LayerOrHiddernNoDefine);
    errorInfo.put(view_code.SHOW_LAYERDATA_NOTALLOW_GRID_view_codeAND, StringTable.ShowLayerDataNotAllowGridview_codeand);
    errorInfo.put(view_code.COMPONENT_REQUIRED, StringTable.RequiredError);
    errorInfo.put(view_code.NO_COMPONENT_FOUND, StringTable.NoComponentFound);
    errorInfo.put(view_code.NO_TABLE_FOUND, StringTable.NoTableFound);
    errorInfo.put(view_code.FOREIGN_FIELDS_INEQUALITY, StringTable.ForeignFieldsInequality);
    errorInfo.put(view_code.NO_EMPTY_ROW_FOUND, StringTable.NoEmptyRowFound);
    errorInfo.put(view_code.GRID_TREE_COLUMN_DEFINE_ERROR, StringTable.GridTreeColumnDefineError);
    errorInfo.put(view_code.UNDEFINED_ROW_view_codeAND_TYPE, StringTable.UndefinedRowview_codeandType);
    errorInfo.put(view_code.NO_DETAIL_ROW_DEFINE, StringTable.NoDetailRowDefine);
    errorInfo.put(view_code.COMPONENT_NOT_EXISTS, StringTable.ComponentNotExists);
    errorInfo.put(view_code.NO_REFDETAILTABLEKEY_DEFINE, StringTable.NoRefDetailTableKeyDefine);
    errorInfo.put(view_code.NO_REFTABLEKEY_DEFINE, StringTable.NoRefTableKeyDefine);
    errorInfo.put(view_code.NO_view_codeANDSOURCE_RESULT_GET, StringTable.Noview_codeandSourceGet);
    errorInfo.put(view_code.UNDEFINED_SUBDETAIL_LINKTYPE, StringTable.UndefinedSubDetailLinkType);
    errorInfo.put(view_code.NO_SUBDETAILS_IN_EMPTYROW, StringTable.NoSubDetailsInEmptyRow);
    errorInfo.put(view_code.NO_GRID_OR_LISTVIEW_FOUND, StringTable.NoGridOrListViewFound);
    errorInfo.put(view_code.NO_CELL_CANNOT_SET_VALUE, StringTable.NoCellCannotSetValue);
    errorInfo.put(view_code.CANNNOT_GET_NO_CELL_VALUE, StringTable.CannnotGetNoCellValue);
    errorInfo.put(view_code.COMPDICT_CANNOT_SET_MULTIDICT, StringTable.CompdictCannotSetMultidict);
    errorInfo.put(view_code.DYNAMICDICT_ITEMKEY_NULL, StringTable.DynamicdictItemkeyNull);
    errorInfo.put(view_code.COMPDICT_ITEMKEY_NULL, StringTable.CompdictItemkeyNull);
    errorInfo.put(view_code.NO_COMPONENT, StringTable.NoComponent);
    errorInfo.put(view_code.NO_WIDTH_OR_HEIGHT, StringTable.NoWidthOrHeight);
    errorInfo.put(view_code.NO_KEY_TARGET_BILL, StringTable.NoKeyTargetBill);
    errorInfo.put(view_code.Exceed_Value_Max_Accuracy, StringTable.ExceedValueMaxAccuracy);
    errorInfo.put(view_code.Date_Diff_Param_Error, StringTable.DateDiffParamError);
    errorInfo.put(view_code.NO_COMPONENT_KEY, StringTable.NoComponentKey);
    errorInfo.put(view_code.CELL_MERGE_DEFINE_ERROR, StringTable.CellMergeDefineError);
    errorInfo.put(view_code.SOURCETYPE_DEFINE_ERROR, StringTable.SourceTypeDefineError);
    errorInfo.put(view_code.PRIMARYKEYS_UNDEFINED, StringTable.NeedPrimarysDefined);
    errorInfo.put(view_code.TYPE_FORMULA_NEEDED, StringTable.TypeFormulaNeeded);
    errorInfo.put(view_code.TYPE_GROUP_UNDEFINED, StringTable.TypeGroupUnDefined);
    errorInfo.put(view_code.TYPE_DEF_UNDEFINED, StringTable.TypeDefUnDefined);
    errorInfo.put(view_code.TYPE_DEF_KEYCOLUMN_UNDEFINED, StringTable.TypeDefKeyColumnUndefined);
    errorInfo.put(view_code.TYPEDEFKEY_EMPTY, StringTable.TypeDefKeyEmpty);
    errorInfo.put(view_code.UNKNOWN_DETAIL_TYPE, StringTable.UnknownDetailType);
    errorInfo.put(view_code.view_codeAND_SOURCE_UNDEFINED, StringTable.view_codeandSourceUndefined);
    errorInfo.put(view_code.view_codeAND_COLUMNKEY_UNDEFIND, StringTable.view_codeandColumnKeyUndefined);
    errorInfo.put(view_code.VIEW_FORM_ONLY, StringTable.ViewFormOnly);
    errorInfo.put(view_code.UNSUPPORT_ROWview_codeAND_TYPE, StringTable.UnSupportRowview_codeandType);
    errorInfo.put(view_code.NO_ENTRYRIGHTS, StringTable.NoEntryRights);
    errorInfo.put(view_code.LISTVIEW_NOT_FOUND_IN_VIEW, StringTable.ListViewNotFound);
    errorInfo.put(view_code.ITEMKEY_COLUMN_UNDEFINED, StringTable.ItemKeyColumnUndefined);
    errorInfo.put(view_code.DICT_DATA_ERROR, StringTable.DictDataError);
    errorInfo.put(view_code.CONNECT_FAILED, StringTable.ConnectFailed);
    errorInfo.put(view_code.FORM_CHECK_ERROR, StringTable.FormCheckError);
    errorInfo.put(view_code.GRID_ROW_ERROR, StringTable.GridRowError);
    errorInfo.put(view_code.GRID_CELL_ERROR, StringTable.GridCellError);
    errorInfo.put(view_code.GRID_CELL_REQUIRED, StringTable.GridCellRequired);
    errorInfo.put(view_code.VE_CANNOT_NULL, StringTable.VeCannotNull);
    errorInfo.put(view_code.NO_LOAD_HANDLER_CLASS, StringTable.NoLoadHandlerClass);
    errorInfo.put(view_code.DICT_ROOT_NODE_CALC_ERROR, StringTable.DictRootNodeCalcError);
    errorInfo.put(view_code.ITEMKEY_NOT_AGREE_WITH_CURRENT, StringTable.ItemkeyNotAgreeWithCurrent);
    errorInfo.put(view_code.ITEMKEY_NO_COMPDICT, StringTable.ItemkeyNoCompDict);
    errorInfo.put(view_code.NO_DICT, StringTable.NoDict);
    errorInfo.put(view_code.NO_COMPONENT_BUILDER_CLASS, StringTable.NoComponentBudilderClass);
    errorInfo.put(view_code.NOT_SUPPORT_TYPE, StringTable.NotSupportType);
    errorInfo.put(view_code.DICT_INPUT_VALUE_TYPE_ERROR, StringTable.DictInputValueTypeError);          
    errorInfo.put(view_code.TIME_ERROR, StringTable.TimeError);          
    errorInfo.put(view_code.FILTER_DEPEND_UNTREATED_TYPE, StringTable.filterDependenceUntreatedType);
    errorInfo.put(view_code.COMPDICT_NOT_DATA_BINDING, StringTable.CompdictNotDataBinding);
    errorInfo.put(view_code.UNEQUAL_PARAM_NUM, StringTable.UnEqualParamNum);
    
    var rt = {

        exceptionCode: (getGroupCode() << 16 | code),
        
        formatMessage: function(/*locale, */code) {
            var key = errorInfo.get(code);
            var format = StringTable.getString(/*locale, */key);
            var msg = YIUI.Exception.format(format, arguments, 1);
            return msg;
        },
        
        throwException: function (code, args) {
            var msg = this.formatMessage(code, args);
            throw new Error(msg);
        },

        getException: function (code, args) {
            var msg = this.formatMessage(code, args);
            return msg;
        }
    };

    return $.extend({}, rt, view_code);
})();
YIUI.Exception.View = YIUI.ViewException;
