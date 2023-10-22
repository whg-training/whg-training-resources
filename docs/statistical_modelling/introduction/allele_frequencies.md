---
sidebar_position: 100
---

# Estimating allele frequencies

Let's use [Bayes](./bayes.md) to estimate allele frequencies - quantifying our uncertainty - for a couple of important
variants in global populations.  Here are the datasets:

1. Data on the O blood group variant (rs8176719): [O blood group data](https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/statistical_modelling/introduction/data/1000_genomes_o_blood_group_grouped.tsv)

rs8176719 has two alleles - the functional 'C' allele, and a deletion allele that results in a
[frameshift](https://en.wikipedia.org/wiki/Frameshift_mutation).  Individuals that have two copies of the deletion have
'O' blood group.

2. Data on **rs61028892**, a variant that has been associated with [control of fetal
haemoglobin](https://www.medrxiv.org/content/10.1101/2023.05.16.23289851v1.full) in individuals with sickle cell
disease: [rs61028892 data](https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/statistical_modelling/introduction/data/1000_genomes_rs61028892_grouped.tsv)

:::tip Challenge

Load one or both of these datasets into R using `read_tsv()`.  Then  use `dbeta()` to plot the posterior distribution of
the allele frequency and/or the O blood group frequency across all populations and then in individual populations.

**Hint.** `ggplot()` is a good way to do this.  Some further tips on this are below.

:::


:::tip Challenge

Add 95% credible intervals for each population to the data frame, using `pbeta()`, and then plot these as the estimates
(points) and 95% confidence intervals

:::

## Plotting multiple populations

To get `ggplot()` to plot densities for multiple populations, you have to make a giant dataframe that for each
population has one value per `x` axis value.  So you may need a loop to do this.  For example, here is one approach.

First let's create a data frame to hold the result:
```
pdf = tibble()
```

Now loop over populations and evaluate the distribution:
```
x = seq( from = 0, to = 1, by = 0.01 )
for( i in 1:nrow( data )) {
	row = data[i,]
	# Plot the allele frequency
	a = 2 * row[['C/C']] + row[['-/C']]
	b = 2 * row[['-/-']] + row[['-/C']]
	pdf = dplyr::bind_rows(
		pdf,
		tibble(
			population = rep( d[['population']], length(x)),
			`C` = a,
			`-` = b,
			x = x,
			value = dbeta( x, shape1 = a+1, shape2 = a+2 )
		)
	)
}
```

To plot distributions for multiple populations in base R, probably the best way is to use `layout()` to make multiple plots.
This works but getting the margins right can be a bit tricky.  Let's try:
```
N = 
layout( matrix = c(0,)))
```

