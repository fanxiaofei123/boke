(function () {
    YIUIContainer = function(el) {
        var YIUIContainer = {};
        YIUIContainer.panel = function (type) {
            if (type == "tab") {
                return new YIUI.TabContainer();
            }
        };
        YIUIContainer.container = new YIUIContainer.panel("tab");
        YIUIContainer.container.el = el;
        YIUIContainer.container.render();
        YIUIContainer.el = YIUIContainer.container.el;
        YIUIContainer.build = function (form) {
            if (YIUIContainer.container) {
                form.setContainer(YIUIContainer);
                YIUIContainer.container.add(form.getRoot());
            }
        };
        YIUIContainer.doLayout = function(width, height) {
            YIUIContainer.container.doLayout(width, height);
        };
        YIUIContainer.removeForm = function (form) {
            if (YIUIContainer.container) {
                YIUIContainer.container.removeForm(form);
            }
        };
        
        YIUIContainer.renderDom = function(form) {
            YIUIContainer.container.doRenderChildren(form);
        };

        YIUIContainer.closeAll = function() {
            if (YIUIContainer.container) {
                YIUIContainer.container.closeAll();
            }
        };
        
        YIUIContainer.closeTo = function(targetKey) {
            if (YIUIContainer.container) {
                YIUIContainer.container.closeTo(targetKey);
            }
        };
        YIUI.MainContainer = YIUIContainer;

        window.onerror = function(msg) {
			YIUI.LoadingUtil.hide();
            msg = msg.replace("Uncaught Error:", "");
            var dialog = $("<div></div>").attr("id", "error_dialog");
            dialog.modalDialog(msg, {title: YIUI.I18N.title.error, showClose: true, type: "error", height: 170, width: 460});
        };

        window.openEntry = function(node) {
            YIUI.EventHandler.doTreeClick(node, YIUI.MainContainer);
        };
        
        window.exec = function(formID, formula) {
            var form = YIUI.FormStack.getForm(formID);
            var result = form.eval(formula, {form: form});
            return result;
        };
        
        window.history.forward(-1);

        return YIUIContainer;
    }

})();