const germanicData = JSON.parse(`{
	"title": "Germanic",
	"combinationBitflags":[
		3,6,7,9,11,14,15,17,19,22
	],
	"titlesM": [
		"Count",
		"Baron",
		"King",
		"Prince",
		"Duke",
		"Lord",
		"Sir",
		"Archduke",
		"Kaiser",
		"Pope",
		"Grand Duke",
		"Viscount",
		"Elder",
		"Earl",
		"Brother",
		"Father",
		"Chamberlain"
	],
	"titlesF": [
		"Countess",
		"Baroness",
		"Queen",
		"Princess",
		"Duchess",
		"Lady",
		"Dame",
		"Archduchess",
		"Canoness",
		"Sister",
		"Mother",
		"Venerable Mother",
		"Viscountess"
	],
	"numbers":[
		"II",
		"III",
		"IV",
		"V",
		"VI",
		"VII",
		"VIII",
		"IX",
		"X",
		"XI",
		"XII",
		"XIII",
		"XIV",
		"XV",
		"XVI",
		"XVII"
	],
	"descriptions": [
		"Destroyer",
		"Conqueror",
		"Great",
		"Bastard",
		"Unready",
		"Boneless",
		"Ancient",
		"Addable",
		"Ambitious",
		"Apostle",
		"Avenger",
		"Beloved",
		"Blind",
		"Bloody",
		"Builder",
		"Confessor",
		"Crazy",
		"Crosseyed",
		"Devil",
		"Elder",
		"Eloquent",
		"Exile",
		"Fair",
		"Fat",
		"Swift",
		"Fearless",
		"Good",
		"Holy",
		"Hopeful",
		"Invincible",
		"Just",
		"Lion",
		"Lamb",
		"Mad",
		"Magnanimous",
		"Monk",
		"Old",
		"Pious",
		"Proud",
		"Prudent",
		"Quiet",
		"Red",
		"Saint",
		"Strong",
		"Tall",
		"Terrible",
		"Treacherous",
		"Unlucky",
		"Usurper",
		"Valient",
		"Warrior",
		"Weak",
		"Wicked",
		"Wise",
		"Young",
		"Younger"
	],
	"prefixesM": [
		"LU",
		"MA",
		"AA",
		"A",
		"BA",
		"BEA",
		"BE",
		"BJO",
		"BO",
		"BRU",
		"CA",
		"CO",
		"CLE",
		"DA",
		"DE",
		"DI",
		"DIE",
		"DO",
		"E",
		"FA",
		"FE",
		"FIE",
		"FLO",
		"FI",
		"FRA",
		"FRE",
		"FRIE",
		"GA",
		"GE",
		"GEO",
		"GO",
		"GRE",
		"GU",
		"HA",
		"HEI",
		"HE",
		"HEI",
		"HI",
		"HU",
		"HO",
		"IGNA",
		"I",
		"ISI",
		"JA",
		"JE",
		"JO",
		"JU",
		"KA",
		"KE",
		"KLAA",
		"KO",
		"KU",
		"LEO",
		"LE",
		"LI",
		"LU",
		"LUD",
		"LUI",
		"MA",
		"MEI",
		"MI",
		"MO",
		"NI",
		"NOA",
		"O",
		"PA",
		"PAU",
		"PE",
		"PHI",
		"PO",
		"RAI",
		"RO",
		"RE",
		"RI",
		"RU",
		"SE",
		"SIE",
		"SI",
		"THEO",
		"THO",
		"THIE",
		"TI",
		"TO",
		"U",
		"VI",
		"VIE",
		"WA",
		"WE",
		"WI",
		"WIE",
		"WO",
		"WU"
	],
	"suffixesM": [
		"RON",
		"HAM",
		"SON",
		"SEN",
		"CHIM",
		"BERT",
		"DAM",
		"DOLF",
		"BRECHT",
		"CHT",
		"DER",
		"XIS",
		"FONS",
		"FRED",
		"SELM",
		"HEML",
		"MIN",
		"RNT",
		"FREID",
		"NOLD",
		"NULF",
		"DUR",
		"TIST",
		"MAUS",
		"NO",
		"HARD",
		"HART",
		"HOLD",
		"RL",
		"STEN",
		"STAIN",
		"NRAD",
		"RAD",
		"NIEL",
		"LEV",
		"LIEF",
		"MUND",
		"MAR",
		"NUEL",
		"RICH",
		"WIN",
		"NAND",
		"MANN",
		"RG",
		"REON",
		"ROLD",
		"STAV",
		"NTHER",
		"JORG",
		"MUT",
		"WIN",
		"NING",
		"GOLF",
		"HEINZ"
	],
	"suffixesF": [
		
	],
	"vowelSounds": [
		"A",
		"O",
		"I",
		"AI",
		"E",
		"EI",
		"IA",
		"OI",
		"EA",
		"IE",
		"U",
		"AU",
		"IU",
		""
	],
	"consonantSounds": [
		"R",
		"N",
		"G",
		"L",
		"B",
		"H",
		"M",
		"CH",
		"D",
		"LB",
		"RT",
		"LH",
		"LF",
		"LB",
		"LBR",
		"CHT",
		"X",
		"ND",
		"DR",
		"LF",
		"LFR",
		"LW",
		"GR",
		"LM",
		"NT",
		"RM",
		"RN",
		"ST",
		"RTH",
		"KT",
		"RTR",
		"NK",
		"NH"
	],
	"locationSuffixes":[
		"BERG",
		"BURG",
		"HEIM",
		"HOSSEN",
		"GRAD",
		"HOLM",
		"STEIN",
		"IA",
		"GART",
		"GOROD",
		"DORF",
		"WOLD",
		"FORT"
	]
}
`);

