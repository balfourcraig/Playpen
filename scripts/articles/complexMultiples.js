let mousePoint = null;
let lastPoint = null;
let w = 0;
let h = 0;
let c = null;
let ctx = null;
let frameDelay = 0;
let lineWidth = 1;
let escapeTimeReadout = null;

let drawTimeout = null;
let maxIteration = 150;
let drawType = '';
let drawn = false;

function click(e){
	console.log('click');
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		mousePoint = {x: mapLinear(e.clientX - canvRect.left, 0, w, -2.5, 1), y: mapLinear(e.clientY - canvRect.top, 0, h, -1, 1)};
		lastPoint = {x: mousePoint.x, y: mousePoint.y};
	}
	if(document.getElementById('clickClearInput').checked){
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.fillRect(0, 0, w, h);
	}
	frameDelay = parseInt(document.getElementById('speedInput').value);
	maxIteration = parseInt(document.getElementById('maxIterationInput').value);
	lineWidth = parseInt(document.getElementById('lineWidthInput').value);
	drawType = document.getElementById('drawTypeSelect').value;
	ctx.lineWidth = lineWidth;
	drawIteration(0, false);
}


function setUp(){
	escapeTimeReadout = document.getElementById('escapeTimeReadout');
	c = document.getElementById('lineCanv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = ~~(w/1.75);
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	document.getElementById('canvArea').style.height = `${h}px`;
	
	ctx = c.getContext('2d');
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.fillRect(0, 0, w, w);
	
	c.addEventListener('mousedown', click);
}

function magnitude(x,y){
	return Math.sqrt(x * x + y * y);
}

function drawIteration(i, oneMore){
	escapeTimeReadout.innerHTML = i;
	if(i >= maxIteration || oneMore){
		return;
	}

	const x = lastPoint.x;
	const y = lastPoint.y;
	
	drawX = mapLinear(x, -2.5, 1, 0, w);
	drawY = mapLinear(y, -1, 1, 0, h);
	
	if(x * x + y * y > 4)
		oneMore = true;
	
	const nextX = x * x - y * y + mousePoint.x;
	const nextY = 2 * x * y + mousePoint.y;
	lastPoint = {x: nextX, y: nextY};
	
	const drawNextX = mapLinear(nextX, -2.5, 1, 0, w);
	const drawNextY = mapLinear(nextY, -1, 1, 0, h);
	
	//const magFrom = magnitude(x, y) * 255;
	//const magTo = magnitude(nextX, nextY);
	//console.log(magFrom);
	const colorFrom = `hsl(${(i/maxIteration) * 360 },70%,50%)`;
	
	if(drawType === 'dot' || drawType === 'linedot'){
		ctx.fillStyle = colorFrom;
		ctx.beginPath();
		ctx.arc(drawX, drawY, lineWidth * 1.5, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	}
	if(drawType === 'line' || drawType === 'linedot'){
		ctx.strokeStyle = colorFrom;
		ctx.beginPath();
		ctx.moveTo(drawX, drawY);
		ctx.lineTo(drawNextX, drawNextY);
		ctx.stroke();
	}
	
	setTimeout(() => {
		drawIteration(i + 1, oneMore);
	}, frameDelay);
}

function hidePattern(){
	document.getElementById('setCanv').style.display = 'none';
	document.getElementById('hideBtn').style.display = 'none';
	document.getElementById('drawBtn').style.display = 'block';
}

function drawPattern(){
	const patternC = document.getElementById('setCanv');
	const drawBtn = document.getElementById('drawBtn');
	drawBtn.style.display = 'none';
	document.getElementById('hideBtn').style.display = 'block';
	if(drawn){
		patternC.style.display = 'block';
		return;
	}
	
	drawBtn.innerText = 'Show';
	drawn = true;
	patternC.setAttribute('width', w);
	patternC.setAttribute('height', h);
	const patternCtx = patternC.getContext('2d');
	patternCtx.fillStyle = 'white';
	patternCtx.strokeStyle = 'none';
	patternCtx.fillRect(0, 0, w, w);
	
	
	const lnMax = Math.log(maxIteration);
	for(let px = 0; px < w; px++){
		for(let py = 0; py < h / 2 + 1; py++){
			const x0 = mapLinear(px, 0, w, -2.5, 1);
			const y0 = mapLinear(py, 0, h, -1, 1);
			
			let x = x0;
			let y = y0;
			
			let iteration = inCardioid(x,y) ? maxIteration : 0;
			while (x * x + y * y < 4 && iteration < maxIteration) {
				const xtemp = x * x - y * y + x0;
				y = 2 * x * y + y0;
				x = xtemp;
				iteration++;
			}
			
			const bright = Math.log(iteration + 1) / lnMax * 255;
			const bright2 = iteration / maxIteration * 255;
			color = 'rgb(' + bright2 + ',' + bright + ',' + bright + ')';

			patternCtx.fillStyle = color;
			patternCtx.fillRect(px, py, 1, 1, color);
			
			patternCtx.fillRect(px, h - py, 1, 1, color);
		}
	}
	
}

function inCardioid(x,y){
	const temp = x - 0.25;
	const q = temp * temp + y * y;
	const a = q * (q + temp);
	const b = 0.25 * (y * y);
	return a < b || ((x + 1) * (x + 1)) + (y * y) <= 0.0625;
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('hideBtn').addEventListener('click', hidePattern);
	setUp();
});