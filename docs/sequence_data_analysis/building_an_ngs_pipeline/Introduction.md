---
sidebar_position: 1
---

# Introduction

In this tutorial you will bring a set of [FASTQ files](https://en.wikipedia.org/wiki/FASTQ_format)
representing reads from an Illumina sequencing platform through a basic NGS data processing
pipeline. You will have to QC and align the reads, identify or remove duplicate reads, compute
coverage and generate an initial set of variant calls.

Before starting you will need to set up a few things - some data and some software. This page
details what you need.

### Obtaining the needed software.

You will need quite a bit of software to implement this pipeline - including:

* The [`bwa`](https://github.com/lh3/bwa) software for aligning reads.
* [`samtools`](https://github.com/samtools/samtools) for general data manipulation.
* The pipelining tool [`snakemake`](https://snakemake.readthedocs.io/en/stable/). (Or, if you
  prefer, you can use another workflow management tool of your choice. [`WDL`](https://openwdl.org)
  and [`Nextflow`](https://www.nextflow.io) are two possibilities. This tutorial focusses on
  snakemake though, so if you go this route, you'll have to work out all the details yourself.)
* For QC: [`fastqc`](https://www.bioinformatics.babraham.ac.uk/projects/fastqc/) and [`multiqc`](https://multiqc.info)
* For coverage calculations: [`bedtools`](https://bedtools.readthedocs.io/en/latest/index.html)
* For variant calling: [`octopus`](https://github.com/luntergroup/octopus).

The simplest way to get this software is to [install conda](/prerequisites/CONDA.md) - including
adding the bioconda and conda-forge channels. At that point installing the software should be
as easy as running:

```
mamba install bwa samtools snakemake fastqc bedtools octopus
```

If this doesn't work or you are using another system, alternatives are to use your system's package
manager and/or to install software from source.  Please try to install before starting.

### Obtaining the data

In this tutorial we will work with a set of fastq files representing *P.falciparum* (malaria) sequence
reads from 5 samples. The data comes from the
[MalariaGEN Pf6 open resource](https://www.malariagen.net/resource/26)
(described further in the [corresponding publication](https://wellcomeopenresearch.org/articles/6-42))
and is publicly available via the [European Nucleotide Archive](https://www.ebi.ac.uk/ena/browser/home).

To get started, create a new directory and cd into it:
```sh
mkdir ngs_tutorial
cd ngs_tutorial
```

To get the data, download the `ngs_pipeline_data.tgz` data tarball from
[this link](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/sequence_data_analysis/building_an_ngs_pipeline/).  For example you can do this using curl:
```
curl -O https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/sequence_data_analysis/building_an_ngs_pipeline/ngs_pipeline_data.tgz
```

This will take a minute or two to download. Once it has finished, extract the tarball into your `ngs_tutorial` directory:

```
tar -xzf /path/to/ngs_pipeline_data.tgz
```

(Once this is successful you can delete the downloaded tarball if you wish).

Have a look at what has been downloaded.  You should see:

* A **samples file**, `samples.tsv`. This lists the identifiers, accessions, and original filenames
  for five samples that we will process.  Have a look at it now using `less` or in a text editor.
	
* Some sequence data reads in the `data/reads` folder.

* A reference genome assembly, named `Pf3D7_v3`, in `data/reference`.

:::tip Note

If you want to, instead of using the supplied read files you can go and get the original versions
of the fastq files from the links supplied in the `samples.tsv` file. The data as deposited on ENA
is about 12Gb - for this tutorial I have downsampled to around 2Gb to make things a bit quicker and
use less space.

:::

## Getting started

You're all set!  Now go the the [pipeline page](pipeline.md).

## Table of contents

* [This introduction](./introduction.md)
* [Building the pipeline](./pipeline.md)
* [Pipeine tips and tricks](./tips_and_tricks.md)

