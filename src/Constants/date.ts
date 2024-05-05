const formatData = (input: number) => {
	return input > 9 ? input : `0${input}`;
};

const formatHour = (input: number) => {
	return input > 12 ? input - 12 : input;
};

const getDateFragments = (date: Date) => {
	return {
		dd: formatData(date.getDate()),
		mm: formatData(date.getMonth() + 1),
		yyyy: date.getFullYear(),
		HH: formatData(date.getHours()),
		hh: formatData(formatHour(date.getHours())),
		MM: formatData(date.getMinutes()),
		SS: formatData(date.getSeconds()),
		amPm: date.getHours() >= 12 ? 'PM' : 'AM'
	};
};

export const format24Hour = (date: Date) => {
	const { dd, mm, yyyy, HH, MM, SS, amPm } = getDateFragments(date);
	return `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS} ${amPm}`;
};

export const format12Hour = (date: Date) => {
	const { dd, mm, yyyy, hh, MM, SS, amPm } = getDateFragments(date);
	return `${mm}/${dd}/${yyyy} ${hh}:${MM}:${SS} ${amPm}`;
};
