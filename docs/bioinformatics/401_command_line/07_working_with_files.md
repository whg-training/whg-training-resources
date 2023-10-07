---
sidebar_position: 8
---

# Working with files

If you got this far, you've had a first look at moving aronud the filesystem and manipulating files. But the files we
used were empty... how do you make files with useful data in?  And how do you see the contents? Here are three ways.

## Using an editor

The simplest way to edit a file is to use an editor, such as `nano`.    For example to edit
our greeting:

```
% nano greeting.txt
```

You can edit the file as desired (for example, maybe you want your real name in there instead of your username?)

When you want to quit, press `Ctrl-X` (control then X).  It should ask if you want to save changes - press 'y' and then `<enter>` to save them and quit.
(You can also just save, without quitting, by using `Ctrl-o` instead.)

If you want to see again what's in the file, the `cat` command will print it out:
```
% cat greeting.txt
```

(`cat` actually stands for 'concatenate' - it outputs the files you give it as arguments, one after the other.)

:::tip Note

Actually the best editor is probably outside your terminal. For example - in JupyterHub you can create and edit files
from the user interface (e.g. `File` -> `New` in the menu). Or on Windows or Mac OS you can use Notepad or TextEdit, or
better still download an editor like Visual Studio Code.

However in some situations, such as when working on a compute cluster, you won't be able to use these, and it's useful
to be able to edit directly in the terminal window, so editrs like `nano` are still useful.

:::

## Redirecting output to a file

Another way to put data in a file is to capture or 'redirect' the output of another command to the file.

For example we've already seen that the echo command can print out a message:

```
% echo "Hello there, $USER!"
Hello there, duncan!
```

If we wanted this output in a file instead - we can redirect it there using `>` :

```
% echo "Hello there, $USER!" > greeting2.txt
```

You will notice a couple of things here:

1. The command **no longer** prints the message to the screen - it's been redirected after all.
2. A new file `greeting2.txt` will appear in the directory.

Use `cat` again to satisfy yourself that the file really contains the message.

Ok, so what if we want a longer greeting? Let's try to add a second line:

```
% echo "This is the second line of our greeting" > greeting.txt
```

Did it work?

:::tip Question
Use `cat` to see what the contents of `greeting.txt` look like now.  Is it the correct greeting, on two lines?
:::

This illustrates an important fact about the `>` redirect operator.  It **overwrites the content** of whatever you
redirect into.  Like other commands, it doesn't ask for confirmation (or permission) - it just does it.

If you actually want to **append** data to the file, you can use `>>` instead of `>`:

```
% echo "Hello there, $USER!" > greeting.txt
% echo "This is the second line of our greeting" >> greeting.txt
```

Again - check this is now the right message.

## Dowloading some data

Finally another very useful way to get data - download it from somewhere else!
You can download from a url using the `wget` or `curl` commands.  Let's download a file to experiment with now:

```sh
wget https://www.well.ox.ac.uk/bioinformatics/training/MSc_GM_2022/CM4-2-command_line/data/sonnet.txt
```

or

```sh
curl -O https://www.well.ox.ac.uk/bioinformatics/training/MSc_GM_2022/CM4-2-command_line/data/sonnet.txt
```

:::tip Note

You can use the copy button in the above to copy the command and paste it into your terminal.  Note that `wget` doesn't
work on Mac OS X, but `curl` should work everywhere.

:::

## Viewing the contents of a file: `cat`, `less`, `head`, `tail`

Obviously you can view the content of a file with an editor like `nano`, but then you're losing
some of the advantages of being on the command line.

As we saw above, the simplest way to see the contents of a file is with `cat`, which just prints the contents of the
file to the screen and then returns you to the command prompt.

~~~~
% cat sonnet.txt 
~~~~

You should see some Shakespeare, right there in your command-line!

However, if the file you looked at was long, the start of it has probably disappeared off the top of the screen. If you
just want to see the start of the file, you can use `head` instead:

~~~~
% head -n 3 sonnet.txt 
~~~~

which prints:

    Shall I compare thee to a summer's day?
     Thou art more lovely and more temperate:
     Rough winds do shake the darling buds of May,

:::tip Note
Use `man head` to check what the `-n` option does.
:::

Similarly, you can see the last few lines of the file with `tail`.

~~~~
% tail -n 1 sonnet.txt 
~~~~

If the file you're interested in is still getting new stuff added to its end (by another process), you can use `tail -f`
to follow new content at the end of the file.

`% tail -f /var/log/dmesg`

You'll neet to type `ctrl-c` to stop tailing the file.

All of these commands just print out the contents to the screen.  If instead you want to be able to move around inside a
file you're looking at, a good choice would be to use `less`.

`% less sonnet.txt`

You can then move around with the cursor keys and PageUp and PageDown. Press `q` to return to the command line.

:::tip Note

Using `less` looks very similar to when you typed `man ls`, doesn't it? That's because `man` is using `less` to show you
the manual page. Lots of command line tools use other tools to do part of their work. Being able to combine things like
this is what makes the command line great.

:::

Why is it called `less`? It's an improved version of an earlier command called `more`, and less is more.
(So why was it called `more`?  I don't know.  Many of the command names are historical, and you just have to learn them.)

## Getting information about a file

Finally what if you don't want to view the file, but just get some information about it?

If you want a word or line count of a file, `wc` will tell you the number of lines, words and characters:

`% wc sonnet.txt`

Often we want to know just the number of lines:

`% wc -l sonnet.txt`

If you want to know the size of a file, or when it was created/edited, or who owns it, `ls` will tell you:
```
% ls -lh sonnet.txt
```

(so it's 654 bytes large).

## Next steps

Next, learn about [pipelining commands](08_pipelines.md).
