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

