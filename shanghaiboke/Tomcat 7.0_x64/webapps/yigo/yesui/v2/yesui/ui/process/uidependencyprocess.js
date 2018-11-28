/**
 * Created by 陈瑞 on 2017/3/14 use WebStorm.
 */
YIUI.UIDependencyProcess = (function () {

    // 单例对象
    var Return = {
        valueChanged:function (form,component) {
            var relations = form.dependency.relationTree;
            var targetFields,targetField,targetComp,cellLocation,grid,columnInfo;
            for (var field in relations) {
                if (field !== component.key)
                    continue;
                var targetFields = relations[field];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    targetComp = form.getComponent(targetField);
                    if (targetComp != null) {
                        targetComp.dependedValueChange(targetField,field,null);
                        continue;
                    }
                    cellLocation = form.getCellLocation(targetField);
                    if( cellLocation != null ) {
                        grid = form.getComponent(cellLocation.key);
                        grid.dependedValueChange(targetField, field, null);
                    }
                }
            }
        },

        cellValueChanged:function (form, grid, rowIndex, colIndex, cellKey) {
            var relations = form.dependency.relationTree, targetFields;
            for (var field in relations) {
                if ( field !== cellKey )
                    continue;
                targetFields = relations[field];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    grid.doPostCellValueChanged(rowIndex, field, targetFields[i], null);
                }
            }
        },

        doCalcOneRow:function (control, rowIndex) {
            var meta = control.getMetaObj();
            if( meta.type != YIUI.CONTROLTYPE.GRID ) {
                return;
            }
            var gridRow = control.getRowDataAt(rowIndex), metaRow = control.getMetaObj().rows[gridRow.metaRowIndex];
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i];
                if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                    //TODO 刷新动态单元格
                }
            }
        }
    }

    return Return;
})();
