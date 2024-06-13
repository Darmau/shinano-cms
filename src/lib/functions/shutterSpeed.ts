// 本文件接收一个float快门速度参数，返回一个1/125类型的string快门速度参数
export default function shutterSpeed(shutterTime: string): string {
	if (!shutterTime) return "0";
	const time = parseFloat(shutterTime);
	if (time >= 1) {
		// 保留整数部分
		return `${Math.round(time)}`;
	}
	const fraction = Math.round(1 / time);
	return `1/${fraction}`;
}
