var SYSTEM = (function(params) {

	// standard settings which can be configured by
	// setting the params argument
	var defaults = {
		target: 'cmd',
		display: 'display',
		input: 'cmd-form'
	}

	// system 'private' properties
	var system_form, system_display, system_input,
		history_list = new Array(), history_pointer = 0;

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
		input_field.autocomplete = "off";
		input_field.placeholder = "enter a command..."

		system_input = input_field;
		input_field.addEventListener('keydown', enter_history, false);
		input_field.addEventListener('focus', function(){
				
				input_field.removeAttribute('placeholder')
			}, false);

		input_form.appendChild(input_field);

		system_form = input_form
		document.getElementById(defaults.target).appendChild(input_form);
	};

	var bind_form_events = function(evt){

		evt.preventDefault();

		var input_value = system_form.getElementsByTagName('input')[0].value;
		system.exec(input_value.match(/[a-z0-9\-.?]+/g));

		update_history(input_value);
		system_form.reset();
	};

	var update_history = function(item){

		if(typeof item === 'string'){
		
			history_list.push(item);

			history_pointer = (history_list.length - 1);
		}
	};

	var enter_history = function(evt){ // 38 = up arrow 40 = down arrow

		if(evt.keyCode === 38){

			system_input.value = history_list[history_pointer];
			history_pointer = history_pointer <= 0 ? 0 : history_pointer - 1;
		} else if (evt.keyCode === 40) {

			system_input.value = history_list[history_pointer];
			history_pointer = history_pointer >= (history_list.length -1) ? history_list.length - 1 : history_pointer + 1;
		}
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

		// advance display window as needed to show
		// most recent input & response
		display.scrollTop = display.scrollHeight;
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

		commands: {},

		getCommand: function(namespace){

			return typeof this.commands[namespace] === 'object' ? this.commands[namespace] : false;
		},

		getHistory: function(index){

			if(index === undefined){
			
				return history_list;
			} else {

				return history_list[index];
			}	
		},

		ajax: function(path, callback){

			// TODO make this far more usable/robust rather than base functionality
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

			//push_to_array(obj, this.commands);
			this.commands[obj.name] = obj;
			return this;
		},

		exec: function(opt_array) {

			set_output(opt_array.join(" "));

			if(typeof this.commands[opt_array[0]] === 'object'){

				var c = this.commands[opt_array[0]];

				opt_array.shift();

				switch(opt_array[0]){

					case "-v":

						c.version();
						break;

					case "-h":

						c.help();
						break;

					default: 

						c.isSysBound ? c.method.call(system, opt_array, c)
									 : c.method(opt_array);
						break;
				}

				return
			};

			set_output("Command not found. try typing 'help' for list of commands");
		}
	}

	return system;
});