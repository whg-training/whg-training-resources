---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Conclusions and challenges

If you've made it through this tutorial and the [earlier part](../programming_with_gene_annotations3/) -
congratulations!  I hope it was useful to you.

If you haven't done much programming or data analysis work before then this might have been a bit of a challenge.  We've
covered a number of topics - 

- basic programming in R or python
- using basic data structures, in particular the highly useful **data frame**.
- using the key [data manipulation verbs](./004_filter_join_merge.md), either using the [dplyr](dplyr.tidyverse.org) library or [sqlite](https://www.sqlite.org). (Or [pandas](https://pandas.pydata.org) in python.)
- Creating [R or python packages](../programming_with_gene_annotations3/007_making_a_module.md), and using them to make [useful command-line programs](../programming_with_gene_annotations3/008_Converting_gff_to_sqlite.md).
- using sqlite to store and access data
- designing and writing algorithms, like our [algorithm to merge regions)[./how_much_in_genes/002_an_algorithm_to_merge_regions.md].
- we also covered techniques for [measuring memory use](../programming_with_gene_annotations3/005_testing_it_out.md#trying-some-real-data).

And we hope you've picked up some good habits along the way, which we could summarise as:

- **test**, **test**, **test**!
- **visualise**, **visualise**, **visualise**!
- Always **sanity check** results!

## Challenges

:::tip Question

In the [introduction to R](../introduction_to_R/working_with_data.md) we saw a curious fact.  In humans, the GC content
of human chromosomes appears to be inversely related to chromosome length.

**Question** Could this be due to gene density?  That is - maybe shorter chromosomes have higher densities of genes - and genes are [known to be associated with higher GC content](https://en.wikipedia.org/wiki/GC-content).

**Challenge 1** If you haven't already done so, quantify this relationship by fitting a [linear regression](../../statistical_modelling/regression_modelling/linear_regression_1.md) of the GC content on the chromosome length.  What is the estimated decrease in %GC per Mb increase in chromosome length?

**Challenge 2**: use the techniques of this tutorial to compute the gene density on each chromosome - that is, the
proportion of each chromosome that is in genes.  Now repeat the linear regression including the gene density as a
covariate.  Does gene density 'explain' the relationship?

How does this play out for other species?

Good luck!

:::
