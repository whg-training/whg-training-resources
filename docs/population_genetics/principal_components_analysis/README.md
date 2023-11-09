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

Imagine we a giant matrix of numbers - say one with $L$ rows and $N$ columns, like this:

$$

X = \begin{array}{c|cccc}
& \text{column 1} & \text{column 2} & \cdots & \text{column $N$} \\
\hline
\text{row $1$} & x_{11} & x_{12} & \cdots & x_{1N} \\
\text{row $2$} & x_{21} & x_{22} & \cdots & x_{2N} \\
\vdots & \vdots & & \ddots & \\
\text{row $L$} & x_{L1} & x_{L2} & \cdots & x_{LN}
\end{array}
$$

For example - it could be a matrix of genotypes in a genome-wide association study (rows are SNPs and columns are samples).  Or it could ba a matrix of expression levels (rows are genes and columns are samples).  Whatever it is, it it's a big multidimensional object, and it would be nice to have a simple way to visualise and analyse its structure.

Principal components analysis (PCA) does this by re-writing the matrix in terms of a small number of 'principal components' - directions in space. The directions are *orthogonal* to each other (i.e. at right angles) so, in a sense, they each represent a seperate part of the matrix.
Together, the principal components capture the major structure of the matrix and often reveal the most important features.



## Principal components for GWAS

In this tutorial you will carry out principal components analysis on a set of human samples using the plink software
package.  Because this is for use in a [GWAS
study](../../genome_wide_association_studies/genome_wide_association_analysis/README.md), we will carry out many of the
steps that are usually done in those studies, including  including *pruning SNPs for local correlation patterns*,
*identifying and excluding closely-related individuals*, and *comparing samples to a global reference panel*.   Before
doing that, however, we'll also try a simple simulated PCA example in R.

When you're ready, go and [get setup](./getting_setup.md) for the practical.  The complete set of pages is as follows:

* [Introduction](README.md) (this page)
* Try a [PCA warm-up in R](./simulated_pca_example.md)
* [Getting the software and data](./getting_setup.md)
* [Practical overview](./overview.md)
* [Linkage disequilibrium pruning](./ld_pruning.md)
* [Relatedness pruning](./relatedness_pruning.md)
* [Computing PCs](./computing_PCs.md)
* [An aside on the maths](./the_maths.md)
* [Analysing samples against a global panel](./global_analysis.md)

