var FocusPolicy = FocusPolicy || {};
(function () {
    FocusPolicy = function (form) {
        var Return = {
            form: form,
            requestNextFocus: function (comp) {
                if (comp == undefined || comp == null) {
                    Return.focusNextNode(0, Return.form.getTabCompList().length);
                } else {
                    Return.doFocusNext(comp.getTabIndex());
                }
            },
            doFocusNext: function (tabIndex) {
                var nextIndex = tabIndex + 1, len = Return.form.getTabCompList().length;
                if (nextIndex < len) {
                    Return.focusNextNode(nextIndex, len);
                } else {
                    Return.focusNextNode(0, len);
                }
            },
            focusNextNode: function (begin, len) {
                var match = false, index = begin;
                var matchNextNode = function (index) {
                    var com = Return.form.getTabCompList()[index];
                    var active = true;
                    $(com.el).parents(".ui-tabs-panel").each(function (idx,elem) {
                        if( !$(elem).hasClass('aria-show') ){
                            active = false;
                            return false;
                        }
                    });
                    if (com.el && com.enable && com.visible && active) {
                        com.focus();
                        return true;
                    }
                    return false;
                };
                while (index < len && !match) {
                    match = matchNextNode(index);
                    index++;
                }
                if (!match) {
                    index = 0;
                    while (index < begin && !match) {
                        match = matchNextNode(index);
                        index++;
                    }
                }
            }
        };
        return Return;
    };
})();