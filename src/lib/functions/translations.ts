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
		"api-unsplash": "如果你希望利用Unsplash API为文章添加图片，需要在此填写Unsplash API Key",
		"api-google-maps": "用于查找图片的拍摄地点",
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
		"api-unsplash": "If you want to use Unsplash API to add images to articles, you need to fill in Unsplash API Key here",
		"api-amap": "If your images are taken in China, it is recommended to use Amap API",
		"api-google": "If your images are taken overseas, it is recommended to use Google Map API",
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
		"api-unsplash": "如果你希望利用Unsplash API為文章添加圖片，需要在此填寫Unsplash API Key",
		"api-amap": "如果你的圖片在中國拍攝，建議使用高德地圖API",
		"api-google": "如果你的圖片在國外拍攝，建議使用Google Map API",
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
		"api-unsplash": "記事に画像を追加するためにUnsplash APIを使用する場合は、ここにUnsplash APIキーを入力する必要があります",
		"api-amap": "写真が中国で撮影された場合、Amap APIを使用することをお勧めします",
		"api-google": "写真が海外で撮影された場合、Google Map APIを使用することをお勧めします",
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
	}
}

export default translations;
