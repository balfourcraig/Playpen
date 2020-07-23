function goldenRand(minSat, maxSat, minLight, maxLight){
	randh += golden_ratio;
	randh %= 1;
	
	let sat = getRandomInt(minSat, maxSat);
	let light = getRandomInt(minLight, maxLight);
	
	return 'hsl(' + (randh * 360) + ', ' + sat + '%, ' + light + '%)';
}

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
	
	ctx.lineWidth = 2;			
	
	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const blendMode = document.getElementById('blendModeSelect').value;


	const subdivisions = parseInt(document.getElementById('subInput').value);
	const points = parseInt(document.getElementById('pointsInput').value);
	const skip = parseInt(document.getElementById('skipInput').value);
	const rotation = Math.random();
	const drawings = [];
	
	ctx.globalCompositeOperation = blendMode;
	
	let spokes = [];
	const colors = [];
	
	for(let i = 0; i < points; i++){
		colors.push(useColor ? goldenRand(75, 95, 40, 60) : 'black');
		spokes.push([]);
		spokes[i][0] = pointOnCircle(center, radius, points, i, rotation);
		
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
		//console.log('p = ' + p);
		//console.log('i = ' + i);
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
	
	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
	}
	
	
	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
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

function pointOnCircle(center, radius, totalPoints, pointNum, rotation){
	const angle = (pointNum / totalPoints * Math.PI * 2) + rotation;
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

function drawLineFlat(ctx, start, end, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
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