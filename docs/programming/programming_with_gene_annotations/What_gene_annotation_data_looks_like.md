---
sidebar_position: 2
---

# What gene annotation data looks like

[Up to table of contents](README.md) / [Back to the introduction](Introduction.md) / [Go the next page](Getting_started_writing_some_code.md)

The data we'll process is in a format called 'General Feature Format' or **GFF**. You can [read its specification here](https://m.ensembl.org/info/website/upload/gff3.html).  It is a commonly-used format for storing gene annotations.

Let's start by taking a look at some GFF data. To make it easy to take a look, I've pasted the top 1000 lines of
a human gene annotation file in the file [encode.v38.annotation.head.gff](gencode.v38.annotation.head.gff). This
comes from [GENCODE](https://www.gencodegenes.org), a project that curates human and mouse genes. (If you want,
you can go there and download the whole file instead.). And I've also placed the first 1000 lines of a
*P.falciparum* (malaria) gene annotation file in
[PlasmoDB-54_Pfalciparum3D7.head.gff](PlasmoDB-54_Pfalciparum3D7.head.gff). (This comes from
[PlasmoDB](https://plasmodb.org).)

Download these and have a look at them (for example using `less -S` in your terminal).  The files look a bit
like this:

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

You'll see there is some stuff at the top starting with `#`, that represent **metadata** - i.e. information about the file itself.  And then there are rows that maybe contain genes - but what do they all mean?

Like many bioinformatics file formats, this file doesn't bother to tell you what the columns are - or
even what they are called. You have to look at [the spec](https://m.ensembl.org/info/website/upload/gff3.html)
for that.

**Challenge.** Figure out what you think the above encodes.

Some things to try to figure out:

- Can you figure out what each row represents (for example, the `gene` row above)?
- How many genes are in the file?  How many exons?
- What is a transcript anyway?  Does each gene have one transcript, or is it not that simple?
- The file clearly has seperate rows for genes, transcripts of genes (called 'transcript' or 'mRNA'), and exons.  How are they linked - can you tell?
- What else is in the 'attributes' column - anything that looks useful?

Spend a few minutes trying to work out what you can about these questions (we'll come back to them below.)

### How are gene annotations created?

The Ensembl gene annotations are created using a particular pipeline that is described in detail [here](https://www.ensembl.org/info/genome/genebuild/index.html).

The NCBI is a second project that creates gene annotations (NCBI RefSeq).  Their pipeline for Eukaryotes is described [here](https://www.ncbi.nlm.nih.gov/genome/annotation_euk/process/).  The process looks like this:

![diagram of gene annotation pipeline](https://www.ncbi.nlm.nih.gov/core/assets/genome/images/Pipeline_RFAM.png)

Simple!

An important thing to notice is that these annotations are made from severe data sources - including
computational predictions from the genome assemblies themselves, but also alignments of known RNA and protein
sequences, and a great deal of automatic and for some genomes manual curation. They shouldn't be regarded as
the whole truth about genes, but as a current best guess - and for some genomes like humans they are fairly
complete.

### What do these data records represent?

Well, for example let's look at the second row in the extract above:

    chr1	HAVANA	transcript	11869	14409	.	+	.	ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1

Comparing to [the specification](https://m.ensembl.org/info/website/upload/gff3.html) you'll see this indicates:

* the chromosome (chromosome 1),
* "HAVANA" which is the name of the program that generated the record
* "transcript" indicating that this record is for a single RNA transcript of a gene
* the start and end coordinates on chromosome 1 (relative the genome build specified in the metadata)
* unspecified *score* and *phase* values
* that the transcript has '+' strand.  (To understand this, you have to realise that the reference genome assembly directly encodes one strand of DNA, often called the forward strand - there is of course a complementary *reverse* strand as well which contains the complementary bases.  Genes are always transcribed in the 5' -> 3' direction, but that could be either on the forward or reverse strand.  This one is transcribed from the forward strand.
* and a bunch of additional data in the 'attributes' column, separated by semicolons.

The attributes clearly contain a bunch of additional information.  Hvae a look at them now.

**The ID and Parent**. Two especially important attributes are the `ID` and `Parent` attributes. The `ID`
attribute provides an identifier for this record (in this example, it is an
[Ensembl ID](https://www.ebi.ac.uk/training/online/courses/ensembl-browsing-genomes/navigating-ensembl/investigating-a-ge
ne/).)
The `Parent` attribute also provides an identifier: it is the identifier of the parent record. For this
record, the parent is 'ENSG00000223972.5', which means that **this is a transcript of the gene record with
`ID=ENSG00000223972.5` (which occurs right above it in the file.). In this sense the file is *relational*: records link to other records that makes them form a hierarchy.

### What types of records are there?

The third column of the file above is called the `type`. If you look in the spec you'll see that this contains
values that are part of a controlled 'ontology', which looks [a bit
scary](http://www.sequenceontology.org/so_wiki/index.php/Category:SO:SOFA). But what's actually in this file? A
quick way to find out is to use UNIX commands: use the `cut` unix command to extract the `type` column, use `grep` to remove the metadata lines, and then the `sort -u` to sort it and get a unique list:

```sh
$ cut -f3 gencode.v38.annotation.head.gff | grep -v '#' | sort -u
$ cut -f3 PlasmoDB-54_Pfalciparum3D7.head.gff | grep -v '#' | sort -u
```

(It would be much better to run this on the real files, not just the top 1000 lines I extracted above.  DO that by downloading the most up-to-date human annotation files now.  For humans this can be found [on the GENCODE page](https://www.gencodegenes.org/human/) - you want the 'Comprehensive gene annotation', for the reference chromosomes only, in `GFF3` format.  For malaria parasites, the annotations can be found [here](https://plasmodb.org/plasmo/app/downloads/Current_Release/Pfalciparum3D7/gff/data/).

**Question:** do the full files have any more types of record than these top-1000-lines files? What are they?

IN any case What you'll see is that there are quite a few different record types! The file includes information
on genes, transcripts, exons, coding sequence (CDS), untranslated regions (UTR), translation start and stop
codons, and more. The *Plasmodium falciparum* file is similar but slightly different, with a wider range of
types. (Also, the *Pf* file uses `type=mRNA` to denote gene transcripts, while GENCODE uses `type=transcript` -
a difference we'll have to allow for in code.)

If you want to see how this information shouldbe interpreted, try searching for a gene on
[Ensembl](http://www.ensembl.org/index.html) or the [UCSC Genome Browser](https://genome.ucsc.edu). E.g. for the gene in the listing above it takes you to
[this page on ENSG00000223972](http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=ENSG00000223972;r=1:11869-14409). The above transcript, `ENST00000456328.2`, can be seen in the transcript table there. This already gives you a flavour of the complexity, because there are two transcripts on top of each other,
with different lengths and different numbers of exons.

**Question:** Do the same for a protein-coding gene. Does it look any different? Which website do you like
better for looking at genes, Ensembl or the [UCSC browser](https://genome.ucsc.edu)? Spend some time exploring
these sites.

## Getting into coding

In this tutorial we're going to write some code to process these data files. When you're ready,
[get started writing some code](Getting_started_writing_some_code.md).
