---
sidebar_position: 1
---
# Getting the prerequisites

To run this tutorial you will need two things: some software and some data.  This page will get you set up.

## Getting the software

You need a version of the following tools:

* [samtools](http://samtools.github.io), a program for manipulating next-generation sequencing data reads
* [fastqc](https://www.bioinformatics.babraham.ac.uk/projects/fastqc/), a program for performing quality control fo sequence data
* [bwa](https://github.com/lh3/bwa), a program for aligning reads to a reference sequence
* [jellyfish 2](https://github.com/zippav/Jellyfish-2), a program for counting k-mers (short sequences of fixed length k) in sequence data reads.
* And it is also useful to install the [Integrated Genomics Viewer](https://igv.org).

You can get this software in a few different ways:

* If you are working on a JupyterHub instance we have setup, these tools should be installed already.
* If you have set up a [conda installation as described here](prerequiesites/README.md), the command

`mamba install -c bioconda -c conda-forge samtools fastqc bwa jellyfish`

run in a terminal should install these tools (except IGV, which should be downloaded from its website.)

* It's also possible to install these programs from source code. Doing this is out of scope of this
  tutorial but if you know what you're doing, feel free to try this.

**Testing it.**  To check that you have the right software, open a bash terminal and type the program names followed
by &lt;enter&gt;. (Don't type the dollar signs, these are there to show you the bash prompt ). You
should see something like:

```bash
$ jellyfish --version
jellyfish 2.3.0

$ fastqc --version
FastQC v0.11.9

$ samtools --version
samtools 1.8
Using htslib 1.8
Copyright (C) 2018 Genome Research Ltd.

$ bwa

Program: bwa (alignment via Burrows-Wheeler transformation)
Version: 0.7.17-r1188
Contact: Heng Li <lh3@sanger.ac.uk>

Usage:   bwa <command> [options]

[...]
```

## Getting the data

To get the data for this tutorial, open a terminal and run the following commands:

Download the data: 
```sh
wget https://www.well.ox.ac.uk/~gav/projects/oxford_statgen_summer_school/day_one_morning.tgz
````

Extract it :
```
tar -xzf day_one_morning.tgz
```

You should now have a folder called `sequence_data_analysis`. For the tutorial, delete the tarball
and then change into that directory:

```
rm day_one_morning.tgz
cd sequence_data_analysis
```

Now you're [ready to start](Pipeline_outline.md).