let animationID = null;

function randomRedShade(){
	const hue = getRandomInt(310,370) + 'deg';
	const sat = getRandomInt(80,100) + '%';
	const val = getRandomInt(10,50) + '%';
	return 'hsl(' + hue + ',' + sat + ',' + val + ')';
}

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	const center = {x: w/2.0, y: w/2.0};
	ctx.globalAlpha = 0.95;
	//ctx.globalCompositeOperation = 'multiply';
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	const animate = document.getElementById('animateInput').checked;

	
	const rotation = Math.random() * Math.PI * 2 ;

	const drawings = [];

	const indexes = [];
	for(let i = 0; i < 100; i++){
		indexes.push(i);
	}
	
	for(let j = indexes.length; j > 2; j -= 1){
		const i = indexes[j];
		const angle = i * goldenAngleRad + rotation;
		const offset = i * w * 0.0029;
		
		const x = Math.cos(angle) * offset + center.x;
		const y = Math.sin(angle) * offset + center.y;
		
		const p = {x:x, y:y};
		
		const radius = Math.sqrt(i) * (w * 0.017);
		
		let color = randomRedShade();

		drawings.push(() => drawCircle(ctx, p, radius, color));
	}
		
	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
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
});