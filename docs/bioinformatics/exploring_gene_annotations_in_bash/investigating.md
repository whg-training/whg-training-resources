---
sidebar_position: 8
---

# Investigating specific genes

Let's switch track and try to dig out info about a specific gene - [*FUT2*](https://en.wikipedia.org/wiki/FUT2).
That's an interesting gene because it encodes a fucosyltransferase which is involved the synthesis pathway for
'soluble' A and B antigens - that is A and B antigens found in blood plasma and other fluids. Mutations in FUT2
affect whether these antigens are secreted. Because norovirus binds to these antigens, these mutations can
confer protection against norovirus.

## Finding the gene

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

## Finding transcripts

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

## Finding exons

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
