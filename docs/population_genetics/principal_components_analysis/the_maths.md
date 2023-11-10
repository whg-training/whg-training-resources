# An aside on the maths

The maths of PCA (in the way usually applied) works like this. Suppose $X$ is a big matrix of genotypes, with $L$ rows
representing genetic variants and $N$ columns representing different samples / individuals.

It is typical to always standardise the genotypes at by dividing by each variant (row) in $X$ by its standard deviation, i.e. by
$\sqrt{f(1-f)}$ where *f* is the allele frequency of the variant - and then subtracting the mean. So do that first.

### It's hip to be square

There are two closely related square matrices you can make out of $X$: either:

$$
R=\frac{1}{L} X^t X \quad \text{or} \quad Z=\frac{1}{N} X X^t
$$

The first matrix $R$ is an $N \times N$ matrix i.e. has one row and one column for each sample.

The second matrix $Z$ is an $L \times L$ matrix with one row and column for each variant in the data.

Because we have normalised and mean-centred, the entries of $R$ are essentially covariances between the genotypes in the two
samples $i$ and $j$. Indeed, we can think of $R$ as a **relatedness matrix**: each entry $r_{ij}$ captures the degree of allele
sharing (covariance) between individual $i$ and $j$. (Because of the frequency scaling, sharing of rarer variants has greater
weight in $r_{ij}$).

On the other hand, the matrix $Z$ is an **LD (linkage disequilibrium) matrix**: entry $z_{ij}$ is the correlation between
genotypes at variants $i$ and $j$. (The diagonal entries are all $1$).

What do these matrices have to do with each other? Well if you followed the [Wright-Fisher tutorial](../simulation/) you will
realise that *relatedness* and *LD* are in some sense dual to each other. LD arises arises as haplotypes drift up in frequency,
that is, increasing the level of identity by descent.

This duality appears in principal components analysis too. Specifically:

* The right eigenvectors of $R$ are the **principal components** of **X**.  Let's call them $\text{PC}_1, \text{PC}_2, \cdots$ and so on.

* The right eigenvectors of $Z$ are the **principal component loading vectors** of $X$.  Let's call them $z_1, z_2, \cdots$.

* The two are related by the following: the principal component for sample $i$ is the projection of that sample's genotypes onto
  the *i*th principal component loading vector.  

In other words **relatedness and LD are dual to each other** - and this is reflected in principal components just like
in other aspects of population genetics.

:::tip Note

There are actually two sources or types of LD that could turn up here. 

The one we are often interested in in PCA is *linkage disequilibrium due to population structure* - sometimes thought of
as 'admixture LD'. This is where variants are correlated to each other because the population is sub-structured, and the
variant frequencies vary between sub-populations.  This type of LD might exist between variants anywhere in the genome
(not just locally in a particular region).

The other source of LD is the local patterns of LD that arise from genetic drift, even in an unstructured population.
(You can see how this arises by following the [genetic drift simulation tutorial](../simulation/README.md).)

In one sense these two types of LD are both *sort of* the same thing - they both arise from patterns of relatedness in
the data, generating haplotype sharing.  However, LD caused by structure clearly arises from demographic features of the
populations, while local LD is just a basic feature of genetic drift.

For PCA, as used in a GWAS, we typically are interested in population structure, so it is often appropriate to thin data
to look at sets of 'independent' SNPs (not too close together) to avoid capturing the local LD effects.  This is why we
LD-thinned our data in practice.

:::


## The maths

To see why PCA works, consider an eigenvector $z$ of $Z = X X^t$, i.e one of the 'loading' vectors.  It's an eigenvector, which means:

$$
X X^t z = \lambda z
$$

where $\lambda$ is some number - the **eigenvalue** corresponding to $z$.

The projection of $X$ onto $z$ is $X^t z$. Now it turns out that $X^t z$ must in fact be an eigenvector of the
relatedness matrix $R = X^t X$, because:

$$
R(X^t z) = X^t X (X^t z) = X^t (X X^t) z = X^t (Z z) = \lambda (X^t z)
$$

Conversely, if $s$ is an eigenvector of $R$ with eigenvalue $\gamma$, that is $X^t X s = \gamma s$, then

$$
X X^t (X s) = \gamma X s
$$

for similar reasons.

What this says is that **the eigenvalues of $R$ and $Z$ are the same** - and the eigenvectors are related by projecting the rows
and columns onto the eigenvectors respectively.


Moreover this eigenvalue decomposition of the relatedness matrix has particular properties that make it useful:

* The first principal component has the maximum possible variance (that is, if you project the samples
  onto any vector other than the first loading vector $z_1$, you get something with less variance).

* The second principal component is then chosen to have the maximum possible variance after accounting for the first.
  (That is, if you project the samples onto any vector orthogonal to (i.e. at right angles to) $z_1$, other than the
  second loading vector $z_2$, you get a lower variance.)

* and so on.

So PCA pulls out the **directions of maximal variance in the data**.


## More reading

**More PCA theory** If all this hasn't melted your brain, [try reading Gil McVean's paper on genealogies and
PCA](https://doi.org/10.1371/journal.pgen.1000686).

**Computing in big cohorts**. In this tutorial we used the eigendecompose-the-relatedness-matrix approach to compute
principal components. While this works in many studies, very large cohorts such as the [UK
Biobank[(https://www.nature.com/articles/s41586-018-0579-z) typically require other methods such as
[flashPCA](https://github.com/gabraham/flashpca) that avoid computing either of the matrices directly.

