---
sidebar_position: 1
---

# Getting setup

In this practical we will run command-line programs to perform the analyses, and R to interpret them. If you haven't
installed these already, visit the [prerequisites section](/prerequisites) for a guide.

To get set up, you need

- the datasets from the practical folder.
- the command-line programs we'll use

## Moving to the right folder

Before starting please check your terminal is in the right folder.  A good choice is your home folder:
```
cd ~
```

**However** if you are using Ubuntu for Windows, you should instead change to your main Desktop folder (this is so that the
results work well with RStudio):

```
cd /mnt/c/Users/<your user name>/Desktop/
```

## Downloading the data

To get the data, download and extract the tarball from
[this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/genome_wide_association_studies/genome_wide_association_analysis/):

```
curl -O https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/genome_wide_association_studies/genome_wide_association_analysis/gwas_practical.tgz
```

This might take a minute or two.  Once the download has completed, extract the tarball and cd into the newly-created directory:

```
tar -xzf gwas_practical.tgz
cd gwas_practical
```

If you explore this directory, you should see there are a number of files and a `resources` and `scripts` folder:

    $ ls
    chr19-example.pca      chr19-example.vcf.gz  resources	snp-example.samples
    chr19-example.samples  plink_versions	     scripts	snp-example.vcf

## Downloading plink

Next let's get the plink program we need.  There are two ways to get this:

* The `plink_versions/` folder contains Mac OS and Linux versions of the plink executable. To get that, move the appopriate
  version into this folder:
  
```
mv plink_versions/plink_linux/plink ./
```
or
```
mv plink_versions/plink_mac/plink ./
```

:::tip Note

If you are using Ubuntu for Windows, the appropriate version is the 'Linux 64 bit' version.

:::

Alternatively, you can download the appropriate version [from the plink website](https://www.cog-genomics.org/plink/). Extract
the archive and move the `plink` executable into this folder.

When all is set up you should now be able to run plink like this:
```sh
./plink –-version
```

Plink will tell you its version, and when it was last updated.  


## Setting up R

Make sure your RStudio session is also pointing at the `gwas_practical` folder (use `setwd()` or the `Session->Set Working
Directory` menu to do this.

## Getting started

### Warm-up: computing allele frequencies

Plink is a tool for analysis of genome-wide genotype data. A basic first task is to compute allele
frequencies. Let's try that out now by running plink like this:

```sh
./plink --freq  --vcf snp-example.vcf
```

The `--freq` command asks PLINK to calculate allele frequencies. `--vcf snp-example.vcf` tells
PLINK to read in data from the VCF file `snp-example.vcf`.

If you type `ls` you'll see that PLINK has written two output files in the directory we are working in: 1. a log file called
`plink.log` that summarizes what it has done (this is the same as the output that appeared in the terminal window), and 2.
`plink.frq`, which contains the allele frequency information. 

:::tip Questions

Use a text editor, `less`, or load them into R to look at all the input and output files.

**Q**. How many SNPs were in this dataset? What are their names? What are their allele frequencies?

**Q**. How many samples are included in total?

**Advanced Question**. The column names can be frankly somewhat cryptic. Can you find out what
`NCHROBS` means from the documentation? (You may find you need to look at the documentation for the
original version of plink (http://zzz.bwh.harvard.edu/plink/summary.shtml). On the other hand,
looking at the documentation on https://www.cog-genomics.org/plink/1.9/, are there other or better
`--freq`-like commands you can run? What do they output? Which version do you like?

:::

### Running a simple GWAS

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
X = read.table( "plink.assoc.logistic", hea=T, as.is=T )
```

If you look at the result, you'll see it has output a `BETA` column instad of the original `OR`, and also has `SE` (standard
error) and confidence interval columns.  Let's plot that now:

```R
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

The final step in this introduction is to learn to rename PLINK’s output files, since we’ll be generating lots of them in the
practicals.  The `--out` option is used to rename the output:

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

Now the output files will be named getting-started.log and getting-started.assoc.logistic. This is the basic pattern to working
with PLINK: specifying input files and analyses, along with an output name to save results.

:::tip Note

The backslashes in the above command are shell line continuation characters - they let us put the command on multiple lines.
Some of these commands will get pretty long, so it's useful to put them on multiple lines like this!

:::

With this background in using plink - it's time to go on to [analysing a simulated GWAS study](gwas_quality_control.md).

## Reference Information

You can download PLINK, and find more information at the website:

https://www.cog-genomics.org/plink2

There is detailed documentation about all the options available, file formats and examples of commands. 

A detailed tutorial (similar to work we have done here) is available at:

http://pngu.mgh.harvard.edu/~purcell/plink/tutorial.shtml

