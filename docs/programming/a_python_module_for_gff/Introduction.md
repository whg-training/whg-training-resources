---
sidebar_position: 1
---

# Introduction

This tutorial has one aim: to walk you through the process of writing a python module that can process common gene annotation
files in bioinformatics: gene annotation (GFF) files. The aim is to produce a building block that will help us analyse genes
across multiple species.

## What genes could we analyse?

Well for example:

* Gene annotations for >300 vertebrate genomes can be found on [Ensembl(https://www.ensembl.org/info/about/species.html).  (See also the [species tree](https://www.ensembl.org/info/about/speciestree.html).)

* [ensemblgenomes.org](http://ensemblgenomes.org) lists more genomes - for plants, protists, fungi and more.

* Malaria genomes can be found on [PlasmoDB](https://plasmodb.org/plasmo/app).

Each of these has a download FTP site where you can get genome annotations.

In other words - there is an incredible amount of data about the world's organisms if only we could get at and analyse it...

## Prerequisites

For this tutorial we will work with data in a format called 'General Feature Format' or **GFF3**. You can [read its specification
here](https://m.ensembl.org/info/website/upload/gff3.html). It is a commonly-used format for storing gene annotations.

Before starting you will need to make sure you have a good understanding of what's in the data. GFF files come from several
projects and differ slightly in what's in them. To get started, create a new directory to work in:

```sh
mkdir genes_programming; cd genes_programming
```

Start by downloading three files:

1. The human gene annotations [from the GENCODE project](https://www.gencodegenes.org)

2. Another version of the human gene annotations [from
Ensembl](http://ftp.ensembl.org/pub/current_gff3/homo_sapiens/). (**Note:** the file
`Homo_sapiens.GRCh38.107.chr.gff3.gz` will do for now - this contains genes that Ensembl could assign to one
of the main chromosomes.)

3. The *Plasmodium falciparum* (malaria parasites) [from
Plasmodb](https://plasmodb.org/plasmo/app/downloads/Current_Release/Pfalciparum3D7/gff/data/).

A backup copy of these files can be found
[in this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/programming/programming_with_gene_annotations/).

Use your [command-line skills](/bioinformatics/exploring_gene_annotations_in_bash) to download these files to the `genes_programming` folder and
have a look at them.  (Feel free to download data for more species as well.)

For example, the GENCODE file looks something like this:

    ##gff-version 3
    #description: evidence-based annotation of the human genome (GRCh38), version 38 (Ensembl 104)
    #provider: GENCODE
    #contact: gencode-help@ebi.ac.uk
    #format: gff3
    #date: 2021-03-12
    ##sequence-region chr1 1 248956422
    chr1	HAVANA	gene	11869	14409	.	+	.	ID=ENSG00000223972.5;gene_id=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;level=2;hgnc_id=HGNC:37102;havana_gene=OTTHUMG00000000961.2
    chr1	HAVANA	transcript	11869	14409	.	+	.	ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
    chr1	HAVANA	exon	11869	12227	.	+	.	ID=exon:ENST00000456328.2:1;Parent=ENST00000456328.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;exon_number=1;exon_id=ENSE00002234944.1;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
    chr1	HAVANA	exon	12613	12721	.	+	.	ID=exon:ENST00000456328.2:2;Parent=ENST00000456328.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;exon_number=2;exon_id=ENSE00003582793.1;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
    ...


ana::tip Question
Can you spot differences in how the three files are encoded?
:::

:::tip Note
Each project has its own version of the file format specification as well.  For example see:

* the [Ensembl page on GFF format](https://www.ensembl.org/info/website/upload/gff.html)

* the [GENCODE file format page](https://www.gencodegenes.org/pages/data_format.html) (this actually described
  `GTF` format, but it's almost identical and has the same basic encoding.  We'll use `GFF3` here.)

* The PlasmoDB files are similar to the Ensembl ones, but if you look closely you'll see the file has some
  difference to both those above.

:::

### Aside: how are gene annotations created anyway?

Gene annotation pipelines are pretty complicated - they involve prediction of genes from genome sequence,
alignment of known transcript sequences and short-read RNA, transfer of annotations from other genomes, and
other steps.  

The Ensembl gene annotations are created using a particular pipeline that is described in detail
[here](https://www.ensembl.org/info/genome/genebuild/index.html). This includes a manual curation step,
'HAVANA', which is applied to the best-annotated genomes including humans, mice, zebrafish and rats.

GENCODE is based on the Ensembl annotation [as described here](https://www.gencodegenes.org/pages/faq.html)
but with extra annotation added.

The NCBI is a second project that creates gene annotations (NCBI RefSeq). Their pipeline for Eukaryotes is
described [here](https://www.ncbi.nlm.nih.gov/genome/annotation_euk/process/). The process looks like this:

![diagram of gene annotation pipeline](https://www.ncbi.nlm.nih.gov/core/assets/genome/images/Pipeline_RFAM.png)

Simple!

An important thing to notice is that these annotations are made from severe data sources - including
computational predictions from the genome assemblies themselves, but also alignments of known RNA and protein
sequences, and a great deal of automatic and for some genomes manual curation. They shouldn't be regarded as
the whole truth about genes, but as a current best guess - and for some genomes like humans they are fairly
complete.

## Next steps

Now [get started writing some code](gff_code.md) to process the file.
