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

To start, go and [get set up](./getting_setup.md).