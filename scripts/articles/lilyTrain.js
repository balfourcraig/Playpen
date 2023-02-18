let smokeParts = [];
let smokeHeight = 100;
let smokeWidth = 100;
const beginSmoke = (engine) =>{
	const smokeHolder = document.createElement('canvas');
	smokeHolder.classList.add('smokeHolder');
	const rect = engine.getBoundingClientRect();
	smokeHolder.style.top = (rect.top - rect.height - 20) + 'px';
	smokeHolder.style.left = (rect.left + 30) + 'px';
	smokeParts = [];
	smokeWidth = window.innerWidth/2;
	smokeHolder.setAttribute('width',smokeWidth);
	smokeHolder.setAttribute('height', smokeHeight);
	const trainEl = document.querySelector('.train');
	trainEl.appendChild(smokeHolder);
	setTimeout(() => smokeTick(smokeHolder.getContext('2d')), 50);
}
const smokeTick = (ctx) =>{
	ctx.clearRect(0,0,smokeWidth,smokeHeight);
	if(smokeParts.length < 50 && Math.random() < 0.4){
		smokeParts.push({
			pos: {x:0, y:smokeHeight},
			radius:5,
			velocity:{
				x :(Math.random() * 5 + 5),
				y :-7
			},
		})
	}
	for(let i = 0; i < smokeParts.length; i++){
		ctx.beginPath();
		ctx.arc(smokeParts[i].pos.x, smokeParts[i].pos.y, smokeParts[i].radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'rgba(0.5,0.5,0.6,' + (0.2 * (1 - smokeParts[i].pos.x/smokeWidth)) + ')';
		ctx.fill();
		smokeParts[i].pos = {x: smokeParts[i].pos.x + smokeParts[i].velocity.x, y: smokeParts[i].pos.y + smokeParts[i].velocity.y};
		smokeParts[i].velocity = {x: smokeParts[i].velocity.x, y: smokeParts[i].velocity.y * 0.9};
		smokeParts[i].radius += 1;
		if(smokeParts[i].pos.x > smokeWidth){
			smokeParts[i] = {
				pos: {x:0, y:smokeHeight},
				radius:5,
				velocity:{
					x :(Math.random() * 5 + 5),
					y :-7
				},
			}
		}
	}
	setTimeout(() => smokeTick(ctx), 50);
}

const setup = () => {
    
	// Generate a random number between 1 and n for the missing carriage
    //const n = ~~(Math.random() * 5 + 4);
	const n = parseInt(document.getElementById('numCarriagesInput').value);
    const missingNumber = Math.floor(Math.random() * n) + 1;

    // Populate the train with carriages numbered from 1 to n, with one missing
    const trainEl = document.querySelector('.train');
	trainEl.innerHTML = '';
	
	const engineDiv = document.createElement('div');
	const engineC = document.createElement('canvas');
	engineC.setAttribute('width', 125);
	engineC.setAttribute('height', 75);
	const engineCtx = engineC.getContext('2d');
	drawTrainEngine(engineCtx, 125, 75, randomColor(), randomColor());
	engineDiv.appendChild(engineC);
	trainEl.appendChild(engineDiv);
    for (let i = 1; i <= n; i++) {
        if (i === missingNumber) {
            //trainEl.innerHTML += '<div class="carriage"></div>';
			trainEl.appendChild(carriageEl(100,75, null));
        } else {
			trainEl.appendChild(carriageEl(100,75, i));
            //trainEl.innerHTML += '<div class="carriage">' + i + '</div>';
        }
    }
    // Create the options for the missing number
    const optionsEl = document.querySelector('.options');
	optionsEl.innerHTML = '';
	optionsEl.classList.remove('hidden');
	const resultPane = document.getElementById('resultPane');
	resultPane.innerHTML = '';
	//beginSmoke(engineC);
    const grade = (num, carriage) => {
		resultPane.classList.remove('hidden');
        if (num === missingNumber) {
            const tickEl = document.createElement('div');
            tickEl.classList.add('tick');
            tickEl.innerText = '\u2714'; // Unicode character for tick
            optionsEl.classList.add('hidden');
            resultPane.appendChild(tickEl);
			//setTimeout(setup,1000);
        } else {
            const crossEl = document.createElement('div');
            crossEl.classList.add('cross');
            crossEl.innerText = '\u2716'; // Unicode character for cross
            optionsEl.classList.add('hidden');
            resultPane.appendChild(crossEl);
			setTimeout(() => {
				resultPane.innerHTML = '';
				optionsEl.classList.remove('hidden');
				carriage.classList.add('hidden');
			}, 1000);
        }
    };
	const optionNums = [];
	for(let i = 1; i <= n; i++){
		optionNums.push(i);
	}
	for(let i of shuffle(optionNums)){
		const optionEl = document.createElement('div');
        optionEl.classList.add('option');
        optionEl.innerText = i;
        optionEl.addEventListener('click', () => {
            grade(i,optionEl);
        });

        optionsEl.appendChild(optionEl);
	}
};


function shuffle(original){
 //copy array
 const arr = [];
 for(let i = 0; i < original.length; i++){
  arr[i] = original[i];
 }

 //swap shuffle
 let n = arr.length;
 while(n > 0){
  const r = ~~(Math.random() * n);
  const temp = arr[r];
  arr[r] = arr[n - 1];
  arr[n - 1] = temp;
  n--;
 }
 return arr;
}

function carriageEl(w, h, num){
	const div = document.createElement('div');
	div.setAttribute('class', 'carriage');
	const c = document.createElement('canvas');
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	ctx.lineWidth = 2;
	drawTrainCarriage(ctx, w, h, randomColor(), randomColor(), num);
	div.appendChild(c);
	return div;
}
const trainColorMain = 'green';
const trainColorTrim = 'forestgreen';
const trainColorWheel = 'dimgrey';
document.addEventListener('DOMContentLoaded', () => { //Wait till the DOM has finished loading or body is null
    //setup();
	document.getElementById('buildBtn').addEventListener('click', setup);
});

//const randomColor = () => colors[~~(Math.random() * colors.length)];

function randomColor() {
	var letters = '456789ABC';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * letters.length)];
	}
	return color;
}

