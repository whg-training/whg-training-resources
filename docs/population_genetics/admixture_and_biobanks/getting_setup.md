---
sidebar_position: 2
---

# Getting setup

## Download data

To get set up, start in the terminal.  Make a new folder, say `admixture`, and `cd` into it:
```sh
mkdir admixture
cd admixture
```

Now download the needed data as follows:

```
# chromosome 21 only
curl -O https://tinyurl.com/45c6f2na/ALL.chr21.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz

# index file
curl -O https://tinyurl.com/45c6f2na/ALL.chr21.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz.tbi

# population file
curl -O https://tinyurl.com/45c6f2na/integrated_call_samples_v3.20130502.ALL.panel
```

:::tip Note

The data comes from the 1000 Genomes Project - specifically [this FTP folder](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502).  If your platform doesn't have `curl`, try `wget` instead, e.g.:
```
wget https://tinyurl.com/45c6f2na/integrated_call_samples_v3.20130502.ALL.panel
```
:::

You will also need to get hold of [plink](https://www.cog-genomics.org/plink/2.0/). We'll use plink 2.0 'alpha' for this practical.  Pick the appropriate version for your platform, download it, unzip it, and copy the `plink2` executable into the current folder.

## Perform LD Pruning in PLINK

To avoid the strong influence of SNP clusters in principal component analysis and relatedness analysis, we will use a pruned (independent) set of SNPs.  Specifically let's get SNPs that are thinned to have LD $r^2 < 0.1$ in a defined window size (50 variants, 10 variants each step):

```sh
./plink2 --vcf ALL.chr21.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz \
--double-id --snps-only \
--set-missing-var-ids @:#\$r,\$a \
--maf 0.01 \
--indep-pairwise 50 10 0.1 \
--out g1k_pruned
```

This is similar to the command used in the [PCA practical](../principal_components_analysis/README.md).  In the above command:

* `--vcf` is to read from a vcf file

* `--double-id` causes both family and individual IDs to be set to the sample ID, this is typically required by the PLINK `fam` format, but in here, both individual and family ID are the same

* `--snps-only` excludes all variants with one or more multi-character allele codes. With 'just-acgt', variants with single-character allele codes outside of {'A', 'C', 'G', 'T', 'a', 'c', 'g', 't', \<missing code\>} are also excluded.

* `--set-missing-var-ids @:#\$r,\$a` if the ID filed of the variant is missing (usually written as '.') in the vcf file, we can fill the variant name based on the chromosome, genomic position, reference (r) and alternative (a) allele. The command here would name, for example, a variant 'chr1:10583G,A'. Note the extra backslashes: they are necessary in bash because '$' is a reserved character there

* `--maf 0.01` is to filter any variant with minor allele frequency <1%

* `--indep-pairwise 50 10 0.1`  This is the command to perform pruning! It considers correlations between unphased-hardcall allele counts. It takes three parameters: a required window size in variant count or kilobase (if the 'kb' modifier is present) units, an optional variant count to shift the window at the end of each step, and a required r2 threshold. At each step, pairs of variants in the current window with squared correlation greater than the threshold are noted, and variants are greedily pruned from the window until no such pairs remain.

:::tip Note

This type of 'LD pruning' is common.  However you should be aware that it can **change the frequency distribution of the variants in your data**.  (This is because rarer SNPs tend to have lower LD levels).  

For extra kudos, use `plink --freq` to compute the frequency of variants before and after pruning above, and then plot their histograms in R - are they similar?

Another way to thin variants is simply to thin by distance, or by genetic distance.

:::

## Computing principal components

Now let's extract the pruned (independent) variants and perform PCA:

```sh
./plink2 --vcf ALL.chr21.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz \
--double-id --snps-only --max-alleles 2 \
--set-missing-var-ids @:#\$r,\$a \
--extract g1k_pruned.prune.in \
--export vcf \
--pca \
--out g1k_chr21_pruned
```

In this command:

`--max-alleles 2` includes only biallelic variants

`--extract` tells plink to only work with post-pruning variants

`--export` outputs a vcf file

`--pca` perform principal component analysis. It extracts top principal components from the variance-standardized relationship matrix computed by `--make-rel/--make-grm-{bin,list}`. 

We expect three output files from this step:

1. a pruned vcf file: `g1k_chr21_pruned.vcf` (this file should contain 22,452 variants)

2. `g1k_chr21.eigenvec` file contains the requested number (10) of principal components (PCs) 

3. `g1k_chr21.eigenval` file contains the corresponding eigenvalues, one per line. 

## Loading the genotype data

Lastly let's convert some genotype data from vcf format (standard, but hard to work with) into a .tsv file for easier downstream work. To do this we will use the `vcfR` package, let's get that now.  It resides in [bioconductor](https://bioconductor.org) so we'll use `BiocManager` to get it:

```r
# List of packages you will need for this course
packages <- c( "vcfR", "tidyverse" )

# Install packages if they aren't installed already
# We are 
new_packages <- packages[!(packages %in% installed.packages()[,"Package"])]
if (!requireNamespace("BiocManager", quietly=TRUE))
    install.packages("BiocManager")

# using BiocManager to install packages
if(length(new_packages)) BiocManager::install(new_packages)

# Load the packages
lapply( packages, library, character.only = TRUE )
```

Make sure your R session is pointing at the current directory (where you downloaded the data) using `setwd()` or the Sessino menu in Rstudio, and let's load the data:

```r
vcf_file <- "g1k_chr21_pruned.vcf"
chr21 <- read.vcfR( vcf_file, verbose = FALSE )
dim(chr21)
```

## Re-coding the genotype data

Since `.vcf` files have a lot information included that isn’t necessary for our analysis, we will extract the genotypes and convert it into a form that we can easily use in R. So, here, we extract the character data containing the genotypes, and convert it into numeric scores that we can later use in our analysis.

If you've looked at a VCF file you'll know they can be a bit complex - luckily the `vcfR` package has a `vcfR::extract.gt()` function that can do the work for us:

```r
chr21_common_geno <- vcfR::extract.gt(
    chr21, 
    element = "GT",
    IDtoRowNames  = FALSE,
    as.numeric = TRUE,
    convertNA = TRUE,
    return.alleles = FALSE
)
```

For this analysis we will subset down to 10,000 SNPs to maek the analysis run smoothly.
For simplicity we'll just go ahead and pick these at random, and save the results:

```
idx <- sample( 1:nrow(chr21_common_geno), size = 10000 )
```

and let's save it:
```r
library( tidyverse )
write_delim(
    as_tibble(chr21_common_geno[idx,]),
    file = "g1k_common_genotypes.txt",
    delim = " "
)
```

You can look at this file using, for example, `less -S` in your terminal to see what it looks like. In short we've stored just the genotype dosages (dosage of the alternate allele, i.e. 0, 1, or 2) for each of our selected SNPs and all 2,504 samples in the 1000 Genomes Project data.
