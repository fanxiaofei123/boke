/**
 * 表格单元格图片组件
 * @type {*}
 */
YIUI.CellEditor.CellImage = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        var self = this;
        this.options = opt;

        var form = YIUI.FormStack.getForm(self.options.ofFormID);

        this.yesCom = new YIUI.Yes_Image({
            sourceType: self.options.sourceType,
            stretch: self.options.stretch,
            imageCut: self.options.imageCut,
            uploadImg:function ($this, paras) {
                var paras = $.extend({
                    service: "UploadImage",
                    formKey: form.formKey,
                    operatorID: $.cookie("userID"),
                    fileID: -1,
                    oid: form.getOID(),
                    mode: 1,
                    isFixName: false,
                    maxSize: self.options.maxSize,
                    types: YIUI.ImageTypes,
                    file: $this,
                    success: function (data) {
                        self.saveCell(data.replace(/\\/g, "/"));
                    }
                }, paras);
                YIUI.FileUtil.ajaxFileUpload(paras);
            },
            click: function() {
                if (!self.enable || (!self.value && !self.image))
                    return;
                self.click();
            },
            clear: function () {
                Svr.SvrMgr.deleteImage({
                    formKey: form.formKey,
                    filePath: self.value,
                    operatorID: $.cookie("userID"),
                    service: "DeleteImage",
                    mode: 1
                });
                self.saveCell("");
            }
        });

        this.yesCom.getEl().addClass("ui-img cellEditor");

        this.setValue(opt.image || opt.value);

        this.setEnable(opt.enable);
    },
    onRender: function (parent) {
        this.base(parent);
    },
    getEl: function () {
        return this.yesCom.getEl();
    },
    setEnable: function (enable) {
        this.yesCom.setEnable(enable);
    },
    setValue: function (value) {
        var self = this;
        this.base(value);
        this.yesCom.getEl().attr("title",value || '');
        if( value ) {
            this.yesCom.getEl().removeClass("empty");
            if (this.options.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
                var form = YIUI.FormStack.getForm(this.options.ofFormID),
                    path = encodeURIComponent(value),
                    url = Svr.SvrMgr.AttachURL + "?path=" + path + "&formKey="+form.formKey + "&service=DownloadImage&mode=1&r=" + Math.random();
                this.yesCom.getImage().attr("src", url).show();
                this.yesCom.getEl().attr("formKey",form.formKey);
                this.yesCom.setValue(value);
            } else {
                this.yesCom.setImagePath(value);
            }
        } else {
            this.yesCom.getEl().addClass("empty");
        }
    },
    install: function () {
        $.noop();
    }
});