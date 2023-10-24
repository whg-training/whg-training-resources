---
sidebar_position: 1
---

# Introduction to snakemake

Welcome!  In this page you will see a brief introduction to snakemake.

## Prerequisites



To get started, we recommend working in a new directory:

```
% mkdir snakemake_tutorail
% cd snakemake_tutorial
```

To run the tutorial you will need three things:

1. You need `snakemake` installed.  Use one of the following commands to install it:

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

2. This tutorial will make use of the `gmsgff` R package you [created previously](../programming_with_gene_annotations3/).

:::tip Note

To avoid any issues with this tutorial, please install my version which can be done like this from within R:
```r
install.packages(
	"https://www.well.ox.ac.uk/bioinformatics/training/gms/code/R/gmsgff.tgz",
	repos = NULL,
	type = "source"
)
```

(You can then re-install your own version later if you made additional changes).
:::

3. Finally, please download the [summarise_ensembl_gff.R]()


