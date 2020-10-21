let h = 0;
let w = 0;
let c = null;
let ctx = null;
let center = null;

function setUp(){
	c = document.getElementById('canv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width * 0.25;
	h = w;
	center = {x: w/2, y:h/2};
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	drawPattern();
	document.getElementById('phaseInput').addEventListener('input', () => {
		ctx.clearRect(0,0,w,h);
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,w,h);
		drawCircle(center, w*0.3, '#aaa');
		drawMoonArc(center, w * 0.3, parseFloat(document.getElementById('phaseInput').value));
	});
}

function drawPattern(){
	ctx.fillRect(0,0,w,h);
	
	const moonDetails = getMoonDetailsForToday();
	console.log(moonDetails);
	document.getElementById('currentPhase').innerText = 'Today (' + moonDetails.date + ') is a ' + moonDetails.name.toLowerCase();
	
	
}

function drawMoonArc(center, radius, phase){
	const moonColor = '#888';
	if(phase < 0.01){
		return;
		//drawCircle(center, radius, '#800', false);
	}
	else if (phase < 0.499){
		ctx.fillStyle = '#008';
		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, Math.PI * 0.5, Math.PI * 1.5, true);
		ctx.moveTo(center.x, center.y - radius);
		ctx.bezierCurveTo(center.x - (radius * phase * 1.333 * 2), center.y - radius, center.x - (radius * phase * 1.333 * 2), center.y + radius,center.x, center.y + radius);
		ctx.fill();
	}
	else if (phase > 0.45 && phase < 0.55){
		ctx.fillStyle = '#080';
		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, Math.PI * 0.5, Math.PI * 1.5, true);
		ctx.moveTo(center.x, center.y - radius);
		ctx.lineTo(radius,center.x, center.y + radius);
		ctx.fill();
	}
	
	
}

function drawCircle(center, radius, style, stroke){
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	if(stroke){
		ctx.strokeStyle = style;
		ctx.stroke();
	}
	else{
		ctx.fillStyle = style;
		ctx.fill();
	}
}

function getMoonDetailsForToday(){
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();
	const date = {day, month, year};
	
	return getMoonPhaseDetailsForDate(date);
}

function getMoonPhaseDetailsForDate(date){
	const phase = moonPhaseForDate(date);
	const name = moonNameForPhase(phase);
	const brightness = moonBrightnessForPhase(phase);
	return {phase, name, brightness, date: date.day + '-' + date.month + '-' + date.year};
}

function moonPhaseForDate(date){
	if (date.month < 3){
		date.year--;
		date.month += 12;
	}
	date.month += 1;
	const c = 365.25 * date.year;
	const e = 30.6 * date.month;
	let jd = c + e + date.day - 694039.09;	//jd is total days elapsed
	jd /= 29.5305882;	//divide by the moon cycle
	jd -= ~~jd;	//subtract integer part to leave fractional part of original jd
	return jd;
}

function moonBrightnessForPhase(phase){//this is very wrong
	const scaled = phase * Math.PI;
	return Math.sin(scaled);
}

function moonNameForPhase(phase){
	phase = ~~((phase * 8) % 8);
	switch (phase){
		case 0:
			return 'New Moon';
		case 1:
			return 'Waxing Crescent Moon';
		case 2:
			return 'Quarter Moon';
		case 3:
			return 'Waxing Gibbous Moon';
		case 4:
			return 'Full Moon';
		case 5:
			return 'Waning Gibbous Moon';
		case 6:
			return 'Last Quarter Moon';
		case 7:
			return 'Waning Crescent Moon';
		default:
			return 'Error';
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});