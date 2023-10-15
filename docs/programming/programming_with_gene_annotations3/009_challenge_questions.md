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

For these chaleenges we suggest to focus on the GFF files [from
Ensembl](http://ftp.ensembl.org/pub/current_gff3/homo_sapiens/), at least at first.  Because these are all formatted the
same way, whereas other data sources like [gencode](https://www.gencodegenes.org/human/) have minor formatting
differences that will make this task harder.

:::

## Challenge 1: extract more attributes

Wouldn't it be nice to have other attributes extracted as columns?  For example the [gene name and biotype](https://ftp.ensembl.org/pub/current_gff3/homo_sapiens/README) are useful fields.

**Challenge**: give `parse_gff3_to_dataframe()` a third 'attributes' argument containing a list of attribute names. For
each attribute, extract that into a seperate column *in addition to* the `ID` and `Parent` attributes you already
extract.

## Challenge 2: split those tables

As you know, the GFF records have different types - genes, transcripts, exons and so on.  And these are linked via the
`ID` and `Parent` attributes.

At the moment our `gff_to_sqlite` program puts all this into a single `gff` table, but maybe that's silly.

Can you write a version of `gff_to_sqlite` (say `gff_to_sqlite_split`) that instead outputs several seperate tables for
the main different types:

* `gene` for gene records
* `transcript` for transcript records
* `exon` for exons
* `cds` for coding sequence
* `chromosome` for chromosome records
* perhaps `other` for anything else?

**Hint.** You can use dataframe filtering to subset out the different parts of the table to write.

:::caution Warning
As you've already seen, not all GFF files have the same encoding of things like the `type` column.  If you
 focus on the [Ensembl files](http://ftp.ensembl.org/pub/current_gff3/homo_sapiens/) this will be easier, as they're all
 consistently formatted.)
:::

