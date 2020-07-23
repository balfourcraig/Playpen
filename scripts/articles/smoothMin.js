function smin(a, b, k){
    const h = Math.max( k-Math.abs(a-b), 0.0 )/k;
    return Math.min( a, b ) - h*h*k*(1.0/4.0);
}

let w = 0;
let c = null;

let shapes = [];
let borders = [];

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
	
	const circle = {
		shapeType: 'circle',
		dragable: true,
		center: {
			x: w * 0.45,
			y: w * 0.5
		},
		radius: w * 0.1
	};
	const box = {
		shapeType: 'rect',
		dragable: true,
		topLeft: {
			x: w * 0.55,
			y: w * 0.5
		},
		width: w * 0.2,
		height: w * 0.2
	};
	shapes.push(circle);
	shapes.push(box);
	
	borders.push({
		shapeType: 'horizontalLine',
		dragable: false,
		y: 0
	});
	borders.push({
		shapeType: 'horizontalLine',
		dragable: false,
		y: w
	});
	borders.push({
		shapeType: 'verticalLine',
		dragable: false,
		x: 0
	});
	borders.push({
		shapeType: 'verticalLine',
		dragable: false,
		x: w
	});
	
	c.addEventListener('mousedown', mouseDown);
	c.addEventListener('mouseup', mouseUp);
	
	c.addEventListener('mousemove', updatePatternPositions);
	c.addEventListener('touchmove', updatePatternPositions);
	
	draw();
}

function mouseUp(e){
	holding = null;
	const mode = getDrawingMode();
	if(mode === 'addCircle' && anchorPoint){
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		const rad = distToPoint(anchorPoint, mousePos);
		const circle = {
			shapeType: 'circle',
			dragable: true,
			center: anchorPoint,
			radius: rad
		};
		shapes.push(circle);
	}
	else if (mode === 'addRect' && anchorPoint){
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		let xDiff = mousePos.x - anchorPoint.x;
		let yDiff = mousePos.y - anchorPoint.y;
		if(xDiff < 0){
			xDiff *= -1;
			anchorPoint.x -= xDiff;
		}
		if(yDiff < 0){
			yDiff *= -1;
			anchorPoint.y -= yDiff;
		}
		const rect = {
			shapeType: 'rect',
			dragable: true,
			topLeft: anchorPoint,
			width: xDiff,
			height: yDiff
		};
		shapes.push(rect)
	}
	else if(mode === 'addLine' && anchorPoint){
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		const line = {
			shapeType: 'line',
			dragable: true,
			from: anchorPoint,
			to: mousePos,
		};
		shapes.push(line);
	}
	anchorPoint = null;
	draw();
}

function mouseDown(e) {
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		
		const mode = getDrawingMode();
		for(let i = 0; i < shapes.length; i++){
			if(shapes[i].dragable && (
				(shapes[i].shapeType === 'rect' && distToRect(mousePos, shapes[i], w, true) === 0)
				|| (shapes[i].shapeType === 'circle' && distToCircle(mousePos, shapes[i], w, true) === 0)
				|| (shapes[i].shapeType === 'line' && distToLine(mousePos, shapes[i], true, w) < 5)
			)){
				if(mode === 'drag'){
					holding = shapes[i];
					return false;
				}
				else if (mode === 'delete'){
					const index = shapes.indexOf(shapes[i]);
					shapes.splice(index, 1);
					return false;
				}
			}
		}
		if (mode === 'addCircle' || mode === 'addRect' || mode === 'addLine'){
			anchorPoint = mousePos;
		}
	}
}

function updatePatternPositions(e){
	const mode = getDrawingMode();
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		
		lastMousePoint = mousePos;

		const traceMouse = document.getElementById('traceMouseInput').checked;
		const drawInstant = document.getElementById('InstantInput').checked;
		
		if(holding){
			if(holding.shapeType === 'circle'){
				holding.center = mousePos;
			}
			else if (holding.shapeType === 'rect'){
				const newBoxTopLeft = {
					x: mousePos.x - holding.width / 2,
					y: mousePos.y - holding.height / 2
				}
				holding.topLeft = newBoxTopLeft;
			}
			else if (holding.shapeType === 'line'){
				const lineWidth = holding.to.x - holding.from.x;
				const lineHeight = holding.to.y - holding.from.y;
				const newFrom = {
					x: mousePos.x - lineWidth/2,
					y: mousePos.y - lineHeight/2,
				};
				const newTo = {
					x: mousePos.x + lineWidth/2,
					y: mousePos.y + lineHeight/2,
				};
				holding.from = newFrom;
				holding.to = newTo;
			}
		}
		if(drawInstant && mode !== 'addCircle' && mode !== 'addRect' && mode !== 'addLine'){
			draw();
			return false;
		}
		else if(mode === 'addCircle'){
			draw();
			if(anchorPoint){
				const ctx = c.getContext('2d');
				ctx.strokeStyle = 'black';
				const rad = distToPoint(anchorPoint, mousePos)
				ctx.beginPath();
				ctx.arc(anchorPoint.x, anchorPoint.y, rad, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
			}
			return false;
		}
		else if (mode === 'addRect'){
			draw();
			if(anchorPoint){
				const ctx = c.getContext('2d');
				ctx.strokeStyle = 'black';
				const xDiff = mousePos.x - anchorPoint.x;
				const yDiff = mousePos.y - anchorPoint.y;
				ctx.strokeRect(anchorPoint.x, anchorPoint.y, xDiff, yDiff);
			}
		}
		else if (mode === 'addLine'){
			draw();
			if(anchorPoint){
				const ctx = c.getContext('2d');
				ctx.strokeStyle = 'black';
				ctx.beginPath();
				ctx.moveTo(anchorPoint.x, anchorPoint.y);
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
			}
		}
		else if(holding){
			drawFast();
			clearTimeout(drawTimeout);
			drawTimeout = setTimeout(() => draw(), 200);
			return false;
		}
	}
}

