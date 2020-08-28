function handleSITUsername(){
	function reformatUsername(original){
		var formatted = original || '';
		if(formatted.length > 8 && formatted.substring(0, 8).toUpperCase() === 'SITNET//')
			formatted = formatted.substring(8);
		var atIndex = formatted.indexOf('@');
		if(atIndex !== -1)
			formatted = formatted.substring(0, atIndex);
		return formatted;
	}
	
}
window.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('#mainContent form');
	if(form){
		form.addEventListener('submit', function (){
			var userNameInput = document.querySelector('#mainContent input[name="user"][type="text"]');
			userNameInput.value = reformatUsername(userNameInput.value);
		});
	}
});