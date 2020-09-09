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

function drawLine(ctx, center, radius, multiplier, points, i, iterations, useColor, color, useGradient){
	if(iterations > 0){
		const pointFrom = pointOnCircle(center, radius, points, i % points);
		const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
		
		if(useColor){
			const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
			if(useGradient){
				const iFrom = ((i % points)/points) * 360;
				const iTo = (((i * multiplier) % points)/points) * 360;
				grad.addColorStop(0, 'transparent');
				grad.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
				grad.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
				grad.addColorStop(1, 'transparent');
			}
			else{
				grad.addColorStop(0, 'transparent');
				grad.addColorStop(0.5, color);
				grad.addColorStop(1, 'transparent');
			}
			ctx.strokeStyle = grad;
		}

		ctx.beginPath();
		ctx.moveTo(pointFrom.x, pointFrom.y);
		ctx.lineTo(pointTo.x, pointTo.y);
		ctx.stroke();
		
		animationID = window.requestAnimationFrame(() =>{
			drawLine(ctx, center, radius,multiplier, points, i+1, iterations -1, useColor, color, useGradient);
		});
	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function updatePermalink(){
	const mult = document.getElementById('multInput').value;
	const mod = document.getElementById('numNails').value;
	const winding = document.getElementById('windingInput').value;
	const width = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const animate = document.getElementById('animateInput').checked;
	const colorMode = document.getElementById('colorModeSelect').value;
	const colorIndex = document.getElementById('colorModeSelect').selectedIndex;
	
	const params = `?mult=${mult}&mod=${mod}&winding=${winding}&width=${width}&animate=${animate}&colorModeIndex=${colorIndex}&colorMode=${colorMode}`
	document.getElementById('imageLink').href = 'ModMulFullscreen.html' + params;
	//document.getElementById('shareLink').href = 'ModMul.html' + params;
	return location.protocol + '//' + location.host + location.pathname + params;
}

function drawModMul(){
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
	const radius = w * 0.45;

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	ctx.globalAlpha = 0.6;
	
	ctx.globalCompositeOperation = 'multiply';
	
	let multiplier = parseFloat(document.getElementById('multInput').value);
	const points = parseInt(document.getElementById('numNails').value);
	
	let iterations = points;
	let winding = parseInt(document.getElementById('windingInput').value);
	if(winding && winding > 1){
		iterations *= winding;
		multiplier += (1 / winding);
	}
	
	const color = randomColor();
	
	const animate = document.getElementById('animateInput').checked;
	
	const colorMode = document.getElementById('colorModeSelect').value;
	const useColor = colorMode === 'mono' || colorMode === 'wheel';
	const useGradient = colorMode === 'wheel';

	if(animate){
		drawLine(ctx, center, radius, multiplier, points, 0, iterations, useColor, color, useGradient);
	}
	else{
		for(let i = 1; i < iterations; i++){
			const pointFrom = pointOnCircle(center, radius, points, i % points);
			const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
			if(useColor){
				const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
				if(useGradient){
					const iFrom = ((i % points)/points) * 360;
					const iTo = (((i * multiplier) % points)/points) * 360;
					grad.addColorStop(0, 'transparent');
					grad.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
					grad.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
					grad.addColorStop(1, 'transparent');
				}
				else{
					grad.addColorStop(0, 'transparent');
					grad.addColorStop(0.5, color);
					grad.addColorStop(1, 'transparent');
				}
				ctx.strokeStyle = grad;
			}
			
			ctx.beginPath();
			ctx.moveTo(pointFrom.x, pointFrom.y);
			ctx.lineTo(pointTo.x, pointTo.y);
			ctx.stroke();
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function randomiseValues(){
	document.getElementById('multInput').value = Math.floor(Math.random() * 100 + 2);
	document.getElementById('numNails').value = Math.floor(Math.random() * 800 + 200);
	document.getElementById('windingInput').value = Math.floor(Math.random() * 4 + 1);
}

function applyURLParams(){
	const urlVars = getUrlVars();
	if(urlVars['mult'])
		document.getElementById('multInput').value = urlVars['mult'];
	if(urlVars['mod'])
		document.getElementById('numNails').value = urlVars['mod'];
	if(urlVars['winding'])
		document.getElementById('windingInput').value = urlVars['winding'];
	if(urlVars['animate'])
		document.getElementById('animateInput').checked = urlVars['animate'] === 'true';
	if(urlVars['colorModeIndex'])
		document.getElementById('colorModeSelect').selectedIndex = urlVars['colorModeIndex'];
}

function copyPermalink(){
	const area = document.createElement('textarea');
	//area.value = document.getElementById('shareLink').href;
	area.value = updatePermalink();
	document.body.appendChild(area);
	area.select();
	document.execCommand('copy');
	document.body.removeChild(area);
	alert('link copied');
}

window.addEventListener('DOMContentLoaded', () => {
	applyURLParams();
	updatePermalink();
	document.getElementById('drawBtn').addEventListener('click', drawModMul);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('luckBtn').addEventListener('click', () => {
		randomiseValues();
		updatePermalink();
		drawModMul();
	});
	document.getElementById('multInput').addEventListener('change',updatePermalink);
	document.getElementById('numNails').addEventListener('change',updatePermalink);
	document.getElementById('windingInput').addEventListener('change',updatePermalink);
	document.getElementById('animateInput').addEventListener('change',updatePermalink);
	document.getElementById('colorModeSelect').addEventListener('change',updatePermalink);
	document.getElementById('copyBtn').addEventListener('click', copyPermalink);
	
	setUpBlankCanvas();
});