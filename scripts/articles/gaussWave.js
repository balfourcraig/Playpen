function drawPattern(){
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	const center = {x: w/2.0, y: h/2.0};

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);
	
	const squish = parseFloat(document.getElementById('SquishInput').value);
	const pixelSize = parseInt(document.getElementById('PixSizeInput').value);
	for (let col = 0; col < w; col += pixelSize) {
		for (let row = 0; row < h; row += pixelSize) {
			const u1 = row/h;
			const u2 = col/w;
			const mapped = gaussianPoint(u1, u2, 1, 1);
			
			const r = ((mapped.x + 1) * w/squish) % 255;
			const g = ((mapped.y + 1) * h/squish) % 255;
			const b = 250;
			
			ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			ctx.fillRect(col, row, pixelSize, pixelSize);
		}
	}
}

function gaussianPoint(u1, u2, mean, stdDev){
	const sq = Math.sqrt(-2 * Math.log(1 - u1));
	u2 = (1 - u2) * 2 * Math.PI;
	const randStdNormalX = sq * Math.sin(u2);
	const randStdNormalY = sq * Math.cos(u2);
	const x = mean + stdDev * randStdNormalX;
	const y = mean + stdDev * randStdNormalY;
	return {x:x, y:y};
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUpSliderReadout('SquishInput','SquishReadout');
	setUpSliderReadout('PixSizeInput','PixSizeReadout');
	document.getElementById('SquishInput').addEventListener('change', drawPattern);
	document.getElementById('PixSizeInput').addEventListener('change', drawPattern);
	drawPattern();
});