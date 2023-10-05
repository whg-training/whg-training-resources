---
sidebar_position: 2
---

# Principal components analysis

Welcome!  In this practical we will do principal component analysis (PCA), one of the fundamental tools of population
genetics for identifying sample clustering and outliers. PCA is several things at the same time: a way of **reducing the
dimension** of a giant matrix of genotypes by projecting it onto a smaller set of important directions; a way to
evaluate and intepret *relatedness* and *population structure* between samples; a way to find **data outliers** and
unexpected samples.  

Because these features are often correlated to environmental factors in a large dataset,  this makes it a great way to
potentially control for environmental confounding in genome-wide association studies.

## How PCA works

Imagine we have genotyped `N` samples genome-wide at `L` SNPs.  We get a matrix of genotypes that looks
something like this:

$$

X = \begin{array}{c|cccc}
& \text{sample 1} & \text{sample 2} & \cdots & \text{sample $N$} \\
\hline
\text{SNP $1$} & g_{11} & g_{12} & \cdots & g_{1N} \\
\text{SNP $2$} & g_{21} & g_{22} & \cdots & g_{2N} \\
\vdots & \vdots & & \ddots & \\
\text{SNP $L$} & g_{L1} & g_{L2} & \cdots & g_{LN}
\end{array}
$$

The $g_{ij}$ here means "the genotype at SNP $i$ of individual $j$."

Typically in a genome-wide analysis, that matrix is huge!  It could have millions of variants ($L \sim 10^6$) and
thousands or hundreds of thousands of samples ($N \sim 10^5$ perhaps) - so billions of genotypes in total. 

PCA helps to make sense of this by rewriting the matrix in terms of a few specific 'directions' in $L$-dimensional
space.  Those 'directions' are 'SNP loadings': each is a vector saying how much each SNP contributes to the component.
The value of the principal component for a given sample is just what you get by multiplying the SNP loadings by the
sample's genotypes.

Importantly the directions are chosen to maximise the amount of variation they capture, and the first few principal
components can often capture the main features of a dataset.  In  many cases they reflect population structure.  But
they might also reflect cryptic relationships, poorly QC'd samples, or other effects that lead to differences in
genotype distribution between samples.

## Principal components for GWAS

In this tutorial you will carry out many of the steps that are commonly done in computing PCs for a genome-wide
association study, including *pruning SNPs for local correlation patterns*, *identifying closely-related individuals*,
and *comparing samples to a global reference panel*.  When you're ready, go and [get setup](./getting_setup.md) for the
practical.  The complete set of pages is as follows:

* [Introduction](README.md) (this page)
* [Getting the software and data](./getting_setup.md)
* [Practical overview](./overview.md)
* [Linkage disequilibrium pruning](./ld_pruning.md)
* [Relatedness pruning](./relatedness_pruning.md)
* [Computing PCs](./computing_PCs.md)
* [An aside on the maths](./the_maths.md)
* [Analysing samples against a global panel](./global_analysis.md)

