---
sidebar_position: 5
---

# ADMIXTURE analysis

`ADMIXTURE` is among many other software (e.g. STRUCTURE) that perform clustering based on genotyping data to infer
populations and individual ancestries.  It is more **model-based** than PCA (which after all just pulls out 'directions'
in space that maximise variance) - it models the input populations in terms of some set of unknown 'ancestral'
 populations, with admixture between them.  Then for each individual it outputs an estimate of how much of their genome
 is from each ancestral population.

You can download the software [at the ADMIXTURE github page](https://dalexander.github.io/admixture/download.html). You
can also [read the manual](https://dalexander.github.io/admixture/admixture-manual.pdf).

:::tip Note
If you receive 'Cannot Be Opened Because the Developer Cannot be Verified' Error on Mac, you can try the following:

1. Open `Finder`.

2. Locate ADMIXTURE software you’re trying to open.

3. `Control+Click` the app.

4. Select Open.

5. Click Open.

The app should be saved as an exception in your security settings, allowing you to open it in the future.
:::

Let's try running ADMIXTURE now.

## Generating the input file for ADMIXTURE

`ADMIXTURE` requires unlinked (i.e. LD-pruned) SNPs in PLINK format. Good news, since we'ce [already generated a set
like that](./getting_setup.md).

Previously, we've output the pruned file (1000 Genomes Chromosome 21) into the vcf format, but for ADMIXTURE we need to
convert them into PLINK (.bed/bim/fam) format.  Let's do that now using PLINK:

```sh
# Generate the input file in plink format
./plink2 \
--vcf g1k_chr21_pruned.vcf.gz \
--snps-only \
--max-alleles 2 \
--make-bed \
--out g1k_chr21_pruned

```

## Running ADMIXTURE

Now, we are ready to run ADMIXTURE. We will run it with cross-validation (the default is 5-fold CV, for higher, choose
e.g. cv=10) and `K=3`. `K` here is the number of clusters, i.e., ancestral populations that you might have. `Bonus`: Try
other values (2,3,4,5,6, etc) and see what you have! 

```sh
admixture --cv g1k_chr21_pruned.bed 3 > admixture_k3.out # saves the log file
```

After running this command, you now should have two new files appear in the same directory! 

`g1k_chr21_pruned.3.P` contains for each SNP the population allele frequency

`g1k_chr21_pruned.3.Q` contains cluster assignment for each individual, this is what we usually need for admixture plotting

# Plotting in R
Now we are ready to plot a typical ADMIXTURE-barplot for `K=3`:

## Setting up R environment
```r
# load library
library("tidyverse")

# read in data
adx <- read.table("g1k_chr21_pruned.3.Q",h=F)
names(adx) <- c("K1","K2","K3")
fam <- read.table("g1k_chr21_pruned.fam",h=F)

# rename samples
samples <- unlist(lapply(fam$V2, function(x) unlist(strsplit(x, split = "_"))[1]))

# admixture individuals that the same order at the input fam file
adx$sample <- samples

# to group/confirm/understand our ADMIXTURE results we can also assign their ancestry
pop <- read.table("integrated_call_samples_v3.20130502.ALL.panel", header = TRUE, stringsAsFactors = FALSE )

adx$ancestry <- pop[ match(adx$sample,pop$sample),]$super_pop

# Now we are ready to plot
pop_colors <- c("#1D72F5","#77CE61", "#FF9326") 
pop_labels <- c("African","East Asian","European")

barplot(t(as.matrix(adx[,1:3])), col = pop_colors, ylab = "Ancestry Proportion",border=NA)
```

# Looking a bit messy? Let's reorder the samples!

```r
pltDf <- adx %>% 
  mutate(id = row_number()) %>% 
  gather('pop', 'prob', K1:K3) %>% 
  group_by(id) %>% 
  mutate(likely_assignment = pop[which.max(prob)],
         assingment_prob = max(prob)) %>% 
  arrange(likely_assignment, desc(assingment_prob)) %>% 
  ungroup() %>% 
  mutate(id = forcats::fct_inorder(factor(id)))

ggplot(pltDf , aes(id, prob, fill = pop)) +
  geom_col() +
  theme_classic()  + 
  facet_grid(~ancestry, scales = 'free', space = 'free') +
  theme(
    axis.title.x = element_blank(),
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "none"
  ) +
  scale_fill_manual(values=pop_colors) +
  ylab("Ancestry Proportion")
```

N.B. There are many packages in R that can do this job with varying number of K, and in more complicated settings, such
as [pophelper](https://www.royfrancis.com/pophelper/).

Congratulations!  You have now completed an ADMIXTURE analysis!
