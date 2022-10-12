---
sidebar_position: 1
---

# Gene annotations tutorial

**Author**: Gavin Band

Welcome! In this tutorial we will show how to use the UNIX command line to explore the human gene annotations.
This tutorial has two main objectives:

* To demonstrate some useful ways of working in the UNIX command line;
* And to get you to start understanding gene annotation data - that is, the core data
  files which represent our knowledge of human genes.
  
The information in these files includes such things as where genes are in the genome, how they are transcribed,
which bits gets turned into proteins and so on.  They are pretty important files!

This is not a full tutorial on command-line processing, but here is a table of some of the UNIX commands we'll
use. If you're not familiar with these, don't worry: there are a lot of commands and it takes a while to learn
them. Try the example commands now in your terminal:

| Command  | What it does                                         | Example                                  |
| -------- | --------------------------------------               | ----------------------                   |
| `ls`       | Lists files in a directory                           | `ls`                                   |
| `mkdir`    | Make a new directory                                 | `mkdir genes_tutorial`                 |
| `cd`       | Changes the current directory                        | `cd genes_tutorial`                    |
| `echo`     | Print some text (that cna be redirected to a file.)  | `echo "Hello all\ngenes" > file.txt`   |
| `cat`      | Print the output of one or more files.               | `cat file.txt`                         |
| `less`     | Interactively explore a file (press `q` to quit)     | `less file.txt`                        |
| `cut`      | Extract specific columns from a file                 | `cut -d' ' -f1 file.txt`.              |
| `grep`     | Search for a string (or *regulare expression*        | `grep "Hello" file.txt`                |
| `awk`      | General-purpose tool                                 | `awk '$1 == "Hello" file.txt`          |
| `sort`     | Sort rows alphabetically                             | `sort file.txt`                        |
| `uniq`     | Gather and count unique values                       | `uniq -c file.txt`                     |
| `gzip`/`gunzip`  | General-purpose compression/decompression.     | `gzip file.txt`                        |

Here are some tips that will make life easier:

:::tip Tips and tricks

* The command line will *auto-complete* filenames for you if you press the `tab` key - this saves a lot of typing.
* Press the up arrow to go back in your command history - you can then edit/rerun the same command.
* In filenames, `./` indicates the current directory, while `../` indicates the parent directory (i.e. one higher up.)
so for example `cd ../` takes you one level higher.

`ls` is particularly useful for looking around - for example

* `ls` on its own prints a simple listing.
* `ls -a` will also include *hidden files* - these are filenames starting with a `.` that are usually excluded.
* `ls -l` will print a long listing - dates, file owners, file sizes, etc. (A command I use a lot is `ls -lht` which lists files ordered by
  modification time with human-readable file sizes.)
:::

When you're ready, move on to download the tutorial data.

## Getting started
To get started, create a new folder for the tutorial and change dir into it:

```
mkdir cmdline_tutorial
cd cmdline_tutorial
```

Now download the gene annotation file from gencode and place it in that folder.  You can either:

* Download it from the [gencode download page](https://www.gencodegenes.org/human/) for human gene annotations -
  you want the 'Comprehensive gene annotation' file in `GFF3` format.

* Or download the copy of the gencode file that I have placed in
[this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/programming/programming_with_gene_annotations/).

For example this command should work to do the download:
```
curl -O https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_41/gencode.v41.annotation.gff3.gz
```

:::note Note

The file I'll work with below has `v41` in the name - as above it's called `gencode.v41.annotation.gff3.gz`. If
you have a different version of this file that's fine - you may get slightly different results below but they
should be very similar.

:::

## Exploring the annotations

### Decompressing the file

Does your file have `.gz` on the end of its filename?  And how big is it?  You can `ls -lh` to find out:
```
ls -lh ./
```

You'll see something like:

    -rw-r--r--  1 user  group    57M 11 Oct 14:09 gencode.v41.annotation.gff3.gz

This file is 57 megabytes big and ends with `.gz`. (If you're doens't have `.gz` on the end and looks bigger -
don't worry. It's likely your operating system has decompressed it for you.)

If you have that `.gz` ending the file has been compressed with `gzip`. We could work directly with it, but to
make life simple let's decompress it now:
```
gunzip gencode.v41.annotation.gff3.gz
```

:::tip Note
If you're bored typing the filename - just type the first few letter and press `tab` to auto-complete it.
:::

Use `ls -lh` to see how big it is now. You should see that it's lost the `.gz` ending and now is about 1.4
gigabytes (i.e. $1.4 \times 10^9$ bytes) big.  So `gzip` compressed it by about 24 times!

### Viewing the file

Use the `less` command to view the file:
```
less -S gencode.v41.annotation.gff3
```

You can scroll around and have a look in there.  You should see some **metadata** lines at the top (they start with `#`).  They look like this:

    ##gff-version 3
    #description: evidence-based annotation of the human genome (GRCh38), version 41 (Ensembl 107)
    #provider: GENCODE
    #contact: gencode-help@ebi.ac.uk
    #format: gff3
    #date: 2022-05-12
    ##sequence-region chr1 1 248956422

...and include information on the human genome assembly used (GRCh38, what's known as 'build 38') and other
things.

This is followed by some *data rows*, that look like:

    chr1    HAVANA  gene    11869   14409   .       +       .       ID=ENSG00000223972.5;gene_id=ENSG00000223972.>
    chr1    HAVANA  transcript      11869   14409   .       +       .       ID=ENST00000456328.2;Parent=ENSG00000>
    chr1    HAVANA  exon    11869   12227   .       +       .       ID=exon:ENST00000456328.2:1;Parent=ENST000004>
    chr1    HAVANA  exon    12613   12721   .       +       .       ID=exon:ENST00000456328.2:2;Parent=ENST000004>

When you want to quit `less`, press `q`.

:::note Tip

What's the `-S` for in that less command?  Well try it without and you'll see:
```
less gencode.v41.annotation.gff3
```

The `-S` tells `less` to extend all the lines off the right of the screen - without it they wrap around which
makes reading the file pretty difficult.
:::

So, what does all that data mean? This file format is one of those annoying ones that **includes no column
names**. To figure out what they mean, you have to look at the GFF3 specification. You can find this [on the
GENCODE site](https://www.gencodegenes.org/pages/data_format.html) or a similar description [on
Ensembl](https://www.google.com/search?client=safari&rls=en&q=ensembl.org%2F+GFF3&ie=UTF-8&oe=UTF-8)

:::tip Question

Look at the first 'gene' in the file. By manually looking at the file and comparing to the file specification,
can you figure out:

- which chromosome is it on?
- which strand is it transcribed on?
- what type of gene is it - is it protein-coding? (Hint: look for the `gene_type` attribute.  It can be looked up in the [list of biotypes](https://www.gencodegenes.org/pages/biotypes.html).)
- how many transcripts does the gene have?

:::

Note that to answer this last question, you'll need to look at how the different rows in the file are related to
each other.  In short:

* each row has an `ID` attribute
* some rows also have a `Parent` attribute

these attributes make the records in the file into a tree.  So conceptually the structure looks something like

                gene
               /    \      
     transcript1   transcript2  ...

i.e. each transcript has a parent gene - which means that it represents an observed or predicted RNA transcript of that
gene.  Transcripts themselves have exons - the parts of the transcript that actually make it to mature messenger RNA - so actually it is more like this:

                 gene
                /    \      
      transcript1   transcript2  ...
       /      |      |       \
    exon1  exon2    exon1    exon2

:::tip Question

There are also *coding sequence* records (`type=CDS`). Can you tell what these have as parents - exons,
transcripts or genes?

:::

### Counting genes

Quit less (by pressing `q`) and let's generate some basic statistics. 

First, how many genes and other things are in the file? For this, we can use the `cut` command to cut out the
third column (which contains the `type`). Then we'll *pipe the output* into the sort command (which sorts the
rows).  And finally we will ask the `uniq` command to count:
```sh
cut -f3 gencode.v41.annotation.gff3 | sort | uniq -c
```    

This will take a minute or two to run - it's a big file!

:::

Ok - the output is not really useful because of all the metadata.  Let's use `grep -v` to get rid of it:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq -c
```    

This **finds lines** that don't contain `#`, **extracts the third column** from them, **sorts them**, and **counts
the unique values**.

:::tip Picking apart the pipeline

If this command isn't making sense to you, a good idea is to look at what each step does.
Try running these commands one by one to parse it apart:

View the whole file:
```sh
less -S gencode.v41.annotation.gff3
```

Just the data rows:
```sh
grep -v '#' gencode.v41.annotation.gff3 | less -S
```
Just the third column of the data rows:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | less -S
```
The third column sorted:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | less -S
```
The sorted unique values in the third column....
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq | less -S
```
...and the same thing with counts:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq -c | less -S
```

Hopefully by this point it is clear(er) what each step is doing.
:::

It prints:

    872459 CDS
    1625321 exon
    171599 five_prime_UTR
     61852 gene
     97009 start_codon
     90749 stop_codon
       119 stop_codon_redefined_as_selenocysteine
    203260 three_prime_UTR
    251236 transcript

So - there are 1.6 million exons in the file and... *wait a moment*, are there really 60,000 genes in the human genome?

:::tip Question
The number 60,000 is way too big - why?
:::

Correct! As we saw above, not all of the genes in this file are protein-coding (the first one said it was a
'transcribed unprocessed pseudogene'.) Let's try to count just the protein-coding ones. To do this we will use a
couple of commands - `awk` which we are here using just to select rows with "gene" in the `type` column, and
`wc` which will count the number of lines:

```sh
cat gencode.v41.annotation.gff3  | awk '$3=="gene"' | grep 'gene_type=protein_coding' | wc -l
```
    20017

This is a much more sensible number - there are about 20,000 protein-coding genes in the human genome.
That’s a lot but we are big animals!
    

### Investigating specific genes.

Let's switch track and try to dig out info about a specific gene - [*FUT2*](https://en.wikipedia.org/wiki/FUT2).
That's an interesting gene because it encodes a fucosyltransferase is involved the synthesis pathway for
'soluble' A and B antigens - that is free A and B antigens found in blood plasma. Mutations in FUT2 affect
whether these antigens are secreted. Because norovirus binds to these antigens, these mutations can confer
protection against norovirus.

A simple way to look this up is to just to grep (i.e. conduct a text search) for `FUT2`:
```sh
grep FUT2 gencode.v41.annotation.gff3 | less -S
```
Unfortunately that returns a lot of rows - let's just get genes:
```sh
grep FUT2 gencode.v41.annotation.gff3 | awk '$3 == "gene"' | less -S
```

Ok, this returns two records. If you look at the `gene_name` attribute you'll see one, on chromosome 19, is
*FUT2*, while the other is a different gene called `POFUT2`. Let's use that to do a bit better:
```sh
grep 'gene_name=FUT2' gencode.v41.annotation.gff3 | awk '$3 == "gene"' | less -S
```

We got it!  Copy its ID to the clipboard - in my file it is `ENSG00000176920.13`.

:::tip Questions

- How long is FUT2 on the chromosome?

**Note.** to get the answer 100% right, you actually have to take the formula

$$
\text{end coordinate} - \text{start coordinate} + 1
$$

This is because both start and end are expressed in a *1-based, closed coordinate system* i.e. they both point
at bases included in the gene.  (Think of a gene with only two bases in it to see why this is.)
:::

### Finding transcripts

So how many transcripts does *FUT2* have? Well we know how to do this - look for *transcript* records with the
*FUT2* gene as parent:

```sh
grep 'Parent=ENSG00000176920.13' gencode.v41.annotation.gff3 | awk '$3 == "transcript"' | less -S
```

So it has 4 transcripts - that is, the file suggests the gene may be transcribed to mRNA in 4 different ways.
Scroll around a bit to look at the attributes of these transcripts.  If you look closely you'll see there is some more information in there.
For example a **transcript support
level** which reflects how confident GENCODE is about the transcript. See
[the Ensembl page](https://www.ensembl.org/info/genome/genebuild/transcript_quality_tags.html)
for a description of these.
    
One of these transcripts (ENST00000425340.3) is also marked as ‘Ensemble canonical’ which means
"[a single, representative transcript identified at every locus](https://www.ensembl.org/info/genome/genebuild/canonical.html)".
So let's focus on that transcript and dig a bit deeper

### Finding exons

This is easy now:
```sh
grep 'Parent=ENST00000425340.3' gencode.v41.annotation.gff3 | awk '$3 == "exon"' | less -S
```

Aha, it has two exons.

So, how long are these exons?  To make that easier let's use `cut` to get rid of the noise:
```
grep 'Parent=ENST00000425340.3' gencode.v41.annotation.gff3 | awk '$3 == "exon"' | cut -f1,3-5
```

Adding that up, the two exons have length 119 and 2,997 - so only about 30% of the gene is actually transcribed into RNA!

What about the bit that codes for protein? We can find that by looking for the *coding sequence* records - they
have `type=CDS`:
```
grep 'Parent=ENST00000425340.3' gencode.v41.annotation.gff3 | awk '$3 == "exon"' | cut -f1,3-5
```

If you look at this you'll see the gene has one annotated coding sequence, and it lives entirely inside the
second exon. Its length is 1032 base pairs. So **only about $\tfrac{1}{10}$th of the gene codes for protein.

:::tip Note
If we've got this right then the nucleotide length of the coding sequence should be a multiple of something - what?
Is 1032 an appropriate multiple?
:::

:::tip Challenge question Now repeat the above process for another gene and see if things look similar. For
example, try the genes that encode [alpha globin](https://en.wikipedia.org/wiki/Hemoglobin_subunit_alpha),
named `HBA1` and `HBA2`.
:::

## Browsing the genome

Can it be right that only a small fraction of these genes is coding? To confirm our results, let’s look up on
the UCSC genome browser:

1. Visit <https://genome.ucsc.edu> and click ‘Genome Browser’ (choose the Euro mirror)

2. In ‘Position/Search Term’ type the gene name - say FUT2. (Make sure the 'Human Assembly' is set to
`GRCh38/hg38` in the dropdown above). This may give you a list of genes - if so click on the one with the right
name.

3. You'll see the gene in its location on the genome. Try zooming out a little to see the gene in its
context.  It should look something like this:

![img](images/ucsc_genome_browser.png)

Sure enough, most of the gene is in introns.

You can click on the gene to read more information about it. Repeat this for the other genes you looked up e.g.
`HBA1` - did you get it right?

:::tip Note

As you can probably see, the genome browser contains an incredible wealth of information about the human genome,
with data representing many thousands of experiments done by researchers worldwide. Feel free to explore the browser to see what you can glean from the data presented - try clicking on things for
more information. (But watch out - it can be a bit overwhelming at first!)

For example, the bottom track in the image above shows *common genetic variants* - some of them are coloured.
You can click on them for more information.  Can you find a SNP that encodes a change to the protein?

:::

