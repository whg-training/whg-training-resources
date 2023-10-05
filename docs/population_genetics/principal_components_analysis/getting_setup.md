---
sidebar_position: 2
---

# Getting set up

To run this practical you need two things: the software and the data.

## Getting the software

We will be using the software `PLINK` written by Christopher Chang:
[https://www.cog-genomics.org/](https://www.cog-genomics.org/)).  Before we start, please make sure you have downloaded this software and can run it in a terminal window on your system.  To check this, try running this in your terminal window:

```
plink
```

You should see something like this:

    PLINK v1.90b6.17 64-bit (28 Apr 2020)          www.cog-genomics.org/plink/1.9/
    (C) 2005-2020 Shaun Purcell, Christopher Chang   GNU General Public License v3

      plink <input flag(s)...> [command flag(s)...] [other flag(s)...]
      plink --help [flag name(s)...]

    Commands include --make-bed, --recode, --flip-scan, --merge-list, [...]

    "plink --help | more" describes all functions (warning: long).

## Getting the data

The data files for this practical can be found in
[this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/population_genetics/principal_components_analysis/).

Please download these now.  For the first part of the practical we will use the `chr19-clean.vcf.gz` file, and later on we will use the other files as well.

For the practical we recommend making a new empty folder to put these in.  So when you're ready to go your folder should look something like this:

    PCA_practical/
        chr19-clean.vcf.gz
        merged.with.1000G.vcf.gz
        resources/
            1000GP_Phase3.sample

Make sure you are working in the above folder - you will need both a terminal and an R session.  In the terminal:

```
cd /path/to/PCA_practical
```

In your R/RStudio session:

*In R/RStudio:*
```
setwd( '/path/to/PCA_practical' )
```

## Next steps

When you have the data, [go and read the practical overview](./overview.md).
