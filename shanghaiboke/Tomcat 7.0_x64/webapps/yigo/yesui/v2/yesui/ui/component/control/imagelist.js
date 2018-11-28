/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-3-26
 * Time: 下午2:52
 */
YIUI.Control.ImageList = YIUI.extend(YIUI.Control, {
    autoEl: '<img>',
    items: null,
    defaultValue: null,
    setValue: function (value) {
        this.base(value);
        if (this.items) {
            this.el.attr("src", this.items[value]);
        }
    },
    onRender: function (ct) {
        this.base(ct);
        if (this.items) {
            if (this.defaultValue) {
                this.el.attr("src", this.items[this.defaultValue]);
            } else {
                this.el.attr("src", this.items[0]);
            }
        }
    }
});
YIUI.reg('imagelist', YIUI.Control.ImageList);