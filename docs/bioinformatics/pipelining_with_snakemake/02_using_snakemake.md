---
sidebar_position: 2
---

# Using snakemake

(This page is under construction).

## The `summarise_ensembl_gff.R` program

For reference, here is how you could run the `summarise_ensembl_gff.R` program using a GFF file downloaded from the
[Ensembl FTP site](https://ftp.ensembl.org/pub/current_gff3/);

```r
Rscript --vanilla summarise_ensembl_gff.R --input /path/to/gff_file.gff --output summary.tsv
```

It reads in the gff file and outputs a summary of the number and median size of each record in the file, split by the
type (and biotype attribute) of the records.

