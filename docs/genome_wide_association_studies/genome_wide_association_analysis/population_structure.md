---
sidebar_position: 4
---

# Controlling for population structure

We have seen how applying appropriate quality control filters to our data eliminated many false positives, but a systematic
inflation remained. The most common source of test statistic inflation is population stratification, as this can act as a
confounder. 

To try to solve this, let's include a set of **principal components** as covariates in our regression. In causal diagram
terminology, including the principal components serves to 'control' for population structure, so that the remaining estimate
of the genotype on the disease might represent a true causal effect.

We can use principal component analysis to measure the genetic structure within the dataset, and use these
estimated components as covariates in the association analysis.

The file `chr19-example.pca` contains the principal components for this dataset. If you haven't done so already (in an earlier
practical), try plotting them now to see what this genome-wide genetic structure of the samples looks like:

```
pcs = read.table( "chr19-example.pca", header = TRUE )
# The country identifier is stored in the FID column
pcs$population = pcs$FID

print(
    ggplot( data = pcs, aes( x = pc1, y = pc2, colour = population ))
    + geom_point()
)
```

You should see there is a great deal of population structure! The different population groups definitely have different
ancestral backgrounds.

:::tip Note

Try plotting other pairs of principal components as well - say, `pc2` vs. `pc3` and so on.  Do they all show structure?
:::

To include these PCs as covariates in our association test, we can use the `--covar` option to plink.  Let's try this now:

```sh
./plink \
--bfile chr19-clean \
--logistic beta \
--ci 0.95 \
--covar chr19-example.pca \
--out pccorrected-test \
--keep-allele-order
```

We have now produced an analysis corrected for population structure. Congratulations!

:::tip Note

The above is starting to look like a production-ready GWAS scan, so we have added a couple of useful options including:

* the `beta` option to `--logistic`, which tells plink to output an effet size estimate on the **log-odds** scale (instead of an odds ratio)

* the `--ci` option, which makes plink output a standard error and a confidence interval.

* The `--keep-allele-order` option, which prevents plink from 'flipping' the two alleles around. (By default it will output
  test statistics for the minor, i.e. less common allele.) This is helpful if we compare across studies, because we want
  effect sizes to be relative to the same allele in all studies (but the minor allele might vary between studies).

These options are particularly useful if you are using the output in a meta-analysis with other studies.
:::

Now use R to examine these results.

**Note.** the output file “pccorrected-test.assoc.logistic” contains information for the SNPs and also all the principal
components. To repeat the earlier analysis, make sure you extract just the SNP lines (those that have “ADD” in the TEST
column):

```R
# In R:
data <- read.table( "pccorrected-test.assoc.logistic", header = T )
data <- data[data$TEST == "ADD",]
```

:::tip Challenge questions

Repeat our earlier analysis for this hwas - create a manhattan plot, a q-q plot, and a summary of the most-associated variants
- and answer the following:

* Has stratifying by disease group corrected our inflation?  (Hint: re-make the QQ-plot.)

* Are there any disease associations in this dataset?  Where are they?  (Hint: re-make the manhattan plot.)

* What do the QC statistics look like for any associated SNPs?  (For example, the frequency or missingness rates?)  Do these associations look plausible?

* Can you find out anything about the function of these associated SNPs using online tools such as [UCSC Genome
  Browser](https://genome.ucsc.edu/cgi-bin/hgGateway). (Note that our data is using GRCh37/hg19 coordinates.). Could they be
  functional?

* What factors explain the differences in association p-values in the different analyses we’ve done?

:::

## Job done?

Not quite!  A complete analysis, will zoom in and create association 'hit' plots in each region.


