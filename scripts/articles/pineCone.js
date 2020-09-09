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
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	const animate = document.getElementById('animateInput').checked;
	const randRot = document.getElementById('rotInput').checked;
	const sqrt = document.getElementById('sqrtDistInput').checked;
	//const down = document.getElementById('countDownInput').checked;
	const drawDir = document.getElementById('drawDirInput').value;
	const colorType = document.getElementById('colorModeSelect').value;
	
	const rotation = randRot ? Math.random() * Math.PI * 2 : 0;

	const drawings = [];

	const colors = [];
	if(colorType === 'fib'){
		for(let i = 0; i < 10; i++){
			colors.push(nextGoldenColor(80,55));
		}
	}
	
	let flatColor = 'black';
	if (colorType ==='mono')
		flatColor = nextGoldenColor(80,55);
	
	const indexes = [];
	for(let i = 0; i < 500; i++){
		indexes.push(i);
	}
	
	const down = drawDir === 'in';
	
	for(let j = down ? indexes.length : 0; (down && j > 0) || (!down && j < indexes.length); j += down ? -1 : 1){
		const i = indexes[j];
		const angle = i * goldenAngleRad + rotation;
		const offset = sqrt ? Math.sqrt(i) * w * 0.023 : i * w * 0.001;
		
		const x = Math.cos(angle) * offset + center.x;
		const y = Math.sin(angle) * offset + center.y;
		
		const p = {x:x, y:y};
		
		const radius = sqrt ? w/60 : Math.sqrt(i) * (w * 0.0012);
		
		let color;
		
		if(colorType === 'fib'){
			if (i % 144 === 0)
				color = colors[1];
			else if (i % 89 === 0)
				color = colors[2];
			else if (i % 55 === 0)
				color = colors[3];
			else if (i % 34 === 0)
				color = colors[4];
			else if (i % 21 === 0)
				color = colors[5];
			else if (i % 13 === 0)
				color = colors[6];
			else if (i % 8 === 0)
				color = colors[7];
			else if (i % 5 === 0)
				color = colors[8];
			else if (i % 3 === 0)
				color = colors[9];
			else
				color = colors[0];
		}
		else if (colorType == 'wheel')
			color = nextGoldenColor(90,50);
		else if (colorType === 'rand')
			color = randomColor();
		else
			color = flatColor;

		drawings.push(() => drawCircle(ctx, p, radius, color));
	}
	
	if(drawDir === 'rand')
		shuffleInplace(drawings);
		
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