---
sidebar_position: 2
---

# Wildcards and 'globbing'

Globs are wildcard patterns that let the command-line match multiple files at once.
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
