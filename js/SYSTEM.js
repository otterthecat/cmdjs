var SYSTEM = (function(params) {

	// standard settings which can be configured by
	// setting the params argument
	var defaults = {
		target: 'cmd',
		display: 'display',
		input: 'cmd-form'
	}

	// system 'private' properties
	var system_form, system_display;

	// function to create required UI elements and bindings
	var init = function(){

		create_display();
		create_input();
		system_form.addEventListener('submit', bind_form_events ,false);
	};

	var create_display = function(){

		var display =  document.createElement('div');
		display.className = "cmd-display";

		var display_list = document.createElement('ul');
		display_list.className = "cmd-display-list";

		display.appendChild(display_list);

		system_display = display;
		document.getElementById(defaults.target).appendChild(display);
	};

	var create_input = function(){

		var input_form = document.createElement('form');
		input_form.className = "cmd-form";

		var input_field = document.createElement('input');
		input_field.type = "text";
		input_field.name = "cmd-input";

		var input_btn = document.createElement('button');
		input_btn.innerHTML ="Enter";

		input_form.appendChild(input_field);
		input_form.appendChild(input_btn);

		system_form = input_form
		document.getElementById(defaults.target).appendChild(input_form);
	};

	var bind_form_events = function(evt){

		evt.preventDefault();

		var input_value = system_form.getElementsByTagName('input')[0].value;
		system.exec(input_value.match(/[a-z0-9\-.?]+/g));

		system.updateHistory(input_value);
		system_form.reset();
	};

	// utility function
	var merge = function(orig, newObj){

		for(var item in newObj) {

			orig[item] = newObj[item];
		}

		return orig;
	};

	if(typeof params === 'object'){

		merge(defaults, params);
	};

	// updates the display UI
	var set_output = function(str){

		var display = document.getElementsByClassName('cmd-display')[0];
		var target_list = display.getElementsByTagName('ul')[0];
		var new_list_item = document.createElement('li');
		new_list_item.className = "sys-out";
		new_list_item.textContent = "$~ : " +str;
		target_list.appendChild(new_list_item);
	};

	// utility function
	var push_to_array = function(obj, target_array){

		if(typeof obj === 'object') {

			target_array.push(obj);
		}
	};

	// set up system display before
	// returning system object
	init();

	var system = {

		history: new Array(),

		commands: new Array(),

		updateHistory: function(item){

			this.history.push(item);
		},

		getHistory: function(index){

			return this.history[index];
		},

		ajax: function(path, callback){

			// not giving a **** about lesser IE versions for now
			// ... maybe ever...
			var ajx = new XMLHttpRequest();

			ajx.open('POST', path, true);
			ajx.send();

			ajx.onreadystatechange = function(){

				if(ajx.readyState === 4){

					callback(ajx.responseText);
				}
			}
		},

		import: function(path){

			return this.ajax(path);
		},

		set: function(obj) {

			push_to_array(obj, this.commands);
			return this;
		},

		exec: function(opt_array) {

			var sc = this.commands;

			set_output(opt_array.join(" "));

			for(var i = 0; i < sc.length; i += 1) {

				if(sc[i].name === opt_array[0]) {

					opt_array.shift();
					switch(opt_array[0]){

						case "-v":

							sc[i].version();
							break;

						case "-h":

							sc[i].help();
							break;

						default: 

							sc[i].isBound ? sc[i].method.call(system, opt_array, sc[i]) : sc[i].method(opt_array);
							break;
					}

					return;
				}
			}

			set_output("Command not found. try typing 'help' for list of commands");
		}
	}

	return system;
});