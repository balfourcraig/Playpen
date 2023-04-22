let strokeStartColor = 'green';
let strokeEndColor = 'orange';
let strokeJoinColor = 'orange';
let strokeDelay = 100;

let timeoutId = null;

const linkedLex = (line) => {
	let showStartEnd = document.getElementById('showStartEndCheck').checked;
	const useGradient = document.getElementById('showColorCheck').checked;
	if(useGradient){
		strokeStartColor = 'green';
		strokeEndColor = 'orange';
		strokeJoinColor = 'orange';
	}
	else{
		strokeStartColor = 'black';
		strokeEndColor = 'black';
		strokeJoinColor = 'black';
	}

	strokeDelay = parseInt(document.getElementById('animateSpeedInput').max) - parseInt(document.getElementById('animateSpeedInput').value);
	clearTimeout(timeoutId);
	console.log(`lexing ${line}`);
	let letters = [];
	
	
	const resultArea = document.getElementById('nameList');
	const c = document.createElement('canvas');
	const scale = 100;
	const w = 9 * scale;
	const h = scale;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'rgb(255,230,200)';
	ctx.fillRect(0, 0, w, h);
	resultArea.appendChild(c);
	const letterInstructions = [];
	for(const c of line){
		if(c === 'T'){
			letterInstructions.push(letter_T());
		}
		else if (c === 'a'){
			letterInstructions.push(letter_a());
		}
		else if (c === 'b'){
			letterInstructions.push(letter_b());
		}
		else if (c === 'c'){
			letterInstructions.push(letter_c());
		}
		else if (c === 'd'){
			letterInstructions.push(letter_d());
		}
		else if (c === 'e'){
			letterInstructions.push(letter_e());
		}
		// else if (c === 'f'){
		// 	letterInstructions.push(letter_f());
		// }
		else if (c === 'h'){
			letterInstructions.push(letter_h());
		}
		else if (c === 'i'){
			letterInstructions.push(letter_i());
		}
		else if (c === 'l'){
			letterInstructions.push(letter_l());
		}
		else if (c === 'o'){
			letterInstructions.push(letter_o());
		}
		else if (c === 't'){
			letterInstructions.push(letter_t());
		}
		else{
			letterInstructions.push(letter_unknown());
		}
	}
	let penPos = {x: 0, y: 0.9};
	let prevEnd = penPos;
	let prevJoin = true;
	let steps = [];
	for(let inst of letterInstructions){
		if(showStartEnd){
			steps.push(() => {
				circleAt(ctx, inst.penStart, 0.03, scale, penPos, strokeStartColor);
			});
		}
		if(inst.join && prevJoin){
			steps.push(() => {
				joinLetters(ctx, prevEnd, inst.penStart, scale, penPos);
			});
		}
		for(let i of inst.instructions){
			steps.push(() => {
				i(ctx, penPos, scale, useGradient);
			});
		}
		
		steps.push(() => {
			if(showStartEnd)
				circleAt(ctx, inst.penEnd, 0.03, scale, penPos, strokeEndColor);
			penPos.x += inst.penEnd.x * scale;
			penPos.y += inst.penEnd.x * scale;
			prevEnd = inst.penEnd;
			prevJoin = inst.join;
		});
	}
	animateLine(steps, 0);
}

const animateLine = (allActions, index) => {
	if(index < allActions.length){
		allActions[index]();
		timeoutId = setTimeout(() => {
			animateLine(allActions, index + 1);
		}, strokeDelay);
	}
}