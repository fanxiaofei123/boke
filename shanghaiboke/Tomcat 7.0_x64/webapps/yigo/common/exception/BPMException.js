YIUI.BPMException = (function () {
    var Return = {

		serialVersionUID: 1,

		NO_DEFINE_NODE_TYPE: 0x0001,

		PARTICIPATOR_ERROR: 0x0002,

		DELEGATE_RIGHT_ERROR: 0x0003,

		INSTANCE_STARTED: 0x0004,

		WORKITEM_DATA_TIME_OUT: 0x0005,

		NO_ACTIVE_WORKITEM: 0x0006,

		NO_MAP_DATA: 0x0007,

		NO_PROCESS_DEFINATION: 0x0008,

		NO_BINDING_PROCESS: 0x0009,

		NO_DYNAMIC_BINDING_PROCESS: 0x000A,

		NO_PROCESS_DEFINATION_VERID: 0x000B,

		NO_INSTANCE_DATA: 0x000C,

		DELEGATE_MISS_SRC: 0x000D,

		DELEGATE_MISS_TGT: 0x000E,

		NO_NODE_EXIST: 0x000F,

		NO_BPM_CONTEXT: 0x0010,
		
		MISS_FORM: 0x0011,
    		
        throwException: function (code, args) {
            var paras = {};
            paras.service = "PureException";
            paras.code = code;
            paras.isBPMError = true;
            if (args != null && args != undefined) {
                paras.args = args;
            }
            var success = function (data) {
                throw new Error( data );
            }
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras, success);
        }
    };
    return Return;
})();