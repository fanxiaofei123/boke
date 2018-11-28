/**
 * Created with IntelliJ IDEA.
 * User: 陈瑞
 * Date: 16-12-26
 * Time: 下午5:19
 */
(function(){
   YIUI.ViewDataMonitor = function(form){
       this.form = form;
       this.process = new YIUI.UIProcess(form);

       this.preFireCellValueChanged = function(grid, rowIndex, colIndex, cellKey){
           this.process.doPreCellValueChanged(grid, rowIndex, colIndex, cellKey);
       }

       this.fireCellValueChanged = function(grid,rowIndex,colIndex) {
           var row = grid.dataModel.data[rowIndex],
               metaRow = grid.getMetaObj().rows[row.metaRowIndex],
               cellKey = row.cellKeys[colIndex];

           // 计算表达式
           this.process.doCellValueChanged(grid,rowIndex,colIndex,cellKey);

           // 汇总计算
           YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);

           if( colIndex == grid.selectFieldIndex ){
               grid.refreshSelectAll();
           }

           var valueChanged = metaRow.cells[colIndex].valueChanged;
           if (valueChanged !== undefined && valueChanged.length > 0) {
               form.eval($.trim(valueChanged), {form: form, rowIndex: rowIndex}, null);
           }
       }

       this.postFireCellValueChanged = function(grid, rowIndex, colIndex, cellKey) {
           this.process.doPostCellValueChanged(grid, rowIndex, colIndex, cellKey);
       }

       this.preFireValueChanged = function (component) {
           this.process.preFireValueChanged(component);
       };

       this.fireValueChanged = function (component) {
           this.process.fireValueChanged(component);
       };

       this.postFireValueChanged = function (component) {
           this.process.postFireValueChanged(component);
       };

       this.getUIProcess = function () {
           return this.process;
       }

   }
})()
