/**
 * Created by 陈瑞 on 2017/3/1.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.AbstractUIProcess = YIUI.extend({
        form : null,
        calcTree: null,
        enableTree: null,
        visibleTree: null,
        checkRuleTree: null,

        init : function(form) {
            this.form = form;
            this.calcTree = this.form.dependency.calcTree;
            this.enableTree = this.form.dependency.enableTree;
            this.visibleTree = this.form.dependency.visibleTree;
            this.checkRuleTree = this.form.dependency.checkRuleTree;
        },

        getFormEnable : function(){
            return this.form.operationState == YIUI.Form_OperationState.New ||
                this.form.operationState == YIUI.Form_OperationState.Edit;
        },

        newContext:function (form, rowIndex, colIndex) {
            var cxt = {};
            cxt.form = form;
            cxt.rowIndex = rowIndex;
            cxt.colIndex = colIndex;
            return cxt;
        },

        initTree:function (item) {
            if( !item.items )
                return;
            for(var i = 0, exp, cnt; exp = item.items[i]; i++ ) {
                cnt = exp.content || exp.formulaValue;
                if( cnt && !exp.syntaxTree ) {
                    exp.syntaxTree = this.form.getSyntaxTree(cnt);
                }
            }
            return item;
        },

        calcFormulaValue:function (item, context, cType) {
            var result = null;
            try {
                if(item.syntaxTree) {
                    result = this.form.evalByTree(item.syntaxTree, context, null);
                } else if (item.formulaValue) {
                    result = this.form.eval(item.formulaValue, context, null);
                } else if (item.defaultValue) {
                    result = this.dataConvert(cType, item.defaultValue);
                }
            } catch (e) {
                result = "#DIV/0";
            }
            return result;
        },

        dataConvert: function(cType, value) {
            var result = null;

            switch (cType) {
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                result = YIUI.TypeConvertor.toDecimal(value);
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                result = YIUI.TypeConvertor.toDate(value);
                break;
            case YIUI.CONTROLTYPE.DICT:
                if( $.isNumeric(value) ) {
                    result = YIUI.TypeConvertor.toLong(value);
                }
                break;
            default:
                result = value;
                break;
            }
            return result;
        },

        calcEnable:function (item, context, defaultValue) {
            if( !this.form.hasEnableRight(item.target) )
                return false;
            if( item.syntaxTree ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(item.syntaxTree, context, null));
            } else if ( item.content ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(item.content, context, null));
            }
            return defaultValue;
        },

        calcVisible:function (item,context,defaultValue) {
            if( !this.form.hasVisibleRight(item.target) )
                return false;
            if( item.syntaxTree ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(item.syntaxTree, context, null));
            } else if ( item.content ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(item.content, context, null));
            }
            return defaultValue;
        },

        calcCheckRule:function (item,context) {
            var result = null;
            if( item.syntaxTree ) {
                result = this.form.evalByTree(item.syntaxTree, context, null);
            } else if ( item.content ) {
                result = this.form.eval(item.content, context, null);
            }
            return result;
        },

        moveError:function (com) {
            if( !com.isVisible() && (com.isError() || com.isRequired()) ) {
                if( com.isError() ) {
                    this.form.setError(true, com.getErrorMsg(), com.key);
                }
                if( com.isRequired() ) {
                    this.form.setError(true, com.caption + " " + YIUI.I18N.control.required, com.key);
                }
            } else {
                if( this.form.isError() && this.form.errorInfo.errorSource == com.key ){
                    this.form.setError(false, null, null);
                }
            }
        },

        moveCellError: function (grid,rowData,rowIndex,colIndex) {
            var cellData = rowData.data[colIndex],
                column = grid.getColumnAt(colIndex),
                editOpt = grid.getCellEditOpt(rowIndex,colIndex);
            if( column.hidden && (cellData[4] || cellData[3]) ) {
                if( cellData[4] ) {
                    grid.setRowError(rowIndex, true, cellData[5], editOpt.key);
                }
                if( cellData[3] ) {
                    grid.setRowError(rowIndex, true, editOpt.caption + " " + YIUI.I18N.control.required, editOpt.key);
                }
            } else {
                if( rowData.error && rowData.errorSource == editOpt.key ) {
                    grid.setRowError(rowIndex, false, null, null);
                }
            }
        }

    })
})();