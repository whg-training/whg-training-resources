---
sidebar_position: 1
---

# Introduction

[Up to table of contents](README.md) / [Go to next page](What_gene_annotation_data_looks_like.md).

One of the amazing achievements of the last 100 years is the identification and mapping of genes -
DNA sequences that encode proteins or other functional molecules - across many hundreds of species.
For example, the [Ensembl ftp site](http://ftp.ensembl.org/pub/current_gff3/) holds gene annotation
files for over 300 species, everything from [*Acanthochromis
Polyacanthus*](https://en.wikipedia.org/wiki/Spiny_chromis) to [*Zosterops
Lateralis*](https://en.wikipedia.org/wiki/Silvereye).  Other sites, such as [Ensembl
Genomes](https://ensemblgenomes.org) hold genes for other organisms such as the [*Plasmodium*
parasites](https://plasmodb.org/plasmo/app/downloads/Current_Release/) that cause malaria.  And many
more species are [being mapped](https://www.darwintreeoflife.org).

So that's a lot of data to digest - all of it available for us to get and analyse?  For any given
species lots of questions immediately spring to mind:

- How many genes are there?
- How big are they?
- How complex are they - how many exons?  How many different transcripts?
- How much of the genome is in genes (and what's in the rest of it?)
- How much of these genes actually codes for proteins - and how much is untranslated?
- Do these patterns differ across species?  Across cell types?  How?

You can probably think many others!

You can probably guess, or may know, some of the answers, but a great thing is that we don't have to
guess!  In this practical we will write some code that can process gene annotation files, as a way
to start figuring out these questions.

## Plan of attack

This problem is typical of bioinformatics problems: there is some data available (like those in the
above FTP sites) that comes in specific file formats (that somebody else has invented). And we have
a set of slightly vague scientific questions in mind we're interested in. To answer them, we have to
understand the data files, write some code to process it, and come up with some sort of quantitative
analyses.

## Coding for success

As outlined above we're going to focus on two things at once in this tutorial. One focus will be on
answering the scientific questions above. And the other focus will be on figuring out how to write
good, re-useable code to do this.

There are lots of ways to define 'good code' and lots of ways to write it. Here are some simple
things we could aim for:

1. the code ought to work
2. it ought to not take too long to do it, or use too much memory
3. it ought to be obvious what the code does

The third point is really the most important one here and is the one we'll focus on first. This is because, if
you can figure out what the code does, then you're in a good position to fix any problems with it, making it
work better and faster and so on. But if you can't figure it out, you'll end up throwing it away and starting
again. So that's what we'll focus on.

## What gene annotation data look like

When you've had enough coding philosophy, [go and see what gene annotation data looks like](What_gene_annotation_data_looks_like.md).
