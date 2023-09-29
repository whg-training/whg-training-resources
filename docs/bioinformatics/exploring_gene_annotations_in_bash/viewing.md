---
sidebar_position: 5
---

# Viewing gene records

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
Ensembl](http://www.ensembl.org/info/website/upload/gff3.html).

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
