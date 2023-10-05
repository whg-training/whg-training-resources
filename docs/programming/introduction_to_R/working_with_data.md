---
sidebar_position: 11
---

# Working with data

Now we come to what R is really good at - loading, manipulating, and plotting data.
Let's do that now by downloading and plotting some data on human chromosomes.

## Getting the data

We'll use the data in this file:

[GRCh38 sequence report](resources/GRCh38_sequence_report.tsv)

which comes from the [NCBI page on the GRCh38 human genome
assembly](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000001405.26/).

To get this file, right-click on the link above and choose 'copy link'.
You ought to be able now to load the data into R using the `read_tsv()` function:

```
> X = read_tsv( "<paste your link here inside the quotes>" )
```

:::tip Note

Alternatively, you can download the file first, for example using your browser.  Make sure you know where you have saved
it, then load it:

```
> X = read_tsv( "/path/to/GRC38_sequence_report.tsv" )
```

Another way to download it is using R's `download.file()` function:
```
> download.file( "<your link here>", destfile = "GRCh38_sequence_report.tsv" )
> X = read_tsv( "GRC38_sequence_report.tsv" )
```

:::

## Viewing the data