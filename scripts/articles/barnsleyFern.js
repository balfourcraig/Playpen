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
	let x = 0;
	let y = 0;
	
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	const animate = document.getElementById('animateInput').checked;
	
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w * 1.2;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	//ctx.fillStyle = 'white';
	//ctx.fillRect(0, 0, c.width, c.height);
	
	const iterationsPerFrame = parseInt(document.getElementById('iterationsInput').value);
	const frames = parseInt(document.getElementById('framesInput').value);
	const opacity = parseFloat(document.getElementById('opacityInput').value);
	
	if(animate){
		frame(0);
	}
	else{
		for(let f = 0; f < frames; f++){
			const color = 'hsla(' + (f/frames * 100 + 30) + ',60%,50%,' + opacity + ')';
			for(let i = 0; i < iterationsPerFrame; i++){
				update(color);
			}
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
	
	function frame(count){
		const color = 'hsla(' + (count/frames * 100 + 30) + ',60%,50%,' + opacity + ')';
		for (let i = 0; i < iterationsPerFrame; i++)
			update(color);
		if(count < frames){
			animationID = window.requestAnimationFrame(() => {
				frame(count + 1);
			});
		}
		else{
			document.getElementById('drawBtn').removeAttribute('style');
			document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		}
	}
	
	function update(color) {
		let nextX, nextY;
		let r = Math.random();

		if (r < 0.01) {
			nextX =  0;
			nextY =  0.16 * y;
		} else if (r < 0.86) {
			nextX =  0.85 * x + 0.04 * y;
			nextY = -0.04 * x + 0.85 * y + 1.6;
			
		} else if (r < 0.93) {
			nextX =  0.20 * x - 0.26 * y;
			nextY =  0.23 * x + 0.22 * y + 1.6;
		} else {
			nextX = -0.15 * x + 0.28 * y;
			nextY =  0.26 * x + 0.24 * y + 0.44;
		}

		// Scaling and positioning
		let plotX = w * (x + 3) / 6;
		let plotY = h - h * ((y + 2) / 14);

		ctx.fillStyle = color;
		ctx.fillRect(plotX, plotY, 1, 1);

		x = nextX;
		y = nextY;
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click',drawPattern);
	
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	setUpBlankCanvas();
});