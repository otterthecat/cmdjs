// define new system
var new_system = SYSTEM();

// add CMD modules to system
new_system.set(new CMD({
	name: 'man',
	version: '0.1',
	description: 'get instructions for chosen module',
	isBound: true,
	method: function(opt, man){

		var system = this;
		var c = system.commands;
		for(var i = 0; i < c.length; i += 1){

			if(c[i].name === opt[0]){

				var man_path = 'man/' + c[i].name + '.txt';

				system.ajax(man_path, function(txt){

					man.update(txt);
				});
				break;
			}
		}
	}
}));

new_system.set(new CMD({
	name: 'help',
	version: '0.1',
	description: 'get system info',
	method: function(opt){

		var sc = new_system.commands;
		this.update("Available Commands:");
		for(var i = 0; i < sc.length; i+=1){

			this.update(sc[i].name);
		}
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