---
sidebar_position: 0
---

# The emergency exit

If you get stuck - for example if you don't seem to see a command prompt, or can't seem to run a
command - you can try pressing the emergency exit key combination `ctrl-c`.  (I.e. `<control>`
together with `c`.)  This should do the following things:

* If there's a command running it should quit it and return to the prompt.
* If you're stuck 'in the middle of a command, this should cancel it and return to the shell.

This can happen for example, if you mismatch quotes.  For example imagine you are trying to use
`echo` to print a message, but accidentally forget to put a closing quote matching an opening one:

```
% echo 'This is a message
```

You will probably note see another prompt, but instead will see something like
```
quote>
```
or just
```
>
```

This means that the command-line is waiting for you to finish the command.  Pressing `ctrl-c` will
cancel this and get you back to the prompt.

:::tip Note

Altenatively, you can finish the command by closing the quote (here `'`).  It will print out the
message and lots of newlines!

:::
