let animationID = null;
let w = 0;
function setUpBlankCanvas(){
	const c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, w);
}

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
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
	
	const lines = [];
	const circles = [];
	
	const includeBorders = document.getElementById('pageBordersInput').checked;
	if(includeBorders){
		const topLeft = {x: 0, y: 0};
		const topRight = {x: w, y: 0};
		const bottomLeft = {x: 0, y: w};
		const bottomRight = {x: w, y: w};
		lines.push({from: topLeft, to: topRight});
		lines.push({from: topLeft, to: bottomLeft});
		lines.push({from: topRight, to: bottomRight});
		lines.push({from: bottomLeft, to: bottomRight});
	}
	
	const useSeed = true;
	const pattern = document.getElementById('patternInput').value;
	if(pattern === 'seed'){
		const seedRadius = w * 0.1;
		const layers = parseInt(document.getElementById('seedLevelsInput').value);;
		circles.push({center: center, radius: seedRadius});
		for(let i = 1; i <= layers; i++){
			const layerPoints = subdividedHexagonAboutPoint(center, seedRadius * i, i, 0);
			for(let j = 0; j < layerPoints.length; j++){
				const p = layerPoints[j];
				circles.push({center: p, radius: seedRadius});
			}
		}
	}
	else if (pattern === 'nail') {
		const points = parseInt(document.getElementById('pointsInput').value);
		for(let i = 0; i < points; i++){
			const pointFrom = pointOnCircle(center, radius, points, i % points);
			for(let j = i + 1; j < points ; j++){
				const pointTo = pointOnCircle(center, radius, points, j % points);
				lines.push({from: pointFrom, to: pointTo});
			}
		}
		circles.push({center: center, radius: radius});
	}
	else if (pattern === 'metatron'){
		metatronRad = w * 0.095;
		const level1 = [];
		const level2 = [];
		
		for(let i = 0; i < 6; i++){
			level1.push(pointOnCircle(center, metatronRad * 2, 6, i));
			level2.push(pointOnCircle(center, metatronRad * 4, 6, i));
		}
		circles.push({center: center, radius: metatronRad})
		for(let i = 0; i < 6; i++){
			if(i % 2 === 0){
				lines.push({from: level2[i], to:  level2[(i + 3) % 6]});
			}
			circles.push({center: level1[i], radius: metatronRad});
			lines.push({from: level1[i], to: level1[(i + 1) % 6]});
			lines.push({from: level1[i], to: level1[(i + 2) % 6]});
			circles.push({center: level2[i], radius: metatronRad});
			lines.push({from: level2[i], to: level1[(i + 4) % 6]});
			lines.push({from: level2[i], to: level1[(i + 2) % 6]});
			lines.push({from: level2[i], to: level2[(i + 1) % 6]});
		}
	}
	else if (pattern === 'spiral'){
		for(let i = 0; i < 250; i++){
			lines.push({
				from: fibPoint(i, center, w),
				to: fibPoint(i + 1, center, w)
			});
		}
	}
	else{
		circles.push({center: center, radius: radius});
	}

	const pixelSize = parseInt(document.getElementById('pixelSizeInput').value);
	const pixelBorder = parseInt(document.getElementById('pixelBorderInput').value);
	const preventExtrapolation = document.getElementById('preventExtrapolationInput').checked;
	const colorOffset = parseInt(document.getElementById('ColorOffsetInput').value);
	const avg = document.getElementById('avgInput').checked;
	const distMult = parseFloat(document.getElementById('distMultInput').value);
	const clampVal = parseFloat(document.getElementById('clampInput').value) * w;
	
	for(let px = 0; px < w; px += pixelSize + pixelBorder){
		for(let py = 0; py < w; py += pixelSize + pixelBorder){
			let minDist = avg ? 0 : w;
			const pixel = {x: px, y: py};
			for(let i = 0; i < lines.length; i++){
				if(avg)
					minDist += Math.sqrt(distToLine(pixel, lines[i], preventExtrapolation, clampVal));
				else
					minDist = Math.min(minDist, distToLine(pixel, lines[i], preventExtrapolation, clampVal));
			}
			for(let i = 0; i < circles.length; i++){
				if(avg)
					minDist += Math.sqrt(distToCircle(pixel, circles[i], clampVal));
				else
					minDist = Math.min(minDist, distToCircle(pixel, circles[i], clampVal));
			}
			let scaledDist = 0
			if(avg){
				minDist /= (lines.length + circles.length);
				scaledDist = (Math.sqrt(minDist/w + 0.01) * 360) * distMult * 100 + colorOffset;
			}
			else{
				scaledDist = (Math.sqrt(minDist/w + 0.01) * 360) * distMult + colorOffset;
			}

			const color = 'hsl(' + scaledDist + ', 90%, 50%)';
			ctx.fillStyle = color;
			ctx.fillRect(px, py, pixelSize, pixelSize, color);
		}
	}

	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
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

function distToCircle(p, circle, clampVal){
	const distToCenter = distToPoint(p, circle.center);
	if(distToCenter < circle.radius)
		return Math.min(clampVal, circle.radius - distToCenter);
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

function updateTabs(){
	const pattern = document.getElementById('patternInput').value;
	const tabs = document.getElementsByClassName('settingsTab');
	console.log(pattern);
	console.log(tabs);
	for(let i = 0; i < tabs.length; i++){
		console.log(tabs[i].getAttribute('tabName'));
		if(tabs[i].getAttribute('tabName') === pattern)
			tabs[i].style.display = null;
		else
			tabs[i].style.display = 'none';
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	setUpSliderReadout('ColorOffsetInput', 'colourOffsetReadout');
	setUpSliderReadout('pointsInput', 'pointsReadout');
	setUpSliderReadout('clampInput', 'clampReadout');
	setUpSliderReadout('seedLevelsInput', 'seedLevelsReadout');
	document.getElementById('patternInput').addEventListener('change', updateTabs);
	setUpBlankCanvas();
	updateTabs();
});