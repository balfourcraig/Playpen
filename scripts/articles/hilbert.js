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
	
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	const lineWidth = parseInt(document.getElementById('lineWidthInput').value);
	
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();

	const animate = document.getElementById('animateInput').checked;
	const useColor = document.getElementById('colorInput').checked;
	const order = document.getElementById('orderInput').value;
	const N = 1 << order;
	const useCircles =document.getElementById('circleInput').checked;
	const useCurves = document.getElementById('curveInput').checked;

	const circleRadius = useCircles ? lineWidth : lineWidth/2;
	const drawings = [];

	let prev = null;
	let prev2 = null;
	
	for(let i = 0; i < N * N; i += 1){
		let curr = hIndex2xy(i, N);
		
		curr = {x: mapLinear(curr.x, -0.5, N -0.5, 0, w), y: mapLinear(curr.y, -0.5, N -0.5, 0, w)};
		
		const colorFrom = useColor ? 'hsl(' + mapLinear(i-1, 0, N*N, 0, 360) + ', 100%, 50%)' : 'black';
		const colorTo = useColor ? 'hsl(' + mapLinear(i, 0, N*N, 0, 360) + ', 100%, 50%)' : 'black';
		
		if(i === 0 && !useCurves){
			drawings.push(() => drawCircle(ctx, curr, circleRadius, colorTo));
		}
		else if (i === N * N -1 && useCurves){
			const mid1 = midpoint(curr, prev);
			drawings.push(() => drawCircle(ctx, mid1, circleRadius, colorTo));
		}

		if(prev && (!useCurves || prev2)){
			const previous = prev;
			let mid1;
			if(useCurves){
				mid1 = midpoint(prev, prev2);
				const previous2 = prev2;
				const mid2 = midpoint(curr, prev);
				drawings.push(() => drawQuadLineFlat(ctx, mid1, previous, mid2, colorFrom, order < 4 ? colorTo : colorFrom)); //If using high order, don't bother with gradient, it will just slow things down
			}
			else{
				drawings.push(() => drawLineFlat(ctx, previous, curr, colorFrom, order < 4 ? colorTo : colorFrom));
			}

			if(useCurves)
				drawings.push(() => drawCircle(ctx, mid1, circleRadius, colorFrom));
			else
				drawings.push(() => drawCircle(ctx, curr, circleRadius, colorTo));
		}

		prev2 = prev;
		prev = curr;
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

function last2bits(x) {return(x & 3);}

function hIndex2xy(hindex, N){
	const positions = [
		/* 0: */ [0, 0],
		/* 1: */ [0, 1],
		/* 2: */ [1, 1],
		/* 3: */ [1, 0]
	];
	
	var tmp = positions[last2bits(hindex)];
	hindex = (hindex >>> 2);
	
	var x = tmp[0];
	var y = tmp[1];
	
	for (var n = 4; n <= N; n *= 2) {
		var n2 = n / 2;

		switch (last2bits(hindex)) {
		case 0: /* case A: left-bottom */
			tmp = x; x = y; y = tmp;
			break;

		case 1: /* case B: left-upper */
			x = x;
			y = y + n2;
			break;

		case 2: /* case C: right-upper */
			x = x + n2;
			y = y + n2;
			break;

		case 3: /* case D: right-bottom */
			tmp = y;
			y = (n2-1) - x;
			x = (n2-1) - tmp;
			x = x + n2;
			break;
		}
		
		hindex = (hindex >>> 2);
	}
	return {x:x, y:y};
}

function drawQuadLineFlat(ctx, start, mid, end, colorFrom, colorTo){
	if(colorFrom === colorTo){
		ctx.strokeStyle = colorFrom;
	}
	else{
		const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
		grad.addColorStop(0, colorFrom);
		grad.addColorStop(1, colorTo);
		ctx.strokeStyle = grad;
	}
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.quadraticCurveTo(mid.x, mid.y, end.x, end.y);
	ctx.stroke();
}


function drawLineFlat(ctx, start, end, colorFrom, colorTo){
	if(colorFrom === colorTo){
		ctx.strokeStyle = colorFrom;
	}
	else{
		const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
		grad.addColorStop(0, colorFrom);
		grad.addColorStop(1, colorTo);
		ctx.strokeStyle = grad;
	}
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
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

function copyShareLink(){
	const order = document.getElementById('orderInput').value;
	const lineWidth = document.getElementById('lineWidthInput').value;
	const round = document.getElementById('curveInput').checked;
	const animate = document.getElementById('animateInput').checked;
	const color = document.getElementById('colorInput').checked;
	const nodes = document.getElementById('circleInput').checked;
	
	const area = document.createElement('textarea');
	
	area.value = location.protocol + '//' + location.host + location.pathname + `?order=${order}&lineWidth=${lineWidth}&round=${round}&animate=${animate}&color=${color}&nodes=${nodes}`;
	document.body.appendChild(area);
	area.select();
	document.execCommand('copy');
	document.body.removeChild(area);
	alert('link copied');
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('copyBtn').addEventListener('click', copyShareLink);
	const urlVars = getUrlVars();
	let drawNow = false;
	if(urlVars['order']){
		document.getElementById('orderInput').value = urlVars['order'];
		drawNow = true;
	}
	if(urlVars['lineWidth']){
		drawNow = true;
		document.getElementById('lineWidthInput').value = urlVars['lineWidth'];
	}
	if(urlVars['round']){
		drawNow = true;
		document.getElementById('curveInput').checked = urlVars['round'] == 'true';
	}
	if(urlVars['animate']){
		drawNow = true;
		document.getElementById('animateInput').checked = urlVars['animate'] == 'true';
	}
	if(urlVars['color']){
		drawNow = true;
		document.getElementById('colorInput').checked = urlVars['color'] == 'true';
	}
	if(urlVars['nodes']){
		drawNow = true;
		document.getElementById('circleInput').checked = urlVars['nodes'] == 'true';
	}
	if(drawNow){
		drawPattern();
	}
});