const colors = [
	'red',
	'green',
	'blue',
	'gold',
	'orange',
	'purple',
	'dodgerblue',
];

function drawTrainCarriage(ctx, xScale, yScale, mainColor, trimColor,num){
	drawRect(ctx, xScale, yScale, 0.05, 0.7, 0.9, 0.2, trimColor, true)//base
	drawRect(ctx, xScale, yScale, 0.0, 0.8, 0.06, 0.04, trainColorWheel, true)//frontStop
	drawRect(ctx, xScale, yScale, 0.94, 0.8, 0.06, 0.04, trainColorWheel, true)//backStop
	drawRect(ctx, xScale, yScale, 0.1, 0.1, 0.8, 0.7, mainColor, true)//cabin
	drawRect(ctx, xScale, yScale, 0.05, 0.0, 0.9, 0.1, trimColor, true)//roof
	drawWheel(ctx,xScale, yScale,{x:0.18, y:0.84}, 0.1, trainColorWheel, true);//front wheel
	drawWheel(ctx,xScale, yScale,{x:0.82, y:0.84}, 0.1, trainColorWheel, true);//back wheel
	drawRect(ctx, xScale, yScale, 0.15, 0.2, 0.05, 0.4, 'lightblue', true)//front Window
	drawRect(ctx, xScale, yScale, 0.8, 0.2, 0.05, 0.4, 'lightblue', true)//back Window
	drawRect(ctx, xScale, yScale, 0.25, 0.16, 0.5, 0.44, 'white', true)//Panel
	if(num){
		ctx.font = (~~(yScale * 0.5)) + "px Arial";
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText(num.toString(), 0.5 * xScale, 0.55*yScale);
	}
}

