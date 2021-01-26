const englishData = {
	title: 'English',
	suffixesM: [
		'ER',
		'IEL',
		'ES',
		'ON',
		'AN',
		'ORY',
		'DER',
		'HAM',
		'ALD',
		'US',
		'IAN',
		'IS',
		
	],
	chunksM: [
		'MICH',
		'JAS',
		'ON',
		'TIM',
		'OTH',
		'UK',
		'GREG',
		'ALE',
		'EXA',
		'IVE',
		'OLI',
		'NICH',
		'OLA',
		'ILLIA',
		'ASO',
		'PHIL',
		'EORGE',
		'ED',
		'WA',
		'ILLI',
		'SEA',
		'EAN',
		'JAM',
		'MIE',
		'WARD',
		'RO',
		'CON',
		'ONNO',
		'ART',
		'ARL',
		'ARTI',
		'AHAM',
		'ARRY',
		'ENE',
		'GAV',
		'REN',
		'ALLA',
		'AD',
		'RIAN',
		'SAM',
		'IVA',
		'LEW',
		'IS',
		'NATH',
		'LEO',
		'JOS',
		'ICA',
		'FRAS',
		'FRED',
		'RICK',
		'ARA',
		'UL',
		'BRO',
		'WAR',
		'ACO',
		'ICHAR',
		'IMO',
		'PAU',
		'AND',
		
	],
	suffixesF: [
		'AH',
		'A',
		'DA',
		'ELA',
		'RINE',
		'ANIE',
		'RY',
		'IA',
		'RET',
		'ANNE',
		'ELLA',
		'LY',
		'LIE',
		'LEIGH',
		'LEY',
		'NA',
		'ETTE',
		'EEN',
		'SEY',
		'YA',
		'PHINE',
		'CIA',
	],
	chunksF: [
		'SAR',
		'RAH',
		'ELI',
		'ISA',
		'TRAC',
		'EY',
		'AM',
		'DON',
		'ONNA',
		'WEN',
		'ENDY',
		'NIC',
		'GEO',
		'NAT',
		'TASH',
		'ROB',
		'JAC',
		'QUE',
		'MAR',
		'PAT',
		'AND',
		'REA',
		'HAY',
		'JAN',
		'VIC',
		'TOR',
		'AYLE',
		'RIA',
		'LUC',
		'OUI',
		'A',
		'AURA',
		'UDI',
		'VAN',
		'YLIE',
		'SSA',
		'JAS',
		'MINE',
		'PAUL',
		'KYL',
		'ARB',
		'ATIE',
		'ASH',
		'EMMA',
		'EM',
		'BER',
		'TAY',
		'LOR',
		'ANI',
		'COLL',
		'LEEN',
	],
	surnameSuffixes: [
		'FORD',
		'OR',
		'HERD',
		'KOVA',
		'SHANK',
		'ALD',
		'MARK',
		'WOOD',
		'SON',
		'IL',
		'SIN',
		'NER',
		'ER',
		'WARDS',
		'SEN',
		'FELLOW',
		'STER',
		'URST',
		'TON',
		'ALL',
		'RING',
		'OLD',
		'BERG',
		'ELL',
		'ARCK',
		'SIDE',
		'COURT',
		'ER',
		'VILLE',
		'FOOT',
		'HAM',
		'FORTH',
		'EON',
		'ET',
	],
	surnamePrefixes: [
		'O\'',
		'Mc',
		'Mac',
		'Van',
		'VanDer',
		'Von',
		'De',
	]
};
const englishElement = (elName) => englishData[elName][getRandomInt(0, englishData[elName].length -1)];

function nextEnglishChunk(existing, property){
	let index = getRandomInt(0, englishData[property].length -1)
	if(!existing)
		englishData[property][index];
	
	while(endsInVowel(existing) === isVowel(englishData[property][index % (englishData[property].length)][0]))
		index++;
	return englishData[property][index % (englishData[property].length)];
}

function englishFirstname(gender){
	let name = '';
	let chuckCount = 0;
	for(let i = 0; i < getRandomInt(1, 2); i++){
		name += nextEnglishChunk(name, 'chunks' + gender);
		chuckCount++;
	}
	if(chuckCount < 2 || Math.random() < 0.6)
		name += nextEnglishChunk(name, 'suffixes' + gender);
	return capitalize(name);
}

function englishSurname(){
	let name = '';
	if(Math.random() < 0.4)
		name = englishFirstname(Math.random() < 0.5 ? 'M' : 'F');
	else{
		let chuckCount = 0;
		for(let i = 0; i < getRandomInt(1, 3); i++){
			name += nextEnglishChunk(name, 'chunks' + (Math.random() < 0.5 ? 'M' : 'F'));
			chuckCount++;
		}
		if(chuckCount < 2 || Math.random() < 0.6)
			name += nextEnglishChunk(name, 'surnameSuffixes');
		name = capitalize(name);
	}
	if(Math.random() < 0.2){
		name = englishElement('surnamePrefixes') + name;
	}
	return name;
}

function englishName(options){
	const gender = options.gender === 'MF' ? Math.random() > 0.5 ? 'M' : 'F' : options.gender;
	//const gender = 'M';
	let name = englishFirstname(gender) + ' ' + englishSurname();
	
	return {culture: englishData.title, value: name, gender: gender};
}