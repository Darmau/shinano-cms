// 本函数接收一个2021-12-25T01:04:08+00:00格式的时间字符串，返回一个本地时间字符串
export function localTime(time: string): string {
	return new Date(time).toLocaleString('zh-CN');
}
