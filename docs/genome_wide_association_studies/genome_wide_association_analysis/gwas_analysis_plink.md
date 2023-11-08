---
sidebar_position: 1.5
---

# A toy GWAS

Before we get started properly let's run a little toy example.

## Testing for association

A basic GWAS study begins by running regression (usually linear regression for quantitative traits,
or logistic regression for case/control traits like the one we are using) between each genetic
variant in the genome and the phenotype of interest. We can run a first tiny GWAS by running:

```sh
./plink --vcf snp-example.vcf --logistic --pheno snp-example.samples --allow-no-sex
```

:::tip Note

The `--allow-no-sex` option is needed when working with VCF files in plink. This works around plink's default behaviour which
removes samples without a sex assignment - VCF files don't record sample sex, so this is necessary.

:::

PLINK has again generated two files in the directory we are working in: `plink.log` and `plink.assoc.logistic`. The log file
simply captures the status information that PLINK reports with each run. The other gives the logistic regression output.

:::tip Question

How many cases and controls are included in this data?
:::

If you look in the `plink.assoc.logistic` file we will see that this SNP, rs8135996, is associated with our phenotype.

:::tip Questions

**Q**. What is the p-value of association?  What is the odds ratio?

**Q**. And what does the odds ratio mean anyway? If this is a disease trait, is it good news to
have the 'G' allele? Or to have the 'A' allele? And how bad is it to have the risk allele?

**Advanced Question**. What does `ADD` mean in the output? Can you figure out how to run a
non-additive test? Which mode of inheritance has the greatest evidence?
:::

## Forest plotting

If you followed other parts of our training on statistical modelling, we argued that what you want is to summarise the
likelihood by its *maximum likelihood estimate* and its *standard error* - thus approximating the likelihood function by a
gaussian function. For logistic regression the appropriate values are the *log odds ratio* and its standard error.

By default plink hasn't given us the standard error so let's compute it now. 
First let's get plink to give us the logistic regression estimate - the *log odds ratio* instead of the odds ratio.
Reading the [documentation for
--logistic](https://www.cog-genomics.org/plink/1.9/assoc#linear) you'll see there is an option called "beta" to the --logistic
command that does this.  

> "For logistic regressions, the 'beta' modifier causes regression coefficients instead of odds ratios to be reported."

Finally there is also a `--ci` option that computes a confidence interval.  Let's apply those now:

```sh
./plink --vcf snp-example.vcf --logistic beta --ci 0.95 --pheno snp-example.samples --allow-no-sex
```

Load this output file into R now:
```R
# in R
X = read_table( "plink.assoc.logistic" )
```

If you look at the result, you'll see it has output a `BETA` column instad of the original `OR`, and also has `SE` (standard
error) and confidence interval columns.  Let's plot that now:

```r
(
	ggplot( data = X )
	+ geom_point( aes( x = BETA, y = SNP ))
	+ geom_segment( aes( x = BETA - 1.96 * SE, xend = BETA + 1.96 * SE, y = SNP, yend = SNP ))
	+ geom_vline( xintercept = 0, linetype = 2 )
	+ xlab( "Log odds-ratio" )
	+ ylab( "SNP" )
	+ theme_minimal( 16 )
	+ theme( axis.title.y = element_text( angle = 0, vjust = 0.5 ))
)
```

or in base R:

```
plot.betas <- function( betas, ses ) {
	plot(
		betas, 1:length(betas),
		pch = 19, # make filled dots
		main = "rs8135996 forest plot",
		xlab = "log odds ratio",
		ylab = "",
		xlim = c( -0.5, 0 ),
		yaxt = 'n' # Turn off y axis ticks
	)
	segments(
		x0 = betas - 1.96 * ses,
		x1 = betas + 1.96 * ses,
		y0 = 1, y1 = 1,
		col = 'grey'
	)
	abline( v = 0 ) # draw a solid black line at 0
	grid()
}

plot.betas( X$BETA, X$SE )
```

Congratulations! This is your first GWAS forest plot (albeit with only one row).

## Renaming output files

Running `plink --logistic` is all very well, but it's a bit annoying to have files named simply `plink.logistic.assoc`
and so on.  Instead lets re-run plink telling it to rename its output files (important since we’ll be generating lots of
them in the practicals).  The `--out` option can be used to do this:

```sh
./plink \
--vcf snp-example.vcf \
--logistic beta \
--beta \
--ci 0.95 \
--pheno snp-example.samples \
--allow-no-sex \
--out getting-started
```

Now the output files will be named `getting-started.log` and `getting-started.assoc.logistic`. This is the basic pattern
to working with PLINK: specifying input files and analyses, along with an output name to save results.

:::tip Note

The backslashes in the above command are shell line continuation characters - they let us put the command on multiple lines.
Some of these commands will get pretty long, so it's useful to put them on multiple lines like this!

:::

With this background in using plink - it's time to go on to [analysing a simulated GWAS study](gwas_quality_control.md).

