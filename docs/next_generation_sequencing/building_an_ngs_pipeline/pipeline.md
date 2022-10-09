---
sidebar_position: 3
---

# The pipeline

## Overview

If you've followed the [introduction](Introduction.md), you should now have a bunch of software
installed, including the `snakemake` pipelining software, and you will have a set of 10 fastq files
named in the format `ERR[xxxxxx]_[1|2].fastq.gz`. And you will also have downloaded the
*P.falciparum* reference sequence, `Pf3D7_v3.fa.gz` - hopefully in its own folder
 `data/reference/`.

:::tip Challenge
Write a snakemake pipeline that processes these reads.
:::

When writing the pipeline, here are some points to consider.

* Your pipeline should start with the set of fastq read files named by accessions as described in
  the [introduction](Introduction.md). To keep things well-organised, it's a good idea to keep
  these in a subdirectory, so they will look something like this:

```
   data/reads/ERR377582_1.fastq.gz
   data/reads/ERR377582_2.fastq.gz
   data/reads/ERR377591_1.fastq.gz
   data/reads/ERR377591_2.fastq.gz
   data/reads/ERR377629_1.fastq.gz
   data/reads/ERR377629_2.fastq.gz
   data/reads/ERR417621_1.fastq.gz
   data/reads/ERR417621_2.fastq.gz
   data/reads/ERR417627_1.fastq.gz
   data/reads/ERR417627_2.fastq.gz
```

* You will also need the reference sequence, placed in `data/reference/Pf3D7_v3.fa.gz`.

* The pipeline will **output** a set of BAM files containing these reads aligned to the a reference
  sequence. The reads should be *coordinate sorted*, duplicate read pairs should have been *marked
  or removed*, and the BAM files should be *indexed*. What's more, the files should be named by
  sample name not the accession.
	
* My advice is to put output files in a seperate subdirectory, so they will look something like
  this:

```
    results/aligned/QG0033-C.bam
    results/aligned/QG0033-C.bam.bai
    results/aligned/QG0041-C.bam
    results/aligned/QG0041-C.bam.bai
    results/aligned/QG0049-C.bam
    results/aligned/QG0049-C.bam.bai
    results/aligned/QG0056-C.bam
    results/aligned/QG0056-C.bam.bai
    results/aligned/QG0088-C.bam
    results/aligned/QG0088-C.bam.bai
```

* The pipeline should also perform QC of the fastq files. We suggest using `fastqc` and `multiqc`
  for this. So this will output some more files that look like this:

```
    results/qc/QG0033-C.fastqc.html
    results/qc/QG0041-C.fastqc.html
    results/qc/QG0049-C.fastqc.html
    results/qc/QG0056-C.fastqc.html
    results/qc/QG0088-C.fastqc.html
    results/qc/multiqc_report.html
```
You should of course look at the output to look for anything odd!  (See the
[tutorial on NGS data](../introduction_to_next_generation_sequencing_data_analysis) for lots
of information on how to interpret these files.)

* The pipeline will also output a
  [`bedgraph`](http://genome.ucsc.edu/goldenPath/help/bedgraph.html) file for each sample,
  reporting the coverage at each site in the genome. (`bedtools genomecov -bg` is a good way to
  create this). These will look like this:

```
    results/coverage/QG0033-C.coverage.bedgraph
    results/coverage/QG0041-C.coverage.bedgraph
    results/coverage/QG0049-C.coverage.bedgraph
    results/coverage/QG0056-C.coverage.bedgraph
    results/coverage/QG0088-C.coverage.bedgraph
```

* And, if you implement the whole pipeline, it will also output a variant calls file (for this
  tutorial we suggest using the [`octopus` variant caller](https://github.com/luntergroup/octopus)
  for this). These will be an indexed bgzipped [vcf
  file](https://samtools.github.io/hts-specs/VCFv4.2.pdf), which should look something like this:

```
    results/variant_calls/variant_calls.vcf.gz
    results/variant_calls/variant_calls.vcf.gz.tbi
```

Easy, right?  Here is a diagram of the overall pipeline:

![Diagram of pipeline](pipeline.svg)

You have to implement a least the green bits... good luck!

(If you are running this as part of a [WHG course](www.well.ox.ac.uk), we'll discuss your pipeline
and look at the outputs at the wrap-up session later in the week.)

## Good luck!

As you can see we are dropping you in at the deep end - good luck!

To help with your journey, however, we have provided some [tips and tricks](tips_and_tricks.md).
These should help you get started.