function drawTrainEngine(ctx, xScale, yScale, mainColor, trimColor){
	drawRect(ctx, xScale, yScale, 0.65, 0.0, 0.3, 0.83, mainColor, true)//cabin
	drawRect(ctx, xScale, yScale, 0.7, 0.1, 0.2, 0.2, 'lightblue', true)//cabinWindow
	drawRect(ctx, xScale, yScale, 0.62, 0.0, 0.37, 0.02, trimColor, true)//cabinroof
	drawCircle(ctx,xScale, yScale,{x:0.13, y:0.4}, 0.05, 'lightyellow', true);//lightGlow
	drawCircle(ctx,xScale, yScale,{x:0.13, y:0.4}, 0.03, 'yellow', true);//light
	drawRect(ctx, xScale, yScale, 0.12, 0.30, 0.06, 0.2, trimColor, true)//lightbox
	drawCircle(ctx,xScale, yScale,{x:0.48, y:0.4}, 0.07, trimColor, true);//body dome
	drawRect(ctx, xScale, yScale, 0.15, 0.4, 0.7, 0.5, mainColor, true)//body
	drawRect(ctx, xScale, yScale, 0.94, 0.8, 0.06, 0.04, trainColorWheel, true)//backStop
	drawRect(ctx, xScale, yScale, 0.25, 0.2, 0.1, 0.2, trimColor, true)//smokestack front
	drawWheel(ctx,xScale, yScale,{x:0.28, y:0.84}, 0.08);//front wheel
	drawWheel(ctx,xScale, yScale,{x:0.47, y:0.84}, 0.08);//middle wheel
	drawWheel(ctx,xScale, yScale,{x:0.75, y: 0.7}, 0.15);//backwheel
	
	const frontTrianglePoints = [
		{x: 0, y: 0.98},
		{x: 0.16, y: 0.98},
		{x: 0.16, y: 0.6},
	];
	drawPath(ctx, xScale, yScale, frontTrianglePoints, trimColor, true);
	const smokeStackPoints = [
		{x: 0.25, y: 0.2},
		{x: 0.35, y: 0.2},
		{x: 0.4, y: 0.0},
		{x: 0.2, y: 0.0},
	];
	drawPath(ctx, xScale, yScale, smokeStackPoints, mainColor, true);
}

function drawPath(ctx, xScale, yScale, points, color, fill){
	ctx.beginPath();
	ctx.moveTo(points[0].x * xScale, points[0].y * yScale);
	for(let p of points){
		ctx.lineTo(p.x * xScale, p.y * yScale);
	}
	if(fill){
		ctx.fillStyle = color;
		ctx.fill();
	}
	else{
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

function drawEllipse(ctx, xScale, yScale, center, radius, color, fill){
	ctx.beginPath();
	ctx.ellipse(center.x * xScale, center.y * yScale, radius * xScale,radius * yScale, 0, 0, 2 * Math.PI);
	if(fill){
		ctx.fillStyle = color;
		ctx.fill();
	}
	else{
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

function drawWheel(ctx, xScale, yScale, center, radius){
	drawCircle(ctx, xScale, yScale, center, radius, '#333', true);
	drawCircle(ctx, xScale, yScale, center, radius * 0.9, trainColorWheel, true);
	drawCircle(ctx, xScale, yScale, center, radius * 0.2, '#333', true);
}

function drawCircle(ctx, xScale, yScale, center, radius, color, fill){
	ctx.beginPath();
	ctx.arc(center.x * xScale, center.y * yScale, radius * xScale, 0, 2 * Math.PI);
	if(fill){
		ctx.fillStyle = color;
		ctx.fill();
	}
	else{
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

function drawRect(ctx, xScale, yScale, x, y, width, height, color, fill){
	if(fill){
		ctx.fillStyle = color;
		ctx.fillRect(x*xScale,y*yScale,width*xScale,height*yScale);
	}
	else{
		ctx.strokeStyle = color;
		ctx.strokeRect(x*xScale,y*yScale,width*xScale,height*yScale);
	}
}