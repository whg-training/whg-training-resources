# Getting started with genomic data

Most data files used in genomics are in 'plain text' format. They are ordinary text with spaces or 
tabs used to separate columns. The advantage to this is that you can read them on the command line 
or load them into a spreadsheet programme very easily. The downside is that this is not generally 
an efficient storage format and leads to large file sizes. It's not at all uncommon to work with 
text files so large that common text editors struggle to open them, even on modern computers.

This means that it's entirely possible to manipulate these files using the standard command line 
tools like `cut` or `awk`. However, you probably don't actually want to do that if you can help it 
as there are better tools available, designed to work with specific types of file. An exception is 
the command `grep`, which you might yourself using often to find specific lines in files, usually 
to try and work out what is going wrong!

## Binary formats

Many text formats have an equivalent 'binary' format. This holds the same data, but not in plain 
text you can read in a terminal or editor. Binary formats are more efficient storage, but require 
specific tools to read nad work with. These tools always have a function to convert back into 
plain text format so you can inspect the data.

## Compression

For large files, it's common to work with a compressed version of the file. This doesn't just help 
reduce the space needed to store the files. On modern computers, reading a compressed file from 
disk and decompressing it is faster than reading the same uncompressed data from disk (almost 
always). On the command line, you usually can't use work with compressed files directly, even 
compressed text files. You need 
to use pipes (`|`) to decompress the file using a suitable tool, then pass it to the command you 
wanted. If you want to save a compressed version of a file, you need to pipe the output to a command 
that compressed the data before sending it to a file.

You have probably encountered the common '.zip' compression format before. This format, and other
compressed formats like it, have a drawback when it comes to working with genomic data: you have
to decompress the entire file even when you only want a small part of it. When genomic data is 
compressed, it is usually done using a 'block compression' algorithm. What block compression does 
is slice the data up into blocks and compress each block separately. Therefore, you only need to 
decompress the block that holds the data you are interested in. This makes accessing random parts of 
a large, compressed file much more efficient.

### Index files

Command line tools still need information about where they need to look in block compressed formats. 
It's very common for compressed genomic data to be accompanied by a separate 'index' file. This 
index file is generated from the main compressed file, and just contains information on what is 
stored in each block. It's this index that lets a tool know where in the block compressed file it 
needs to look. In genomic data, which usually has some positional information in terms of 
chromosomal position, this is very convenient.

You commonly need to run a separate command to create an index after you have created a compressed 
file.

## File headers

Depending on the format, these files may or may not have a header row that names the columns. Where 
they do not, this is because the columns, and their order, are defined precisely in the format 
specification.

It is also common for these files to have a header section before the table itself. This is used to 
store meta-data about the rest of the file. This *could* be kept in a separate file, but that makes 
it too easy for the two files to become separated. Many tools use information in this header to 
make sure they are interpreting the data correctly.

As these headers are at the start of the file, it is simple to view them from the command line, 
allowing you to check this metadata for yourself to make sure it is what's expected.

## Versioning

Many data files will be created with reference to a specific build of the reference genome for an 
organism. It's vital to avoid mixing up these versions between different steps of data processing. 
Even if the organism is the same, and the sequence very similar, the positions of features like 
genes can vary considerably and this can be a source of errors.

# Common genomics file formats

It's not expected that you have all the details of file formats committed to memory. It *is* 
useful to be able to recognise most common ones and know where to look to find the detailed 
information you might need.

## BED format

