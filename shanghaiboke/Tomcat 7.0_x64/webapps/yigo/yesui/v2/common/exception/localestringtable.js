
YIUI.StringTable = {};
YIUI.LocaleStringTable = (function(StringTable) {
	var defaultDevLocal = "zh-CN";
	var resClass = null;
	
	var rt = {
		localeMap: new HashMap(),
		defaultDevLocal: "zh-CN",
		getString: function(/*locale, */group, key) {
			// 如果没有相应语种的字符串定义，那么取默认的开发语言
			// if ( locale == null ) {
			var locale = YIUI.DefaultLocale.getDefaultLocale();
			// }
			var lang = locale.getLocale();
			var text = null;

			if ( lang == null || lang.isEmpty() ) {
				lang = this.defaultDevLocal;
			}
			var map = this.localeMap.get(lang);
			if ( map == null ) {
				map = YIUI.Exception[group][lang];
				this.localeMap.put(lang, map);
			}

			var code = StringTable[key];
			text = map[code];

			if ( text == null ) {
				// 如果默认的语言环境未初始化,那么初始化
				map = this.localeMap.get(defaultDevLocal);
				if( map == null ) {
					map = YIUI.Exception[group][lang];
					this.localeMap.put(defaultDevLocal, map);
				}
				var code = StringTable[key];
				text = map[code];
			}
			
			return text;
		}

	};

	return rt;
});

YIUI.DefaultLocale = (function() {
	var rt = {
		defaultLocale: null,
		getDefaultLocale: function() {
			if ( this.defaultLocale == null ) {
				this.defaultLocale = {
					locale: $.cookie("locale"),
					getLocale: function() { 
						return this.locale;
					}
				};
			}
			return this.defaultLocale;
		}
	};
	return rt;
})();

