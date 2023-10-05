---
sidebar_position: 11
---

# Working with data

Now we come to what R is really good at - loading, manipulating, and plotting data.
Let's do that now by downloading and plotting some data on human chromosomes.

## Getting the data

We'll use the data in this file:

[GRCh38 sequence report](resources/GRCh38_sequence_report.tsv)

To get this file, right-click on the link above and choose 'copy link'.
You ought to be able now to load the data into R using the `read_tsv()` function:

```
> X = read_tsv( "<paste your link here inside the quotes>" )
```

This data comes from the [NCBI page on the GRCh38 human genome
assembly](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000001405.26/).

:::tip Note

An alternative way to get the data is to download the file first, and then load it in.

For example using R you could use `download.file()`:
```
> download.file( "<your link here>", destfile = "GRCh38_sequence_data.tsv" )
> X = read_tsv( "GRCh38_sequence_data.tsv" )
```

:::

## Viewing the data

We'll only scratch the surface of data manipulation here but here are a few ways to look at this data.
First, you can view the data by printing it:
```
> print(X)
```
