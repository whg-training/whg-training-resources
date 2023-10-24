---
sidebar_position: 1
---

# Getting set up

To get started there are three steps.

## Install snakemake

To run the tutorial you will of course need snakemake installed.  Depending on your system use one of the following
commands to install it:

```
conda install snakemake
```

if you are using conda, or

```
brew install snakemake
```

if you are using homebrew on a Mac.  Or, on Ubuntu linux you may be able to do:
```
apt install snakemake
```

:::tip Note
Whichever way you install snakemake, you should now be able to run it - you'll see a message about a missing 'snakefile':
```
% snakemake
Error: no Snakefile found, tried Snakefile, snakefile, workflow/Snakefile, workflow/snakefile.
```

This is fine - it means snakemake is ready for use.
:::


## Work in a new directory

We recommend working in a new directory - so let's make one now.

```
% mkdir snakemake_tutorail
% cd snakemake_tutorial
```

## Get an R program

This tutorial will make use of the `gmsgff` R package you created previously if you ran the [Learn to program with gene annotations!](../programming_with_gene_annotations3/README.md) tutorial.

However, to avoid any issues with versions, please install my version which can be done like this from within R:

```r
install.packages(
	"https://www.well.ox.ac.uk/bioinformatics/training/gms/code/R/gmsgff.tgz",
	repos = NULL,
	type = "source"
)
```

:::tip Note
(You can then re-install your own version later if you made additional changes).
:::

**Finally**, please download [this R
script](https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/programming/pipelining_with_snakemake/code/summarise_ensembl_gff.R).
(For example by copying the link and using `curl -O`).  You should save it as `summarise_ensembl_gff.R` in the current directory.

:::tip Note
You can check this is working by running it:
```
% Rscript --vanilla summarise_ensembl_gff.R
```
You should see something like:
```
++ Welcome to summarise_ensembl_gff.R!
usage: summarise_ensembl_gff.R [-h] --input INPUT --output OUTPUT
summarise_ensembl_gff.R: error: the following arguments are required: --input, --output
Execution halted
```
:::

Congratulations!  You're ready to [get started](using_snakemake.md).
