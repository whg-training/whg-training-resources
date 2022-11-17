---
sidebar_position: 3
---

# Association Practical

Now we will test for association between the SNPs in our dataset and the disease outcome.

## Conducting a basic GWAS

### Testing in the original data

Basic association tests using logistic regression can be carried as follows:

```sh
./plink --bfile chr19-example --logistic beta --out basic-test --keep-allele-order
```

:::tip question
Load these results in R...
```
data = read.table( "basic-test.assoc.logistic", header = TRUE )
```
...and explore them further.

How many SNPs seem to be associated (e.g. at $P=0.01$, or $P=0.0001$)? Is this what you expect? Why?

:::

Let's create a **manhattan plot** to visualise these results. This plots the evidence for association (as summarise in the
P-value) on the y axis, against the position of the variant on the x axis:

```R
# In R:
library( tidyverse )

print(
    ggplot(
        data = data,
        mapping = aes( x = BP, y = -log10( P ))
    )
    + geom_point()
    + xlab( "Position on chromosome 19")
    + ylim( c( 0, 80 ))
)
```

(I've added the y limit just so we can easily compare with the next plot.)

:::tip Question

Which of these statements do you agree with?

* Wow - lots of genetic variants on chromosome 19 are associated with the disease!
* Some genetic variants on chromosome 19 are associated, but it's hard to tell which ones.
* Something is confounding the results - they are much too noisy.

(Also - why do we plot $-\log_{10}(\text{p-value})$ instead of just the p-value here?)
:::

### A cleaner GWAS

It's not really surprising we saw all that noise - after all, we have used the raw data above. Quality control issues are one
of the main potential confounders in GWAS studies; since we are looking for small differences in frequency between cases and
controls, any small biases in genotyping rates or data quality can affect results.

To see if that's the explanation, let's now test for association within the cleaned dataset we created earlier:

```sh
./plink --bfile chr19-clean --logistic beta --out clean-test --keep-allele-order
```
Read this new dataset into R (as above) and look at the plot of association p-values.

```R
#In R:
data = read.table( "clean-test.assoc.logistic", header = TRUE )
print(
    ggplot(
        data = data,
        mapping = aes( x = BP, y = -log10( P ))
    )
    + geom_point()
    + xlab( "Position on chromosome 19")
    + ylim( c( 0, 80 ))
)
```

Aha! That looks... better?

:::tip Question

Compare to the previous plot - how has cleaning the data affected our signals of association? What does that imply about the associations seen in the
previous analysis?

(When you're ready you can remove the `ylim` part above, to get a better view of the cleaned data association scan.)

:::

### The distribution of association test statistics

In addition to using data cleaning to remove strong false positive associations, we are also interested in checking whether
the overall distribution of test statistics seems sensible. One way to look at this is to compare the observed association
results to what our expectation would be if there weren't any associaitons (i.e. under the 'null' model). 

Let's do that now by making a **quantile-quantile plot** (qq plot) comparing the observed p-values to a set of uniformly
distributed values:

```R
# In R:

number_of_tests = length(data$P)
qqplot_data = tibble(
    observed_pvalue = sort( data$P ),
    expected_pvalue = (1:number_of_tests)/(number_of_tests+1)      # uniformly distributed values.
)

print(
    ggplot(
        data = qqplot_data,
        mapping = aes( x = -log10( expected_pvalue ), y = -log10( observed_pvalue ))
    )
    + geom_point()
    + geom_abline( intercept = 0, slope = 1, col= 'red' )
    + xlab( "-log10 (expected p-value)" )
    + xlab( "-log10 (observed p-value)" )
    + annotate(
        "text",
        label = sprintf( "Median p = %.2f", median( data$P )),
        x = 1, y = 11
    )
)
```

The quantile-quantile plot is very useful in evaluating GWAS data for systematic bias. It compares the empirical distribution
of values against the expected distribution if drawn from a uniform distribution.  

The **expected median p-value** (if there were no associations) is 0.5. If the median P-value is much below this, it indicates
there are more small p-values than expected by chance. The diagonal line shows where the points should fall if the null
hypothesis that there are no association signals were true at most SNPs.

:::tip Question

What does this plot tell us about our current association analysis?  

:::

There's clearly still something odd about this test - maybe there are other confounders?
To find out, let's try [controlling for population structure](population_structure.md).

### Aside on other tests

:::tip Challenge question

The test we have been running is an 'additive' model (meaning that each copy an allele carried by each individual contributes
the same amount, on the log-odds scale. Of course associations might also have other architectures, for example dominance or
recessive effects. By referring to the [PLINK documentation](https://www.cog-genomics.org/plink/1.9/), can you work out
 how to conduct these tests using `--logistic` option?

:::


