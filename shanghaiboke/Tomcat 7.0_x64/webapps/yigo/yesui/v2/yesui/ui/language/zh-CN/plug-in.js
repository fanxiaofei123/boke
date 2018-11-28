var plug_in = {
		image: {
				height: "显示框的宽不能小于头像框，高至少大于头像框高50px",
				fileError: "选择文件错误,图片类型必须是",
				bilderType: "中的一种"
				
		},
		
		richEditor : {
			test: "检测到页面没有引用jQuery，请先引用，否则wangEditor将无法使用。",
			cannot: "检测到 window.jQuery 已被修改，wangEditor无法使用。",
			arial: '宋体',
			blackbody: '黑体',
			regularScript: '楷体',
			officialScript: '隶书',
			youyuan: '幼圆',
			microsoftYaHei: '微软雅黑', 
			marroon: '暗红色',
            purple: '紫色',
            red: '红色',
            brightPink: '鲜粉色',
            mazarine: '深蓝色',
            blue: '蓝色',
            lakeBlue: '湖蓝色',
            blushGreen: '蓝绿色',
            green: '绿色',
            olive: '橄榄色',
            reseda: '浅绿色',
            aurantius: '橙黄色',
            gray: '灰色',
            silver: '银色',
            black: '黑色',
            white: '白色',
            insertExpression: "实际项目中，表情图标要配置到自己的服务器（速度快），也可配置多组表情，请查阅文档。\n\n\n【该弹出框在实际项目中不会出现】",
            insertImage: "实际项目中，可查阅配置文件，如何配置上传本地图片（支持跨域）\n\n\n【该弹出框在实际项目中不会出现】",
            insertCode: "实际项目中，可配置高亮代码，请查阅文档\n\n\n【该弹出框在实际项目中不会出现】",
            insertPicture: "插入本地图片",
            insert: '插入',
			submit: '提交',
			update: '更新',
			cancel: '取消',
			close: '关闭',
			upload: '上传',
			unsafeAlert: '输入的内容不安全，请重新输入！',
			formatError: '输入的内容格式错误，请重新输入！',
			unchecked: '未选中编辑区，无法执行操作',
			prompt: 'wangEditor提示：请使用textarea扩展富文本框。',
			event: '针对一个textarea不能执行两遍wangEditor()事件'
		}
};

var YIUI = YIUI || {};
if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, plug_in);
}else {
	YIUI.I18N = plug_in;
}