const chineseData = JSON.parse(`{
	"title": "Chinese",
	"completeNames" :[
		"BO",
		"CHANG",
		"CHAO",
		"CHEN",
		"AH",
		"AI",
		"BAI",
		"CHIN",
		"DA",
		"FEN",
		"FU",
		"HAI",
		"HE",
		"HONG",
		"JIA",
		"JIANG",
		"LI",
		"LEE",
		"KIM",
		"LIM",
		"MEI",
		"MING",
		"PING",
		"TAI",
		"TAO",
		"WEI",
		"XIANG",
		"XIU",
		"YANG",
		"YI",
		"ZHE",
		"ZHENG"
	],
	"vowelSounds": [
		"A",
		"AI",
		"AO",
		"E",
		"I",
		"U",
		"O",
		"UA",
		"YU",
		"UIYI",
		"UI",
		"IA",
		"IU",
		"YA"
	],
	"consonantSounds": [
		"H",
		"N",
		"B",
		"CH",
		"NG",
		"D",
		"F",
		"G",
		"NT",
		"J",
		"NH",
		"K",
		"L",
		"M",
		"Q",
		"SH",
		"S",
		"T",
		"W",
		"X",
		"ZH"
	],
	"suffixs": [
		"AH",
		"AI",
		"AO",
		"O",
		"EN",
		"ENG",
		"IN",
		"UN",
		"A",
		"ONG",
		"ANG",
		"ING",
		"U",
		"YU",
		"UO",
		"UA",
		"UI",
		"YI",
		"AN",
		"EI",
		"UAN",
		"IANG"
	]
}
`);

const chineseElement = (elName) => chineseData[elName][getRandomInt(0, chineseData[elName].length -1)];
const chineseConsonant = () => chineseElement('consonantSounds');
const chineseVowel = () => chineseElement('vowelSounds');
const chineseSuffix = () => chineseElement('suffixs');

function chineseNameSegment(gender){
	if(Math.random() < 0.5)
		return chineseElement('completeNames');
	else
		return chineseVowel() + chineseConsonant();
}

function chineseFirstname(gender){
	let name = '';
	
	if(Math.random() < 0.4){//very short name
		name += chineseNameSegment();
	}
	else{
		for(let i = 0; i < getRandomInt(0,2); i++){
			name += chineseNameSegment();
		}
		name += chineseSuffix();
	}

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

	return {culture: 'Chinese', value: name, gender: gender};
}