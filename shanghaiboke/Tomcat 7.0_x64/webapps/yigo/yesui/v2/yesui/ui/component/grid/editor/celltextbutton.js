/**
 * 表格单元格搜索框组件
 * @type {*}
 */
YIUI.CellEditor.CellTextButton = YIUI.extend(YIUI.CellEditor.CellTextEditor, {
    init: function (opt) {
        this.base(opt);
        this.opt = opt;
    },

    onRender: function (parent) {
        this.base(parent);
        this.yesCom.el.addClass("ui-txtbtn");
        this._btn = $("<button class='btn'>...</button>");
        this._btn.appendTo(this.yesCom.el);
        this._btn.css({height: this.yesCom.getInput().height() + "px", width:"20px", padding: "0", verticalAlign: "top"});
        this.yesCom.getInput().css({width: (parent.width() - this._btn.outerWidth()) + "px"});
    },

    finishInput: function () {
        return this.yesCom.finishInput();
    },

    install: function () {
        var self = this;
        self.clicking = false;
        this._btn.mousedown(function (e) {
            $(this).addClass("hover");
            self.clicking = true;
            self.opt.click();
        }).mouseup(function (e) {
            $(this).removeClass("hover");
            // window.setTimeout(function () {
            //     self.getInput().focus();
            // }, 50);
        });
        // this.getInput().blur(function (e) {
        //     window.setTimeout(function () {
        //         if (!self.clicking) {
        //             self.doFocusOut();
        //         } else {
        //             self.clicking = false;
        //         }
        //     }, 10);
        // });
    }
});