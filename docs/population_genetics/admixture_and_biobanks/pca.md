---
sidebar_position: 4
---

# Principal component analysis of the 1000 Genomes Project

The example is based on a subset of genotype data of common variant included in the 1000 Genome Project (chromosome 21
only). 

:::tip Note

You should have already generated the dataset (`g1k_common_genotypes.txt.gz`) yourself.
If not please run the [setup section](./getting_setup.md).
:::

We are now ready to examine the PCA we computed.

## Loading the PCs:
Let's load the data first (make sure your R session is pointing to the correct folder).

```r
library( tidyverse )
library( ggplot2 )
library( ggpubr )

pca <- read.table( "g1k_chr21.eigenvec", header = FALSE, stringsAsFactors = F )
eigenval <- scan( "g1k_chr21.eigenval", as.numeric() )
```

## Summarizing and ploting

Let's determine the percentage of variation explained by each PC. The first thing we'll do is **name the columns**
(because plink, rather unhelpfully, doesn't output column names).

```r
# set names
names(pca)[1] <- "iid"
names(pca)[2] <- "fid"
names(pca)[3:ncol(pca)] <- paste0("PC", 1:(ncol(pca)-2))

```

It turns out that the 'eigenvalues' reflect the *proportion of variance explained* by the corresponding principal
components.  Since the PCs are orthogonal (at right-angles to each other), we can simply sum their variances to
calculate total variant explained.  For example, let's calculate the total variance explained by the first 10 PCs:

```

pve <- data.frame( PC = 1:10, percent_explained = eigenval / sum(eigenval)*100 )
pve$label = sprintf( "%.2f%%", pve$percent_explained )

(
  ggplot(pve, aes(x = as.factor(PC), y = percent_explained ))
  + geom_col()
  + geom_text( aes( label = label, vjust = -0.2 ))
  + xlab( "Principal Components" )
  + ylab( "% Variance Explained" )
  + theme_classic()
)
```

## Ploting the top 2 PCs
```r
(
  ggplot(pca, aes(PC1, PC2))
  + geom_point(size = 1)
  + theme_classic()
)
```

## Adding population labels

These PCs were [computed on](./getting_setup.md) all 1000 Genomes populations - and you can see there is some nice
separation into different clusters among different individuals.  Are these really different populations?  Let's add
their population label now, so we can check whether individuals (as in their point) really are grouping by their genetic
ancestry:

```r
# read in population information
pop <- read_table( "integrated_call_samples_v3.20130502.ALL.panel" )

# assign continental population to each sample
pca$superPop <- pop[ match( pca$iid, pop$sample ),]$super_pop
(
  ggplot(pca, aes( x = PC1, y = PC2, col=superPop))
  + geom_point(size = 1)
  + theme_classic()
  + xlab(paste0("PC1 (", signif(pve$percent_explained[1], 3), "%)"))
  + ylab(paste0("PC2 (", signif(pve$percent_explained[2], 3), "%)"))
)
```

Interesting!

:::tip Question

Which populations define the main axes of variation here?

What if you plot other PCs - say, PCs 2 and 3, or others?

:::