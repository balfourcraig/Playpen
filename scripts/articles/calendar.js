function buildCalendar(){
	const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
	const cal = {};
	cal['days'] = [];
	for(let i = 0; i < days.length; i++){
		const d = {name: days[i], events: []};
		cal.days.push(d);
	}
	cal.days[3].events.push({start: 3, end: 4});
	cal.days[1].events.push({start: 5.5, end: 6});
	cal.days[2].events.push({start: 12.25, end: 15.75});
	cal.days[1].events.push({start: 16, end: 19});

	return cal;
}

function drawCalendar(cal, holderID){
	const hourHeight = 20;
	const holder = document.getElementById(holderID);
	for(let i = 0; i < cal.days.length; i++){
		const d = document.createElement('div');
		d.classList.add('day');
		
		const dayTitle = document.createElement('div');
		dayTitle.innerText = cal.days[i].name;
		d.appendChild(dayTitle);

			let hour = 0;
			let index = 0;
			while(hour < 24 && index < cal.days[i].events.length){
				fillUntilHour(hour, cal.days[i].events[index].start, d, i % 2 === 0);

				const e = document.createElement('div');
				e.setAttribute('class','hour event');
				e.setAttribute('style','height:' + ((cal.days[i].events[index].end - cal.days[i].events[index].start) * hourHeight) + 'px;');
				e.innerText = intToClock12(cal.days[i].events[index].start) + ' - ' + intToClock12(cal.days[i].events[index].end);
				d.appendChild(e);
				
				hour = cal.days[i].events[index].end;
				index++;
			}
			fillUntilHour(hour, 24, d, i % 2 === 0);


		holder.appendChild(d);
	}
	
	function fillUntilHour(current, hour, holder, altRows){
		while(current < hour){
			const d = document.createElement('div');
			
			let diff;
			if(current - ~~current != 0)
				diff = 1- (current - ~~current);
			else
				diff = Math.min(1, hour-current);
			
			if(diff === 1 && current % 6 === 0)
				d.innerText = intToClock12(current);
				
			if((~~current)%2 === 0)
				d.setAttribute('class','hour' + (altRows ? ' altRow' : ''));
			else
				d.setAttribute('class','hour'+ (!altRows ? ' altRow' : ''));
			
			current += diff;
			d.setAttribute('style','height:' + diff * hourHeight + 'px');
			
			
			holder.appendChild(d);
		}
	}
	
	function intToClock12(num){
		const sign = num < 12 ? 'am' : 'pm';
		let hour = (~~num)%12;
		if(hour === 0)
			hour = 12;
			
		let minuteCompnent = (~~(60 * (num - ~~num))).toString();
		if(minuteCompnent.length === 1)
			minuteCompnent = '0' + minuteCompnent;
		
		return hour + ':' + minuteCompnent + sign;
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const cal = buildCalendar();
	drawCalendar(cal, 'calendar');
});