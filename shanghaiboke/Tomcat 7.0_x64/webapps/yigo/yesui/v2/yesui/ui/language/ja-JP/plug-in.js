var plug_in = {
		image: {
				height: "表示ボックスの幅がイメージボックスより大きい、且つ高さがイメージボックスより50px以上高くように設定してください。",
				fileError: "選択したファイルのイメージタイプは誤っています。イメージタイプを",
				bilderType: "に設定してください。"
				
		},
		
		richEditor : {
			test: "画面にjQueryへの引用は存在しませんので、wangEditorは使用できません。",
			cannot: "window.jQuery が変更されましたので、wangEditorは使用できません。",
			arial: 'SimSun',
			blackbody: 'SimHei',
			regularScript: 'KaiTi',
			officialScript: '隷書',
			youyuan: '丸ゴシック',
			microsoftYaHei: 'Microsoft YaHei', 
			marroon: '濃い赤',
            purple: '紫色',
            red: '赤色',
            brightPink: 'ピンク',
            mazarine: '紺碧',
            blue: '青色',
            lakeBlue: '水色',
            blushGreen: '緑青',
            green: '緑色',
            olive: '新緑',
            reseda: '青磁',
            aurantius: 'オレンジ',
            gray: '灰色',
            silver: '銀色',
            black: '黒色',
            white: '白色',
            insertExpression: "実際のプロジェクトでは顔文字をローカルサーバーに配置する必要があり（速度が速いです）、何セット配置することも可能です。資料を参照してください。\n\n\n【本ポップアップダイアログは実際のプロジェクトで表示しません。】",
            insertImage: "実際のプロジェクトでは設定ファイルを確認しながら、ローカルから画像のアップロードを設定することが可能です（ドメインの跨ぎも対応）。\n\n\n【本ポップアップダイアログは実際のプロジェクトで表示しません。】",
            insertCode: "コードハイライトの設定が可能です。資料を参照してください。\n\n\nを【本ポップアップダイアログは実際のプロジェクトで表示しません。】",
            insertPicture: "ローカルから画像を選択します。",
            insert: '挿入',
			submit: 'サブミット',
			update: '更新',
			cancel: 'キャンセル',
			close: '終了',
			upload: 'アップロード',
			unsafeAlert: '内容に誤りがありますので、再入力してください！',
			formatError: 'フォーマットは誤っています。再入力してください！',
			unchecked: '編集エリアを選択してください。',
			prompt: 'wangEditor提示：textarea拡張リッチテキストボックスを使用してください。',
			event: '一つのtextareaに対してはwangEditor()イベントを1回のみ実行します。'
		}
};

var YIUI = YIUI || {};
if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, plug_in);
}else {
	YIUI.I18N = plug_in;
}