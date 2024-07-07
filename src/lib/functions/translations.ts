type Translation = {
	[key: string]: {
		[key: string]: string;
	};
};

const translations: Translation = {
	"zh-CN": {
		"home": "首页",
		"message": "消息",
		"media": "媒体",
		"article": "文章",
		"photo": "照片",
		"video": "视频",
		"thought": "想法",
		"comment": "评论",
		"user": "用户",
		"topic": "话题",
		"setting": "设置",
		"default": "默认",
		"add-language": "添加语言",
		"delete": "删除",
		"set-default": "设为默认",
		"language": "语言",
		"media-storage": "媒体存储",
		"api": "API",
		"ai": "AI",
		"email": "邮箱",
		"username": "用户名",
		"username-description": "将作为对外显示的用户名",
		"password": "密码",
		"password-requirement": "密码需要包含大小写字母和数字，最少8位",
		"confirm-password": "确认密码",
		"password-too-short": "密码长度不足8位",
		"password-not-valid": "密码需要包含大小写字母和数字",
		"password-not-match": "密码不匹配",
		"ok": "确定",
		"submit": "提交",
		"cancel": "取消",
		"language-added": "语言已添加",
		"language-deleted": "语言已删除",
		"language-set-default": "默认语言已切换",
		"language-add-fail": "添加语言失败",
		"language-delete-fail": "删除语言失败，请检查是否还有关联的内容",
		"url-prefix": "本字段用于对象存储的URL前缀",
		"api-unsplash": "如果你希望利用Unsplash API为文章添加图片，需要在此填写Unsplash API Key",
		"api-mapbox": "用于查找图片的拍摄地点",
		"api-amap": "如果你的图片在中国拍摄，建议使用高德地图API",
		"api-perspective": "该服务用于鉴别评论是否为恶意评论",
		"upload-photo": "上传照片",
		"shooting-time": "拍摄时间",
		"shooting-location": "拍摄地点",
		"brand": "品牌",
		"model": "型号",
		"lens": "镜头",
		"aperture": "光圈",
		"shutter-speed": "快门速度",
		"iso": "ISO",
		"image-caption": "图片描述",
		"selected": "已选择",
		"edit-image": "编辑图片信息",
		"file-name": "文件名",
		"alt-text": "替代文本",
		"generate-alt": "生成替代文本",
		"alt-text-description": "出于无障碍考虑，建议填写替代文本",
		"folder": "文件夹",
		"close": "关闭",
		"next-page": "下一页",
		"previous-page": "上一页",
		"title": "标题",
		"subtitle": "副标题",
		"description": "描述",
		"content": "正文",
		"abstract": "摘要",
		"cover": "封面",
		"save": "保存",
		"publish": "发布",
		"unpublish": "取消发布",
		"publish-time": "发布时间",
		"feature": "精选",
		"top": "置顶",
		"logged-in-only": "登录后可见",
		"category": "分类",
		"generate": "生成",
		"select": "选择",
		"reset": "重置",
		"status": "状态",
		"edit": "编辑",
		"draft": "草稿",
		"published": "已发布",
		"topped": "置顶",
		"featured": "精选",
		"premium-only": "登录可见",
		"add-new": "创建",
		"type": "类型",
		"count": "数量",
		"slug-is-available": "你可以使用这个slug",
		"slug-has-been-used": "这个slug不能使用",
		"leave-confirm": "你还有未保存的修改，确定要离开吗？",
		"photos-count": "照片数量",
		"image": "图片",
		"translate": "翻译",
	},
	"en": {
		"home": "Home",
		"message": "Message",
		"media": "Media",
		"article": "Article",
		"photo": "Photo",
		"video": "Video",
		"thought": "Thought",
		"comment": "Comment",
		"user": "User",
		"topic": "Topic",
		"setting": "Setting",
		"default": "Default",
		"add-language": "Add Language",
		"delete": "Delete",
		"set-default": "Set Default",
		"language": "Language",
		"media-storage": "Media Storage",
		"api": "API",
		"email": "Email",
		"username": "Username",
		"username-description": "Will be displayed as username",
		"password": "Password",
		"password-requirement": "Password must contain uppercase, lowercase, and number, at least 8 characters",
		"confirm-password": "Confirm Password",
		"password-too-short": "Password is too short",
		"password-not-valid": "Password must contain uppercase, lowercase, and number",
		"password-not-match": "Password does not match",
		"ok": "OK",
		"submit": "Submit",
		"cancel": "Cancel",
		"language-added": "Language added",
		"language-deleted": "Language deleted",
		"language-set-default": "Default language switched",
		"language-add-fail": "Failed to add language",
		"language-delete-fail": "Failed to delete language, please check if there are still associated contents",
		"url-prefix": "This field is used for the URL prefix of object storage",
		"api-unsplash": "If you want to use Unsplash API to add images to articles, you need to fill in Unsplash API Key here",
		"api-amap": "If your images are taken in China, it is recommended to use Amap API",
		"api-mapbox": "If your images are taken overseas, it is recommended to use Google Map API",
		"api-perspective": "This service is used to identify whether comments are malicious comments",
		"upload-photo": "Upload Photo",
		"shooting-time": "Shooting Time",
		"shooting-location": "Shooting Location",
		"brand": "Brand",
		"model": "Model",
		"lens": "Lens",
		"aperture": "Aperture",
		"shutter-speed": "Shutter Speed",
		"iso": "ISO",
		"image-caption": "Image Caption",
		"selected": "Selected",
		"edit-image": "Edit Image Information",
		"file-name": "File Name",
		"alt-text": "Alt Text",
		"generate-alt": "Generate Alt Text",
		"alt-text-description": "For accessibility consideration, it is recommended to fill in alt text",
		"folder": "Folder",
		"close": "Close",
		"next-page": "Next",
		"previous-page": "Previous",
		"title": "Title",
		"subtitle": "Subtitle",
		"description": "Description",
		"content": "Content",
		"abstract": "Abstract",
		"cover": "Cover",
		"save": "Save",
		"publish": "Publish",
		"unpublish": "Unpublish",
		"publish-time": "Publish Time",
		"feature": "Feature",
		"top": "Top",
		"logged-in-only": "Logged in only",
		"category": "Category",
		"generate": "Generate",
		"select": "Select",
		"reset": "Reset",
		"status": "Status",
		"edit": "Edit",
		"draft": "Draft",
		"published": "Published",
		"topped": "Topped",
		"featured": "Featured",
		"premium-only": "Logged in only",
		"add-new": "Create",
		"type": "Type",
		"count": "Count",
		"slug-is-available": "You can use this slug",
		"slug-has-been-used": "This slug cannot be used",
		"leave-confirm": "You have unsaved changes, are you sure to leave?",
		"photos-count": "Photos Count",
		"image": "Image",
		"translate": "Translate",
	},
	"zh-TW": {
		"home": "首頁",
		"message": "訊息",
		"media": "媒體",
		"article": "文章",
		"photo": "照片",
		"video": "影片",
		"thought": "想法",
		"comment": "評論",
		"user": "用戶",
		"topic": "話題",
		"setting": "設定",
		"default": "默認",
		"add-language": "新增語言",
		"delete": "刪除",
		"set-default": "設為默認",
		"language": "語言",
		"media-storage": "媒體存儲",
		"api": "API",
		"email": "信箱",
		"username": "用戶名",
		"username-description": "將作為對外顯示的用戶名",
		"password": "密碼",
		"password-requirement": "密碼需要包含大小寫字母和數字，最少8位",
		"confirm-password": "確認密碼",
		"password-too-short": "密碼長度不足8位",
		"password-not-valid": "密碼需要包含大小寫字母和數字",
		"password-not-match": "密碼不匹配",
		"ok": "確定",
		"submit": "提交",
		"cancel": "取消",
		"language-added": "語言已添加",
		"language-deleted": "語言已刪除",
		"language-set-default": "默認語言已切換",
		"language-add-fail": "添加語言失敗",
		"language-delete-fail": "刪除語言失敗，請檢查是否還有關聯的內容",
		"url-prefix": "本字段用於對象存儲的URL前綴",
		"api-unsplash": "如果你希望利用Unsplash API為文章添加圖片，需要在此填寫Unsplash API Key",
		"api-amap": "如果你的圖片在中國拍攝，建議使用高德地圖API",
		"api-mapbox": "如果你的圖片在國外拍攝，建議使用Google Map API",
		"api-perspective": "該服務用於鑑別評論是否為惡意評論",
		"upload-photo": "上傳照片",
		"shooting-time": "拍攝時間",
		"shooting-location": "拍攝地點",
		"brand": "品牌",
		"model": "型號",
		"lens": "鏡頭",
		"aperture": "光圈",
		"shutter-speed": "快門速度",
		"iso": "ISO",
		"image-caption": "圖片描述",
		"selected": "已選擇",
		"edit-image": "編輯圖片信息",
		"file-name": "文件名",
		"alt-text": "替代文本",
		"generate-alt": "生成替代文本",
		"alt-text-description": "出於無障礙考慮，建議填寫替代文本",
		"folder": "文件夾",
		"close": "關閉",
		"next-page": "下一頁",
		"previous-page": "上一頁",
		"title": "標題",
		"subtitle": "副標題",
		"description": "描述",
		"content": "內容",
		"abstract": "摘要",
		"cover": "封面",
		"save": "保存",
		"publish": "發布",
		"unpublish": "取消發布",
		"publish-time": "發布時間",
		"feature": "精選",
		"top": "置頂",
		"logged-in-only": "登錄後可見",
		"category": "分類",
		"generate": "生成",
		"select": "選擇",
		"reset": "重置",
		"status": "狀態",
		"edit": "編輯",
		"draft": "草稿",
		"published": "已發布",
		"topped": "置頂",
		"featured": "精選",
		"premium-only": "登錄可見",
		"add-new": "創建",
		"type": "類型",
		"count": "數量",
		"slug-is-available": "你可以使用這個slug",
		"slug-has-been-used": "這個slug不能使用",
		"leave-confirm": "你還有未保存的修改，確定要離開嗎？",
		"photos-count": "照片數量",
		"image": "圖片",
		"translate": "翻譯",
	},
	"jp": {
		"home": "ホーム",
		"message": "メッセージ",
		"media": "メディア",
		"article": "記事",
		"photo": "写真",
		"video": "ビデオ",
		"thought": "アイデア",
		"comment": "コメント",
		"user": "ユーザー",
		"topic": "トピック",
		"setting": "設定",
		"default": "デフォルト",
		"add-language": "言語を追加",
		"delete": "削除",
		"set-default": "デフォルトに設定",
		"language": "言語",
		"media-storage": "メディアストレージ",
		"api": "API",
		"email": "メール",
		"username": "ユーザー名",
		"username-description": "外部に表示されるユーザー名",
		"password": "パスワード",
		"password-requirement": "パスワードには大文字、小文字、数字が必要で、最低8文字",
		"confirm-password": "パスワードを認証",
		"password-too-short": "パスワードが短すぎます",
		"password-not-valid": "パスワードには大文字、小文字、数字が必要です",
		"password-not-match": "パスワードが一致しません",
		"ok": "OK",
		"submit": "提出する",
		"cancel": "キャンセル",
		"language-added": "言語が追加されました",
		"language-deleted": "言語が削除されました",
		"language-set-default": "デフォルト言語が切り替わりました",
		"language-add-fail": "言語の追加に失敗しました",
		"language-delete-fail": "言語の削除に失敗しました。関連コンテンツがまだあるかどうかを確認してください",
		"url-prefix": "このフィールドはオブジェクトストレージのURLプレフィックスに使用されます",
		"api-unsplash": "記事に画像を追加するためにUnsplash APIを使用する場合は、ここにUnsplash APIキーを入力する必要があります",
		"api-amap": "写真が中国で撮影された場合、Amap APIを使用することをお勧めします",
		"api-mapbox": "写真が海外で撮影された場合、Google Map APIを使用することをお勧めします",
		"api-perspective": "このサービスは、コメントが悪意のあるコメントかどうかを識別するために使用されます",
		"upload-photo": "写真をアップロード",
		"shooting-time": "撮影時間",
		"shooting-location": "撮影場所",
		"brand": "ブランド",
		"model": "モデル",
		"lens": "レンズ",
		"aperture": "絞り",
		"shutter-speed": "シャッタースピード",
		"iso": "ISO",
		"image-caption": "画像の説明",
		"selected": "選択済み",
		"edit-image": "画像情報を編集",
		"file-name": "ファイル名",
		"alt-text": "代替テキスト",
		"generate-alt": "代替テキストを生成",
		"alt-text-description": "アクセシビリティを考慮して、代替テキストを記入することをお勧めします",
		"folder": "フォルダ",
		"close": "閉じる",
		"next-page": "次へ",
		"previous-page": "前へ",
		"title": "タイトル",
		"subtitle": "サブタイトル",
		"description": "説明",
		"content": "コンテンツ",
		"abstract": "要約",
		"cover": "カバー",
		"save": "保存",
		"publish": "公開",
		"unpublish": "非公開",
		"publish-time": "公開時間",
		"feature": "特集",
		"top": "トップ",
		"logged-in-only": "ログイン後に表示",
		"category": "カテゴリ",
		"generate": "生成",
		"select": "選択",
		"reset": "リセット",
		"status": "ステータス",
		"edit": "編集",
		"draft": "下書き",
		"published": "公開済み",
		"topped": "トップ",
		"featured": "特集",
		"premium-only": "ログイン後に表示",
		"add-new": "作成",
		"type": "タイプ",
		"count": "数",
		"slug-is-available": "このスラッグを使用できます",
		"slug-has-been-used": "このスラッグは使用できません",
		"leave-confirm": "保存されていない変更があります。本当に移動しますか？",
		"photos-count": "写真の数",
		"image": "画像",
		"translate": "翻訳",
	}
}

export default translations;
