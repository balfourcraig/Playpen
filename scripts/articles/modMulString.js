let animationID = null;

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

function drawModMul(){
	let name = document.getElementById('nameInput').value;
	if(!name)
		return;
	
	name = name.toUpperCase();
	
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	ctx.globalAlpha = 0.6;
	ctx.lineWidth = 1;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.45;
	ctx.globalCompositeOperation = 'multiply';
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();

	let multiplier = Math.floor(stringHash(name, 7) * 100 + 2);
	const points = Math.floor(stringHash(name, 17) * 800 + 200);
	
	let iterations = points;
	let winding = Math.floor(stringHash(name, 53) * 4 + 1);
	if(winding && winding > 1){
		iterations *= winding;
		multiplier += (1 / winding);
	}
	
	const color = randomColor();
	
	const animate = document.getElementById('animateInput').checked;
	
	const useColor = true;
	const useGradient = true;

	if(animate){
		drawLine(ctx, center, radius, multiplier, points, 0, iterations, useColor, color, useGradient);
	}
	else{
		for(let i = 1; i < iterations; i++){
			const pointFrom = pointOnCircle(center, radius, points, i % points);
			const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
			if(useColor){
				const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
				
				const iFrom = ((i % points)/points) * 360;
				const iTo = (((i * multiplier) % points)/points) * 360;
				grad.addColorStop(0, 'transparent');
				grad.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
				grad.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
				grad.addColorStop(1, 'transparent');

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

function copyShareLink(){
	const area = document.createElement('textarea');
	const input = document.getElementById('nameInput').value ? '?input=' + document.getElementById('nameInput').value : '';
	area.value = location.protocol + '//' + location.host + location.pathname + input;
	document.body.appendChild(area);
	area.select();
	document.execCommand('copy');
	document.body.removeChild(area);
	alert('link copied');
}

function updateButtonEnabled(){
	if(document.getElementById('nameInput').value){
		document.getElementById('drawBtn').removeAttribute('disabled');
		document.getElementById('copyBtn').removeAttribute('disabled');
	}
	else{
		document.getElementById('drawBtn').setAttribute('disabled','disabled');
		document.getElementById('copyBtn').setAttribute('disabled','disabled');
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawModMul);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('nameInput').addEventListener('input', updateButtonEnabled);
	document.getElementById('nameInput').addEventListener('keyup', (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			drawModMul();
		}
	});
	document.getElementById('copyBtn').addEventListener('click', copyShareLink);
	
	const urls = getUrlVars();
	
	if(urls['input']){
		document.getElementById('nameInput').value = decodeURIComponent(urls['input']);
		drawModMul();
	}
	updateButtonEnabled();
});