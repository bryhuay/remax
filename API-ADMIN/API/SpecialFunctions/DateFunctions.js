
const getDateWithoutTime = (date) => {
	const newDate = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
	return newDate;
}

const getHolidays = (year) => {
	let holidays = [];
	let posibleHolidays = [
		new Date(year,5 - 1,1),
		new Date(year,6 - 1,29),
		new Date(year,7 - 1,28),
		new Date(year,7 - 1,29),
		new Date(year,8 - 1,30),
		new Date(year,10 - 1,8),
		new Date(year,11 - 1,1),
		new Date(year,12 - 1,8)
	];

	for (let i = 0; i < posibleHolidays.length; i++) {
		if(isWeekday(posibleHolidays[i])){
			holidays.push(posibleHolidays[i]);
		}
	}

	return holidays;
}

const isWeekday = (date) => {
	let day = date.getDay();
	return (day == 0 || day == 6)? false : true;
}

const isHoliday = (date) => {
	date = getDateWithoutTime(date);
	let holidays = getHolidays(date.getFullYear());

	for (let i = 0; i < holidays.length; i++) {
		if(holidays[i].getTime() == date.getTime()){
			return true;
		}
	}
	return false;
}

const daysBetween = (startDate, endDate) => {
	let ndays = 1 + Math.round( ( endDate.getTime() - startDate.getTime() ) / (24*3600*1000) );
	return ndays;
}

const weekendDaysBetween = (startDate, endDate) => {
	let ndays = 1 + Math.round( ( endDate.getTime() - startDate.getTime() ) / (24*3600*1000) );
	let nsaturdays = Math.floor( ( startDate.getDay() + ndays ) / 7 );
	
	return 2*nsaturdays + ( startDate.getDay() == 0 ) - ( endDate.getDay()==6 );
}

const holidaysBetween = (startDate, endDate) => {
	let holidaysNumber = 0;
	let holidays = getHolidays(startDate.getFullYear());

	let startDay = startDate.getDate();
	let endDay = endDate.getDate();
	let startMonth = startDate.getMonth() + 1;
	let endMonth = endDate.getMonth() + 1;

	for (let i = 0; i < holidays.length; i++) {
		const itemDay = holidays[i].getDate();
		const itemMonth = holidays[i].getMonth() + 1;


		if(itemMonth > startMonth && itemMonth < endMonth){
			holidaysNumber++;
		}else if(itemMonth == startMonth){
			if(startDay <= itemDay){
				holidaysNumber++;
			}
		}else if(itemMonth == endMonth){
			if(endDay >= itemDay){
				holidaysNumber++;
			}
		}

	}

	return holidaysNumber;
}

const vacationDaysBetween = ( startDate, endDate, vacationsList ) => {
	
	let vacationDays = 0;

	for (let i=0; i < vacationsList.length; i++) {
		let startVacations = new Date(vacationsList[i].start.toISOString());
		let endVacations = new Date(vacationsList[i].end.toISOString());
		
		if(startDate <= startVacations && endVacations <= endDate){
			//sumar
			vacationDays += daysBetween(startVacations, endVacations);
		}
		else if(endDate <= startVacations ){
			//no sumar
		}
		else if(startDate <= startVacations && endVacations >= endDate)
		{
			endVacations = endDate;
			vacationDays += daysBetween(startVacations, endVacations);
		}
		else if(startDate >= startVacations && endVacations >= endDate){
			startVacations = startDate;
			vacationDays += daysBetween(startVacations, endVacations);
		}
	}

	return vacationDays;
}

module.exports = { 
	getDateWithoutTime,
	getHolidays,
	isWeekday,
	isHoliday,
	daysBetween,
	weekendDaysBetween,
	holidaysBetween,
	vacationDaysBetween
};