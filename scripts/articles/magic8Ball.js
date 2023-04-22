function pickNumberGolden(max){
	randh += golden_ratio;
	randh %= 1;
	
	const noise = Math.random() * 0.2;
	return ~~(((randh + noise) % 1) * max);
}


const answers = [
	{ text: "It is certain.", type: "affirmative" },
	{ text: "Without a doubt.", type: "affirmative" },
	{ text: "It is decidedly so.", type: "affirmative" },
	{ text: "Yes&mdash;definitely.", type: "affirmative" },
	{ text: "You may rely on it.", type: "affirmative" },
	{ text: "As I see it, yes.", type: "affirmative" },
	{ text: "Most likely.", type: "affirmative" },
	{ text: "Outlook good.", type: "affirmative" },
	{ text: "Yes.", type: "affirmative" },
	{ text: "Signs point to yes.", type: "affirmative" },

	{ text: "Reply hazy, try again.", type: "non-committal" },
	{ text: "Ask again later.", type: "non-committal" },
	{ text: "Better not tell you now.", type: "non-committal" },
	{ text: "Cannot predict now.", type: "non-committal" },
	{ text: "Concentrate and ask again.", type: "non-committal" },

	{ text: "Don't count on it.", type: "negative" },
	{ text: "My reply is no.", type: "negative" },
	{ text: "My sources say no.", type: "negative" },
	{ text: "Outlook not so good.", type: "negative" },
	{ text: "Very doubtful.", type: "negative" },
];

function guess(){
	if(document.getElementById('apiCheck').checked){
		apiGuess();
		return;
	}
	const useGoldenRand = document.getElementById('goldenInput').checked;
	
	const index = useGoldenRand ? pickNumberGolden(answers.length) : ~~(Math.random() * answers.length);
	const answer = answers[index];
	
	displayGuess(answer.text, answer.type);
}

function apiGuess(){
	const holder = document.getElementById('MagicResultHolder');
	holder.innerHTML = 'Loading...';
	const address = 'https://magiceightballapi.azurewebsites.net/api/MagicEightBall';
	fetch(address)
		.then(response => response.json())
		.then(data => {
			displayGuess(data.Text, data.AnswerType);
		}
	).catch(err => {
		holder.innerHTML = 'Error loading answer.';
		console.error(err);
	});

}

function displayGuess(text, type){
	const holder = document.getElementById('MagicResultHolder');
	holder.innerHTML = '';
	
	const answerEl = document.createElement('span');
	answerEl.innerHTML = text;
	answerEl.title = type;
	let color = '#000';
	switch(type.toLowerCase()){
		case 'affirmative':
			color = 'lime';
			break;
		case 'non-committal':
			color = 'gold';
			break;
		case 'negative':
			color = 'red';
			break;
	}
	answerEl.setAttribute('style', 'color:' + color);
	holder.appendChild(answerEl);
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('askBtn').addEventListener('click', guess);
});