[BED format definition](https://genome.ucsc.edu/FAQ/FAQformat.html#format1)

- Suffix: `.bed`
- Header: none
- Uses: defining regions of interest (such as targetted sequencing kits), output from feature 
detection algorithms
- Acquired from: downloads of sequencing kit targets, databases of genomic features.

This format defines genomic regions as simply as possible. Chromosome identifer (or equivalent),
start position and end position. It can optionally have extra columns with additional information 
about those regions, such as strand or defining sub-features.

### BED example

## GFF3 format

[GFF3 format definition](https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md)

- Suffix: `.gff3` or `.gff`
- Header: `##` comments providing context for the file such as version numbers and region 
identifiers
- Uses: defining genomic features such as genes and exons
- Acquired from: downloads of gene definitions

This format also defines genomic regions, but has additional required columns with information 
regarding feature type, strand and phase.

### GFF3 example

## FASTA format

[FASTA format definition](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)

- Suffix: `.fasta` or `.fa`
- Header: none
- Uses: reference genomes for specific organisms, spike-in proteins and so on
- Acquired from: on-line repositories of reference genomes, Sanger sequencing

Rather than a table, a FASTA file is a series of lines of data. This data can be nucleic acid codes 
but sometimes amino acid codes. Each sequence has an identifier and can run to several lines.

### FASTA example

## FASTQ format

[FASTQ format definition](https://maq.sourceforge.net/fastq.shtml)

- Suffix: `.fastq`
- Header: none
- Uses: inputs for mapping and other tools, deposition in on-line biodata repositories, for a single 
sample
- Acquired from: sequencing services or machines directly

A FASTQ file contains a series of lines of data, similar to the FASTA format. Each sequence fragment 
has nucleic acid codes, annotated with quality scores, and an identifier for that fragment. FASTQ 
files are usually stored compressed (`.fastq.gz`).

### FASTQ example

## SAM format

[SAM format definition](https://samtools.github.io/hts-specs/SAMv1.pdf)

- Suffic: `.sam`
- Header: `@` lines contain extensive information about the data fields in the main file, the tools 
and files used to generate them
- Uses: input to variant callers, output from alignment tools, archival for sequencing projects 
where space is not an issue
- Acquired from: alignment tools

This format contains all of the information in a FASTQ file, but also contains information as to 
where in the genome the sequence fragments map to, how well they map there, and how they differ 
from the reference for that region.

It is possible to reconstruct a FASTQ file from a SAM file.

### SAM example

### BAM and CRAM formats

A `.bam` file is the binary equivalent of a `.sam` file, for much more efficient storage. This is 
important because `.bam` files are generally the largest working files you will encounter 
(and their `.sam` equivalents would often be unworkably so).

A `.cram` file is similar, but uses a more finely-tuned compression algorithm to be even more 
efficient. It hasn't yet achieved the same level of adoption as the BAM format, and you should check 
that the tools you intend to use support it.

## VCF format

[VCF format definition](https://samtools.github.io/hts-specs/VCFv4.3.pdf)

- Suffix: `.vcf`
- Header: `##` lines contain information about the sample, how the sequence was generated, and 
information about the content of columns in the file. The `#` line is the header for the table.
- Uses: showing variants for a sample or comparing variants between samples
- Acquired from: the output of a variant calling pipeline, downloads from variant databases

A format for storing variant information such as single nucleotide variants, short insertions and 
deletions, and other sequence variations, for one or more samples. It only stores differences in a 
particular sample from the supplied reference, and hence is smaller than full sequence data. It has 
8 columns containing information about the variants, then 1 or more columns showing genotypes, 1 
column per sample.

### VCF example

### BCF format

There is a binary equivalent of VCF, with the same data in a more compact format.

# Common tools

bedtools

[bedtools documentation](https://bedtools.readthedocs.io/en/latest/)

samtools

[samtools documentation](http://www.htslib.org/doc/samtools.html)

bamtools

[bamtools documentation](https://hcc.unl.edu/docs/applications/app_specific/bioinformatics_tools/data_manipulation_tools/bamtools/)

vcftools

[vcftools documentation](https://vcftools.github.io/index.html)

bcftools

[bcftools documentation](http://www.htslib.org/doc/bcftools.html)

bgzip and tabix

[bgzip documentation](http://www.htslib.org/doc/bgzip.html)
[tabix documentation](http://www.htslib.org/doc/tabix.html)
