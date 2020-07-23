let animationID = null;
let w = 0;

let c = null;

let circle = null;
let box = null;

let drawTimeout = null;

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
	
	circle = {
		center: {
			x: w * 0.45,
			y: w * 0.5
		},
		radius: w * 0.1
	};
	box = {
		topLeft: {
			x: w * 0.55,
			y: w * 0.5
		},
		width: w * 0.2,
		height: w * 0.2
	};
	
	c.addEventListener('mousemove', updatePatternPositions);
	c.addEventListener('touchmove', updatePatternPositions);
	
	if(document.getElementById('InstantInput').checked){
		drawPattern();
		//drawTimeout = setTimeout(() => drawPattern(1), 400);
	}
	else
		drawFast();
}

function updatePatternPositions(e){
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		const ctx = c.getContext('2d');
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		
		const leftDown = leftMouseButtonOnlyDown = e.buttons === undefined 
			? e.which === 1 
			: e.buttons === 1;
		
		if(leftDown){
			if(distToCircle(mousePos, circle, w, true) < 0.001){
				circle.center = mousePos;
			}
			else if (distToRect(mousePos, box, w, true) < 0.001){
				const newBoxTopLeft = {
					x: mousePos.x - box.width/2,
					y: mousePos.y - box.height/2
				}
				box.topLeft = newBoxTopLeft;
			}
			
			if(document.getElementById('InstantInput').checked){
				drawPattern();
				clearTimeout(drawTimeout);
				//drawTimeout = setTimeout(() => drawPattern(1), 400);
			}
			else{
				drawFast();
				clearTimeout(drawTimeout);
				drawTimeout = setTimeout(() => drawPattern(), 200);
			}
		}
	}
}

function drawFast(){
	const ctx = c.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,w,w);
	
	ctx.strokeStyle = 'red';
	ctx.strokeRect(box.topLeft.x, box.topLeft.y, box.width, box.height);
	
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
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

	const fill = document.getElementById('FillInput').checked;
	const smoothing = parseFloat(document.getElementById('SmoothingInput').value);

	for(let px = 0; px < w; px += pixelSize){
		for(let py = 0; py < w; py += pixelSize){
			const pixel = {x: px, y: py};
			const rectDist = distToRect(pixel, box, w, fill) / w;
			const circleDist = distToCircle(pixel, circle, w, fill) / w;
			const minDist = bias(smoothMin(rectDist, circleDist, smoothing), -0.99);
			
			const scaledDist = minDist * 100;

			const color = 'hsl(' + (minDist * 270 + 120) + ', 70%, ' + scaledDist + '%)';
			ctx.fillStyle = color;
			ctx.fillRect(px, py, pixelSize, pixelSize, color);
		}
	}
}

function rectContains(point, rect){
	return (
		point.x > rect.topLeft.x
		&& point.x < rect.topLeft.x + rect.width
		&& point.y > rect.topLeft.y
		&& point.y < rect.topLeft.y + rect.height
	);
}

function distToRect(point, rect, clampVal, fill){
	if(rectContains(point,rect)){
		if(fill)
			return 0;
		else{
			const yDist = Math.abs(Math.abs(point.y - rect.topLeft.y - (rect.height/2)) - (rect.height/2));
			const xDist = Math.abs(Math.abs(point.x - rect.topLeft.x - (rect.width/2)) - (rect.width/2));
			return Math.min(yDist, xDist);
		}
	}

	const cx = Math.max(Math.min(point.x, rect.topLeft.x + rect.width), rect.topLeft.x);
	const cy = Math.max(Math.min(point.y, rect.topLeft.y + rect.height), rect.topLeft.y);
	return Math.min(distToPoint(point, {x: cx, y: cy}), clampVal);
}

function fibPoint(i, center, w){
	const angle = i * goldenAngleRad;
	const offset = i * w * 0.0035;
	
	const x = Math.cos(angle) * offset + center.x;
	const y = Math.sin(angle) * offset + center.y;
	
	const p = {x:x, y:y};
	return p;
}

function minPoints(p1, p2, p3){
	return Math.min(distToPoint(p1, p2), distToPoint(p1, p3));
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

function distToLine(point, line, preventExtrapolation, clampVal){
	if(line.from.x > line.to.x){
		const temp = line.from;
		line.from = line.to;
		line.to = temp;
	}
	
	let iX = 0;
	let iY = 0;
	
	if(Math.abs(line.from.y - line.to.y) < 0.01){//flat
		iX = point.x;
		iY = line.from.y;
	}
	else if(Math.abs(line.from.x - line.to.x) < 0.01){//vertical
		iX = line.from.x;
		iY = point.y
	}
	else{
		const lM = (line.to.y - line.from.y) / (line.to.x - line.from.x);
		const pM = (line.from.x - line.to.x) / (line.to.y - line.from.y);
		const lC = line.from.y - lM * line.from.x;
		const pC = point.y - pM * point.x;
		
		iX = -(lC - pC) / (lM - pM);
		iY = -(lM * -iX) + lC;
	}

	if(preventExtrapolation && (
		(line.from.x < line.to.x && iX < line.from.x)
		|| (line.to.x < line.from.x && iX < line.to.x)
		|| (line.from.x > line.to.x && iX > line.from.x)
		|| (line.to.x > line.from.x && iX > line.to.x)
		|| (line.from.y < line.to.y && iY < line.from.y)
		|| (line.to.y < line.from.y && iY < line.to.y)
		|| (line.from.y > line.to.y && iY > line.from.y)
		|| (line.to.y > line.from.y && iY > line.to.y)
		))
	{
		return Math.min(clampVal, minPoints(point, line.from, line.to));
	}
	else
	{
		const deltaX = Math.abs(point.x - iX);
		const deltaY = Math.abs(point.y - iY);
		const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		
		return Math.min(clampVal, dist);
	}
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

const seedAngle = Math.PI / 3;
function subdividedHexagonAboutPoint(center, radius, subdivisions, rotation){
	const pointCenters = [];
	let prevPoint = null;
	for(let i = 7; i > 0; i--){
		const x = Math.sin(seedAngle * i + rotation) * radius + center.x;
		const y = Math.cos(seedAngle * i + rotation) * radius + center.y;
		
		const point = {x: x, y: y};
		if(prevPoint){
			if(subdivisions > 0){
				const xDist = (x - prevPoint.x) / subdivisions;
				const yDist = (y - prevPoint.y) / subdivisions;
				
				for(let sub = subdivisions-1; sub > 0; sub--){
					subPoint = {x: x - xDist * sub, y: y - yDist * sub};
					pointCenters.push(subPoint);
				}
			}
			pointCenters.push(point);
		}
		prevPoint = point;
	}
	return pointCenters;
}

window.addEventListener('DOMContentLoaded', () => {
	setUpSliderReadout('SmoothingInput', 'SmoothingReadout');
	setUpSliderReadout('PixelSizeInput', 'PixelSizeReadout');
	document.getElementById('PixelSizeInput').addEventListener('change', drawPattern);
	document.getElementById('SmoothingInput').addEventListener('change', drawPattern);
	document.getElementById('FillInput').addEventListener('change', drawPattern);
	setUpBlankCanvas();
});