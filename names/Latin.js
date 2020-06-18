const latinData = JSON.parse(`{
	"title": "Latin",
	"suffixesM": [
		"US",
		"O",
		"IAN",
		"IUS",
		"IX",
		"EUS",
		"EIUS",
		"ANUS"
	],
	"suffixesF": [
		"A",
		"IA"
	],
	"vowelSounds": [
		"AE",
		"IA",
		"A",
		"I",
		"AHE",
		"O",
		"U",
		"IU",
		"E",
		"UI",
		"IO",
		"AU"
	],
	"consonantSounds": [
		"QU",
		"NCT",
		"L",
		"N",
		"R",
		"S",
		"B",
		"LV",
		"T",
		"RN",
		"C",
		"ND",
		"PT",
		"RV",
		"V",
		"XT",
		"RT",
		"RG",
		"M",
		"FR",
		"GR",
		"PP",
		"RB",
		"BL",
		"MP",
		"GN",
		"LL"		
	]
}
`);

const latinElement = (elName) => latinData[elName][getRandomInt(0, latinData[elName].length -1)];
const latinConsonant = () => latinElement('consonantSounds');
const latinVowel = () => latinElement('vowelSounds');

function latinFirstname(gender){
	let name = '';
	for(let i = 0; i < getRandomInt(1,3); i++){
		name += latinVowel() + latinConsonant()
	}
	if(gender === 'M')
		name += latinElement('suffixesM');
	else if (gender === 'F')
		name += latinElement('suffixesF');
	else
		name += latinVowel();
	
	return capitalize(name);
}

function latinSurname(){
	return latinFirstname('M');
}

function latinName(gender){
	let name = latinFirstname(gender) + ' ' + latinSurname();
	if(Math.random() < 0.3)
		name += ' ' + latinSurname();
	return name;
}