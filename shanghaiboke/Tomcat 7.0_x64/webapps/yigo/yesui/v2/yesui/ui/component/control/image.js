/**
 * 目前显示上传的图片，需要在tomcat\conf\Catalina\localhost底下配置path.xml
 * 该文件，设置了一个虚拟路径，其内容为：
 *          <Context docBase="D:/yes/test/Config/YigoApp/Data" path="/path" reloadable="true">
 *          </Context>
 *  其中docBase为上传的图片所在服务端的路径
 * @type {*}
 */
"use strict";
YIUI.Control.Image = YIUI.extend(YIUI.Control, {

    sourceType: YIUI.IMAGE_SOURCETYPE.DATA,
    image: "",
    maxSize: -1,
    imageCut: false,
    stretch: false,
    handler: YIUI.ImageHandler,
    
    behavior: YIUI.ImageBehavior,

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.sourceType = meta.sourceType || this.sourceType;
        this.image = meta.image || this.image;
        this.stretch = meta.stretch || this.stretch;
        this.maxSize = meta.maxSize || this.maxSize;
        this.imageCut = meta.imageCut || this.imageCut;
        this.clickContent = $.isUndefined(meta.onClick) ? "" : meta.onClick.trim();
    },
    
    setEnable: function(enable) {
    	this.base(enable);
    	if( this.el ) {
    		this._image.setEnable(enable);
    	}
    },

    checkEnd: function(value) {
        this.value = value;
        if( value ) {
            this.el.removeClass("empty");
            if( this.sourceType == YIUI.IMAGE_SOURCETYPE.DATA ) {
                var form = YIUI.FormStack.getForm(this.ofFormID),
                formKey = form.formKey,path = encodeURIComponent(value),
                url = Svr.SvrMgr.AttachURL + "?path=" + path + "&formKey="+formKey+"&service=DownloadImage&mode=1&r=" + Math.random();
                this._image.getImage().attr("src", url);
                this.el.attr("formKey", formKey);
            } else {
                this.setImage(value);
            }
            this._image.setValue(value);
        } else {
            this._image.getImage().attr("src", YIUI.Image.EmptyImg);
            this.el.addClass("empty");
        }
        this._image.getImage().attr("alt", this.caption);
    },

    setControlValue: function(value) {
        if( this.el ) {
            if((this.sourceType == YIUI.IMAGE_SOURCETYPE.RESOURCE) && !value) return;
            this.checkEnd(value);
        } else {
            this.value = value;
        }
    },

    setSourceType: function (sourceType) {
        this.sourceType = sourceType;
        this._image.setSourceType(sourceType);
    },
    onSetHeight: function (height) {
        this.base(height);
        this._image.setHeight(height);
    },
    onSetWidth: function (width) {
        this.base(width);
        this._image.setWidth(width);
    },
    setImage: function (image) {
        this._image.setImagePath(image);
    },
    setImageCut: function (imageCut) {
        this._image.setImageCut(imageCut);
    },

    onRender: function (ct) {
        this.base(ct);
        var _this = this,
            form = YIUI.FormStack.getForm(_this.ofFormID);
        this._image = new YIUI.Yes_Image({
            el: _this.el,
            sourceType: _this.sourceType,
            stretch: _this.stretch,
            imageCut: _this.imageCut,
            uploadImg: function ($this, paras) {
                var self = _this;
                paras = $.extend({
                    service: "UploadImage",
                    formKey: form.formKey,
                    operatorID: $.cookie("userID"),
                    fileID: -1,
                    oid: form.getOID(),
                    mode: 1,
                    isFixName: false,
                    maxSize: _this.maxSize,
                    types: YIUI.ImageTypes,
                    file:$this,
                    success:function (data) {
                        self.setValue(data.replace(/\\/g, "/"), true, true);
                    }
                }, paras);
                YIUI.FileUtil.ajaxFileUpload(paras);
            },
            click: function() {
                if (!_this.enable || (!_this.value && !_this.image))
                    return;
                _this.handler.doOnClick(_this.ofFormID, _this.clickContent);
            },
            clear: function () {
                Svr.SvrMgr.deleteImage({
                    formKey: form.formKey,
                    filePath: _this.value,
                    operatorID: $.cookie("userID"),
                    service: "DeleteImage",
                    mode: 1
                });
                _this.setValue("", true, true);
            }
        });

        this.el.addClass("ui-img");

        this.checkEnd(this.value || this.image);
    },

    downPicture: function () {
        alert(123)
    },
    focus: function () {
        this.el.attr("tabIndex", this.getTabIndex());
        this.el.focus();
    },
    install: function () {
        $(this.el).unbind("click");
        var self = this;
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('image', YIUI.Control.Image);