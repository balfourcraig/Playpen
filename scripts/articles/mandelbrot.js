function drawPattern(){
	const zoomLevel = parseFloat(document.getElementById('zoomInput').value);
	document.getElementById('drawBtn').setAttribute('style','display:none');
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = ~~(w/1.75);
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'none';
	ctx.fillRect(0, 0, w, w);
	
	const maxIteration = 150;
	const lnMax = Math.log(maxIteration);
	for(let px = 0; px < w; px++){
		for(let py = 0; py < h / 2 + 1; py++){
			const x0 = mapLinear(px, 0, w, -2.5 / zoomLevel, 1 / zoomLevel);
			const y0 = mapLinear(py, 0, h, -1 / zoomLevel, 1 / zoomLevel);
			
			let x = x0;
			let y = y0;
			
			let iteration = inCardioid(x,y) ? maxIteration : 0;
			while (x * x + y * y < 4 && iteration < maxIteration) {
				const xtemp = x * x - y * y + x0;
				y = 2 * x * y + y0;
				x = xtemp;
				iteration++;
			}
			
			const bright = Math.log(iteration + 1) / lnMax * 255;
			const bright2 = iteration / maxIteration * 255;
			const color = 'rgb(' + bright2 + ',' + bright + ',' + bright + ')';
			
			ctx.fillStyle = color;
			ctx.fillRect(px, py, 1, 1, color);
			
			ctx.fillRect(px, h - py, 1, 1, color);
		}
	}
	document.getElementById('drawBtn').removeAttribute('style');
}

function inCardioid(x,y){
	const temp = x - 0.25;
	const q = temp * temp + y * y;
	const a = q * (q + temp);
	const b = 0.25 * (y * y);
	return a < b || ((x + 1) * (x + 1)) + (y * y) <= 0.0625;
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
});