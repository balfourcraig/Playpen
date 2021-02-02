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
	console.log('drawing');
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	const animate = document.getElementById('animateInput').checked;
	
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	const corners = [];
	const radius = w * 0.4;
	const center = {x: w/2, y: h/2};
	const angle = (Math.PI * 2) /2;
	const numCorners = parseInt(document.getElementById('numPoints').value);
	for(let i = 0; i < numCorners; i++){
		//corners.push(pointByAngle(center, radius, angle * (1 + i)));
		corners.push(pointOnCircle(center, radius, numCorners, i));
	}
	let currentPoint = {x: Math.random() * w, y: Math.random() * h};
	const iterationsPerFrame = parseInt(document.getElementById('iterationsInput').value);
	const frames = parseInt(document.getElementById('framesInput').value);
	const opacity = parseFloat(document.getElementById('opacityInput').value);
	
	if(animate){
		frame(0);
	}
	else{
		for(let f = 0; f < frames; f++){
			const color = 'hsla(' + (f/frames * 200 + 150) + ',60%,50%,' + opacity + ')';
			for(let i = 0; i < iterationsPerFrame; i++){
				update(color);
			}
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
	
	function frame(count){
		const color = 'hsla(' + (count/frames * 200 + 150) + ',60%,50%,' + opacity + ')';
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
		let r = ~~(Math.random() * numCorners);

		currentPoint = midpoint(currentPoint, corners[r]);
		
		ctx.fillStyle = color;
		ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click',drawPattern);
	
	setUpSliderReadout('numPoints','numPointsReadout')
	
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	setUpBlankCanvas();
});

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}