var CMD = (function(opt){

	// dev configurable settings
	var settings = {
		name: 'default',
		isBound: false,
		version: '0.0',
		method: function(){}
	};


	// utility function
	var merge = function(orig, newObj){

		for(var item in newObj) {

			orig[item] = newObj[item];
		}

		return orig;
	};

	var getVersion = function(){

		do_update("Module: " + this.name);
		do_update("Version: " + this.version_num);
		do_update("Description: " + this.description);
	};

	var do_help = function(){

		do_update("Description: " + this.description);
	};

	var do_error = function(){

		do_upate("Do you even know what you're doing?");
	};

	var do_update = function(str){

		var display = document.getElementsByClassName('cmd-display')[0];

		var target_list = display.getElementsByTagName('ul')[0];

		var new_list_item = document.createElement('li');
		new_list_item.className = "sys-in";
		new_list_item.textContent = str;

		target_list.appendChild(new_list_item);

		// advance display window as needed to show
		// most recent input & response
		display.scrollTop = display.scrollHeight;
	};

	// apply user configs
	settings = merge(settings, opt);

	return {

		name: settings.name,
		version_num: settings.version,
		description: settings.description || "No description available",
		isBound: settings.isBound,
		method: settings.method,
		version: getVersion,
		error: do_error,
		update: do_update,
		help: do_help
	}
});