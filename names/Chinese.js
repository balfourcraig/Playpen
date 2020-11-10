const chineseData = JSON.parse(`{
	"title": "Chinese",
	"suffixesM": [
		"US",
		"O",
		"IAN"
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

const chineseElement = (elName) => chineseData[elName][getRandomInt(0, chineseData[elName].length -1)];
const chineseConsonant = () => chineseElement('consonantSounds');
const chineseVowel = () => chineseElement('vowelSounds');

function chineseFirstname(gender){
	let name = '';
	for(let i = 0; i < getRandomInt(1,2); i++){
		name += chineseVowel() + chineseConsonant()
	}
	if(gender === 'M')
		name += chineseElement('suffixesM');
	else if (gender === 'F')
		name += chineseElement('suffixesF');
	else
		name += chineseVowel();
	
	return capitalize(name);
}

function chineseSurname(){
	return chineseFirstname('M');
}

function chineseName(options){
	const gender = options.gender === 'MF' ? Math.random() > 0.5 ? 'M' : 'F' : options.gender;
	let name = '';
	if(options.firstname)
		name += chineseFirstname(gender)
	if(options.surname)
		name += ' ' + chineseSurname();
	name = name.trim();
	
	if(options.surname && Math.random() < 0.3)
		name += ' ' + chineseSurname();
	return {culture: 'Chinese', value: name, gender: gender};
}