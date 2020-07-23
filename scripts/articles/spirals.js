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
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	ctx.globalAlpha = 0.6;
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const randRot = document.getElementById('rotInput').checked;
	const sqrt = document.getElementById('sqrtDistInput').checked;
	const curve =  document.getElementById('curveInput').checked;
	const order = parseInt(document.getElementById('orderInput').value);
	
	const rotation = randRot ? Math.random() * Math.PI * 2 : 0;

	const drawings = [];

	const color = useColor ? randomColor() : 'black';

	for(let i = 0; i < 1100; i += order){
		if(curve){
			drawings.push(() => drawQuadCurve(ctx, fibPoint(i, rotation, center, w, sqrt), center, fibPoint(i + order, rotation, center, w, sqrt), color));
		}
		else{
			drawings.push(() => drawLine(ctx, fibPoint(i, rotation, center, w, sqrt), fibPoint(i + order, rotation, center, w, sqrt) , color));
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

function fibPoint(i, rotation, center, w, sqrt){
	const angle = i * goldenAngleRad + rotation;
	const offset = sqrt ? Math.sqrt(i) * w * 0.023 : i * w * 0.001;
	
	const x = Math.cos(angle) * offset + center.x;
	const y = Math.sin(angle) * offset + center.y;
	
	const p = {x:x, y:y};
	return p;
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

function drawQuadCurve(ctx, start, control, end, color){
	const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
	grad.addColorStop(0, 'transparent');
	grad.addColorStop(0.5, color);
	grad.addColorStop(1, 'transparent');
	ctx.strokeStyle = grad;
	
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
	ctx.stroke();
}

function drawLine(ctx, start, end, color){
	const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
	grad.addColorStop(0, 'transparent');
	grad.addColorStop(0.5, color);
	grad.addColorStop(1, 'transparent');
	ctx.strokeStyle = grad;
	//ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
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