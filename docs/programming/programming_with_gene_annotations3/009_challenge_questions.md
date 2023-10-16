---
sidebar_position: 9
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Challenge questions

If you reach this point, you have:

* written a function`parse_gff3_to_dataframe()` that can read GFF data into R (or python)
* written an R package, or a python module, to contain that function
* written a command-line program `gff_to_sqlite.R` (or `gff_to_sqlite.py`) that uses that function to convert GFF file(s) to a database format.

That's pretty good - but it could be better.  Here are some challenges to try. 

:::tip Note

For these challenges we suggest to focus on the GFF files [from
Ensembl](http://ftp.ensembl.org/pub/current_gff3/homo_sapiens/), at least at first.  Files from other sources such as
[gencode](https://www.gencodegenes.org/human/) have minor formatting differences that will make this task harder.

:::

:::caution Wartning

Some of these challenges involve changes to your `parse_gff3_to_dataframe()` function. Make sure and test it to ensure
it still works!

Also, if you like your edits and put them in your **gmsgff** package, remember to run `R CMD INSTALL gmsgff` again to
install the new version of the package.

:::


## Challenge 1: extract more attributes

Wouldn't it be nice to have other attributes extracted as columns?  For example in the Ensembl files the `Name` and
`biotype` are [useful attributes](https://ftp.ensembl.org/pub/current_gff3/homo_sapiens/README) of gene records.

:::tip Challenge

Give `parse_gff3_to_dataframe()` a second argument called 'attributes', which should be a list (or in R,
a vector) of attribute names. For each attribute in the list, you should extract it and add it into a seperate column of
the result dataframe.  (This should be in addition to the `ID` and `Parent` attributes, which you should always
extract.)

For bonus marks, alter `gff_to_sqlite.R` or `gff_to_sqlite.py` so you can also specify these attributes on the
command-line. **Hint** You will need to use the `nargs = "+"` option to the argument parser `add_argument()` call, so
that the option can take several values.  The argument can then be used as a list (in python) or vector (in R).

:::

## Challenge 2: shrink `attributes`

Currently, `parse_gff3_to_dataframe()` extracts `ID` and `Parent` (and, if you do the challenge above, other attributes too).
But it also leaves these fields in the `attributes` column.  Since the files are so bit, this can waste a lot of space.

:::tip Challenge

Find a way to remove the extracted fields from `attributes` when you extract them.
Make sure to remove the semicolon too, if it's there!

:::

**Hint 1** The [`str_remove()` function](https://stringr.tidyverse.org/reference/str_remove.html) can help with this -
you will need to use the right regular expression.

**Hint 2** The regular expression syntax '(;|$)' will match *either* a semicolon *or* the end of the string - may be
useful.

## Challenge 3: split the output

Currently, our `gff_to_sqlite` program outputs all fields into a single table (called `gff`).
However, wouldn't it be better to split out the different types into different tables?
For example:

* chromosomes
* genes
* transcripts
* exons
* CDS
* utr

may all make sense as seperate tables.

:::tip Challenge

Create a version of `gff_to_sqlite` (say, `gff_to_sqlite_split`) that outputs different gff record types into different
tables.

**Note** This is easiest if you focus on GFF files from one source (say Ensembl) - since the GFFs from other sources
(such as gencode) have different types in them.

:::

In fact the best version of this would extract different attributes for each table as well.  For example, the gene name or symbol
is only needed for gene records.

## Challenge 4: the refactor

See [the appendix](appendices/refactoring.md) for this challenge.

## The finished product

If you get through all (or any) of that - congratulations!

For a tutorial that uses this code - see the follow-on [Analysing genes across species
tutorial](../analysing_genes_across_species/README.md).

:::tip Note

If instead you'd like to see my version of the finished product - the R package and the command-line program with the
improvements listed here - there's also a link on the [Analysing genes across species
tutorial](../analysing_genes_across_species/README.md) page.

:::
