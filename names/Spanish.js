const spanishData = JSON.parse(`{
	"title": "Spanish",
	"suffixesM": [
		"AM",
		"O",
		"ON",
		"&Oacute;N",
		"&Aacute;N",
		"EL",
		"IO",
		"I&Aacute;",
		"U",
		"OR",
		"ERT",
		"ERTO",
		"EDO",
		"ARO",
		"ADO",
		"ER",
		"&Eacute;S",
		"EU",
		"ONI",
		"IEL",
		"AU",
		"URO",
		"UR",
		"UNO"
	],
	"suffixesF": [
		"ENE",
		"A&IAcute;L",
		"ELA",
		"A",
		"ION",
		"ORA",
		"IA",
		"E",
		"AIA",
		"IS",
		"ETS",
		"ES",
		"INA"
	],
	"vowelSounds": [
		"A",
		"E",
		"I",
		"O",
		"U",
		"&Aacute;",
		"&Eacute;",
		"&Iacute;",
		"&Oacute;",
		"&Uacute;",
		"AI",
		"AGU",
		"EI",
		"J",
		"EJ",
		"AYA",
		"IA"
	],
	"consonantMidSounds": [
		"BR",
		"LB",
		"RD",
		"RT",
		"LF",
		"RN",
		"ZN",
		"RTZ",
		"LD",
		"GN"
	],
	"consonantSounds": [
		"B",
		"R",
		"N",
		"G",
		"L",
		"H",
		"M",
		"D",
		"T",
		"DR",
		"DA",
		"G",
		"ST",
		"F",
		"X"
	],
	"suffixesSurname": [
		"RCIA",
		"CIA",
		"NDEZ",
		"DEZ",
		"LEZ",
		"GUEZ",
		"PEZ",
		"NCHEZ",
		"REZ",
		"TIN",
		"MEZ",
		"NEZ",
		"NOZ",
		"RRO",
		"NYM",
		"RRES",
		"L",
		"QUEZ",
		"NO",
		"MOS",
		"NCO",
		"STRO",
		"BIO",
		"GA",
		"LES",
		"TIZ",
		"RTIZ",
		"RIN",
		"SIAS"
	]
}
`);

const spanishElement = (elName) => spanishData[elName][getRandomInt(0, spanishData[elName].length -1)];
const spanishConsonant = () => spanishElement('consonantSounds');
const spanishConsonantAll = () => Math.random() < 0.3 ? spanishElement('consonantMidSounds') : spanishElement('consonantSounds');
const spanishVowel = () => spanishElement('vowelSounds');

function spanishFirstname(gender){
	let name = '';
	for(let i = 0; i < getRandomInt(1,2); i++){
		name += spanishVowel() + spanishConsonantAll()
	}
	if(gender === 'M')
		name += spanishElement('suffixesM');
	else if (gender === 'F')
		name += spanishElement('suffixesF');
	else
		name += spanishVowel();
	
	return capitalizeMaori(name);
}

function spanishSurname(){
	let name = '';
	if(Math.random() < 0.3)
		name += spanishVowel();
	for(let i = 0; i < getRandomInt(0,2); i++){
		if(i == 0)
			name += spanishConsonant() + spanishVowel();
		else
			name += spanishConsonantAll() + spanishVowel();
	}
	name += spanishElement('suffixesSurname');
	return capitalizeMaori(name);
}

function spanishName(options){
	const gender = options.gender === 'MF' ? Math.random() > 0.5 ? 'M' : 'F' : options.gender;
	let name = '';
	if(options.firstname)
		name += spanishFirstname(gender)
	if(options.surname)
		name += ' ' + spanishSurname();
	//if(Math.random() < 0.3)
		//name += ' ' + spanishSurname();
	return {culture: 'Spanish', value: name.trim(), gender: gender};
}