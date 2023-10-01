---
sidebar_position: 4
---

# Command line basics

## The command prompt

If you've reached here, you should have a terminal window open, and it will be showing you a prompt:

```
<prompt> %
```

This is what the command line shows when it is ready to receive input.

## Running some simple commands

The basic idea is that once you type a command and press Enter, the command line will execute it, display any output,
and when it is finished it will show you the prompt again. 

When you first open a terminal, you might want to find out a bit about where you are.

You can find out what your username is with `whoami`:

```
% whoami
```

Type this and press enter - it should print your username, something like:

    duncan

:::tip Note

Remember that we are using `%` to denote the command prompt - you don't tyope that bit, just the command and press `enter`.

:::

Find the hostname of the computer you're using with `hostname`

~~~~
% hostname
~~~~

    duncans-laptop

the directory you're currently in with `pwd` (print working directory)

~~~~
% pwd
~~~~

    /home/duncan

what files are there in the directory you're in

~~~~
% ls
~~~~

You should see a list of files.  (We'll come back to directories and files later on.)

There's probably nothing much there at the moment! Let's make a few files so we have a more realistic home directory:

```
% touch bash_intro1.md  bash_intro_2012.md  bash_intro2.md  bash_introduction.doc  bash_intro.md  bash_intro.md.old .very_secret
```

The `touch` command should have created empty files for any which did not previously exist for us:

~~~~
% ls
~~~~

which will look something like:

    bash_intro1.md      bash_intro2.md         bash_intro.md
    bash_intro_2012.md  bash_introduction.doc  bash_intro.md.old

plus the other stuff that was there before.

Or, to try something different, what about getting the shell to print a message?  For example, try the command:

`% echo "Look at me"`

The `echo` command simply echoes input text back as output, so this should just print "Look at me".

Finally, you can find out you've been up to recently with `history`:

```
% history
```

     1 whoami
     2 hostname
     3 pwd
     4 ls
     5 touch bash_intro1.md  bash_intro_2012.md  bash_intro2.md  bash_introduction.doc  bash_intro.md  bash_intro.md.old .very_secret
     6 ls
     7 echo
	 8 history


:::caution Note

This is a good time to point out that the command line is **case sensitive** - that is, capitalisation matters.  For
example if you accidentally type:

`$ History

... it won't work and you will see an error message, something like:

    Command 'History' not found.

The terminal couldn't find any command called 'History' (even though one called 'history', in lower-case, exists.)

:::

BASH has hundreds of commands, but don’t panic! In most cases, you’ll only use a handful of them in your day-to-day work.

## What is a command anyway?

What's actually happening when you run a command?  Well, most 'commands' are really just programs - they are files which
live on the filesystem somewhere.  A few are instead built-in to the terminal shell itself.  To find out, you can try
using the `which` command:

`% which ls`

You should see that `ls` lives in the `/bin` folder. (We'll return to the question of how the terminal knows to look in
that folder later on in the tutorial.)

:::tip Question
Where does `whoami` live?  What about `echo`?
:::

If you want to see what other programs exist - you could trying using `ls` to see the contents of those folders:

```
% ls /bin     
                csh             echo            ksh             mkdir           rm              sync            zsh
bash            dash            ed              launchctl       mv              rmdir           tcsh
cat             date            expr            link            pax             sh              test
chmod           dd              hostname        ln              ps              sleep           unlink
cp              df              kill            ls              pwd             stty            wait4path
```

There are lots of other commands available in that one folder alone!  

However before you go off to experiment with these commands - **take care**!  Some of these commands, like `rm` and
`rmdir` can delete files, while others like `kill` can stop essential processes that are running on your system. These
commands can mess up your system.  Even worse, once a file is deleted, there's no getting it back - there's no 'bin'
or 'trashcan' to recover it from.

:::caution Note

This illustrates a feature of the command line - it does what you tell it, and assumes you know what you are doing.

:::

Others like `hostname` and `pwd` (which tells you the current directory) are perfectly safe.  

## A table of useful commands

For this tutorial we will instead focus on a few common and useful commands. We've put a table of these in [in an
appendix](appendices/table_of_commands.md) but here are a few to get you started:

| Command | What it does | Examples |
| --- | --- | ------- |
| `hostname` | What computer am I on? | `hostname` |
| `pwd` | What directory am I in? | `pwd` |
| `ls` | List files in a directory, or a file or files you specify. | `ls` (current directory) or `ls /bin` |
| `cp` | **Copy** a file in a new location. | `cp my_file.txt my_file2.txt` |
| `mv` | **Move** a file to a new location (removing the original). | `mv my_file2.txt my_file3.txt` |
| `grep` | **Searches** for a snippet of text in a file, showing matching lines. | `grep 'second' my_file.txt` |
| `mkdir` | Create a new directory. | `mkdir new_directory` |
| `rmdir` | Removes an entire directory. (Fails if the directory is not empty.) | `rmdir new_directory` |
| `rm` | Removes a file **without asking for confirmation**. | `rm my_file3.txt` |
| `cat` | Show the contents of a text file. | `cat my_file.txt` |
| `head` | Show the first few lines of a file. | `head my_file.txt` |
| `tail` | Show the last few lines of a file. | `tail my_file.txt` |
| `wc` | Counts the lines, words and letters in a file. | `wc my_file.txt` |

:::tip Question
Where do all these commands live on the filesystem?  Use `which` to find out.
:::

In the next few pages we will walk you through the use of many of these commands.  First, let's learn how to [get help
on these commands](03_help.md).


