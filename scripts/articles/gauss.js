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
	const center = {x: w/2.0, y: w/2.0};
	
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();

	ctx.globalCompositeOperation = 'screen';
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const useGradient = document.getElementById('gradInput').checked;
	let gradMultiplier = parseFloat(document.getElementById('gradInnerSize').value);
	
	gradMultiplier = Math.min(0.99, Math.max(0, gradMultiplier));
	
	const drawings = [];
	
	for(let i = 0; i < 900; i++){
		const radius = Math.random() * 0.01 + 0.01;
		drawings.push(() => drawCircle(ctx, gaussianPoint(center.x, center.x/3), w*radius, useColor ? randomColor() : 'grey', useGradient, gradMultiplier));
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
		animationID = window.requestAnimationFrame(() => {
			animateLine(allActions, index + 1);
		});
	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function gaussianPoint(mean, stdDev){
	const sq = Math.sqrt(-2 * Math.log(1 - Math.random()));
	const u2 = (1 - Math.random()) * 2 * Math.PI;
	const randStdNormalX = sq * Math.sin(u2);
	const randStdNormalY = sq * Math.cos(u2);
	const x = mean + stdDev * randStdNormalX;
	const y = mean + stdDev * randStdNormalY;
	return {x:x, y:y};
}

function drawCircle(ctx, center, radius, color, useGradient, gradMultiplier){
	if(useGradient){
		radius *= 1.5;
		const grad = ctx.createRadialGradient(center.x, center.y, radius * gradMultiplier, center.x, center.y, radius);
		grad.addColorStop(0, color);
		grad.addColorStop(1, 'transparent');
		ctx.fillStyle = grad;
	}
	else{
		ctx.fillStyle = color;
	}
	
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});