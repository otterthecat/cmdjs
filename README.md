CMDJS
=====

Emmulates command line behaviour to fire off javascript modules.

Caveats
-------
Still very much a work in progress - currently it's functional "as is",
but it simply doesn't do a hell of a lot yet.


Usage
-----

Should work pretty much out of the box - note that requested man pages should be a .txt file in the 'man'
directory, as they're pulled in when requested via ajax.

One can create their own functionality by adding custom CMD module to the SYSTEM object 
(see sample.js for general usage).

Recent update allows to cycle through history of executed commands by using the up/down arrow keys when
the input field has focus.
