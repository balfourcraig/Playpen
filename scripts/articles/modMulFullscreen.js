let animationID = null;
let urlVars = {};
let multValue = 0;

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function getUrlParam(parameter, defaultvalue){
	var urlparameter = defaultvalue;
	if(window.location.href.indexOf(parameter) > -1){
		urlparameter = urlVars[parameter];
		}
	return urlparameter;
}

function drawLine(ctx, center, radius, multiplier, points, i, iterations, useColor, color, useGradient){
	if(iterations > 0){
		const pointFrom = pointOnCircle(center, radius, points, i % points);
		const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
		
		if(useColor){
			const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
			if(useGradient){
				const iFrom = ((i % points)/points) * 360;
				const iTo = (((i * multiplier) % points)/points) * 360;
				grad.addColorStop(0, 'transparent');
				grad.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
				grad.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
				grad.addColorStop(1, 'transparent');
			}
			else{
				grad.addColorStop(0, 'transparent');
				grad.addColorStop(0.5, color);
				grad.addColorStop(1, 'transparent');
			}
			ctx.strokeStyle = grad;
		}

		ctx.beginPath();
		ctx.moveTo(pointFrom.x, pointFrom.y);
		ctx.lineTo(pointTo.x, pointTo.y);
		ctx.stroke();
		
		animationID = window.requestAnimationFrame(() =>{
			drawLine(ctx, center, radius,multiplier, points, i+1, iterations -1, useColor, color, useGradient);
		});
	}
}

function setUpEditLink(){
	const mult = getUrlParam('mult','2');
	const mod = getUrlParam('mod','200');
	const winding = getUrlParam('winding','4');
	const width = getUrlParam('width', document.getElementById('sizeCalc').getBoundingClientRect().width.toString);
	const animate = getUrlParam('animate','false') === 'true';
	const colorMode = getUrlParam('colorMode','wheel');
	const colorIndex = getUrlParam('colorModeIndex','2');
	
	const params = `?mult=${mult}&mod=${mod}&winding=${winding}&width=${width}&animate=${animate}&colorModeIndex=${colorIndex}&colorMode=${colorMode}`
	document.getElementById('editLink').href = 'ModMul.html' + params;
}

function drawModMul(){
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = parseInt(getUrlParam('width', document.getElementById('sizeCalc').getBoundingClientRect().width.toString()));
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	ctx.globalAlpha = 0.6;
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

	let multiplier = parseFloat(getUrlParam('mult','2'));
	const points = parseInt(getUrlParam('mod','200'));
	
	let iterations = points;
	let winding = parseInt(getUrlParam('winding','4'));
	if(winding && winding > 1){
		iterations *= winding;
		multiplier += (1 / winding);
	}
	
	const color = randomColor();
	
	const animate = getUrlParam('animate','false') === 'true';
	
	const colorMode = getUrlParam('colorMode','wheel');
	const useColor = colorMode === 'mono' || colorMode === 'wheel';
	const useGradient = colorMode === 'wheel';

	if(animate){
		drawLine(ctx, center, radius, multiplier, points, 0, iterations, useColor, color, useGradient);
	}
	else{
		for(let i = 1; i < iterations; i++){
			const pointFrom = pointOnCircle(center, radius, points, i % points);
			const pointTo = pointOnCircle(center, radius, points, (i * multiplier) % points);
			if(useColor){
				const grad = ctx.createLinearGradient(pointFrom.x, pointFrom.y, pointTo.x, pointTo.y);
				if(useGradient){
					const iFrom = ((i % points)/points) * 360;
					const iTo = (((i * multiplier) % points)/points) * 360;
					grad.addColorStop(0, 'transparent');
					grad.addColorStop(0.4, 'hsl(' + iFrom + ', 80%, 50%)');
					grad.addColorStop(0.6, 'hsl(' + iTo + ', 80%, 50%)');
					grad.addColorStop(1, 'transparent');
				}
				else{
					grad.addColorStop(0, 'transparent');
					grad.addColorStop(0.5, color);
					grad.addColorStop(1, 'transparent');
				}
				ctx.strokeStyle = grad;
			}
			
			ctx.beginPath();
			ctx.moveTo(pointFrom.x, pointFrom.y);
			ctx.lineTo(pointTo.x, pointTo.y);
			ctx.stroke();
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	urlVars = getUrlVars();
	setUpEditLink();
	drawModMul();
});