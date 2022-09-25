---
sidebar_position: 1
---

# Introduction

[Up to table of contents](README.md) / [Go to next page](What_gene_annotation_data_looks_like.md).


One of the most amazing scientific achievements in the last 100 years has been the mapping of genes - DNA
sequences that encode proteins or other functional molecules - across many hundreds of species. For example, the
[Ensembl ftp site](http://ftp.ensembl.org/pub/current_gff3/) holds gene annotation files for over 300 species, everything from
[*Acanthochromis Polyacanthus*](https://en.wikipedia.org/wiki/Spiny_chromis) to [*Zosterops
Lateralis*](https://en.wikipedia.org/wiki/Silvereye).  Other sites hold genes for other organisms such as the [*Plasmodium*
parasites](https://plasmodb.org/plasmo/app/downloads/Current_Release/) that cause malaria.  And many more species are [on the way](https://www.darwintreeoflife.org).

But what does all this data actually look like?  Lots of questions spring to mind:

- How many genes are there?
- How big are they?
- How much of the genome is in genes?
- How complex are genes - How many exons?  How many different transcripts?
- How much of genes are actually protein-coding - and how much is untranslated?
- Do these patterns differ across species?  How?

You can probably think many others!

In this practical we will write some re-useable code that can process gene annotation files, as a
way to start figuring out these questions.

## Plan of attack

This problem is fairly typical of bioinformatics problems in the following way. There is some data
available (like those in the above FTP sites). It comes in file formats that somebody has invented.
And we have a set of slightly vague scientific questions in mind we're interested in. To answer
them, we have to understand the data files, write some code to process it, and come up with some
sort of quantitative analysis.

## Coding for success

In this tutorial we'll focus on two things at once. Our primary focus will be on answering the
scientific questions above. But we're also going to use this as a chance to write some useful and
re-useable code.

There are lots of ways to define 'good code' and lots of ways to write it. But here are some simple
things our code ought to aim for:

1. it ought to work
2. it ought to not take too long to do it
3. it ought to be obvious what it does

Perhaps surprisingly at first glance, the third point is really the most important one here. Because if you can
figure out what the code does, then you can fix any problems with it, make it work, and figure out how to speed
it up.  But if you can't figure it out, you'll end up throwing it away and starting again.

When writing code here are some things we can do to help:

- *Keep things as simple as possible.*
- *Give things good names.*
- *Write tests.*

All of these things help with understanding the code (including tests, which document how code is supposed to
work). There are of course lots of other principles that we could apply, but these are ones I tend to focus on.

## What gene annotation data look like

When you've had enough coding philosophy, [go and see what gene annotation data looks like](What_gene_annotation_data_looks_like.md).
