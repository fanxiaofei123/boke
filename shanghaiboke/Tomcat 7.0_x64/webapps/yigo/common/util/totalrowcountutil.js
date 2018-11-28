YIUI.TotalRowCountUtil = (function(){
	var Return = {
		getKey: function(tableKey) {
			return tableKey + "_RowCount";
		},
		getRowCount: function(doc, tableKey) {
			return YIUI.TypeConvertor.toInt(doc.getExpData(this.getKey(tableKey)));
		},
		setRowCount: function(doc, tableKey, rowCount) {
			doc.putExpandData(this.getKey(tableKey), rowCount);
		}
	};
	return Return;
})();