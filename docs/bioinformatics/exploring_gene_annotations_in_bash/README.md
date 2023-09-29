---
sidebar_position: 1
---

# Exploring gene annotations on the command-line

**Author**: Gavin Band

Welcome! In this tutorial we will show how to use the UNIX command line to explore the human gene annotations.
This tutorial has two main objectives:

* To demonstrate some useful ways of working in the UNIX command line;
* And to get you to start understanding gene annotation data - that is, the core data
  files which represent our knowledge of human genes.
  
The information in these files includes such things as where genes are in the genome, how they are transcribed,
which bits gets turned into proteins and so on.  They are pretty important files!

This is not a full tutorial on command-line processing, but here is a table of some of the UNIX commands we'll
use. If you're not familiar with these, don't worry: there are a lot of commands and it takes a while to learn
them. Try the example commands now in your terminal:

| Command  | What it does                                         | Example                                  |
| -------- | --------------------------------------               | ----------------------                   |
| `ls`       | Lists files in a directory                           | `ls`                                   |
| `mkdir`    | Make a new directory                                 | `mkdir genes_tutorial`                 |
| `cd`       | Changes the current directory                        | `cd genes_tutorial`                    |
| `echo`     | Print some text (that cna be redirected to a file.)  | `echo "Hello all\ngenes" > file.txt`   |
| `cat`      | Print the output of one or more files.               | `cat file.txt`                         |
| `less`     | Interactively explore a file (press `q` to quit)     | `less file.txt`                        |
| `cut`      | Extract specific columns from a file                 | `cut -d' ' -f1 file.txt`.              |
| `grep`     | Search for a string (or *regulare expression*        | `grep "Hello" file.txt`                |
| `awk`      | General-purpose tool                                 | `awk '$1 == "Hello" file.txt`          |
| `sort`     | Sort rows alphabetically                             | `sort file.txt`                        |
| `uniq`     | Gather and count unique values                       | `uniq -c file.txt`                     |
| `gzip`/`gunzip`  | General-purpose compression/decompression.     | `gzip file.txt`                        |

Here are some tips that will make life easier:

:::tip Tips and tricks

* The command line will *auto-complete* filenames for you if you press the `tab` key - this saves a lot of typing.
* Press the up arrow to go back in your command history - you can then edit/rerun the same command.
* In filenames, `./` indicates the current directory, while `../` indicates the parent directory (i.e. one higher up.)
so for example `cd ../` takes you one level higher.

`ls` is particularly useful for looking around - for example

* `ls` on its own prints a simple listing.
* `ls -a` will also include *hidden files* - these are filenames starting with a `.` that are usually excluded.
* `ls -l` will print a long listing - dates, file owners, file sizes, etc. (A command I use a lot is `ls -lht` which lists files ordered by
  modification time with human-readable file sizes.)
:::

When you're ready, move on to [download the tutorial data](getting_started.md).

