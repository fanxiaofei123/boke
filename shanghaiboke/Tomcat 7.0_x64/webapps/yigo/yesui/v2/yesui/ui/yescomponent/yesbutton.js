(function () {
    YIUI.Yes_Button = function (options) {
        var Return = {
            el: $("<div><button></button></div>"),
            /** 图标 */
            icon: null,
            /** 显示文本 */
            caption: "按钮",

            init: function () {
                var self = this;
                var $input = $("button", this.el);
                if( options.IEFile ) {
                    $("<input type='file' class='upload' name='file'/>").appendTo(this.el);
                }
                $("<span class='txt'></span>").html(this.caption).appendTo($input);
                options.icon && this.setIcon(options.icon);
            },
            getEl: function () {
                return this.el;
            },
            setIcon: function (icon) {
                this.icon = icon;
                var textButton = $("span.txt", this.el), _icon = $("span.icon", this.el);
                if (_icon.length > 0) {
                    _icon.css({
                    	backgroundImage: "url('Resource/" + icon + "')"
                    });
                } else {
                    _icon = $("<span class='icon'></span>").css({
                    	backgroundImage: "url('Resource/" + icon + "')"
                    });
                    textButton.before(_icon);
                }
            },
            getTextButton: function () {
                return $("span.txt", this.el);
            },
            setWidth: function (width) {
                this.el.css("width", width);
                $("button", this.el).css("width", this.el.width());
            },
            setHeight: function (height) {
                this.el.css("height", height);
                $("button", this.el).css("height", this.el.height() + "px");
                $("button", this.el).css("line-height", this.el.innerHeight() + "px");
            }
        };
        Return = $.extend(Return, options);
        Return.init();
        return Return;
    }
})();