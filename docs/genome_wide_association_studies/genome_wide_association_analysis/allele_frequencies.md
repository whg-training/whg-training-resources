---
sidebar_position: 1.25
---

# Plink warm-up

Plink is a tool for analysis of genome-wide genotype data that supports many functions including those related to data
organization, formatting, quality control, association testing, population stratification and much more. In this
practical we'll use it to quality control (QC) some data and run a real (simulated) GWAS study.  Will we find any
associations?

:::tip Note

You can find more information about plink at the plink website:

https://www.cog-genomics.org/plink2

There is detailed documentation about all the options available, file formats and examples of commands.   (The version
currently in greatest use is called '1.9 beta'.)

Another detailed tutorial (similar to work we have done here) is available at:

http://pngu.mgh.harvard.edu/~purcell/plink/tutorial.shtml
:::

## Computing allele frequencies

A basic first task is to compute allele frequencies. Let's try that out now by running plink like this:

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
