---
sidebar_position: 2
---

# Analysing a GWAS

We will now work with a set of data files containing many SNPs from chromosome 19 genotyped on controls and cases. Data from a
GWAS would contain SNPs at this density across the entire genome, but we will focus on just one chromosome to make the
exercises more tractable.

Our first task will be to **quality control** the dataset to remove unusual SNPs and samples.

## Basic quality control using plink

### Converting data to binary format
The key files are `chr19-example.vcf.gz` and `chr19-example.samples`. If you followed the [getting started
section](./getting_setup.md), you should already have these in your folder.

Before getting started, let's convert these files from VCF format to a 'binary PED' format that PLINK can read more
easily:

```sh
./plink --make-bed \
--vcf chr19-example.vcf.gz \
--pheno chr19-example.samples \
--update-sex chr19-example.samples 2 \
--out chr19-example \
--keep-allele-order
```

This might take a moment to run.  You should see plink has created three new files:

    chr19-example.bed
    chr19-example.bim
    chr19-example.fam

These files contain information about the samples and SNPs, as well as the genotypes for each of the samples at each of the
SNPs. You can look at the `.bim` and `.fam` files using `less`, but the `.bed` file is in a special binary format that only
plink and other software tools can understand.

:::tip Note

We added the `--keep-allele-order` option here to the above command to make sure plink preserves the two alleles at each
SNP in the same order as in the VCF file. This is **important** because in a GWAS analysis you will want to be able to
keep track of the direction of estimated effects.

:::

We can tell `plink` to load data in the binary plink format using the `--bfile` option. For instance, to calculate
allele frequencies we now use:

```sh
./plink --bfile chr19-example --freq --out chr19-example
```

:::tip Question
How many SNPs and samples are in this dataset?
:::

:::note Note

