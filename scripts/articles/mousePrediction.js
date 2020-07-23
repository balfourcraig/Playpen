const golden_ratio= 0.618033988749895;
let randh = Math.random();
let w = 0;
let lastMousePoint = null;
let prev2MousePoint = null;
let lastDist = 0;

function nextGoldenRand(){
	randh += golden_ratio;
	randh %= 1;
	return randh;
}

function nextGoldenColor(sat, light){
	const num = nextGoldenRand();
	return 'hsl(' + (num * 360) + ', ' + sat + '%, ' + light + '%)';
}

function randomColor() {
	var letters = '0123456789ABC';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * letters.length)];
	}
	return color;
}

function shuffleInplace(arr){
	let n = arr.length;
	while(n > 0){
		const r = Math.floor(Math.random() * n);
		const temp = arr[r];
		arr[r] = arr[n-1];
		arr[n-1] = temp;
		n--;
	}
}

const goldenAngleRad = 2.39996322972865332;
let ctx;

function setUp(){
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	console.log('setup');
	const c = document.createElement('canvas');
	c.id = 'pieCanvas';
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	ctx = c.getContext('2d');
	const canvResult = document.getElementById('canvResult');
	canvResult.appendChild(c);
	
	canvResult.addEventListener('mousemove',drawPattern);
}

function drawPattern(e){
	const c = document.getElementById('pieCanvas');

	ctx.clearRect(0,0,w,w);
	const rect = c.getBoundingClientRect();

	if(e) {
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const mousePoint = {x:mouseX, y:mouseY};				

		if(lastMousePoint && prev2MousePoint){
			const movedDist = distance(mousePoint, lastMousePoint);
			const avgDist = (movedDist + lastDist) / 2;
			lastDist = movedDist;
			
			//mouseDrawPoint = pointReflect(mousePoint, lastMousePoint, 1);
			
			const grad = ctx.createLinearGradient(prev2MousePoint.x, prev2MousePoint.y, mousePoint.x, mousePoint.y);
			grad.addColorStop(0, 'transparent');
			grad.addColorStop(1, 'dodgerblue');
			ctx.strokeStyle = grad;
			
			ctx.beginPath();
			ctx.moveTo(prev2MousePoint.x, prev2MousePoint.y);
			ctx.quadraticCurveTo(lastMousePoint.x, lastMousePoint.y, mousePoint.x, mousePoint.y);
			ctx.stroke();
			
			const mult = 1;
			const predict1 = pointReflect(mousePoint, lastMousePoint, mult);
			const predict2 = pointReflect(predict1, pointReflect(lastMousePoint, prev2MousePoint, mult), mult);
			
			ctx.beginPath();
			ctx.moveTo(mousePoint.x, mousePoint.y);
			ctx.quadraticCurveTo(predict1.x, predict1.y, predict2.x, predict2.y);
			ctx.strokeStyle = 'red';
			ctx.stroke();
		}
		prev2MousePoint = lastMousePoint;
		lastMousePoint = mousePoint;
	}
}

function pointReflect(origin, point, multiplier){
	const xDiff = origin.x - point.x;
	const yDiff = origin.y - point.y;

	const x = origin.x + xDiff * multiplier;
	const y = origin.y + yDiff * multiplier;
	return {x:x, y:y};
}

function pointByAngle(center, radius, angle){
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

function pointOnCircle(center, radius, totalPoints, pointNum){
	const angle = pointNum / totalPoints * Math.PI * 2;
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

function distance(p1, p2, signed){
	let xDiff;
	let yDiff;
	if(signed){
		xDiff = p2.x - p1.x;
		yDiff = p2.y - p1.y;
		
		console.log('X: ' + xDiff);
		console.log('Y:' + yDiff);
	}
	else{
		xDiff = Math.abs(p1.x - p2.x);
		yDiff = Math.abs(p1.y - p2.y);
	}

	let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	if(xDiff > 0 && yDiff > 0)
		dist *= -1;
	return dist;
}

function midpoint(p1, p2){
	const x = (p1.x + p2.x) / 2;
	const y = (p1.y + p2.y) / 2;
	return {x:x, y:y};
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function angleOfC(a, b, c){
	const numerator = a * a + b * b - c * c;
	const deno = 2 * a * b;
	
	const arc = numerator / deno;
	
	return Math.acos(arc);
}

function perpendicular(p1, p2){
	const deltaX = p2.x - p1.x;
	const deltaY = p2.y - p1.y;
	
	const mid = midpoint(p1,p2);
	
	const start = {x: mid.x + deltaY/2, y: mid.y - deltaX/2};
	const end = {x: mid.x - deltaY/2, y: mid.y + deltaY/2};
	
	return {start: start, end: end};
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	drawPattern();
});