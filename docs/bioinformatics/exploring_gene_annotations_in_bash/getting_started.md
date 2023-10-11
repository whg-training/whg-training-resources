---
sidebar_position: 2
---

# Getting started

To get started, if you [haven't
already](./README.md#exploring-gene-annotations-on-the-command-line), create a new folder for the
tutorial and change dir into it:

```
mkdir genes_tutorial
cd genes_tutorial
```

Now download the gene annotation file from gencode and place it in that folder.  You can either:

* Download it from the [gencode download page](https://www.gencodegenes.org/human/) for human gene annotations -
  you want the 'Comprehensive gene annotation' file in `GFF3` format.

* Or download the copy of the gencode file that I have placed in
[this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/programming/programming_with_gene_annotations/).

For example this command should work to do the download:
```
curl -O https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_41/gencode.v41.annotation.gff3.gz
```

:::note Note

The file I'll work with below has `v41` in the name - as above it's called `gencode.v41.annotation.gff3.gz`. If
you have a different version of this file that's fine - you may get slightly different results below but they
should be very similar.

:::
