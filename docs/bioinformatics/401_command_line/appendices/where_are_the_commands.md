---
sidebar_position: 5
---

# Where is a command?

A 'command' is usually just a program on the filesystem somewhere.  A few commands, however are built-in to the command
line.

## Finding commands

To find out where a program is, you can use the `which` command.

For example, let's find out where `ls` is:
```
% which ls
/bin/ls
```

This tells us that `ls` is a program in `/bin`.  So typing `ls` is just the same as typing `/bin/ls`.

:::tip Question

Where do some other programs, like `echo`, `cp`, or `hostname`, live?  Are they all in `/bin`?

:::

## Knowing where to look


So how does the command line know which directories to look in?  The answer is the `$PATH` environment variable.
To see what's in this variable right now, you can use `echo` to print it:
```
% echo $PATH
```

(Remember that `echo` just prints out its arguments to stdout.)

:::tip Note

As you can see, the directories in `$PATH` are separated by colons.  Can you use `tr` in a pipeline with `echo` as
above, to print them out seperated by newlines instead?

**Hint**: '\n' is the way
to write a newline character so `tr` can understand it (but make sure and put the `'\n'` in single quotes).

:::

You will probably see that the command line is looking in multiple directories for programs to run - it simply starts at
the top and works down the list until it finds a program with the given name.  If it can't find one, it prints a 'command not found' error instead.

So if you want to break your terminal, try resetting `$PATH`:

```
% PATH=""
% ls
command not found: ls
```

Uh-oh!  You'll have to start a new terminal now, or re-set `$PATH` to the right values, to get it back.

