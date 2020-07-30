const titles = [
	'Mr.',
	'Mrs.',
	'Miss.',
	'Ms.',
	'Sir',
	'Dame',
	'Lord',
	'Lady',
	'Baron',
	'Baroness',
	'Count',
	'Countess',
	'King',
	'Queen',
	'Emperor',
	'Empress',
	'Rev.',
	'Dr.',
	'St.',
	'Chief',
];

const surnameSuffixes = [
	'BERG',
	'HILL',
	'WARD',
	'WOOD',
	'Y',
	'SON',
	'S',
	'O',
	'I',
	'A',
	'HAM',
	'ER',
	'ERS',
	'LER',
	'NER',
	'SOV',
	'NOV',
	'LOV',
	'SKI',
	'VIC',
	'OVA',
	'OV',
	'SEN',
	'GAARD',
	'NEN',
	'HOLM',
	'TINEZ',
	'MANN',
	'AZ',
	'EZ',
	'SKAS',
	'EIRA',
	'TON',
	'ALD',
];

const surnamePrefixes = [
	'MC\'',
	'MAC',
	'VON ',
	'VAN ',
	'DE ',
	'O\'',
	'VAN DER ',
];

const vowels = [
	'A',
	'E',
	'I',
	'O',
	'U',
	'Y',
	'OU',
	'EE',
	'AI',
	'AE',
	'OO',
	'IE',
	'EI',
	'AU',
	'IE'
];

const consonants = [
	'B',
	'C',
	'D',
	'F',
	'G',
	'H',
	'J',
	'K',
	'L',
	'M',
	'N',
	'P',
	'QU',
	'R',
	'S',
	'T',
	'V',
	'W',
	'Y',
	'Z',
	'SH',
	'TH',
	'CH',
	'PH',
	'SON',
	'ING',
	'GR',
	'CR',
	'SW',
	'BR',
	'DR',
	'FL',
	'SC'
];

const randConsonant = () => consonants[getRandomInt(0, consonants.length -1)];
const randVowel = () => vowels[getRandomInt(0, vowels.length-1)];
const randSuffix = () => surnameSuffixes[getRandomInt(0, surnameSuffixes.length-1)];
const randPrefix = () => surnamePrefixes[getRandomInt(0, surnamePrefixes.length-1)];
const randTitle = () => titles[getRandomInt(0, titles.length-1)];

function nameSegment(maxLength){
	let name = randConsonant();
	for(let i = 0; i < getRandomInt(1, maxLength); i++){
		name += randVowel() + randConsonant();
	}
	name = name[0] + name.toLowerCase().substring(1);
	return name;
}

function firstName(maxLength, allowTitles){
	let name = '';
	
	name += randConsonant();
	for(let i = 0; i < getRandomInt(1, maxLength); i++){
		name += randVowel() + randConsonant();
	}
	name = name[0] + name.toLowerCase().substring(1);
	
	if(allowTitles && Math.random() < 0.4)
		name = randTitle() + ' ' + name;
	
	return name;
}

function surname(allowHyphen, allowPrefix){
	let name = nameSegment(3);
	
	if(Math.random() < 0.8){
		name += randSuffix();
	}
	if(allowPrefix && Math.random() < 0.3){
		name = randPrefix() + name;
	}
	
	name = name.toUpperCase();
	name = name[0] + name.toLowerCase().substring(1);
	
	if(allowHyphen && Math.random() < 0.15){
		name += '-' + surname(false, false);
	}

	return name;
}

function name(allowTitles){
	return firstName(3, allowTitles) + ' ' + surname(true, true);
}

function printNames(numToPrint, append){
	const nameList = document.getElementById('nameList');
	const showSurnames = document.getElementById('showSurnamesInput').checked;
	const showTitles = document.getElementById('showTitlesInput').checked;
	if(!append){
		nameList.innerHTML = '';
	}
	const list = document.createElement('ul');
	for(let i = 0; i < numToPrint; i++){
		const item = document.createElement('li');
		if(showSurnames)
			item.innerText = name(showTitles);
		else
			item.innerText = firstName(5);
		list.appendChild(item);
	}
	nameList.appendChild(list);
	const moreBtn = document.createElement('button');
	moreBtn.innerText = '10 more...';
	moreBtn.addEventListener('click', () => {
		printNames(15, true);
		moreBtn.parentElement.removeChild(moreBtn);
	});
	nameList.appendChild(moreBtn);
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('genBtn').addEventListener('click', () => {
		printNames(parseInt(document.getElementById('numNamesInput').value), false);
	});
});