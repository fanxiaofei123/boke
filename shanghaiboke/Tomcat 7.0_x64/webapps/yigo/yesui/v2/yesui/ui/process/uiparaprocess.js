/**
 * Created by 陈瑞 on 2017/3/15 use WebStorm.
 */
YIUI.UIParaProcess = (function () {

    /**
     * 静态私有方法,刷新一个参数的值
     * @param para 参数
     */
    var refreshPara = function (form,para) {
        var value;
        switch (para.type) {
        case YIUI.ParameterSourceType.CONST:
            value = YIUI.TypeConvertor.toDataType(para.dataType,para.value);
            break;
        case YIUI.ParameterSourceType.FORMULA:
            value = form.eval(para.formula,{form:form},null);
            break;
        case YIUI.ParameterSourceType.FIELD:
            var cellLocation = form.getCellLocation(para.value);
            if ( cellLocation ) { // 固定行单元格
                var key = cellLocation.key,
                    row = cellLocation.row,column = cellLocation.column;
                value = form.getCellValByIndex(key, row, column);
            } else {
                // 头控件
                var comp = form.getComponent(key);
                if ( !comp ) {
                    YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS,key);
                }
                value = comp.getValue();
            }
            if( value instanceof YIUI.ItemData ) {
                value = value.getOID();
            }
            break;
        }
        form.setPara(para.key,value);
    };

    var Return = {
        // 计算所有参数的值
        calcAll:function (form) {
            var paras = form.dependency.paraTree.items;
            for( var i = 0,size = paras.length;i < size;i++ ) {
                refreshPara(form,paras[i]);
            }
        },
        // 值改变影响的参数值重新计算
        valueChanged:function (form,component) {
            var affectItems = form.dependency.paraTree.affectItems,affect;
            if( !affectItems )
                return;
            for( var i = 0,length = affectItems.length;i < length;i++ ) {
                if( affectItems[i].key === component.key ) {
                    affect = affectItems[i];
                    break;
                }
            }
            if( affect ) {
                for( var i = 0,size = affect.expItems.length;i < size;i++ ) {
                    refreshPara(form,affect.expItems[i]);
                }
            }
        }
    }
    return Return;
})();

