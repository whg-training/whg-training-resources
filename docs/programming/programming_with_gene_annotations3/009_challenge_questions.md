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

:::

## Challenge 3: split the output

Currently, our `gff_to_sqlite` outputs all fields into a single table (called `gff`).
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

