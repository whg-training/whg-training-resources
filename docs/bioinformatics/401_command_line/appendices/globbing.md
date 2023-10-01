---
sidebar_position: 2
---

# Wildcards and 'globbing'

Globs are wildcard patterns that let the command-line match multiple files at once.

## Using `*`

The most useful wildcard is `*`, which means 'match anything'.  For example this command:

```
% ls *.txt
```

will list all files ending in '.txt' in the current directory.

A glob can have multiple '*' characters in it - e.g. to get a list of files that have 'file' in the name and end in '.txt':

```
% ls *file*.txt
```

This feature can be combined with any command that uses a file, and is quite powerful.  

To illustrate this, here is a command sequence that creates a new temporary folder, copies all text files into it,
removes `listing.txt`, concatenates all the others into one big text file, and then removes the temporary files:

```
% mkdir tmp_folder
% cp *.txt tmp_folder/
% rm tmp_folder/listing.txt
% cat tmp_folder/*.txt > concatenated.txt
% rm tmp_folder/*.txt
% rmdir tmp_folder
```

:::tip Note
Depending on your shell, you might find that pressing `<tab>` before `<enter>` has the effect of **expanding** the wildcard, right there on your terminal.
This is what is happening under the hood: `*.txt` is shorthand for typing out all the files that would match `*.txt`, one by one, on the command line.
:::

Apart from `*`, which is the most useful glob special character, there are a few others as well.  But '*' is the most useful.

## How globbing is processed

Importantly you should realise that the shell processes globbing (and any other filename expansions) *before* it passes
the arguments to the command.  Suppose your folder looks like this:
```
file1.txt
file2.txt
image.jpg
```

and you type:
```
% ls *
```

Then, as far as `ls` is concerned, this is equivalent to typing:
```
ls file1.txt file2.txt image.jpg
```

That is - the `ls` command does not know you are using a glob, because the shell expands it beforehand.

## Avoiding globbing

What if you don't want a glob, but want the command to see the argument you typed instead?
The answer is to wrap the argument in **single quotes**:
```
% ls '*'
ls: *: No such file or directory
```

Here `ls` has correctly told me that I don't have a file called `*` in my directory.

Single quotes `'<something>'` and double quotes `"<something>"` behave differently in this regard - compare to:
```
% ls "*"
```

If you want the shell not to expand what's in the quotes, use single quotes.

:::tip Question

Another way to see what's going on is to use `echo` (which you'll recall just prints out its arguments).  Try these
three commands:

```
% echo *
% echo "*"
% echo '*'
```
Make sure you understand the results!
:::