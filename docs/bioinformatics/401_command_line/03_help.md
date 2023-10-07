---
sidebar_position: 5
---

# Getting help!

## Reading the man pages

If you’re unsure about what a command does, or its specific syntax, you can type `man` followed by the command. For example,

```
man ls
```

produces the following output:

    LS(1)                            User Commands                           LS(1)
    
    NAME
           ls - list directory contents
    
    SYNOPSIS
           ls [OPTION]... [FILE]...
    
    DESCRIPTION
           List  information  about  the FILEs (the current directory by default).
           Sort entries alphabetically if none of -cftuvSUX nor --sort  is  speci‐
           fied.
    
           Mandatory  arguments  to  long  options are mandatory for short options
           too.
    
           -a, --all
                  do not ignore entries starting with .
    
           -A, --almost-all
                  do not list implied . and ..
    
           --author
     Manual page ls(1) line 1 (press h for help or q to quit)

Use the arrows on your keyboard to scroll up and down the manual; then press `q` to exit when you’re done reading.

Note that options, like commands, are **case-sensitive** - so `-a` and `-A` are different options!

:::tip Top tip
A  useful thing to do in a man page is search - you can do this by pressing `/` and then typing the string you want to search for.
The `n` key then cycles through the search results.

For example if you want to know what the `-l` option does, you could type `/-l<enter>` and then keep pressing `n` until you find the description
of the (lower case) `-l` option.

:::

## Seeing the in-built help for commands

Alternatively, you can often get help by typing the command name followed by `--help` (or sometimes just
`-h`), to see how it's used. For example to see how `ls` can be used:

```
ls --help
```

(This works on some systems and not others.)

## Help!  I'm stuck!

If at any point you seem to be 'stuck', don't panic!  Here are a few things to try:

* If you are inside a man page as described above (or using `less`) - press `q` to quit back to the command prompry.
* Otherwise, the key combination `ctrl-c` (`<control>` and `c` keys pressed together) will probably
help.  They will cancel any current command and get you back to the prompt.  See [this
page](appendices/emergency_brake.md) for more information.

:::


## Next steps

Next, go and read about the [standard command syntax](04_standard_syntax.md).
