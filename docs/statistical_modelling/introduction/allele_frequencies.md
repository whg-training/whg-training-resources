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

Both datasets above come from the [1000 Genomes Project Phase 3
dataset](https://www.internationalgenome.org/data-portal/data-collection/phase-3).

:::tip Challenge

Load one or both of these datasets into R using `read_tsv()`.  Then  use `dbeta()` to plot the posterior distribution of
the allele frequency and/or the O blood group frequency across all populations and then in individual populations.

**Hint.** `ggplot()` is one good way to do this.  Some further tips on this are below.

:::

:::tip Challenge

Add the posterior mean and lower and upper values forming a 95% credible set to the data frame.

Add 95% credible intervals for each population to the data frame, using `pbeta()`, and then plot these as the estimates
(points) and 95% confidence intervals

:::

## Plotting multiple populations

To get `ggplot()` to plot densities for multiple populations, you have to make a giant dataframe that for each
population has one value per `x` axis value.  So you may need a loop to do this.  For example, here is one approach
(we'll plot the O blood group variant allele frequency here.)

First let's create a data frame to hold the result, and a grid of x values to work with:
```
plot_data = tibble()
x = seq( from = 0, to = 1, by = 0.01 )
```

Now loop over populations and evaluate the distribution. We use `bind_rows()` (part of [dplyr](dplyr.tidyverse.org)) to
expand our data frame.  (Although `rbind()` from base R also works.).

```
for( i in 1:nrow( data )) {
	row = data[i,]
	population = row[['population']]
	nonO = row[['C/C']] + row[['-/C']]
	O = row[['-/-']]
	plot_data = dplyr::bind_rows(
		plot_data,
		tibble(
			population = population,
			`nonO` = nonO,
			`O` = O,
			x = x,
			value = dbeta( x, shape1 = O+1, shape2 = nonO+1 )
		)
	)
}
```

Now the distributions can be plotted:
```
p = (
	ggplot( data = plot_data )
	+ geom_line( aes( x = x, y = value ))
	+ facet_grid( population ~ ., scales = "free_y" )
	+ theme_minimal()
)
print( p )
```

As usual this can be improved with a bit of ggplot theming.  Let's rotate the facet 'strip' labels:

```
print(
	p + theme(
		strip.text.y.right = element_text(angle = 0, hjust = 0)
	)
)
```

Whilst we're at it, let's get rid of the actual tick numbers on the left.  (After all, all [distributions sum to
1](./some_distributions.md) so the y axis scale is not really important for this visualisation.)
```
print(
	p + theme(
		axis.text.y = element_blank(),
		strip.text.y.right = element_text(angle = 0, hjust = 0),
		axis.title.y = element_text(angle = 0, vjust = 0.5)
	)
	+ xlab( "x" )
	+ ylab( "posterior density" )
)
```

:::caution Note

Most of those distributions are quite well-defined but a few are much more spread out.  Why is this?  (Look back at the
data.)  

(You could merge the data for those populations into the corresponding larger sets, if you wanted to - or remove them.)

:::

:::tip Order the points

Wouldn't it be nicer to order the populations by allele frequency? To get ggplot to do this you will need to  turn the
`population` column into a **factor** - that is a set of strings with a definite set of **levels**, which you can order.

For example:
```
data$O_bld_grp_frequency = data[['-/-']] / ( data[['C/C']] + data[['-/C']] + data[['-/-']])
populations = (data %>% arrange( O_allele_frequency ))$population
data$population = factor( data$population, levels = populations )
```

If you use `str(data)` you'll see that the `population` column has turned into a factor.

Now if you regenerate the data frame and plot, things should be in order.

:::


