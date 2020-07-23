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
	
	ctx.lineWidth = 1;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.45;
	ctx.globalCompositeOperation = 'multiply';
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	ctx.globalAlpha = 0.6;

	const points = parseInt(document.getElementById('numPoints').value);
	const speed1 = parseFloat(document.getElementById('speed1').value);
	const speed2 = parseFloat(document.getElementById('speed2').value);
	let iterations = gcd(points, speed1 * speed2 * points);

	console.log(iterations);
	
	const color = randomColor();
	
	const animate = document.getElementById('animateInput').checked;

	const useColor = true;
	const useGradient = true;

	for(let i = 1; i < iterations; i++){
		const pointFrom = pointOnCircle(center, radius/2, points, (i * speed1) % points);
		const pointTo = pointOnCircle(center, radius, points, (i * speed2) % points);
		if(useColor){
			const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);

			grad.addColorStop(0, 'transparent');
			grad.addColorStop(0.5, color);
			grad.addColorStop(1, 'transparent');
			
			ctx.strokeStyle = color;
		}
		
		ctx.beginPath();
		ctx.moveTo(pointFrom.x, pointFrom.y);
		ctx.lineTo(pointTo.x, pointTo.y);
		ctx.stroke();
	}
	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});