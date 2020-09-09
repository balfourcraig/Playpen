function pointOnCircle(center, radius, totalPoints, pointNum, rotation){//Re-defined to include rotation. Should probably just use the same one really, but I'm lazy
	const angle = (pointNum / totalPoints * Math.PI * 2) + rotation;
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

let animationID = null;

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	ctx.lineWidth = 15;
	ctx.lineCap = "round";
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.3;
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const gradient = document.getElementById('gradInput').checked;
	const randRot = document.getElementById('rotInput').checked;
	
	const colors = [];
	for(let i = 0; i < 6; i++){
		//colors.push(randomColor());
		colors.push('hsl(' + ((i/5) * 360) + ', 80%, 50%)');
	}
	
	const pathPoints = [];
	const rotation = randRot ? Math.random() * Math.PI * 2 : 0;
	for(let i = 0; i < 5; i++){
		pathPoints.push(pointOnCircle(center, radius, 5, i, rotation));
	}

	const drawings = [];
	const randAngle = Math.random() * 360;
	for(let i = 0; i < 5; i++){
		const p = pathPoints[i];
		if(gradient){
			const colorStart = 'hsl(' + ((((i/5) * 360) + randAngle) % 360) + ', 80%, 50%)';
			const colorEnd = 'hsl(' + (((((i)/5) * 360) + 144 + randAngle) % 360) + ', 80%, 50%)';
			drawings.push(() => drawLineGradient(ctx, p, midpoint(p, pathPoints[(i + 2) % 5]), p, pathPoints[(i + 2) % 5], useColor ? colorStart : 'black', useColor ? colorEnd : 'black'));
		}
		else{
			drawings.push(() => drawLineFlat(ctx, p, midpoint(p, pathPoints[(i + 2) % 5]), useColor ? colors[i] : 'black'));
		}
	}
	
	drawings.push(() => drawCircle(ctx, center, radius * 0.9, useColor ? ('hsl(' + (Math.random() * 360 ) + ', 60%, 50%') : 'black'));
	
	for(let i = 0; i < 5; i++){
		const p = pathPoints[(i + 2) % 5];
		if(gradient){
			const colorEnd = 'hsl(' + ((((i/5) * 360) + randAngle) % 360) + ', 80%, 50%)';
			const colorStart = 'hsl(' + (((((i)/5) * 360) + 144 + randAngle) % 360) + ', 80%, 50%)';
			drawings.push(() => drawLineGradient(ctx, p, midpoint(p, pathPoints[i]), p, pathPoints[i], useColor ? colorStart : 'black', useColor ? colorEnd : 'black'));
		}
		else{
			drawings.push(() => drawLineFlat(ctx, p, midpoint(p, pathPoints[i]), useColor ? colors[i] : 'black'));
		}
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
		},50)
	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function drawLineGradient(ctx, start, end, gradStart, gradEnd, colorStart, colorEnd){
	const grad = ctx.createLinearGradient(gradStart.x, gradStart.y, gradEnd.x, gradEnd.y);
	grad.addColorStop(0, colorStart);
	grad.addColorStop(1, colorEnd);
	ctx.strokeStyle = grad;

	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawLineFlat(ctx, start, end, color){
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
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});