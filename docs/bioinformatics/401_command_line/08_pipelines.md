---
sidebar_position: 10
---

# I/O redirection and pipelining

In programming there are three standard 'streams' of communication

* standard input (stdin)
* standard output (stdout)
* standard error (stderr)

Stdin is what goes into a command, stdout is what comes out of it, and stderr is somewhere for the command to write messages about how things are going (such as error messages).

One of the most powerful features of the shell is the ability to 'redirect' output, and to 'pipe' this output into other commands.
This allows you to built up pipelines of operations that do sophisticated things.

## Redirecting standard Output

By default, stdout from a command is sent to the terminal, and that's what you're seeing when you type `ls`, etc.

However, sometimes you might need instead to
have this output written to a file.

If you follow a command with `>` and the name of a file, then stdout will go there instead, so

`% ls > myfiles.txt`

will send no output to the terminal, but instead creates a file `myfiles.txt`.  We say that the output has been "redirected" to the file.ß

:::warning Warning

Be **CAREFUL**.  Like most operations that write to files, this command will **overwrite** the file if it exists already
- so you could lose data.  As usual you have to make sure you know what you are doing first.  (If in doubt, check with
`ls`.)

:::

We used this form already to [create simple files](working_with_files.md#redirecting-output-to-a-file).

If you use `>>` instead of `>`, then the output will be appended to the file rather than overwriting it

## Pipelines and standard Input

Many commands can also accept input from stdin. A good example is `wc`: if it's not given a filename, `wc` will work on
stdin instead.

The best way to get input in to stdin is to **pipe** it in, using the `|` character.  For example, if you read [the
section on working with files](working_with_files.md) you know that the
`cat` command will print out the contents of a file:

```
# cat myfiles.txt
```

On the other hand the `wc -l` counts the number of lines in its input.  To count the number of lines in the file, we
just have to connect one to the other:

```
% cat myfiles.txt | wc -l
```

we say the output of `cat` has been "piped" into the input of `wc`.

:::tip Note
It's also possible to redirect a file into the input of `wc -l` directly - like this:
```
% wc -l < myfiles.txt
```

However, I find this more confusing because I prefer thinking of the data as flowing from left to right along the
pipeline, so I don't generally use this.

:::

Although this particular command could be done more simply just by writein `wc -l myfiles.txt`, the pipelining here is
much more flexible and more powerful.  For example, suppose we wanted to count the number of words in the first
row of the sonnet we were reading.  We could combine commands from the [working with files](working_with_files.md) page:
```
% cat sonnet.txt | head -n 1 | wc -w
```

:::tip Note
Remember that you can get help on a command like `wc` by viewing its man page - `man wc`.
Press `q` to quit the man page.
:::

For example here are some quick recipes.

The number of lines and words in `sonnet.txt`:
```
% cat sonnet.txt | wc -l
% cat sonnet.txt | wc -w
```

The number of words in the first and last line:
```
% cat sonnet.txt | head -n 1 | wc -w
% cat sonnet.txt | tail -n 1 | wc -w
```

...or the number of lines that contain the word 'fair' (using `grep`, which we shall [cpver on the next page](basics.md)).
```
% cat sonnet.txt | grep 'fair' | wc -l
```

## Combining pipelines with redirection

Of course you can also combine pipelines with redirection.
For let's conut the number of text files again and store it in a new file:

```
% ls '*.txt' | wc -l > number_of_text_files.txt
```

(You can use `ls` and `cat` to check it got the answer right.)

There is one other useful way to get the output into a file - the `tee` command.  This takes input on stdin,
echoes it to stdout, but also sends a copy to a file as well.  (You can imagine a letter T with standard input coming
from the left, standard output going to the right, and a copy being dropped in a file at the bottom.)

So let's list all the text files into text_files.txt, but also count them:

~~~~
% ls '*.txt' | tee text_files.txt | wc -l
~~~~

:::tip Recap

Pipelining works because many programs **read from stdin** and **write to stdout**. Typically they work one line at a
time. Therefore you can build up pipelines made up of commands that each process the stream of lines in one way, passing
on the results to the next command in the pipeline.  At the end, you can redirect the output into a file.

:::

## Next steps

Finally we will learn about a set of commands that can perform complex [filtering operations](09_filtering_files.md) on
files.
