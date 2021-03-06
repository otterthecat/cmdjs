// define new system
var new_system = SYSTEM();

// add CMD modules to system
new_system.set(new CMD({
	name: 'man',
	version: '0.1',
	description: 'get instructions for chosen module',
	isSysBound: true,
	method: function(opt, man){

		if(!opt[0]){

			man.update("'man' requires argument of module name e.g 'man date'");
			return;
		} else if(!this.getCommand(opt[0])){

			man.update("'man' requries argument to the name of an existing module");
			man.update("try typing 'help' for list of available modules");

			return;
		}

		var man_path = 'man/' + opt[0] + '.txt';

		this.ajax(man_path, function(txt){

			man.update(txt);
		});	
	}
}));

new_system.set(new CMD({
	name: 'help',
	version: '0.1',
	description: 'get system info',
	isSysBound: true,
	method: function(opt, help){

		help.update("Available Commands:");
		for(item in this.commands){

			help.update(item);
		};
	}
}));

new_system.set(new CMD({
	name: 'date',
	version: '0.1',
	description: 'get date from client machine',
	method: function(opt){

		var date = new Date();
		this.update(date.toLocaleDateString());
	}
}));