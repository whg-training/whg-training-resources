---
sidebar_position: 7.5
---

# Counting genes again

So why are there 60,000 genes in the file - isn't that too many?

If you didn't work this out already, go back and use `less -S` to look at the 'gene' records in the
file again, and remember that `gene_type` attribute.  Many of the records actually don't say they
are protein-coding genes but something else.  (For example `ENSG00000223972.6` is a ['transcribed
unprocessed pseudogene', i.e. something that makes mRNA but there isn't evidence it is translated to
protein - see [the Ensembl biotypes
page](http://www.ensembl.org/info/genome/genebuild/biotypes.html) for a more specific definition.)

Let's try to count just the protein-coding ones. To do this we will use a couple of commands - `awk`
which we are here using just to select rows with "gene" in the `type` column, and `wc` which will
count the number of lines:

```sh
cat gencode.v41.annotation.gff3  | awk '$3=="gene"' | grep 'gene_type=protein_coding' | wc -l
```
    20017

This is a much more sensible number - there are about 20,000 protein-coding genes in the human genome.
That’s a lot but we are big animals!
    
