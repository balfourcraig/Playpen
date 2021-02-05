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
	let currentPoint;// = {x: Math.random() * w, y: Math.random() * h};
	switch(document.getElementById('startPointSelect').value){
		case 'corner':
			currentPoint = arrayRandom(corners);
			break;
		case 'center':
			currentPoint = center;
			break;
		case 'contained':
			if(numPoints < 8){
				currentPoint = randomPointInNGon(corners);
			}
			else{
				const containMaxRad = distance(center, midpoint(corners[0], corners[1]));
				currentPoint = pointOnCircle(center, Math.random() * containMaxRad, 50, ~~(Math.random() * 50))
			}
			break;
		case 'any':
			currentPoint = {x: Math.random() * w, y: Math.random() * h};
			break;
	}
	const iterationsPerFrame = parseInt(document.getElementById('iterationsInput').value);
	const frames = parseInt(document.getElementById('framesInput').value);
	const opacity = parseFloat(document.getElementById('opacityInput').value);
	const ratio = parseFloat(document.getElementById('ratioInput').value);
	
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

		currentPoint = proportionalMidpoint(currentPoint, corners[r], ratio);
		//currentPoint = randomPointInNGon(corners);
		
		ctx.fillStyle = color;
		ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
	}
}

function proportionalMidpoint(p1, p2, weight){
	const xDiff = p1.x - p2.x;
	const yDiff = p1.y - p2.y;
	return {x: p1.x - xDiff * weight, y: p1.y - yDiff * weight};
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	
	setUpSliderReadout('numPoints','numPointsReadout');
	//setUpSliderReadout('ratioInput','ratioReadout');
	
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('ratioInput').addEventListener('input', drawPattern);
	document.getElementById('numPoints').addEventListener('input', drawPattern);
	document.getElementById('setIdealBtn').addEventListener('click', () => {
		document.getElementById('ratioInput').value = idealRatio(parseInt(document.getElementById('numPoints').value));
		drawPattern();
	});
	setUpBlankCanvas();
});

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

function randomPointInNGon(corners){
	const tris = getTrianglesForNGon(corners);
	const areas = [];
	let totalArea = 0;
	for(let t of tris){
		const a = areaOfTriangle(t[0], t[1], t[2]);
		totalArea += a;
		areas.push(a);
	}
	const selected = Math.random() * totalArea;
	let pos = 0;
	for(let i = 0; i < tris.length; i++){
		pos += areas[i];
		if(selected <= pos){
			return randomPointInTriangle(tris[i][0], tris[i][1], tris[i][2]);
		}
	}
	alert('ERROR ' + totalArea + ' : ' + selected);
	
}

function getTrianglesForNGon(corners){
	const tris = [];
	if(corners.length === 3){
		tris.push([corners[0], corners[1], corners[2]]);
	}
	else if(corners.length === 4){
		tris.push([corners[0], corners[1], corners[2]]);
		tris.push([corners[0], corners[2], corners[3]]);
	}
	else if(corners.length === 5){
		tris.push([corners[0], corners[1], corners[2]]);
		tris.push([corners[0], corners[2], corners[4]]);
		tris.push([corners[2], corners[3], corners[4]]);
	}
	else if(corners.length === 6){
		tris.push([corners[0], corners[1], corners[2]]);
		tris.push([corners[0], corners[2], corners[5]]);
		tris.push([corners[2], corners[5], corners[3]]);
		tris.push([corners[3], corners[4], corners[5]]);
	}
	else if(corners.length === 7){
		tris.push([corners[0], corners[1], corners[2]]);
		tris.push([corners[0], corners[2], corners[6]]);
		tris.push([corners[2], corners[6], corners[3]]);
		tris.push([corners[3], corners[6], corners[5]]);
		tris.push([corners[3], corners[4], corners[5]]);
	}
	return tris;
	
}

function areaOfTriangle(a,b,c){
	const chunk1 = a.x * (b.y - c.y);
	const chunk2 = b.x * (c.y - a.y);
	const chunk3 = c.x * (a.y - b.y);
	return Math.abs((chunk1 + chunk2 + chunk3) / 2);
}

function randomPointInTriangle(a,b,c){
	let p = Math.random()
    let q = Math.random()

    if (p + q > 1) {
    	p = 1 - p
      q = 1 - q
    }
		
    // A + AB * p + BC * q
    let x = a.x + (b.x - a.x) * p + (c.x - a.x) * q
    let y = a.y + (b.y - a.y) * p + (c.y - a.y) * q

    return { x, y }
}

function idealRatio(numPoints){
	switch(numPoints){
		case 3:
			return 0.5;//exact
		case 4:
			return 0.52;//fudged to see detail
		case 5:
			return 0.6180331732534712;//exact (I think)
		case 6:
			return 0.6666666666667;//exact
		case 7:
			return 0.692;//estimate
		case 8:
			return 0.708;//estimate
		case 9:
			return 0.742;//estimate
		default:
			return 0.5;
	}
}