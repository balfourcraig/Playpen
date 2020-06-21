const maoriData = JSON.parse(`{
	"title": "Maori",
	"vowelSounds": [
		"A",
		"&Amacr;",
		"E",
		"&Emacr;",
		"I",
		"&Imacr;",
		"O",
		"&Omacr;",
		"U",
		"&Umacr;",
		"AA",
		"AE",
		"AI",
		"AO",
		"AU",
		"AIA",
		"OI",
		"UI",
		"IE",
		"UA"
	],
	"consonantSounds": [
		"N",
		"H",
		"R",
		"T",
		"WH",
		"M",
		"P",
		"K",
		"NG",
		"P",
		"W"
	]
}
`);

const maoriElement = (elName) => maoriData[elName][getRandomInt(0, maoriData[elName].length -1)];
const maoriConsonant = () => maoriElement('consonantSounds');
const maoriVowel = () => maoriElement('vowelSounds');

function maoriFirstname(gender, maxLength){
	let name = '';
	if(Math.random() < 0.4)
		name += maoriVowel();
	for(let i = 0; i < getRandomInt(1,maxLength); i++){
		name += maoriConsonant() + maoriVowel();
	}

	return capitalizeMaori(name);
}

function capitalizeMaori(s){
	if(s[0] === '&'){
		return s.substring(0,2).toUpperCase() + s.substring(2).toLowerCase();
	}
	else return capitalize(s);
}

function maoriSurname(){
	return maoriFirstname('M', 4);
}

function maoriName(gender){
	let name = maoriFirstname(gender,3) + ' ' + maoriSurname();
	if(Math.random() < 0.06)
		name = 'Te ' + name;
	return {culture: 'Maori', value: name, gender: gender};
}