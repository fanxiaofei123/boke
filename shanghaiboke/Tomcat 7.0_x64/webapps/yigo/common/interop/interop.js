var Interop = Interop || {};
(function () {
	Interop.exec = function(formID, formula, args) {
		if ( window.webkit != null && window.webkit.messageHandlers.eval != null ) {//IOS
			var msg = {
				form: formID,
				script: formula,
				args: args
			};
			window.webkit.messageHandlers.eval.postMessage(JSON.stringify(msg));
		} else if( window.YigoForm!=null){//Android
                          var msg = {
				form: formID,
				script: formula,
				args: args
			};
			window.YigoForm.eval(JSON.stringify(msg));
        }
	};
})();
