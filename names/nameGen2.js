function getOptions(){
	const firstLast = document.getElementById('firstLastNameSelect').value;
	const options = {
		firstname: firstLast === 'first' || firstLast === 'both',
		surname: firstLast === 'last' || firstLast === 'both',
		gender: document.getElementById('genderSelect').value,
		germanic: {
			titles: document.getElementById('germanicTitleCheck').checked,
			descriptions: document.getElementById('germanicDescriptionCheck').checked
		}
	};
	return options;
}

function printNames(numToPrint, append){
	const nameList = document.getElementById('nameList');
	const warnings = document.getElementById('warnings');
	warnings.innerHTML = '';
	let nameFunc;
	const allNameFuncs = [latinName, germanicName, maoriName, spanishName];
	const culture = document.getElementById('cultureSelect').value;
	switch(culture){
		case 'latin':
			nameFunc = latinName;
			break;
		case 'spanish':
			nameFunc = spanishName;
			break;
		case 'germanic':
			nameFunc = germanicName;
			break;
		case 'maori':
			nameFunc = maoriName;
			warnings.innerText = 'Notice: No distinction between Maori M and F names';
			break;
		case 'chinese':
			warnings.innerText = 'Warning: Not implemented';
			nameFunc = chineseName;
			break;
		case 'any':
			nameFunc = (options) => {
				return allNameFuncs[getRandomInt(0, allNameFuncs.length-1)](options);
			};
			break;
		default:
			nameFunc = (x) => console.log('Unknown culture');
	}
	if(!append){
		nameList.innerHTML = '';
	}
	
	const table = document.createElement('table');
	
	const headerRow = document.createElement('tr');
	const headings = ['Name','Culture','Gender'];
	for(let i = 0; i < headings.length; i++){
		const h = document.createElement('th');
		h.innerText = headings[i];
		headerRow.appendChild(h);
	}
	table.appendChild(headerRow);
	const options = getOptions();
	for(let i = 0; i < numToPrint; i++){
		const row = document.createElement('tr');
		const item = document.createElement('td');	
		const gen = nameFunc(options);
		item.innerHTML = gen.value;
		row.setAttribute('class', 'gender' + gen.gender);
		row.appendChild(item);
		
		const cultureItem = document.createElement('td');
		cultureItem.innerText = gen.culture;
		row.appendChild(cultureItem);

		const genderItem = document.createElement('td');
		genderItem.innerText = gen.gender;
		row.appendChild(genderItem);

		table.appendChild(row);
	}
	nameList.appendChild(table);
	const moreBtn = document.createElement('button');
	moreBtn.innerText = '10 more...';
	moreBtn.addEventListener('click', () => {
		printNames(15, true);
		moreBtn.parentElement.removeChild(moreBtn);
	});
	nameList.appendChild(moreBtn);
}

function optionTabs(){
	const culture = document.getElementById('cultureSelect').value;
	const tabs = document.querySelectorAll('#tabs .optionsArea');
	for(let i = 0; i < tabs.length; i++){
		if(tabs[i].id === culture + 'Options')
			tabs[i].style.display = 'block';
		else
			tabs[i].style.display = null;
	}
}

window.addEventListener('DOMContentLoaded', () => {
	optionTabs();
	document.getElementById('cultureSelect').addEventListener('change', optionTabs);
	document.getElementById('genBtn').addEventListener('click',() => {
		const numToPrint = parseInt(document.getElementById('numNamesInput').value);
		printNames(numToPrint, false);
	});
});