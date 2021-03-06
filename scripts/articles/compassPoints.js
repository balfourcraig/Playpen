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
	const radius = w * 0.45;
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.lineWidth = 1;
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const blendMode = document.getElementById('blendModeSelect').value;


	const subdivisions = parseInt(document.getElementById('subInput').value);
	const points = 8;
	const skip = 3;
	const drawings = [];
	
	ctx.globalCompositeOperation = blendMode;
	
	let spokes = [];
	
	const cardinalColor = useColor ? nextGoldenColor(75,50) : 'black';
	const subCardinalColor = useColor ? nextGoldenColor(75,50) : 'black';
	const northColor = cardinalColor; // useColor ? goldenRand(75,50) : 'black';

	const colors = [
		cardinalColor,//S
		subCardinalColor,//SE
		cardinalColor,//E
		subCardinalColor,//NE
		northColor,//N
		subCardinalColor,//NW
		cardinalColor,//W
		subCardinalColor//SW
	];
	
	const cardinalLength = 0.6;
	const subCardinalLength = 0.35;
	const northLength = 0.9;
	const spokeLengths = [
		cardinalLength,//S
		subCardinalLength,//SE
		cardinalLength,//E
		subCardinalLength,//NE
		northLength,//N
		subCardinalLength,//NW
		cardinalLength,//W
		subCardinalLength//SW
	];
	
	drawings.push(() => drawCircle(ctx, center, radius * 0.3, colors[1]));
	drawings.push(() => ctx.globalAlpha = 0.7);
	for(let i = 0; i < 8; i++){
		const p1 = pointOnCircle(center, w, points * 2, i);
		const p2 = pointOnCircle(center, w, points * 2, i + 8);
		
		drawings.push(() => drawLineFlat(ctx, p1, p2, colors[(i + 1) % 4]));
	}
	
	drawings.push(() => ctx.globalAlpha = 1);
	
	for(let i = 0; i < points; i++){
		if(!useColor)
			colors[i] = 'black';
		spokes.push([]);
		spokes[i][0] = pointOnCircle(center, radius * spokeLengths[i], points, i);
		
		for(let j = 1; j < subdivisions; j++){
			spokes[i][j] = subdivideLine(spokes[i][0], center, subdivisions, j);
		}
	}
	
	const shift = skip % points;
	const divisor = gcd(skip, points) - 1;

	for(let p = 0; p < points * skip; p += skip){
		let i = (p + (divisor * ~~(p/points))) % points;//this is tempremental af, do not touch it unless you want to spend hours of pain
		if(p !== 0 && i === 0)
			i++;

		drawings.push(() => drawLineFlat(ctx, spokes[i][0], center, colors[i]));
			
		for(let j = 0; j < subdivisions; j++){
			if(useColor){
				drawings.push(() => drawLineGradient(ctx, spokes[i][j], spokes[(i + skip) % points][subdivisions-1-j], colors[i], colors[(i + skip) % points]));
			}
			else{
				drawings.push(() => drawLineFlat(ctx, spokes[i][j], spokes[(i + skip) % points][subdivisions-1-j], colors[i]));
			}
		}
	}
	
	const cardinalDirections = ['S','E','N','W'];
	const fontSize = ~~(w / 20);
	
	ctx.font = fontSize + 'px Arial';
	ctx.textAlign = "center";
	drawings.push(() => {ctx.globalCompositeOperation = 'source-over';});
	for(let i = 0; i < 4; i++){
		drawings.push(() => ctx.fillStyle = colors[i*2]);
		const p = pointOnCircle(center, radius * spokeLengths[i * 2] + fontSize, 4, i);
		drawings.push(() => ctx.fillText(cardinalDirections[i], p.x, i % 2 == 0 ? p.y : p.y + fontSize *0.35));
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

function drawLineGradient(ctx, start, end, colorFrom, colorTo){
	const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
	grad.addColorStop(0, colorFrom);
	grad.addColorStop(1, colorTo);
	ctx.strokeStyle = grad;

	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawLineFlat(ctx, start, end, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

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

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});