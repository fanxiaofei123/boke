//语言包
(function ($) {
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {
        defaults: {
            record: "{0} - {1}",
            totalrecord: YIUI.I18N.grid.total,
            seqColText: YIUI.I18N.listview.seq,  //序号字段名称
            emptyrecords: YIUI.I18N.grid.noData,
            recordtext: "{0} - {1}\u3000" + YIUI.I18N.grid.recordtext, // 共字前是全角空格
            pgtext: YIUI.I18N.grid.jumpTo
        },
        del: {
        	 caption: YIUI.I18N.attachment.attachmentDelete,
             msg: YIUI.I18N.grid.deleteRecord,
             bSubmit: YIUI.I18N.attachment.attachmentDelete,
             bCancel: YIUI.I18N.dict.cancel
        },
        nav: {
             addtitle: YIUI.I18N.grid.addRecord,
             deltitle: YIUI.I18N.grid.delRecord,
             uprowtitle: YIUI.I18N.grid.moveUp,
             downrowtitle: YIUI.I18N.grid.moveDown,
             bestwidthtitle: YIUI.I18N.grid.bestWidth,
             frozencoltitle: YIUI.I18N.grid.frozencol,
             frozenrowtitle: YIUI.I18N.grid.frozenrow,
             unfrozencoltitle: YIUI.I18N.grid.unfrozencol,
             unfrozenrowtitle: YIUI.I18N.grid.unfrozenrow
        },
        formatter: {
            integer: {thousandsSeparator: ",", defaultValue: '0'},
            number: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
            currency: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "", suffix: "", defaultValue: '0.00'}
        },
        error: {
        	isNotTable: YIUI.I18N.grid.isNotTable,
            isErrorMode: YIUI.I18N.grid.isErrorMode,
            model: YIUI.I18N.grid.model,
            isSortError: YIUI.I18N.grid.isSortError,
            compDictNotDataBinding: YIUI.I18N.grid.notAllow
        },
        alert: {
        	 title: YIUI.I18N.grid.prompt,
             confirm: YIUI.I18N.date.confirm
        },
        cell_imgOpt: {
        	open: YIUI.I18N.grid.select,
            show: YIUI.I18N.grid.show,
            clear: YIUI.I18N.grid.clear
        }
    });
})(jQuery);