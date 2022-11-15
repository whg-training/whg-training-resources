---
sidebar_position: 3
---

# Overview of the practical

[Up to the table of contents](Introduction.md) / [Back to the setup page](getting_setup.md) / [Forward to the page on LD pruning](ld_pruning.md)

In this practical we will use `plink` to do several things to the data:

* to remove closely-related samples
* to compute principal components
* and to compute the SNP weights or loadings that tell us how principal components are weighted across the genome.

We'll also use R to inspect and plot results.

### A note on quality control

Before carrying out a genetic analysis like PCA, it's important to have a good-quality dataset, and
this typically means carrying out careful quality control (QC) first. On this course we'll cover QC
in later lectures and practicals. For this practical we'll use an already-cleaned dataset contained
in the file `chr19-clean.vcf.gz`. You can look at the data in this file by typing

```
less -S chr19-clean.vcf.gz
```

:::tip Note
If you are using Mac OS X, you will need to use `zless` instead of `less` because the file is gzipped.
:::


This file is a [Variant Call Format](https://samtools.github.io/hts-specs/VCFv4.2.pdf) file.  It consists of some metadata, followed by genotype calls at different sites (rows) for different samples (columns).  Feel free to look at the data by scrolling around. When you've finished, press the 'q' key to quit back to the terminal prompt.

### Preparing data for PCA

Before computing PCs we will need to do some pruning of the data.  We will:

* remove SNPs that are in high LD (to avoid confounding the analysis by local LD patterns.)
* remove samples that are too closely related (so that our PCs reflect the majority of our data.)

When you're ready, [go here to start pruning](ld_pruning.md).
