const vowels = ["A", "E", "I", "O", "U", "Y"];
const celestialData = JSON.parse(`{
	"title": "Celestial",
	"prefixTitles": [
		"Archangel",
		"Holy",
		"Aeon",
		"Prince",
		"Lord",
		"Holiest"
	],
	"suffixTitles": [
		"the Holy",
		"the Blessed",
		"the Glowing One",
		"the Burning One",
		"the Virtuous",
		"the Light",
		"the Fallen",
		"the Cherubim",
		"the Ophanim",
		"the Malakhim",
		"the Serafim",
		"the All-Seeing",
		"the Omniscient",
		"the Omnipresent",
		"the Omnipotent",
		"the Benevolent",
		"the Malevolent",
		"the Throne-bearer",
		"of the Chorus",
		"of the Quire",
		"the Flame-touched",
		"the Proclaimer",
		"the Just",
		"the Fair",
		"the Inevitable",
		"the Eternal",
		"the Incomprehensible",
		"the Indescribable",
		"the Ineffable",
		"the Nephilim"
		
	],
	"suffixes": [
		"EL",
		"IEL",
		"AEL",
		"IUS",
		"REL",
		"QEEL",
		"JAL",
		"SAEL",
		"LIEL",
		"LIUS"
	],
	"chunks": [
		"SEM",
		"ZAZ",
		"RAM",
		"KOK",
		"IA",
		"EE",
		"IAZ",
		"TAM",
		"ARA",
		"IA",
		"ZAZ",
		"EZE",
		"QE",
		"AB",
		"DAN",
		"ARNA",
		"TUR",
		"AS",
		"BAT",
		"ANA",
		"ATA",
		"MAR",
		"SAR",
		"AZAZ",
		"BEL",
		"CHAZ",
		"AR",
		"YAZA",
		"KA",
		"SHE",
		"SHAM",
		"SAR",
		"UR",
		"EQON",
		"AE"
	]
}
`);
const isVowel = (c) => vowels.includes(c);
const endsInVowel = (s) => isVowel(s[s.length-1]);
const celestialElement = (elName) => celestialData[elName][getRandomInt(0, celestialData[elName].length -1)];

function celestialSurname(){
	return celestialFirstname('M');
}

function nextChunk(existing, property){
	let index = getRandomInt(0, celestialData[property].length -1)
	if(!existing)
		celestialData[property][index];
	
	while(endsInVowel(existing) === isVowel(celestialData[property][index % (celestialData[property].length -1)][0]))
		index++;
	return celestialData[property][index % (celestialData[property].length -1)];
}

function celestialFirstname(gender){
	let name = '';
	for(let i = 0; i < getRandomInt(1,2); i++){
		name += nextChunk(name, 'chunks');
	}
	name += nextChunk(name, 'suffixes');
	return capitalize(name);
}

function celestialName(options){
	//const gender = options.gender === 'MF' ? Math.random() > 0.5 ? 'M' : 'F' : options.gender;
	let name = celestialFirstname();
	if(options.celestial.titles){
		if(Math.random() < 0.1)
			name = celestialElement('prefixTitles') + ' ' + name;
		else
			name += ' ' + celestialElement('suffixTitles');
	}
	
	return {culture: 'Celestial', value: name, gender: 'MF'};
}