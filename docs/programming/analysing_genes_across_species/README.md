---
sidebar_position: 10
---

# Analysing genes across species

**Warning** this tutorial is still under construction.

Welcome!

In this tutorial we will get back to the [questions about gene
annotations](../programming_with_gene_annotations3/001_Introduction.md) we were asking in the ['Learn to program with
gene annotations'](../programming_with_gene_annotations3/README.md) tutorial.  We'll use the code we developed there to
start investigating these genes.

As discussed there, a great deal of data is available on many species - such as the vertebrate species listed on [the
Ensembl ftp site](http://ftp.ensembl.org/pub/current_gff3), or nonvertebvrate species you can find through [Ensembl
Genomes](https://ensemblgenomes.org).  And data on *all* eukaryotic species is being produced through the [Darwin Tree
of Life project](https://www.darwintreeoflife.org).  What does all that data look like, and what should we do with it?

This tutorial is focussed on the gene content of these species (rather than, say, the genome assembly data itself).  For
any given species you can get hold of a GFF file which tells you where the genes are.  A lot of questions then immediately
spring to mind - for example:

- How many genes are there?
- How big are they?
- How complex are they - how many exons?  How many different transcripts?
- How much of the genome is in genes (and what's in the rest of it?)
- How much of these genes actually codes for proteins - and how much is untranslated?
- Do these patterns differ across species?  Across cell types?  How?


## Getting setup

If you followed the R version of our [earlier tutorial](../programming_with_gene_annotations3/README.md) you will have:

* An R package called **gmsgff** which provides the `parse_gff3_to_dataframe()` function.
* An R script called `gff_to_sqlite.R` which converts a GFF file into the sqlite database format.

If you don't have these or want an updated version, don't worry!  You can get my versions as follows.

First, to install the R package, try (from an R session):
```
install.packages(
	"https://www.well.ox.ac.uk/bioinformatics/training/gms/code/R/gmsgff.tgz",
	repos = NULL,
	type = "source"
)
```

This will install the **gmsgff** package - this is the [same as the one you developed](../programming_with_gene_annotations3/007_making_a_module.md) with some additions that came from the [challenge
questions](../programming_with_gene_annotations3/009_challenge_questions.md).  

For example you can use it to load GFF data like this:
```
data = gmsgff::parse_gff3_to_dataframe( "/path/to/Homo_sapiens.GRCh38.107.chr.gff3.gz", extra_attributes = c( "biotype", "Name" ))
```

You should see some nice output like this:
```
++parse_gff3_to_dataframe(): Reading GFF3 data from "Homo_sapiens.GRCh38.107.chr.gff3.gz"...
++parse_gff3_to_dataframe(): Extracting "ID" attribute...                                                          
++parse_gff3_to_dataframe(): Extracting "Parent" attribute...
++parse_gff3_to_dataframe(): Extracting "biotype" attribute...
++parse_gff3_to_dataframe(): Extracting "Name" attribute...
++parse_gff3_to_dataframe(): Removing prefixes from ID fields...
++parse_gff3_to_dataframe(): ok.
```

You should get back a dataframe with all the [GFF columns](https://m.ensembl.org/info/website/upload/gff3.html), plus
the extracted `ID`, `Parent`, `biotype` and `Name` attributes as seperate columnbs.

:::caution Warning

Remember these are big files and they use lots of memory.  It is worth having a seperate terminal running and monitoring
the memory usage as this data loads - use `top -u <username> -o '%MEM'` (on linux) `top -U gav -o MEM` (in Mac OS) to do
this, or use your system activity monitor.  How much memory does the process use?

:::

## A command-line program

If you completed the tutorial you should also have a command-line program `gff_to_sqlite.R` which can be used to
[convert a GFF file into sqlite format](../programming_with_gene_annotations3/008_Converting_gff_to_sqlite.md).  

:::tip Note

If you don't thave this program, fear not!  You can download my version at this link:
[gff_to_sqlite.R](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/analysing_genes_across_species/code/gff_to_sqlite.R).

(This program depends on the gmsgff R library, so make sure to install that first.)

:::

In the command-line you can run the program like this:

```
Rscript --vanilla gff_to_sqlite.R --input Homo_sapiens.GRCh38.107.chr.gff3.gz --output genes.sqlite --attributes biotype Name
```
which will produce a new file called `genes.sqlite`.  You can see how to access that data [on this
page](../programming_with_gene_annotations3/appendices/sqlite_access.md).

## Next steps

You are all set to start [counting genes](./006_Counting_genes_1.md).
