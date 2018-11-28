var plug_in = {
		image: {
				height: "The width of the display box should not be smaller than the head frame," +
						"and the height should be at highter than the head frame height 50px",
				fileError: "Select file error,the picture type must be",
				bilderType: "one of the"
				
		},
		
		richEditor : {
			test: "The page was detected without reference to jQuery,please quote first,otherwise the wangEditor will not be available.",
			cannot: "Detects that window.jQuery has been modified and the wangEditor will not be available.",
			arial: 'Song typeface',
			blackbody: 'blackbody',
			regularScript: 'Regular script',
			officialScript: 'Official script',
			youyuan: 'youyuan',
			microsoftYaHei: 'Microsoft YaHei', 
			marroon: 'marroon',
            purple: 'purple',
            red: 'red',
            brightPink: 'Bright pink',
            mazarine: 'mazarine',
            blue: 'blue',
            lakeBlue: 'Lake blue',
            blushGreen: 'Bluish green',
            green: 'green',
            olive: 'olive',
            reseda: 'reseda',
            aurantius: 'aurantius',
            gray: 'gray',
            silver: 'silver',
            black: 'black',
            white: 'white',
            insertExpression: "In actual projects,emoticons should be cofigured to your own server(faster),or multiple groups of expressions can be configured,please refer to the document." +
            		"  \n\n\n   【The pop-up box will not appear in the actual project】",
            insertImage: "In the actual project,you can consult the configuration file and configure how to upload the local picture (support across domains)   \n\n\n    【The pop-up box will not appear in the actual project】",
            insertCode: "In the actual project,you can cofigure the highlighted code,refer to the document     \n\n\n    【The pop-up box will not appear in the actual project】",
            insertPicture: "insert local picture",
            insert: 'insert',
			submit: 'submit',
			update: 'update',
			cancel: 'cancel',
			close: 'close',
			upload: 'upload',
			unsafeAlert: 'The input is not safe,please re-enter!',
			formatError: 'Input formatting error,please re-enter!',
			unchecked: 'Unselected edit area,unable to perform operation',
			prompt: 'wangEditor perompt: use textarea to expand the rich text box.',
			event: 'A two wangEditor() event cannot be executed for a textarea'
		}
};


if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, plug_in);
}else {
	YIUI.I18N = plug_in;
}