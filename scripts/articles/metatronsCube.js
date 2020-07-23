let animationID = null;

function drawMetatron(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	ctx.lineWidth = 2;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.095;
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	ctx.globalAlpha = 0.6;
	const level1 = [];
	const level2 = [];
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	
	const colors = [];
	for(let i = 0; i < 5; i++){
		colors.push(randomColor());
	}
	
	for(let i = 0; i < 6; i++){
		level1.push(pointOnCircle(center, radius * 2, 6, i));
		level2.push(pointOnCircle(center, radius * 4, 6, i));
	}
	
	const drawings = [];
	
	drawings.push(() => drawCircle(ctx, center, radius,  useColor ? colors[4] : 'black'));
	
	for(let i = 0; i < 6; i+=2){
		drawings.push(() => drawLine(ctx, level2[i], level2[(i + 3) % 6], useColor ? colors[0] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawCircle(ctx, level1[i], radius,  useColor ? colors[4] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawLine(ctx, level1[i], level1[(i + 1) % 6], useColor ? colors[3] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawLine(ctx, level1[i], level1[(i + 2) % 6], useColor ? colors[1] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawCircle(ctx, level2[i], radius,  useColor ? colors[4] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawLine(ctx, level2[i], level1[(i + 4) % 6], useColor ? colors[2] : 'black'));
		drawings.push(() => drawLine(ctx, level2[i], level1[(i + 2) % 6], useColor ? colors[2] : 'black'));
	}
	
	for(let i = 0; i < 6; i++){
		drawings.push(() => drawLine(ctx, level2[i], level2[(i + 1) % 6], useColor ? colors[3] : 'black'));				
	}

	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}

	
}

function animateLine(allActions, index){
	if(index < allActions.length){
		allActions[index]();
		setTimeout(() => {
			animationID = window.requestAnimationFrame(() => {
				animateLine(allActions, index + 1);
			});
		},60)
	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function drawLine(ctx, start, end, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawCircle(ctx, center, radius, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawMetatron);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});