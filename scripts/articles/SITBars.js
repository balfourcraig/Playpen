const colors = [
	'#015581',
	'#ed6d20',
	'#3ca4dc',
	'#ee2b74',
	'#007dc3',
	'#ffc80f',
	'#b4c869',
	'#666866',
	'#22bbe3',
	'#cd2137',
	'#669b41',
	'#5e58a2',
	'#b63e97',
	'#8dc63f',
	'#00697c',
	'#363636',
	'#eb5a91',
	'#e83c2a',
	'#643514',
];

let animationID = null;
function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	const heightMult = parseFloat(document.getElementById('heightMultInput').value);
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	
	const h = w * heightMult;

	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.45;
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);
	
	ctx.lineWidth = 1;

	const numBars = parseInt(document.getElementById('barNumInput').value);
	const gutterWidth = (parseFloat(document.getElementById('barGutterInput').value) / 100) * w;
	
	const barWidth = w / numBars - gutterWidth;
	if(barWidth <= 0){
		alert('Negative bar width. Try smaller gutters');
	}
	else{
		const drawings = [];

		shuffleInplace(colors);				
		
		for(let i = 0; i < numBars; i ++){
			const left = i * barWidth + i * gutterWidth;
			ctx.fillStyle = colors[i % colors.length];
			ctx.beginPath();
			ctx.rect(left, 0, barWidth, h);
			ctx.fill();
		}
	}

	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});