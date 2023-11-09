---
sidebar_position: 0.5
---

# Some real data

Before getting started, let's load some real data.

Start by downloading the file `GWD_30x_calls.filtered.tsv.gz` from [this folder](https://www.well.ox.ac.uk/bioinformatics/training/gms/data/) and loading into R:
```r
library( tidyverse )
gwd = read_tsv( "https://www.well.ox.ac.uk/bioinformatics/training/gms/data/GWD_30x_calls.filtered.tsv.gz" )

print(gwd)
```

Have a look at the data.  The data consists of genotype calls for 112 'Gambian from the Western Division' individuals
from the recent high-coverage sequencing of [1000 Genomes Project](https://www.internationalgenome.org) samples.

It has data for >30,000 biallelic SNPs (in rows) and the samples in columns.

:::tip Note

If you want to see how this data was generated - follow the [Variant calling and imputation practical](/sequence_data_analysis/variant_calling_and_imputation/README.md).

This data comes from the region of the gene *FUT2*.

:::

## Plotting the haplotypes

Let's plot this data now.  To start, let's turn the genotypes themselves into a matrix:
```r
GT = as.matrix( gwd[,5:ncol(gwd)])
```

A simple way to plot is to use `image()`.  First we'll throw out monomorphic and rare variants:

```r
frequencies = rowSums(GT) / ncol(GT)
w = which( frequencies > 0 & frequencies < 1 )
GT = GT[w,]
metadata = gwd[w,1:4]
```

Let's first get the number of SNPs and haplotypes in the data:
```r
L = nrow(GT)
N = ncol(GT)
```
and plot:
```r
image( GT, x = 1:L, y = 1:N )
```

Cool!  But a bit noisy.
