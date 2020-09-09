let animationID = null;

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

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	ctx.globalAlpha = 0.7;
	
	//ctx.globalCompositeOperation = 'multiply';
	
	const points = parseInt(document.getElementById('numNails').value);

	const color = randomColor();

	const animate = document.getElementById('animateInput').checked;
	
	const colorMode = document.getElementById('colorModeSelect').value;
	const useColor = colorMode !== 'black';
	const useGradient = colorMode === 'wheel';
	
	const drawings = [];
	
	for(let i = 0; i < points; i++){
		const pointFrom = pointOnCircle(center, radius, points, i % points);
		for(let j = i + 1; j < points ; j++){
			const pointTo = pointOnCircle(center, radius, points, j % points);
			drawings.push(() => {
				if(useColor){
					const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
					if(colorMode === 'wheel'){
						const iFrom = ((i % points)/points) * 720;
						const iTo = ((j % points)/points) * 720;
						//grad.addColorStop(0, 'transparent');
						grad.addColorStop(0, 'hsl(' + iFrom + ', 80%, 50%)');
						grad.addColorStop(1, 'hsl(' + iTo + ', 80%, 50%)');
						//grad.addColorStop(1, 'transparent');
					}
					else if(colorMode === 'random'){
						const col1 = randomColor();
						const col2 = randomColor();
						grad.addColorStop(0, 'transparent');
						grad.addColorStop(0.1, col1);
						grad.addColorStop(0.9, col2);
						grad.addColorStop(1, 'transparent');
					}
					else if(colorMode === 'radial'){
						let dist = Math.max(i,j) - Math.min(i,j);
						dist = Math.min(dist, points - dist);
						
						const col1 = (points / dist) * 120;

						grad.addColorStop(0, 'hsl(' + col1 + ', 80%, 50%)');
						grad.addColorStop(1, 'hsl(' + col1 + ', 80%, 50%)');
					}
					else{
						grad.addColorStop(0, 'transparent');
						grad.addColorStop(0.1, color);
						grad.addColorStop(0.9, color);
						grad.addColorStop(1, 'transparent');
					}
					ctx.strokeStyle = grad;
				}
			
				ctx.beginPath();
				ctx.moveTo(pointFrom.x, pointFrom.y);
				ctx.lineTo(pointTo.x, pointTo.y);
				ctx.stroke();
			});
		}
	}
		
	if(animate){
		const drawLine = (i) => {
			if(i < drawings.length){
				drawings[i]();
				i++;
				animationID = window.requestAnimationFrame(() =>{
					drawLine(i);
				});
			}
			else{
				document.getElementById('drawBtn').removeAttribute('style');
				document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
			}
		}
		animationID = window.requestAnimationFrame(() =>{
			drawLine(0);
		});
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
	
}

function randomiseValues(){
	document.getElementById('numNails').value = Math.floor(Math.random() * 90 + 5);
}

window.addEventListener('DOMContentLoaded', () => {
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

	setUpBlankCanvas();
});