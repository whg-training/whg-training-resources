---
sidebar_position: 3
---

# Fst

$F_{ST}$ is a statistical measure used to quantify the degree of genetic differentiation or genetic structure among populations. 

$F_{ST}$ is calculated based on the genetic variation within and between populations. It typically ranges from 0 to 1, with higher values indicating greater genetic differentiation. 

When $F_{ST}$ is 0, it means that there is no genetic differentiation between populations (all populations have
identical allele frequencies).  So in a sense all the genetic diversity is within the populations.  In contrast, when
$F_{ST}$ is 1, it indicates complete genetic differentiation, with no shared genetic variation between populations.

$F_{ST}$ is conceptually a number that applies to whole populations - while what we typically have is data on a smaller
sample of individuals.  To handle this there are several different formula that estimate $F_{ST}$ - surveyed in [Bhatia
et al 2013](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3759727/)  Here, we adopt the estimation approach from
[Hudson et al. 1992](https://doi.org/10.1093/genetics/132.2.583).

Assume we have two populations **pop1** and **pop2**. Hudson's $F_{ST}$ can be calculated by: 

$$

F_{ST}^{Hudson} = \frac{(p1-p2)^2 -\frac{p_1(1-p_1)}{n_1-1}-\frac{p_2(1-p_2)}{n_2-1}}{p_1(1-p_2) + p_2(1-p_1)}

$$

where $n_i$ is the sample size of population $i$ and $p_i$ is the sample allele frequency in population $i$. This
formula applies to a single variant - it answers 'how differentiated is this variant between the two populations'?
A simple way to ask 'how differentiated are the populations' is to average this value across a large set of variants, and that's what we'll do.

Let's code it in R:

## Setting up R environment
```r
library( tidyverse )
library( ggplot2 )
library( ggpubr )
library( vcfR )
```

Here is a function to compute Hudson's estimator of $F_{ST}$.  We'll actually extend a little bit to compute the *mean
$F_{ST}$ between multiple populsion

```r
Hudson_Fst <- function( p1, p2, n1, n2 ) {
    numerator = (p1-p2)^2 - p1*(1-p1)/(n1-1) - p2*(1-p2)/(n2-1)
    denominator = p1*(1-p2) + p2*(1-p1)
    hudson = numerator / denominator
    # before taking the man, let's get rid of any monomorphic variants!
    hudson = hudson[denominator != 0]
    return( mean( hudson) )
}
```


## Calculate Fst using common chr21 genotypes from the 1000 Genomes Project
```{r}
# read in genotypes (10,000 randomly selected common marker in 1000 Genome Project)
chr21 <- read.table("g1k_common_genotypes.txt",h=T,stringsAsFactors = F)
dim(chr21)

# now let's load the sample ancestry information
pop <- read.table("integrated_call_samples_v3.20130502.ALL.panel",h=T,stringsAsFactors = F)

#simplify sample names
samples <- unlist(lapply(names(chr21), function(x) unlist(strsplit(x, split = "_"))[1]))

```

## $F_{ST}$ between European and East Asian individuals
```{r}
# subset only European samples and get genotypes
eur <- pop[pop$super_pop=="EUR",]$sample
eurGeno <- chr21[,samples %in% eur]

# subset only East Asian samples and get genotypes
eas <- pop[pop$super_pop=="EAS",]$sample
easGeno <- chr21[,samples %in% eas]

# Obtain frequencies of 10,000 variants
eurFreq <- rowSums( eurGeno ) / (2*ncol(eurGeno))
easFreq <- rowSums( easGeno ) / (2*ncol(easGeno))

## Calculate Hudson Fst
Fst_eur_eas <- Hudson_Fst(p1 = eurFreq,p2 = easFreq, n1=length(eur),n2=length(eas))
print(paste("Fst between European and East Asian is", signif(Fst_eur_eas,2)))
```

## $F_{ST}$ between European and African individuals

Interesting!  Now let's try measuring between African and European individuals:

```{r}
# subset only African samples and get genotypes
afr <- pop[pop$super_pop=="AFR",]$sample
afrGeno <- chr21[,samples %in% afr]

# SNP frequency among African individuals
afrFreq <- rowSums( afrGeno ) / (1*ncol(afrGeno))

## Calculate Hudson Fst
Fst_eur_afr <- Hudson_Fst(p1 = eurFreq,p2 = afrFreq, n1=length(eur),n2=length(afr))

print(paste("Fst between European and African is", signif(Fst_eur_afr,2)))

```

## $F_{ST}$ between East Asian and African individuals
```{r}
Fst_eas_afr <- Hudson_Fst(p1 = easFreq,p2 = afrFreq, n1=length(eas),n2=length(afr))

print(paste("Fst between East Asian and African is", signif(Fst_eas_afr,2)))
```

## The choice of markers affects Fst

You should note that all these values are relative to the set of markers chosen. 

For example, what happens if we randomly pick 1000 markers?

```r
idx <- sample( 1:nrow(chr21), size=1000 )

# Calcuate Hudson Fst
Fst_eur_afr <- Hudson_Fst(p1 = eurFreq[idx],p2 = afrFreq[idx], n1=length(eur),n2=length(afr))
Fst_eur_eas <- Hudson_Fst(p1 = eurFreq[idx],p2 = easFreq[idx], n1=length(eur),n2=length(eas))
Fst_eas_afr <- Hudson_Fst(p1 = easFreq[idx],p2 = afrFreq[idx], n1=length(eas),n2=length(afr))


print(paste("Fst between European and East Asian is", signif(Fst_eur_eas,2)))
print(paste("Fst between European and African is", signif(Fst_eur_afr,2)))
print(paste("Fst between East Asian and African is", signif(Fst_eas_afr,2)))
```

If you run this a few times, you should see slightly different values.

## Fst between populations within a continent

How differentiated are populations within continents?

```r
# see how many subpoputions were collected  within Europe
table( pop[pop$super_pop == "AFR",]$pop )

# let's caculate Fst between UK (GBR) and Finland (FIN)
# subset only GBR & FIN samples
gbr <- pop[pop$pop=="GBR",]$sample
fin <- pop[pop$pop=="FIN",]$sample

# GBR & FIN genotypes
gbrGeno <- chr21[, samples %in% gbr]
finGeno <- chr21[, samples %in% fin]

# Obtain frequencies of 10,000 variants

gbrFreq <- rowSums( gbrGeno ) / (2*ncol(gbrGeno))
finFreq <- rowSums( gbrGeno ) / (2*ncol(gbrGeno))

# Calculate Fst
Fst_gbr_fin <- Hudson_Fst(p1 = gbrFreq,p2 = finFreq, n1=length(gbr),n2=length(fin))

print(paste("Fst between Britain and Finland is", signif(Fst_gbr_fin,2)))

```

When I run this, my answer is **negative**!

# Interpreting negative Fst

If you are getting a negative Fst, don't panic!  Remember we are making an *estimate* of the $F_{ST}$ between the
populations.  The estimate varies due to sampling noise and can be negative (or greater than $1$).  In this case you could reasonably treat the estimate as zero. i.e. the two populations don't have much differentiation.

:::tip Note

Of course this is not true - British and Finnish individuals are genetically different! This only means, among the
common genetic variants (in Chromosome 21) that we used, there is no detectable differences. This shows that $F_{ST}$
computed this way is only a relative measure, and depends on what the input variants are.  It's *NOT* an absolute value!

:::
