YIUI.BPMException = (function (code, message) {
    var bpm_code = {

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
		
		MISS_FORM: 0x0011
	};
    		
    var StringTable = YIUI.StringTable.BPM;

	var getGroupCode = function() {
		return 0x8009;
	};

    var errorInfoMap = new HashMap();
	errorInfoMap.put(bpm_code.NO_DEFINE_NODE_TYPE, StringTable.NoDefineNodeType);
	errorInfoMap.put(bpm_code.PARTICIPATOR_ERROR, StringTable.ParticipatorError);
	errorInfoMap.put(bpm_code.DELEGATE_RIGHT_ERROR, StringTable.DelegateRightError);
	errorInfoMap.put(bpm_code.INSTANCE_STARTED, StringTable.InstanceStarted);
	errorInfoMap.put(bpm_code.WORKITEM_DATA_TIME_OUT, StringTable.WorkitemDataTimeout);
	errorInfoMap.put(bpm_code.NO_ACTIVE_WORKITEM, StringTable.NoActiveWorkitem);
	errorInfoMap.put(bpm_code.NO_MAP_DATA, StringTable.NoMApData);
	errorInfoMap.put(bpm_code.NO_PROCESS_DEFINATION, StringTable.NoProcessDefination);
	errorInfoMap.put(bpm_code.NO_BINDING_PROCESS, StringTable.NoBindingProcess);
	errorInfoMap.put(bpm_code.NO_DYNAMIC_BINDING_PROCESS, StringTable.NoDynamicBindingProcess);
	errorInfoMap.put(bpm_code.NO_PROCESS_DEFINATION_VERID, StringTable.NoProcessDefinationVerID);
	errorInfoMap.put(bpm_code.NO_INSTANCE_DATA, StringTable.NoInstanceData);
	errorInfoMap.put(bpm_code.DELEGATE_MISS_SRC, StringTable.DelegateMissSrc);
	errorInfoMap.put(bpm_code.DELEGATE_MISS_TGT, StringTable.DelegateMissTgt);
	errorInfoMap.put(bpm_code.NO_NODE_EXIST, StringTable.NoNodeExist);
	errorInfoMap.put(bpm_code.NO_BPM_CONTEXT, StringTable.NoBPMContext);
	errorInfoMap.put(bpm_code.ROLLBACK_ERROR, StringTable.RollbackError);
	errorInfoMap.put(bpm_code.NO_STANDARD_FORM, StringTable.NoStandardForm);
	errorInfoMap.put(bpm_code.NO_FORM, StringTable.NoForm);
	errorInfoMap.put(bpm_code.NO_PATH, StringTable.NoPath);
	errorInfoMap.put(bpm_code.MISS_ATTACHMENT, StringTable.MissAttachment);
	errorInfoMap.put(bpm_code.DELEGATE_ENDTIME_BEFORE_STARTTIME, StringTable.EndTimeBeforeStartTime);
	errorInfoMap.put(bpm_code.INSTANCE_PAUSED, StringTable.InstancePaused);
	errorInfoMap.put(bpm_code.COMMIT_RIGHT_ERROR, StringTable.CommitRightError);
	errorInfoMap.put(bpm_code.COMMIT_ERROR, StringTable.CommitError);
	errorInfoMap.put(bpm_code.COMMIT_NO_BACKSITE, StringTable.CommitNOBacksite);
	errorInfoMap.put(bpm_code.COMMIT_NO_BACKSITE_OPT, StringTable.CommitNOBacksiteOpt);
	errorInfoMap.put(bpm_code.OUT_OF_PARTICIPATORS, StringTable.OutOfParticipators);
	errorInfoMap.put(bpm_code.COMMIT_NO_TRANSITTO, StringTable.CommitNoTranstTo);
	errorInfoMap.put(bpm_code.PARTICIPATORS_CACL_ERROR, StringTable.ParticipatorsCaclError);
	errorInfoMap.put(bpm_code.DISTRIBUTE_NOT_SUPPORT, StringTable.DistributeNotSupport);

    var rt = {
        formatMessage: function(/*locale, */code) {
			var key = errorInfoMap.get(code);
            var format = StringTable.getString(/*locale, */key);
            var msg = YIUI.Exception.format(format, arguments, 1);
			return msg;
		},

        throwException: function (code, args) {
            var msg = this.formatMessage(code, args);
            throw new Error(msg);
        }

    };

		
	return $.extend({}, rt, bpm_code);
})();
YIUI.Exception.BPMMid = YIUI.BPMException;