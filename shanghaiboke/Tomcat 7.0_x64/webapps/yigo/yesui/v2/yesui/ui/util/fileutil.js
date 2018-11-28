/**
 * 文件工具类
 */
YIUI.FileUtil = (function () {

    YIUI.ImageTypes = ["gif", "jpg", "jpeg", "png", "bmp"];

    // 获取文件信息
    var getFileInfo = function ($file) {
        var prefix,size,fileName;
        if ($.browser.isIE) {
            var filePath = $file[0].value;
            try {
                // var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                // var file = fileSystem.GetFile(filePath);
                // size = file.Size / 1024;
                // var fileName = file.Name;
                // prefix = fileName.substring(fileName.lastIndexOf(".") + 1);

                var s = $file[0].value;
                var arr = s.split('\\');
                fileName = arr[arr.length-1];

                prefix = fileName.substring(fileName.lastIndexOf(".") + 1);

                size = 0;
            } catch (e) {
                $.error("IE needs to start the ActiveX in the settings!");
            }
        } else {
            size = $file[0].files[0].size / 1024;
            var path = $file.val();
            prefix = path.substring(path.lastIndexOf(".") + 1);
            fileName = path.substring(path.lastIndexOf("\\") + 1);
        }
        var info = {};
        info.prefix = prefix.toLowerCase();;
        info.size = size;
        info.fileName = fileName;
        return info;
    };

    // 文件规格检查,IE, 报错:Automation,服务器不能创建对象,需要Internet设置ActiveX
    // IE同时需要设值上传文件到服务器时包含本地路径
    var checkFile = function (info, maxSize, types, fileInput) {
        if(fileInput && (fileInput instanceof jQuery)) {
            fileInput = fileInput[0];
        }
        if (types && types.length > 0 && $.inArray(info.prefix, types) == -1) {
            fileInput && (fileInput.outerHTML = fileInput.outerHTML);
            $.error("非指定文件类型!(" + types + ")");
            return false;
        }
        if (maxSize && maxSize != -1 && info.size > maxSize) {
            fileInput && (fileInput.outerHTML = fileInput.outerHTML);
            $.error("超出指定大小!(" + maxSize + "KB)");
            return false;
        }
        return true;
    };

    var Return = {

        downLoadFile: function (options) {
            // IE 需要先把iframe进行appendTo(document.body)
            var $iframe = $('<iframe id="download-file-iframe"/>').appendTo(document.body);
            var $form = $('<form target="download-file-iframe" name="AAA" enctype="multipart/form-data" method="post"/>');

            $form.attr('action', Svr.SvrMgr.AttachURL);

            for(var key in options){
                // $form.append('<input type="hidden" name="'+key+'" value="'+ options[key]+'"/>');
                $form.append("<input type='hidden' name='" + key + "' value='" + options[key] + "'/>");
            }

            $iframe.append($form);
            $form.submit();

            $iframe.remove();
            $form.remove();
        },

        uploadFile:function (options) {
            // 先移除可能存在的iframe和form元素
            var $iframe = $("#upload-frame",document.body);
            var $form = $("#upload-form",document.body);
            $iframe.remove();
            $form.remove();

            //动态创建iframe和form表单,必须设置iframe的name值与form的target属性
            $iframe = $('<iframe name="upload-file-iframe" id="upload-frame"/>');
            $form = $('<form id="upload-form" target="upload-file-iframe" enctype="multipart/form-data" method="post" style="display:none;"/>');

            $form.attr('action',Svr.SvrMgr.AttachURL);

            var $file = $('<input type="file" name="upload-file">');

            $file.appendTo($form);
            $(document.body).append($iframe).append($form);

            $file.change(function () {

                var info = getFileInfo($(this));
                options.fileName = info.fileName;

                for(var key in options){
                    if( typeof options[key] === 'function' )
                        continue;
                    // $form.append('<input type="hidden" name="'+key+'" value="'+ options[key]+'"/>');
                    $form.append("<input type='hidden' name='" + key + "' value='" + options[key] + "'/>");
                }

                if( checkFile(info, options.maxSize, options.types) ) {
                    $form.submit();
                } else {
                    $iframe.remove();
                    $form.remove();
                }
            });

            // 处理回调事件
            $iframe.load(function () {
                var data = $(this).contents().find('body').html();
                if( data ) {
                    var ret = JSON.parse(data);
                    if( ret.data && typeof options.success === 'function' ) {
                        options.success(ret.data);
                    } else if ( ret.error ) {
                        $.error(ret.error.error_info);
                    }
                    $iframe.remove();
                    $form.remove();
                }
            });

            $file.click();// 触发浏览事件,选择文件
        },

        ajaxFileUpload:function (options) {
            var info = getFileInfo(options.file);
            options.fileName = info.fileName;

            if( checkFile(info,options.maxSize,options.types,options.file) ) {

                var params = {};
                for( var p in options ) {
                    if( typeof options[p] === 'function' || typeof options[p] === 'object' )
                        continue;
                    params[p] = options[p];
                }

                $.ajaxFileUpload({
                    url: Svr.SvrMgr.AttachURL,
                    fileElement: options.file,
                    data: params,
                    type: "post",
                    success: function (data) {
                        if( !data ) return;
                        var result = JSON.parse(data).data;
                        if( typeof options.success === 'function' ) {
                            options.success.call(this,result);
                        }
                    }
                });
            }
            window.up_target = null;
        }
    };
    return Return;
})();
