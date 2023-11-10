---
sidebar_position: 0.5
---

# Plotting haplotypes in R

In this page you will load up some real haplotype data (from the 1000 Genomes Project) and plot it in R.

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
L = nrow(GT) # number of SNPs
N = ncol(GT) # number of haplotypes
```
and plot:
```r
image(
	GT,
	x = 1:L,
	y = 1:N,
	xlab = "SNPs",
	ylab = "Chromosomes"
)
```

Cool!  But a bit noisy.

## Ordering the haplotype

Let's use a simple approach to order the haplotypes in the region - [hierarchical
clustering](https://en.wikipedia.org/wiki/Hierarchical_clustering).

In R we can do this by first constructing a **distance matrix** and then using `hclust()` to cluster it.  Let's try now:


```r
distance = dist(
	t(GT),
	method = "manhattan"
)
```

Here we've used 'manhattan' distance, that is, the distance between two haplotypes is the number of mutational
differences between them.

:::tip Note

The `t()` part is needed around GT, otherwise we will be clustering SNPs instead of samples.  (You'll know if you got
this wrong because the output will be enormous below.

:::

You can see what the distance matrix looks like by converting to a matrix:
```r
as.matrix(distance)[1:10,1:10]
```

You ushould see something like this:
```
             HG02461_hap1 HG02461_hap2 HG02462_hap1 HG02462_hap2 HG02464_hap1 HG02464_hap2 HG02465_hap1 HG02465_hap2
HG02461_hap1      0.00000     36.87818     43.52011     42.80187     42.13075     38.28838     44.46347     40.59557
HG02461_hap2     36.87818      0.00000     45.40925     39.26831     41.86884     38.26225     41.58125     44.40721
HG02462_hap1     43.52011     45.40925      0.00000     40.84116     39.98750     43.42810     40.18706     43.33590
HG02462_hap2     42.80187     39.26831     40.84116      0.00000     44.75489     44.22669     42.24926     41.73727
HG02464_hap1     42.13075     41.86884     39.98750     44.75489      0.00000     43.39355     43.31282     42.32021
HG02464_hap2     38.28838     38.26225     43.42810     44.22669     43.39355      0.00000     43.53160     42.28475
HG02465_hap1     44.46347     41.58125     40.18706     42.24926     43.31282     43.53160      0.00000     46.22770
HG02465_hap2     40.59557     44.40721     43.33590     41.73727     42.32021     42.28475     46.22770      0.00000
HG02561_hap1     42.39104     42.01190     41.67733     41.43670     44.11349     40.97560     42.87190     41.53312
HG02561_hap2     46.04346     43.33590     43.26662     44.85532     45.33211     40.69398     42.95346     46.10857
```

Now let's cluster and order them using `hclust()`:
```r
the_order = hclust( distance )$order
```

Let's plot again - this time ordering the columns (haplotypes) in the data:
```r
image(
	GT[,the_order],
	x = 1:L,
	y = 1:N,
	xlab = "SNPs",
	ylab = "Chromosomes"
)
```

## How much diversity?

One way to assess the amount of variation is to 
