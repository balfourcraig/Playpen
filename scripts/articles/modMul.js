let animationID = null;
let initialDraw = false;
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

function drawLineSimple(ctx, from, to, style){
	ctx.strokeStyle = style;
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}

function updatePermalink(){
	const mult = document.getElementById('multInput').value;
	const mod = document.getElementById('numNails').value;
	const winding = document.getElementById('windingInput').value;
	const width = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const animate = document.getElementById('animateInput').checked;
	const colorMode = document.getElementById('colorModeSelect').value;
	const colorIndex = document.getElementById('colorModeSelect').selectedIndex;
	const colorOffset = document.getElementById('colorOffsetInput').value;
	
	const params = `?mult=${mult}&mod=${mod}&winding=${winding}&width=${width}&animate=${animate}&colorModeIndex=${colorIndex}&colorMode=${colorMode}&colorOffset=${colorOffset}`;
	document.getElementById('imageLink').href = 'ModMulFullscreen.html' + params;
	//document.getElementById('shareLink').href = 'ModMul.html' + params;
	return location.protocol + '//' + location.host + location.pathname + params;
}

function drawModMul(){
	const drawings = [];
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	const lineWidth = parseFloat(document.getElementById('lineWidthInput').value);
	const lineOpacity = parseFloat(document.getElementById('opacityInput').value);
	
	ctx.lineWidth = lineWidth;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.45;

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	ctx.globalAlpha = lineOpacity;
	
	let multiplier = parseFloat(document.getElementById('multInput').value);
	const points = parseInt(document.getElementById('numNails').value);
	
	let iterations = points;
	let winding = parseInt(document.getElementById('windingInput').value);
	if(winding && winding > 1){
		iterations *= winding;
		multiplier += (1 / winding);
	}

	const animate = document.getElementById('animateInput').checked;
	const useGradient = document.getElementById('gradientInput').checked;
	const colorMode = document.getElementById('colorModeSelect').value;
	const colorOffset = parseInt(document.getElementById('colorOffsetInput').value);
	const blendMode = document.getElementById('blendModeSelect').value;
	
	ctx.globalCompositeOperation = blendMode;
	
	console.log(colorOffset);
	let color = null;
	if(colorMode === 'mono'){
		color = 'hsl(' + colorOffset + ', 80%, 50%)'
	}
	else if (colorMode === 'black'){
		color = 'black';
	}
	const maxDist = radius * 2;

	for(let i = 1; i < iterations; i++){
		const pointFrom = pointOnCircle(center, radius, points, i % points);
		const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
		
		let style = color;
		
		if(colorMode === 'distance'){
			const dist = distance(pointFrom, pointTo) / maxDist;
			color = 'hsl(' + (dist * 360 + colorOffset) + ', 80%, 50%)'
		}
		else if (colorMode === 'random'){
			color = randomColor();
		}
		
		if(useGradient || colorMode === 'wheel'){
			style = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
			const iFrom = ((i % points)/points) * 360;
			const iTo = (((i * multiplier) % points)/points) * 360;

			if(colorMode === 'wheel'){
				if(useGradient){
					style.addColorStop(0, 'transparent');
					style.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
					style.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
					style.addColorStop(1, 'transparent');
				}
				else{
					style.addColorStop(0, 'hsl(' + iFrom + ', 80%, 50%)');
					style.addColorStop(1, 'hsl(' + iTo + ', 80%, 50%)');
				}
			}
			else{
				style.addColorStop(0, 'transparent');
				style.addColorStop(0.5, color);
				style.addColorStop(1, 'transparent');
			}
		}
		drawings.push(() => drawLineSimple(ctx, pointFrom, pointTo, style));
	}
	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let a of drawings)
			a();
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function animateLine(allActions, index){
	if(index < allActions.length){
		allActions[index]();
		animationID = window.requestAnimationFrame(() => {
			animateLine(allActions, index + 1);
		});
	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function randomiseValues(){
	document.getElementById('multInput').value = Math.floor(Math.random() * 100 + 2);
	document.getElementById('numNails').value = Math.floor(Math.random() * 800 + 200);
	document.getElementById('windingInput').value = Math.floor(Math.random() * 4 + 1);
	document.getElementById('colorOffsetInput').value = Math.floor(Math.random() * 360 + 1);
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
	if(urlVars['colorOffset'])
		document.getElementById('colorOffsetInput').value = urlVars['colorOffset'];
	if(urlVars['autoDraw'])
		initialDraw = urlVars['autoDraw'] == 'true';
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
	document.getElementById('copyBtn').addEventListener('click', copyPermalink);
	
	setUpSliderReadout('opacityInput', 'opacityReadout');
	setUpSliderReadout('lineWidthInput', 'lineWidthReadout');
	
	setUpBlankCanvas();
	if(initialDraw){
		drawModMul();
	}
});

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}