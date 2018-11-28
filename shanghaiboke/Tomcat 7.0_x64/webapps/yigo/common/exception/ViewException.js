YIUI.ViewException = (function () {
    var Return = {
        /*缺少映射数据*/
        DATA_BINDING_ERROR: 0x000F,
        /* 组件未定义 */
        NO_COMPONENT_FOUND: 0x0015,
        /* 非单元格无法设置*/
        NO_CELL_CANNOT_SET_VALUE: 0x002E,
        /* 无法获取非单元格值*/
        CANNNOT_GET_NO_CELL_VALUE: 0x002F,
        /*复合字典不能设置为多选字典*/
        COMPDICT_CANNOT_SET_MULTIDICT: 0x0030,
        /*动态字典的itemKey字段为空*/
        DYNAMICDICT_ITEMKEY_NULL: 0x0031,
        /*复合字典的itemKey字段为空*/
        COMPDICT_ITEMKEY_NULL: 0x0032,
       /*控件不存在*/
        NO_COMPONENT: 0x0033,
        /*宽度或高度未定义*/
        NO_WIDTH_OR_HEIGHT: 0x0034,
        /*下推的目标单据的key为空*/
        NO_KEY_TARGET_BILL: 0x0035,
        //超出最大数值精度
        Exceed_Value_Max_Accuracy: 0x0036,
        //DateDiff公式传入参数有误,请检查配置
        Date_Diff_Param_Error: 0x0037,
        //控件key不存在
        NO_COMPONENT_KEY: 0x0038,
        /* 映射未定义表单标识 */
        MAP_MISS_FORMKEY: 0x001E,
    	NO_TABLE_DATA: 0x0001,
    	NO_BINDING_TABLE_DATA: 0x0002,
    	NO_PRINT_TEMPLATE_DEFINED: 0x0003,
    	CIRCLE_DEPENDENCY: 0x0004,
    	GRID_EXPAND_OR_GROUP_IN_GRID_GE: 0x0005,
    	EXIST_GROUPROW_IN_GRIDPAGE: 0x0006,
    	OUTER_COLUMN_MUSTBE_TITLE: 0x0008,
    	UNDEFINED_COMPONENT_TYPE: 0x0009,
    	UNDEFINED_PAGE_LOAD_TYPE: 0x000A,
    	UNABLE_TO_GET_CELL_BEHAVIOR: 0x000B,
    	CHECK_RULE_NOT_PASS: 0x000C,
    	SUB_DETAIL_BINDING_ERROR: 0x000D,
    	FORMULA_IDENTIFIER_ERROR: 0x000E,
    	NO_ROW_SELECTED: 0x0010,
    	SEQUENCE_NO_DEFINE: 0x0011,
    	LAYER_OR_HIDDEN_NO_DEFINE: 0x0012,
    	SHOW_LAYERDATA_NOTALLOW_GRID_EXPAND: 0x0013,
    	REQUIRED_ERROR: 0x0014,
    	NO_TABLE_FOUND: 0x0016,
    	FOREIGN_FIELDS_INEQUALITY: 0x0017,
    	NO_EMPTY_ROW_FOUND: 0x0018,
    	GRID_TREE_COLUMN_DEFINE_ERROR: 0x0019,
    	UNDEFINED_ROW_EXPAND_TYPE: 0x001A,
    	REF_OPERATION_NOT_DEFINED: 0x001B,
    	NO_DETAIL_ROW_DEFINE: 0x001C,
    	COMPONENT_NOT_EXISTS: 0x001D,
    	NO_REFDETAILTABLEKEY_DEFINE: 0x001E,
    	NO_REFTABLEKEY_DEFINE: 0x001F,
    	NO_EXPANDSOURCE_RESULT_GET: 0x002A,
    	UNDEFINED_SUBDETAIL_LINKTYPE: 0x002B,
    	NO_SUBDETAILS_IN_EMPTYROW: 0x002C,
    	NO_GRID_OR_LISTVIEW_FOUND: 0x002D,
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
    	EXPAND_SOURCE_UNDEFINED: 0x0048,
    	//数据拓展数据列未定义
    	EXPAND_COLUMNKEY_UNDEFIND: 0x0049,
    	//只支持在表单类型为View的情况下使用
    	VIEW_FORM_ONLY: 0x0050,
    	

        throwException: function (code, args) {
            var paras = {};
            paras.service = "PureException";
            paras.code = code;
            if (args != null && args != undefined) {
                paras.args = args;
            }
            var success = function (data) {
                throw new Error( data );
            }
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras, success);
        }
    };
    return Return;
})();