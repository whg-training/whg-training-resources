---
sidebar_position: 6
---

# Standard command syntax

Most commands follow the same basic syntax as `ls`. Here's a more advanced `ls` command:

`% ls -lh ./`

This has three parts

* the command name (`ls`)
* some options (`-lh`), which change how the command behaves.
* and some positional arguments (`./`), which are what the command operates on.

The options here are actually `-l` and `-h`, but they can be combined together as `-lh`.

Some options have longer names starting with `--`, for example, `-h` is short for `--human-readable`.   (The longer names
can't be combined in the same way as the short ones can).

Finally the positional arguments, if there are more than one, are separated by spaces.

So we could have written the command above as

`% ls -l --human-readable ./`

:::tip Note

Remember you can read about what these options do by [viewing the man page](help.md).  
Can you figure out from the man page what this command `ls -lh ./` does?  (The `./` just denotes the current directory.)
Now try it and see.

:::

The general form of a command is therefore:
```
% <command name> [options] [positional options]
```

## Next steps

Congratulations!  You now know what a command looks like.  Next we'll see how to [make directories and move around the filesystem](05_tour.md).