const fastColors = [
	'blue',
	'red',
	'green',
	'yellow',
	'purple'
];

function draw(pixelSizeOverride){
	displayMode = getDisplayMode();
	drawMode = getDrawingMode();
	
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
		ctx.strokeStyle = fastColors[i % fastColors.length];
		
		if(shapes[i].shapeType === 'rect'){
			ctx.strokeRect(shapes[i].topLeft.x, shapes[i].topLeft.y, shapes[i].width, shapes[i].height);
		}
		else if (shapes[i].shapeType === 'circle'){
			ctx.beginPath();
			ctx.arc(shapes[i].center.x, shapes[i].center.y, shapes[i].radius, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.stroke();
		}
		else if (shapes[i].shapeType === 'line'){
			ctx.beginPath();
			ctx.moveTo(shapes[i].from.x, shapes[i].from.y);
			ctx.lineTo(shapes[i].to.x, shapes[i].to.y);
			ctx.stroke();
		}
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

	const fill = document.getElementById('FillInput').checked;
	const smoothing = parseFloat(document.getElementById('SmoothingInput').value);
	const useBorders = document.getElementById('pageBordersInput').checked;
	const traceMouse = document.getElementById('traceMouseInput').checked;
	const multiplier = parseFloat(document.getElementById('MultiplierInput').value);
	
	for(let px = 0; px < w; px += pixelSize){
		for(let py = 0; py < w; py += pixelSize){
			const pixel = {x: px, y: py};
			
			let minDist = 1;
			for(let i = 0; i < shapes.length; i++){
				if(shapes[i].shapeType === 'rect'){
					minDist = smin(minDist, distToRect(pixel, shapes[i], w, fill) / w, smoothing);
				}
				else if (shapes[i].shapeType === 'circle'){
					minDist = smin(minDist, distToCircle(pixel, shapes[i], w, fill) / w, smoothing);
				}
				else if (shapes[i].shapeType === 'horizontalLine'){
					minDist = smin(minDist, distToHorizontalLine(pixel, shapes[i], w) / w, smoothing);
				}
				else if (shapes[i].shapeType === 'verticalLine'){
					minDist = smin(minDist, distToVerticalLine(pixel, shapes[i], w) / w, smoothing);
				}
				else if (shapes[i].shapeType === 'line'){
					minDist = smin(minDist, distToLine(pixel, shapes[i], true, w) / w, smoothing);
				}
				else{
					console.error('Unknown shapeType ' + shapes[i].shapeType);
				}
			}
			if(useBorders){
				for(let i = 0; i < borders.length; i++){
					if (borders[i].shapeType === 'horizontalLine'){
						minDist = smin(minDist, distToHorizontalLine(pixel, borders[i], w) / w, smoothing);
					}
					else if (borders[i].shapeType === 'verticalLine'){
						minDist = smin(minDist, distToVerticalLine(pixel, borders[i], w) / w, smoothing);
					}
				}
			}
			if(traceMouse && lastMousePoint){
				minDist = smin(minDist, distToPoint(pixel, lastMousePoint, w) / w, smoothing);
			}
			minDist = bias(minDist, -0.99) * multiplier;
			
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

function distToHorizontalLine(point, line, clampVal){
	return Math.min(clampVal, Math.abs(point.y - line.y));
}

function distToVerticalLine(point, line, clampVal){
	return Math.min(clampVal, Math.abs(point.x - line.x));
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
	setUpSliderReadout('MultiplierInput', 'MultiplierReadout');
	document.getElementById('PixelSizeInput').addEventListener('change', draw);
	document.getElementById('SmoothingInput').addEventListener('change', draw);
	document.getElementById('MultiplierInput').addEventListener('change', draw);
	document.getElementById('FillInput').addEventListener('change', draw);
	document.getElementById('pageBordersInput').addEventListener('change', draw);
	document.getElementById('traceMouseInput').addEventListener('change', () => {
		lastMousePoint = null;
		draw();
	});
	displayModes = document.querySelectorAll('input[name="displayMode"');
	for(let i = 0; i < displayModes.length; i++){
		displayModes[i].addEventListener('click', draw);
	}
	drawModes = document.querySelectorAll('input[name="drawMode"');
	for(let i = 0; i < drawModes.length; i++){
		drawModes[i].addEventListener('click', draw);
	}
	setUpBlankCanvas();
});