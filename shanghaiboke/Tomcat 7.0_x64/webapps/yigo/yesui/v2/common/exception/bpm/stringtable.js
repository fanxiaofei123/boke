YIUI.StringTable.BPM = (function (code, message) {
	var obj = {
		NoDefineNodeType: "NoDefineNodeType",
		ParticipatorError: "ParticipatorError",
		DelegateRightError: "DelegateRightError",
		InstanceStarted: "InstanceStarted",
		WorkitemDataTimeout: "WorkitemDataTimeout",
		NoActiveWorkitem: "NoActiveWorkitem",
		NoMApData: "NoMApData",
		NoProcessDefination: "NoProcessDefination",
		NoBindingProcess: "NoBindingProcess",
		NoDynamicBindingProcess: "NoDynamicBindingProcess",
		NoProcessDefinationVerID: "NoProcessDefinationVerID",
		NoInstanceData: "NoInstanceData",
		DelegateMissSrc: "DelegateMissSrc",
		DelegateMissTgt: "DelegateMissTgt",
		NoNodeExist: "NoNodeExist",
		NoBPMContext: "NoBPMContext",
		RollbackError: "RollbackError",
		NoStandardForm: "NoStandardForm",
		NoForm: "NoForm",
		NoPath: "NoPath",
		MissAttachment: "MissAttachment",
		StartInstance: "StartInstance",
		CommitWorkItem: "CommitWorkItem",
		RevocateCommited: "RevocateCommited",
		EndTimeBeforeStartTime: "StartTimeBeforeEndTime",
		InstancePaused: "InstancePaused",
		CommitRightError: "CommitRightError",
		CommitError: "CommitError",
		CommitNOBacksite: "CommitNOBacksite",
		CommitNOBacksiteOpt: "CommitNOBacksiteOpt",
		TransitTo: "TransitTo",
		OutOfParticipators: "OutOfParticipators",
		CommitNoTranstTo: "CommitNoTransitTo",
		ParticipatorsCaclError: "ParticipatorsCaclError",
		DistributeNotSupport: "DistributeNotSupport"
	};

	var stringTable = null;
	var rt = {
		getString: function(/*locale, */key) {
			var string = null;
			if (stringTable == null) {
				stringTable = new YIUI.LocaleStringTable(this);
			}
			string = stringTable.getString(/*locale, */"BPMMid", key);
			return string;
		}
	};
	return $.extend({}, rt, obj);
})();

	