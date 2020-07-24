function smin(a, b, k){
    const h = Math.max( k-Math.abs(a-b), 0.0 )/k;
    return Math.min(1, Math.max(0, Math.min( a, b ) - h*h*k*(1.0/4.0)));
}

let w = 0;
let c = null;

let shapes = [];

let drawTimeout = null;
let lastMousePoint = null;
let holding = null;
let anchorPoint = null;

function getDrawingMode(){
	return document.querySelector('input[name="drawMode"]:checked').value
}

function getDisplayMode(){
	return document.querySelector('input[name="displayMode"]:checked').value
}

function spawnCircleAbove(){
	const rad = Math.random() * w * 0.08 + (w * 0.02);
	shapes.push({
		color: randomColor(),
		center: {
			x: Math.random() * w,
			y: -2 * rad
		},
		radius: rad,
		yAcceleration: Math.random() * 0.02 + 0.02,
		xAcceleration: 0,
		ySpeed: Math.random() * 2,
		xSpeed: 0
	});
}

function spawnCircleBelow(){
	const rad = Math.random() * w * 0.08 + (w * 0.02);
	shapes.push({
		color: randomColor(),
		center: {
			x: Math.random() * w,
			y: w + 2 * rad
		},
		radius: rad,
		yAcceleration: -(Math.random() * 0.02 + 0.02),
		xAcceleration: 0,
		ySpeed: -(Math.random() * 2),
		xSpeed: 0
	});
}

function updatePositions(){
	for(let i = 0; i < shapes.length; i++){
		shapes[i].center.y += shapes[i].ySpeed;
		shapes[i].center.x += shapes[i].xSpeed;
		shapes[i].xSpeed += shapes[i].xAcceleration;
		shapes[i].ySpeed += shapes[i].yAcceleration;
		
		if(shapes[i].center.y - shapes[i].radius * 2 > w){
			shapes[i].ySpeed = -1;
			shapes[i].yAcceleration *= -1;
		}
		else if (shapes[i].center.y + shapes[i].radius * 2 < 0){
			shapes[i].ySpeed = 1;
			shapes[i].yAcceleration *= -1;
		}
	}
}

function setUpBlankCanvas(){
	c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, w);
	
	for(let i = 0; i < 12; i++){//random number of blobs
		if(Math.random() < 0.5)
			spawnCircleAbove();
		else
			spawnCircleBelow();
	}
	
	setInterval(() => {
		updatePositions();
		draw();
	}, 50);
	
	//draw();
}

function draw(pixelSizeOverride){
	displayMode = getDisplayMode();
	
	if(displayMode === 'basic'){
		drawFast();
	}
	else{
		drawPattern(pixelSizeOverride);
	}
}

function drawFast(){
	const ctx = c.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,w,w);
	
	for(let i = 0; i < shapes.length; i++){
		ctx.strokeStyle = shapes[i].color;
		ctx.beginPath();
		ctx.arc(shapes[i].center.x, shapes[i].center.y, shapes[i].radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
	}
}

function drawPattern(pixelSizeOverride){
	clearTimeout(drawTimeout);
	const ctx = c.getContext('2d');
	
	ctx.lineWidth = 1;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.35;

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	ctx.globalAlpha = 1;
	
	let pixelSize = pixelSizeOverride;
	if(pixelSize === undefined || isNaN(pixelSize))
		pixelSize = parseInt(document.getElementById('PixelSizeInput').value);

	const fill = true;
	const smoothing = parseFloat(document.getElementById('SmoothingInput').value);
	const traceMouse = false;
	const multiplier = parseFloat(document.getElementById('MultiplierInput').value);
	
	for(let px = 0; px < w; px += pixelSize){
		for(let py = 0; py < w; py += pixelSize){
			const pixel = {x: px, y: py};
			
			let minDist = 1;
			for(let i = 0; i < shapes.length; i++){
				minDist = smin(minDist, distToCircle(pixel, shapes[i], w, fill) / w, smoothing);
			}
			minDist = smin(minDist, Math.abs(pixel.y - w) / w, smoothing);
			minDist = smin(minDist, Math.abs(pixel.y) / w, smoothing);

			minDist = bias(minDist, -0.99) * multiplier;
			
			const scaledDist = 40 + (0.6 * (70 - (minDist * 90 + 10)));
			const color = 'hsl(' + (minDist * 30 - 10) + ', 70%, ' + scaledDist + '%)';
			ctx.fillStyle = color;
			ctx.fillRect(px, py, pixelSize, pixelSize, color);
		}
	}
}

function distToPoint(p1, p2){
	const dX = p1.x - p2.x;
	const dY = p1.y - p2.y;
	return Math.sqrt((dX * dX) + (dY * dY));
}

function distToCircle(p, circle, clampVal, fill){
	const distToCenter = distToPoint(p, circle.center);
	if(distToCenter < circle.radius){
		if(fill)
			return 0;
		else
			return Math.min(clampVal, circle.radius - distToCenter);
	}
	else
		return Math.min(clampVal, distToCenter - circle.radius);
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUpSliderReadout('SmoothingInput', 'SmoothingReadout');
	setUpSliderReadout('PixelSizeInput', 'PixelSizeReadout');
	setUpSliderReadout('MultiplierInput', 'MultiplierReadout');
	document.getElementById('PixelSizeInput').addEventListener('change', draw);
	document.getElementById('SmoothingInput').addEventListener('change', draw);
	document.getElementById('MultiplierInput').addEventListener('change', draw);

	displayModes = document.querySelectorAll('input[name="displayMode"');
	for(let i = 0; i < displayModes.length; i++){
		displayModes[i].addEventListener('click', draw);
	}
	
	setUpBlankCanvas();
});