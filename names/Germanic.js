const germanicData = JSON.parse(`{
	"title": "Germanic",
	"combinationBitflags":[
		3,6,7,9,14,15,17,22
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
	]
}
`);

const germanicElement = (elName) => germanicData[elName][getRandomInt(0, germanicData[elName].length -1)];

function germanicFirstname(gender){
	let name = '';
	if(gender === 'M')
		name += germanicElement('prefixesM');
	for(i = 0; i < getRandomInt(0,2); i++){
		
		name += germanicElement('consonantSounds');
		name += germanicElement('vowelSounds');
	}
	if(gender === 'M')
		name += germanicElement('suffixesM');
	return name;
}

function germanicSurname(){
	
}

function germanicTitle(){
	
}

function germanicLocation(){
	
}

function germanicDescription(){
	
}

function germanicName(){
	
}

//1  = Firstname
//2  = Surname
//4  = Title
//8  = Location
//16 = Description