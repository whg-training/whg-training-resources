---
sidebar_position: 10
---

# Filtering files: sort, uniq, cut, tr

Pipelines are great, but you need some commands to put in them. Luckily bash contains lots of commands which can take
standard input, transform it, and then send the result to standard output.

Let's imagine we have the following file

~~~~
% cat beatles.tsv 
John	vocals,guitars,keyboards,harmonica,bass
Paul	vocals,bass,guitars,keyboards,drums
George	guitars,vocals,sitar,keyboards,bass
Ringo	drums,percussion,vocals
~~~~

You can get a copy of this file for yourself by running one of these commands:

```sh
wget https://www.well.ox.ac.uk/bioinformatics/training/MSc_GM_2022/CM4-2-command_line/data/beatles.tsv
```

or 
```sh
curl -O https://www.well.ox.ac.uk/bioinformatics/training/MSc_GM_2022/CM4-2-command_line/data/beatles.tsv
```

## Sorting files

`sort` sorts its input alphabetically, numerically, or even randomly.

To try it, let's sort the Beatles based on their first names (from column 1):

~~~~
% cat beatles.tsv | sort -k 1
George	guitars,vocals,sitar,keyboards,bass
John	vocals,guitars,keyboards,harmonica,bass
Paul	vocals,bass,guitars,keyboards,drums
Ringo	drums,percussion,vocals
~~~~

::tip Note
Like other commands here, you can also use a file as input to `sort`, as in 
```
% sort -k 1 beatles.tsv
```

But we are going to keep using the pipeline syntax because it is flexible.
:::


## Cutting columns from files

`cut` lets you pick out particular columns of the input to keep.

For example if we only want to take the names above, then we could use cut to pick out just the first column:

~~~~
% cat beatles.tsv | cut -f 1
John
Paul
George
Ringo
~~~~

By default, cut bases its columns on tabs, but it can use anything you like. For example let's get just the first
instrument from that list by using cut again with the "delimiter" set to a comma.

~~~~
% cat beatles.tsv | cut -f 2 | cut -d ',' -f 1
vocals
vocals
guitars
drums
~~~~

:::tip Question
Check you understand how this works.  The first `cut` in the pipeline uses tabs as a delimiter, so it cuts out the second column, which looks like 'guitars,vocals,sitar,keyboards,bass' and so on.  The second `cut` then cuts out the first instrument from that list by using `,` as a delimiter.
:::

## Finding matching (or mismatching) lines

`grep` finds lines that match a certain pattern.

For example, suppose we wanted information about just Paul.  We could do it by grepping for Paul:
```
% cat beatles.tsv | grep Paul
```

We could also use the `-v` (or `--invert-match`) option to find out about all the beatles *except* Paul:
```
% cat beatles.tsv | grep -v Paul
```

Do all beatles sing?
```
% cat beatles.tsv | grep vocals
```

`grep` is actually a sophisticated tool that can find complex matches - we'll come back to this below.

## Getting unique lists of values, and counting them

`uniq` removes duplicate lines from standard input.  Often this is best if you sort it first.
For example, to get a unique list of first instruments we could extend the above with a call to `uniq`:

~~~~
% cat beatles.tsv | cut -f 2 | cut -d ',' -f 1 | uniq
vocals
guitars
drums
~~~~

`uniq` also has a very useful option `-c`, which also counts the 

```
% cat beatles.tsv | cut -f 2 | cut -d ',' -f 1 | uniq -c
   2 vocals
   1 guitars
   1 drums
```

## Transforming input

`tr` translates characters into others.

Specifically, if you give it two equal length strings, it will swap characters in the first string in standard input for the
corresponding characters from the second string.

~~~~
% echo veryinsecurepassword | tr osi 05!
very!n5ecurepa55w0rd
~~~~

It can also be used to change the case of a string

~~~~
% echo veryinsecurepassword | tr '[:lower:]' '[:upper:]'
VERYINSECUREPASSWORD
~~~~

`tr` also has an option `-d` which means 'delete these characters':
~~~~
% echo veryinsecurepassword | tr -d 'aeiou'
vrynscrpsswrd
~~~~

As you can see, you can do a lot by combining these simple tools together with pipes.

## Complex processing with grep, awk and sed

As a last part to this tutorial, we will mention three programs that are sophisticated tools in their own right. They
are well worth looking into in detail, but we will use them in fairly simple ways in this module. Here are a
few basic recipes that you can use with each of them without needing to understand them deeply.

* `grep` extracts lines containing a pattern

You could use it to see who in the Beatles plays keyboards:

~~~~
% cat beatles.tsv | grep keyboards
John	vocals,guitars,keyboards,harmonica,bass
Paul	vocals,bass,guitars,keyboards,drums
George	guitars,vocals,sitar,keyboards,bass
~~~~

or the names of Beatles who play keyboards and sing:
```
% cat beatles.tsv | grep keyboards | grep vocals
```

::tip Note
`grep` is actually quite a bit more sophisticated than this - the pattern is really a *regular expression*. We won't go
into detail, but for example, here is a command which only finds lines with 'bass' right at the end of the line:

```
% cat beatles.tsv | grep 'bass$'
```

(The `$` in a regular expression means 'match the end of the line')
:::

* `awk` filter lines based on the contents of columns

In this module we'll also make very simple use of `awk` to find values in specific columns.  
(This is different to `grep` that will search for patterns in the whole line.)
For example let's pick out just Paul using his name in column one

~~~~
$ cat beatles.tsv | awk '$1 == "Paul"'
Paul	vocals,bass,guitars,keyboards,drums
~~~~

Here the '$1' means 'look at column 1' and the `== "Paul"` means 'is equal to "Paul".  (We have to put single quotes
around the whole thing to make sure all this is interpreted by `awk`, not the command line itself.)


* Finally, `sed` can parse and transform text in a more sophisticated way than `tr`

For example, it can be used to substitute some text with other text using the 's' command:

~~~~
$ cat beatles.tsv | sed 's/keyboards/piano/'
John	vocals,guitars,piano,harmonica,bass
Paul	vocals,bass,guitars,piano,drums
George	guitars,vocals,sitar,piano,bass
Ringo	drums,percussion,vocals
~~~~

## Conclusion

By putting together pipelines made out of these commands you can perform complex sorting, filtering, and transformations
on files.

Now go on an [test yourself](recap_2.md).


