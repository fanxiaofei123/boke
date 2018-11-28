(function () {
    
    YIUI.Yes_Image = function (options) {

        var installBar = function (self) {
            var locale = $.ygrid.cell_imgOpt,
                optBar = $("<div class='bar'></div>").appendTo(self.el);

            var upload = $("<span class='opt load' title='" + locale.open + "'/>").appendTo(optBar),
                clear = $("<span class='opt clear' title='" + locale.clear + "'/>").appendTo(optBar),
                show = $("<span class='opt show' title='" + locale.show + "'/>").appendTo(optBar);

            $("<input type='file' class='upload' name='file'/>").appendTo(upload);

            $(".opt",self.el).hover(function () {
                $(this).addClass("sel");
            },function () {
                $(this).removeClass("sel");
            });

            clear.click(function () {
                self.clear();
            });

            show.click(function () {
                var path;
                if (self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
                    if (!self.value)
                        return;
                    var formKey = self.el.attr("formKey"),
                        p = encodeURIComponent(self.value);
                    path = Svr.SvrMgr.AttachURL + "?path=" + p + "&formKey="+formKey+"&service=DownloadImage&mode=1&r=" + Math.random();
                } else {
                    path = self.image;
                }
                if( !path )
                    return;

                var showDiv = $("<div class='ui-img-showDiv'></div>").appendTo(document.body),
                    imageDiv = $("<div class='image_count'></div>").appendTo(document.body),
                    tmpImg = $("<img class='ui-img-showImg' src='" + path + "'>").appendTo(imageDiv),
                    deleteDiv = $("<span class='deleteImage'><span class='image_delete'></span></span>").appendTo(imageDiv),
                    toolbarDiv = $("<div class='toolbarIamge'><span class='big'></span><span class='small'></span></div>").appendTo(imageDiv);
                var outerWidth = imageDiv.outerWidth();
            	var outerHeight = imageDiv.outerHeight();
            	var imageWidth = imageDiv.outerWidth();
            	var imageHeight = imageDiv.outerHeight();
                tmpImg.load(function () {
                    // var left = (showDiv.width() - this.width) / 2 + "px",
                    //     top = (showDiv.height() - this.height) / 2 + "px";
                	
                    var left = (showDiv.width() - outerWidth) / 2 + "px",
                        top = (showDiv.height() - outerHeight) / 2 + "px";
                    if(this.width > outerWidth && this.height > outerHeight){
                        tmpImg.css({width: imageWidth + 'px', height: imageHeight + 'px',display: 'block'});
                    }else if(this.width < outerWidth && this.height >= outerHeight){
                        tmpImg.css({width: this.width, height: imageHeight + 'px'});
                    }else if(this.width >= outerWidth && this.height < outerHeight){
                        tmpImg.css({width: imageWidth + 'px', height: this.height});
                    }else{
                        tmpImg.css({width: this.width, height: this.height});
                    }
                    
                    imageDiv.css({left: left, top: top});
                });

                $(".image_delete").click(function () {
                    showDiv.remove();
                    imageDiv.remove();
                });
                
                showDiv.click(function () {
                    showDiv.remove();
                    tmpImg.remove();
                    imageDiv.remove();
                });

                // tmpImg.click(function () {
                //     showDiv.remove();
                //     tmpImg.remove();
                // });
                var tmpWidth,  tmpHeight ;
                $(".big").click(function(){
                    if(tmpImg.width() < imageWidth && tmpImg.height() < imageHeight){
                        tmpWidth= tmpImg.width() + 20 ;
                        tmpHeight = tmpImg.height() + 20;

                    }else if(tmpImg.width() < imageWidth && tmpImg.height() >= imageHeight){
                        tmpWidth= tmpImg.width() + 20;
                        tmpHeight = imageHeight;
                    }else if(tmpImg.width() >= imageWidth && tmpImg.height() < imageHeight){
                        tmpWidth = imageWidth;
                        tmpHeight = tmpImg.height() + 20;

                    }else if(tmpImg.width() >= imageWidth  && tmpImg.height()>= imageHeight ||
                    		tmpImg.width() == imageWidth && tmpImg.height() == imageHeight){
                        tmpWidth= imageWidth;
                        tmpHeight = imageHeight;
                        tmpImg.css({width: imageWidth + 'px', height: imageHeight + 'px',display: 'block'});
                    }
                    tmpImg.css({width: tmpWidth + "px", height: tmpHeight  + "px"});
                });


                $(".small").click(function(){
                    tmpWidth= tmpImg.width() - 20 ;
                    tmpHeight = tmpImg.height() - 20;
                    tmpImg.css({width: tmpWidth + "px", height: tmpHeight  + "px",display:'inline-block'});
                });

            });
           
            $(".opt,.bar", self.el).hide();
        }

        var Return = {
            el: $("<div></div>"),
            sourceType: YIUI.IMAGE_SOURCETYPE.DATA,
            image: "",
            stretch: false,
            imageCut: false,
            enable: true,
            init: function () {
                this._img = $("<img />").appendTo(this.el);
                if( this.stretch ) {
                    this._img.addClass("stretch");
                }
                installBar(this);
            },
            getEl: function () {
                return this.el;
            },
            setSourceType: function (sourceType) {
                this.sourceType = sourceType;
            },
            setImagePath: function (path) {
                this.image = "Resource/" + path;
                this._img.attr("src", this.image.replace(/\\/g, "/"));
            },
            setImageCut: function (imageCut) {
                this.imageCut = imageCut;
            },
            setStretch: function (stretch) {
                this.stretch = stretch;
            },
            setEnable: function (enable) {
                this.enable = enable;
            },
            getImage: function () {
                return this._img;
            },
            setHeight: function (height) {
                // var img = this.getImage();
                // if (this.stretch) {
                //     img.css({height: height});
                // } else {
                //     if (height < this.el.width()) {
                //         img.height("100%");
                //         img.width("auto");
                //     } else {
                //         img.width("100%");
                //         img.height("auto");
                //     }
                // }
            },
            setWidth: function (width) {
                // var img = this.getImage();
                // if (this.stretch) {
                //     img.css("width", this.el.innerWidth());
                // } else {
                //     if (width > this.el.height()) {
                //         img.height("100%");
                //         img.width("auto");
                //     } else {
                //         img.width("100%");
                //         img.height("auto");
                //     }
                // }
            },

            setValue: function (value) {
                this.value = value;
            },

            uploadImg: $.noop,
            clear: $.noop,
            click: $.noop,
            commitValue: $.noop,

            install: function () {
                var self = this;

                self.el.on('change', '.upload', function (event) {
                    var file,fileName,type;
                    if( $.browser.isIE ) {
                        file = $(this).val();
                        fileName = file.substring(file.lastIndexOf("\\") + 1), type = fileName.split(".")[1];
                    } else {
                        file = event.target.files[0];
                        fileName = file.name, type = file.type.split("/")[1];
                    }
                    var _this = this;
                    if (self.imageCut) {
                        $(_this).photoCut({
                            type: type,
                            callback: function (paras) {
                                self.uploadImg($(_this), paras);
                            }
                        });
                    } else {
                        self.uploadImg($(_this), {
                                fileName: fileName,
                                imgType: type
                            }
                        );
                    }
                });

                self.el.on('blur', '.upload', function (event) {
                    $(".opt,.bar", self.el).hide();
                });

                this._img.bind("click", function (e) {
                    self.click();
                });

                this.el.hover(function () {
                    if(self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA && self.enable) {
                        $(".opt,.bar", self.el).show();
                    } else {
                        $(".opt.show,.bar", self.el).show();
                    }
                },function () {
                    $(".opt,.bar", self.el).hide();
                })
            }
        };
        Return = $.extend(Return, options);
        if (!options.isPortal) {
            Return.init();
        }
        Return.install();
        return Return;
    }
})();