Many other formats are in use for genetic data, including 'GEN' format, BCF (binary VCF) format, and ['BGEN'
format](http://www.bgenformat.org). Learning how to deal with these is part of the job description.

:::

### Computing and analysing QC metrics

There are many useful QC metrics that we can calculate for our dataset. These metrics can tell us about the quality of
loci (i.e. SNPs), and of samples. For instance, we can calculation information about missingness:

```sh
./plink --bfile chr19-example --missing --out miss-info
```

This will produce a `.imiss` file with information about individuals and .lmiss with information about loci (SNPs).

Another QC metric is sample heterozygosity:

```sh
./plink --bfile chr19-example --het --out het-info
```

Let's use R to visualize these results. 

You can load the output into R to look at them in more detail - we'll use `tidyverse` in some of the examples, so load that now as well:

```
# In R:
library( tidyverse )
MissData = read_table( "miss-info.imiss", col_types = "ccciid" )
HetData <- read_table( "het-info.het", col_types = "ccdddd" )
```

:::note Note

If you prefer, you can also look at the data using a spreadsheet like Excel. Open a new spreadsheet and then use the
`File->Import` menu to load the data. The files are space-delimited text files.

:::

Load the data now and take a look.

:::tip Quick question

What columns do these files have? (**Note:** the column names can be pretty cryptic, but they're described in the [plink
documentation](https://www.cog-genomics.org/plink/1.9/formats#imiss).)

Which SNP has the highest missing rate?

:::

To make sense of this, let's plot the metrics now - we'll start with the heterozygosity. Curiously enough, even though the
command is called `--het`, plink does not actually output the heterzygosity rates in this file. Let's compute it now from the
*number of observed homozygotes* and plot:

```
# in R
HetData$heterozygosity = ( HetData[['N(NM)']] - HetData[['O(HOM)']] ) / HetData[['N(NM)']]
print(
    ggplot(
        data = HetData,
        aes( x = heterozygosity )
    )
    + geom_histogram( bins = 100, col = 'black', fill = 'grey' )
    + theme_minimal()
    + xlab( "Sample heterozygosity" )
    
)
```

The graph you see shows the distribution of *heterozygosity* across samples. QC plots often look like this; there is a large peak of samples that lie within a range of normal values (the normal samples), and then a small number of outlier samples that are usually poor quality samples. 

:::tip Note

The idea here is that in any reasonable homogenous population, the level of heterozygosity - that is, the chance that
the two chromosomes in an individual differ at a randomly chosen SNP - will be roughtly similar across individuals.
Or, if the population is structured, we might see subsets of the population with different values.

If single individuals appear to have drastically different heterozygosity, this could be for example because

- the samples was contaminated (it contains more than one person's DNA); or
- the person was somewhat inbred (contains more homozygosity than expected); or
- the DNA sample was poor quality (so that genotype calling was poor).

:::

To improve the plot without losing any data, let's *clamp* the values into a smaller x axis range:

```
clamp <- function( x, lower = -Inf, upper = Inf ) {
    pmax( pmin( x, upper ), lower )
}
p = (
    ggplot(
        data = HetData,
        aes( x = clamp( heterozygosity, 0.1, 0.3 ))
    )
    + geom_histogram( bins = 100, col = 'black', fill = 'grey' )
    + theme_minimal()
    + xlab( "Sample heterozygosity, clamped to [0.1 - 0.3]" )
)
print(p)
```

You can see that there is a large peak in heterozygosity around 0.2, with a number of outliers below 0.15 or above 0.25.

:::tip Saving images

In Rstudio you can save any figure for later reference - go to the 'Export' button above the plot and choose a destination
file.  Alternatively you can save it directly from ggplot using the `png()` command like this:
```R
# In R:
ggsave( p, file = "HetHist.pdf" )
```
:::

Next, lets plot the missingness values.

```R
# In R:
print(
    ggplot(
        data = MissData,
        aes( x = F_MISS )
    )
    + geom_histogram( bins = 100, col = 'black', fill = 'grey' )
    + theme_minimal()
    + xlab( "Sample missing data rate" )
)
```

That's again not very informative because of the scale... let's zoom in to the region near zero on the x axis by clamping
values to 0.2:

```
print(
    ggplot(
        data = MissData,
        aes( x = clamp( F_MISS, 0, 0.1 ) )
    )
    + geom_histogram( bins = 100, col = 'black', fill = 'grey' )
    + theme_minimal()
    + xlab( "Sample missing data rate, clamped to [0 - 0.1]" )
)
```

Again, most of the samples have low missingness (close to zero), with a number of outliers above 0.025. You can see some
other features there as well such as the two bumps in the distribution which looks a bit suspicious - in a real study
you would want to look into this. For now, let's combine the two QC metrics (missingness and heterozygosity) to select
outlying samples:

```R
# In R:
qcFails <- MissData[
    MissData$F_MISS > 0.02
    | HetData$heterozygosity < 0.18
    | HetData$heterozygosity > 0.22,
    c(1:2)                   # Just capture the sample identifier fields
]
write_delim( qcFails, file = "qcFails.txt" )

```

Here's a plot showing the thresholds we've chosen:
```
print(
    ggplot(
        data = cbind( MissData, HetData[,3:7] ),
        aes(
            x = clamp( F_MISS, 0, 0.1 ),
            y = clamp( heterozygosity, 0.1, 0.3 )
        )
    )
    + geom_point()
    + theme_minimal()
    + geom_vline( xintercept = c( 0.02 ), col = 'red' )
    + geom_hline( yintercept = c( 0.18, 0.22 ))
    + xlab( "Sample missing data rate, clamped to [0 - 0.1]" )
    + ylab( "Sample heterozygosity, clamped to [0.1 - 0.3]" )
)
```

We should definitely do something about those two clusters!

:::tip Challenge question

Explore the dataset. Is there anything different about the samples in the two clusters? (Information on the samples is contained
in the`chr19-example.fam` file (format [here](https://www.cog-genomics.org/plink/1.9/formats#fam)) or the
`chr19-example.samples` file.

:::

### Creating an analysis-ready dataset

Let's apply these sample filters and some basic SNP quality filters, to try to create a 'clean' dataset for analysis. We will:

* filter samples out that have outlying missingness or heterozygosity, according to the list generated above;

* and filter out SNPs based on SNP QC metrics using the `--geno`, `--hwe`, and `--maf` options.

Here is a plink command that does this:

```sh
./plink \
--bfile chr19-example \
--remove qcFails.txt \
--hwe 1e-4 include-nonctrl \
--geno 0.01 \
--maf 0.01 \
--make-bed \
--out chr19-clean \
--keep-allele-order
```

:::warning Note

The backslash characters above are 'line continuation characters' - they're just there to make the command work as if we typed
it all one one line.

:::

:::tip Questions

What SNP QC filters have we applied here? (To find out, see the
[documentation on --hwe](https://www.cog-genomics.org/plink/1.9/filter#hwe),
on [--geno](https://www.cog-genomics.org/plink/1.9/filter#missing),
and on [--maf](https://www.cog-genomics.org/plink/1.9/filter#maf)).

Read the output of the command carefully. How many samples did the command retain? Check in R this is the expected number. And
how many SNPs did we keep - does this number look sensible?

:::

:::tip Important question

Re-compute the sample missingness and heterozygosity metrics and re-create the above QC plot using the clean data. Have the SNP
QC filters dealt with the issue that showed two clusters of samples?

(And why are the new missingness values much smaller than the old ones?)

:::

### Next steps

Congratulations!  You now have a carefully QC'd dataset to work with.  Now go on to the [association practical](./gwas_association/).
