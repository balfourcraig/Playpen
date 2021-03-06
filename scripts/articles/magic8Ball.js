function pickNumberGolden(max){
	randh += golden_ratio;
	randh %= 1;
	
	const noise = Math.random() * 0.2;
	return ~~(((randh + noise) % 1) * max);
}


const answers = [
	{ text: "It is certain.", type: "Affermative" },
	{ text: "Without a doubt.", type: "Affermative" },
	{ text: "It is decidedly so.", type: "Affermative" },
	{ text: "Yes&mdash;definitely.", type: "Affermative" },
	{ text: "You may rely on it.", type: "Affermative" },
	{ text: "As I see it, yes.", type: "Affermative" },
	{ text: "Most likely.", type: "Affermative" },
	{ text: "Outlook good.", type: "Affermative" },
	{ text: "Yes.", type: "Affermative" },
	{ text: "Signs point to yes.", type: "Affermative" },

	{ text: "Reply hazy, try again.", type: "NonCommital" },
	{ text: "Ask again later.", type: "NonCommital" },
	{ text: "Better not tell you now.", type: "NonCommital" },
	{ text: "Cannot predict now.", type: "NonCommital" },
	{ text: "Concentrate and ask again.", type: "NonCommital" },

	{ text: "Don't count on it.", type: "Negative" },
	{ text: "My reply is no.", type: "Negative" },
	{ text: "My sources say no.", type: "Negative" },
	{ text: "Outlook not so good.", type: "Negative" },
	{ text: "Very doubtful.", type: "Negative" },
];

function guess(){
	const holder = document.getElementById('MagicResultHolder');
	holder.innerHTML = '';
	const useGoldenRand = document.getElementById('goldenInput').checked;
	
	//const answer = answers[Math.floor(Math.random() * answers.length)];
	const index = useGoldenRand ? pickNumberGolden(answers.length) : ~~(Math.random() * answers.length);
	//console.log(index);
	const answer = answers[index];
	
	const answerEl = document.createElement('span');
	answerEl.innerHTML = answer.text;
	answerEl.title = answer.type;
	let color = '#000';
	switch(answer.type){
		case 'Affermative':
			color = 'lime';
			break;
		case 'NonCommital':
			color = 'gold';
			break;
		case 'Negative':
			color = 'red';
			break;
	}
	answerEl.setAttribute('style', 'color:' + color);
	holder.appendChild(answerEl);
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('askBtn').addEventListener('click', guess);
});