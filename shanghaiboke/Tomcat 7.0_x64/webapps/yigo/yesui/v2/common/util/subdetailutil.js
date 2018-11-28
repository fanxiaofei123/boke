YIUI.SubDetailUtil = (function () {
    var Return = {
        isSubDetail: function (form, comp, gridKey) {
            if (comp.parentGridKey) {
                if (comp.parentGridKey != gridKey) {
                    return Return.isSubDetail(form, Return.getBindingGrid(form, comp), gridKey);
                } else {
                    return true;
                }
            }
            return false;
        },
        getBindingGrid: function (form, subDetailComp) {
            var parentGridKey = subDetailComp.parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            return form.getComponent(grid.key);
        },
        getBindingCellData: function (form, subDetailComp) {
            var cellKey = subDetailComp.bindingCellKey,
                grid = this.getBindingGrid(form,subDetailComp);
            if( grid == null ) return null;
            var rowIndex = grid.getFocusRowIndex();
            if (rowIndex == -1 || !cellKey) return null;
            var loc = form.getCellLocation(cellKey);
            return grid.getCellDataAt(rowIndex,loc.column);
        },
        getBindingColumn:function (form, subDetailComp) {
            var cellKey = subDetailComp.bindingCellKey;
            if( !cellKey ) return null;
            var grid = this.getBindingGrid(form,subDetailComp);
            if( grid == null ) return null;
            var loc = form.getCellLocation(cellKey);
            return grid.getColumnAt(loc.column);
        },
        clearSubDetailData: function (form, parentGrid) {
            var coms = form.subDetailInfo[parentGrid.key];
            if ( !coms ) {
                return;
            }

            var com;
            for (var i = 0, len = coms.length; i < len; i++) {
                com = form.getComponent(coms[i]);
                if (com.type == YIUI.CONTROLTYPE.GRID) {
                    this.clearSubDetailData(form,com);
                }
                com.reset();
            }
        }
    };
    return Return;
})();