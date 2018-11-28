YIUI.RemoteService = (function () {
	var Return = {
		/**
		 * 获取一个新增的oid
		 */
	    applyNewOID: function() {
	        var params = {
	    		service: "ApplyNewOID"
	        };
	        return Svr.Request.getData(params).then(function(data){
	        			return data.OID;
	        		}).promise();
	    },

	    /**
	     * 获取平台公共密钥
	     */
	    getPublicKey: function (success) {
            var paras = {
                isWeb: true,
                service: "GetPublicKey"
            };

            if(success) {
	            return Svr.Request.getSyncData(null, paras, success);
	        } else {
            	return Svr.Request.getData(paras);
	        }
        },

        /**
		 * 获取登录人员信息
         * @param formKey 表单标识
         * @param mode 登录模式
         */
		getSvrUser: function (formKey,mode) {
            var params = {
                service: "SessionRights",
                cmd: "GetLoginOperators",
				formKey: formKey,
                loginMode: mode
            };
            return Svr.Request.getData(params);
        },

	    /**
	     * 修改密码
	     */
        changePWD: function (operatorID, password, newPassword) {
            var paras = {
                service: "SessionRights",
                cmd: "ChangePWD",
                operatorID: operatorID,
                password: password,
                newPassword: newPassword
            };
            // return Svr.Request.getData(paras);
	        return Svr.Request.getSyncData(null, paras);
        },

        /**
		 * 设置sessionParas，存放在服务器端
		 */
        setSessionParas: function(paras) {
	        var params = {
	            cmd: "SetSessionParas",
	            service: "HttpAuthenticate",
	            paras: $.toJSON(YIUI.YesJSONUtil.toJSONObject(paras))
	        };

	        return Svr.Request.getData(params);
        }


	}
	return Return;
})();