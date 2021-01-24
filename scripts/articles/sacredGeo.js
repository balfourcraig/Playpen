let w;
let h;
let ctx;
let c;

function setUpConstants(){
	const sizeCalc = document.getElementById('sizeCalc');
	
	w = sizeCalc.getBoundingClientRect().width;
	h = w;

	sizeCalc.parentElement.removeChild(sizeCalc);
	
	c = document.createElement('canvas');
	ctx = c.getContext('2d');
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
}

function drawPattern(){
	ctx.clearRect(0,0,w,h);
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	const animate = document.getElementById('animateInput').checked;
	const stroke = document.getElementById('strokeRadioStroke').checked;
	const gradStyle = document.querySelector('input[name="gradRadio"]:checked').value;
	
	const rotation = document.getElementById('randomRotInput').checked ? Math.random() * Math.PI * 2 : 0;
	
	const colors = [];
	for(let i = 0; i < 6; i++){
		colors.push(nextGoldenColor(80, 60));
	}

	

	const center = {x: w/2.0, y: h/2.0};
	const radius = Math.min(w,h) * 0.1 * parseFloat(document.getElementById('radiusInput').value);
	
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 3;
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fill();
	
	const drawings = [];
	
	if(!stroke)
		ctx.globalCompositeOperation = 'xor';

	drawings.push(() => {
		if(stroke)
			ctx.strokeStyle = gradStyle === 'none' ? 'black' : colors[1];
		else
			ctx.fillStyle = gradStyle === 'none' ? 'black' : colors[1];

		
		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
		ctx.closePath();
		if(stroke)
			ctx.stroke();
		else
			ctx.fill();
	});
	
	const layers = parseInt(document.getElementById('layersInput').value);
	
	for(let i = 1; i <= layers; i++){
		const layerPoints = subdividedHexagonAboutPoint(center, radius * i, i, rotation);
		for(let j = 0; j < layerPoints.length; j++){
			drawings.push(() => {
				const p = layerPoints[j];
				
				if(gradStyle === 'none'){
					if(stroke)
						ctx.strokeStyle = 'black';
					else
						ctx.fillStyle = 'black';
				}
				else{
					const angle = Math.atan2(p.x - center.x, p.y - center.y);

					const pGrad1 = {x: Math.sin(angle) * radius + p.x, y: Math.cos(angle) * radius + p.y};
					const pGrad2 = pointReflect(pGrad1, p, -2);
					
					let grad = ctx.createLinearGradient(pGrad1.x, pGrad1.y, pGrad2.x, pGrad2.y);
					
					if(gradStyle === 'smooth'){
						grad.addColorStop(0, colors[(i+1) % colors.length]);
						grad.addColorStop(0.5, colors[(i) % colors.length]);
						grad.addColorStop(1, colors[(i-1) % colors.length]);
					}
					else if (gradStyle == 'rev'){
						grad.addColorStop(0, colors[(i-1) % colors.length]);
						grad.addColorStop(0.5, colors[(i) % colors.length]);
						grad.addColorStop(1, colors[(i+1) % colors.length]);
					}
					
					if(stroke)
						ctx.strokeStyle = grad;
					else
						ctx.fillStyle = grad;
				}

				ctx.beginPath();
				ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
				if(stroke)
					ctx.stroke();
				else
					ctx.fill();
			});
		}
	}

	if(animate){
		shuffleInplace(drawings);
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i <drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
	const vignette = parseFloat(document.getElementById('vignetteInput').value);
	filterVignette(ctx, 0, 0, w, h, vignette);
	
}

const seedAngle = Math.PI / 3;

function drawCircle(ctx, center, radius, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
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

function randomiseValues(){
	document.getElementById('radiusInput').value = roundToPrecision(Math.random() * 3 + 0.2,1);
	document.getElementById('layersInput').value = ~~(Math.random() * 7 + 3);
	
	if(Math.random() > 0.5)
		document.getElementById('strokeRadioStroke').checked = true;
	else
		document.getElementById('strokeRadioFill').checked = true;
	
	if(Math.random() > 0.5)
		document.getElementById('gradInputSmooth').checked = true;
	else
		document.getElementById('gradInputRev').checked = true;
	
	document.getElementById('randomRotInput').checked = Math.random() > 0.5;
	if(Math.random() > 0.5)
		document.getElementById('vignetteInput').value = Math.random();
	else
		document.getElementById('vignetteInput').value = 0;
	
}



window.addEventListener('DOMContentLoaded', () => {
	setUpConstants();
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('luckBtn').addEventListener('click', () => {
		randomiseValues();
		drawPattern();
	});
});