const germanicElement = (elName) => germanicData[elName][getRandomInt(0, germanicData[elName].length -1)];

function germanicFirstname(gender, maxLength){
	let name = '';
	//if(gender === 'M')
	name += germanicElement('prefixesM');
	for(i = 0; i < getRandomInt(0, maxLength); i++){
		name += germanicElement('consonantSounds');
		name += germanicElement('vowelSounds');
	}
	//if(gender === 'M')
	name += germanicElement('suffixesM');
	if(gender === 'F')
		name += germanicElement('vowelSounds');
	return capitalize(name);
}

function germanicSurname(gender){
	return germanicFirstname(gender, 2) + (Math.random() < 0.8 ? 'er' : '');
}

function germanicTitle(gender){
	if(gender === 'M')
		return germanicElement('titlesM');
	else
		return germanicElement('titlesF');
}

function germanicLocation(){
	let name = Math.random() < 0.4 ? '' : germanicElement('vowelSounds');
	for(i = 0; i < getRandomInt(1,2); i++){
		name += germanicElement('consonantSounds');
		name += germanicElement('vowelSounds');
	}
	name += germanicElement('locationSuffixes');
	return capitalize(name);
}

function germanicDescription(){
	return germanicElement('descriptions');
}

function germanicName(gender){
	const flags = germanicElement('combinationBitflags');

	let name = '';
	
	if((flags & 4) === 4 && Math.random() < 0.8)
		name += germanicTitle(gender);
	
	if((flags & 1) === 1)
		name += ' ' + germanicFirstname(gender, 2);
	
	if((flags & 2) === 2)
		name += ' ' + germanicSurname(gender);
	
	if((flags & 16) === 16){
		if(Math.random() < 0.35)
			name += ' ' + germanicElement('numbers');
		else
			name += ' the ' + germanicDescription();
	}
	if((flags & 8) === 8){
		if(Math.random() < 0.3)
			name += ' of ' + germanicLocation();
		else if(Math.random() < 0.5)
			name += ' Van' + germanicLocation();
		else
			name += ' Von' + germanicLocation();
	}
		
	
	return {culture: 'Germanic', value: name.trim(), gender: gender};
	
	//return germanicFirstname(gender, 2) + ' ' + germanicSurname(gender);
}

//1  = Firstname
//2  = Surname
//4  = Title
//8  = Location
//16 = Description