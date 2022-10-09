---
sidebar_position: 1
---

# Introduction

In this practical we will do principal component analysis (PCA), which is one of the fundamental tools of
population genetics for identifying sample clustering and outliers. PCA is several things at the same time: a
way of projection a large multidimensional set of genotypes onto a useful smaller set of orthogonal directions;
a way to interpret *relatedness* and *population structure* between samples; and a way to control potentially
control environmental confounding in genome-wide association studies.

PCA picks out *principal components* that represent "directions" of greatest variance. These may reflect
population structure, but might also reflect cryptic relationships, poor QC, or other effects that lead to
differences in genotype distribution.

In this tutorial you will carry out many of the steps that are commonly done in computing PCs for a genome-wide association study, including *pruning SNPs for local correlation patterns*, *identifying closely-related individuals*, and *comparing samples to a global reference panel*.  When you're ready, go and [get setup](./getting_setup.md) for the practical.

## Table of contents

* [Introduction](Introduction.md) (this page)
* [Getting the software and data](./getting_setup.md)
* [Practical overview](./overview.md)
* [Linkage disequilibrium pruning](./ld_pruning.md)
* [Relatedness pruning](./relatedness_pruning.md)
* [Computing PCs](./computing_PCs.md)
* [An aside on the maths](./the_maths.md)
* [Analysing samples against a global panel](./global_analysis.md)
