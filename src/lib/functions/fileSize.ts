// 本函数接收一个数字，转换成合适的文件大小单位，如 kb mb gb
export function fileSize(size: number) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let i = 0;
	while (size >= 1024) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(2)} ${units[i]}`;
}
