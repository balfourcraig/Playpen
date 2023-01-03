let animationID = null;

function setUpBlankCanvas(){
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.fillRect(0, 0, w, w);
	
	
}

function drawPattern(){
	console.log('drawing');
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');

	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	//gridSand(5, '#fda');
	const mono = document.getElementById('monoInput').checked;
	noiseSand(mono);
	//scatterSand(10000, 'limegreen');
	const center = {x: w/2, y: h/2};
	const progBar = document.getElementById('drawProg');
	const frames = parseInt(document.getElementById('framesInput').value);
	const scattering = parseFloat(document.getElementById('scatteringMultInput').value);
	const radius = parseFloat(document.getElementById('circleRadiusInput').value);
	const circle = {radius: radius * w, center: center};

	frame(0);
	
	function bounce(){
		const srcData = ctx.getImageData(0, 0, w, h);
		const destData = ctx.createImageData(w, h);
		
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = ((h - row) * w + col) * 4;
				//const dist = distToLine({x: col, y: row}, line, false, w) * scattering;
				const dist = (distToCircle({x: col, y: row}, circle, w/2)) * scattering;

				const shiftedRow = row + ~~((Math.random() * dist) - (dist/2));
				const shiftedCol = col + ~~((Math.random() * dist) - (dist/2));
				
				const srcOffset = (shiftedRow * w + shiftedCol) * 4;
				destData.data[destOffset] = srcData.data[srcOffset];
				destData.data[destOffset + 1] = srcData.data[srcOffset + 1];
				destData.data[destOffset + 2] = srcData.data[srcOffset + 2];
				destData.data[destOffset + 3] = 255;
			}
		}
		ctx.putImageData(destData, 0, 0); 

	}
	
	function frame(count){
		bounce();
		progBar.value = count / frames;
		if(count < frames){
			animationID = window.requestAnimationFrame(() => {
				frame(count + 1);
			});
		}
		else{
			document.getElementById('drawBtn').removeAttribute('style');
			document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		}
	}
	
	function update(color) {
		let nextX, nextY;
		let r = ~~(Math.random() * numCorners);
		currentPoint = {x: Math.random() * w, y: Math.random() * w};
		
		ctx.fillStyle = color;
		ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
	}
	
	function gridSand(gridSize, color){
		ctx.fillStyle = color;
		let rowCount = 0;
		for(let y = 0; y < w - gridSize; y += gridSize, rowCount++){
			for(let x = 0; x < w; x += gridSize){
				ctx.fillRect(x + (rowCount % 2 === 0 ? ~~(gridSize/2) : 0), y, 1, 1);
			}
		}
	}
	
	function noiseSand(mono){
		const destData = ctx.createImageData(w, h);
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = ((h - row) * w + col) * 4;
				if(mono){
					const val = ~~(Math.random() * 255);
					destData.data[destOffset] = val;
					destData.data[destOffset + 1] = val;
					destData.data[destOffset + 2] = val;
				}
				else{
					destData.data[destOffset] = ~~(Math.random() * 255);
					destData.data[destOffset + 1] = ~~(Math.random() * 255);
					destData.data[destOffset + 2] = ~~(Math.random() * 255);
				}
				
				destData.data[destOffset + 3] = 255;
			}
		}
		ctx.putImageData(destData, 0, 0);
	}
	
	function scatterSand(grains, color){
		ctx.fillStyle = color;
		for(let i = 0; i < grains; i++){
			ctx.fillRect(Math.random() * w, Math.random() * w, 1, 1);
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});

	setUpBlankCanvas();
});

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

function drawCircle(ctx, center, radius, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
}


function distToPoint(p1, p2){
	const dX = p1.x - p2.x;
	const dY = p1.y - p2.y;
	return Math.sqrt((dX * dX) + (dY * dY));
}

const distToCircle = (p, circle) => {
	return Math.abs(distToPoint(p, circle.center) - circle.radius);
};

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