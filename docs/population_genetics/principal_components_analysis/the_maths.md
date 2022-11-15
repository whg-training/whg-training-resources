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

:::tip Note
To see why this works, consider an eigenvector $z$ of $Z$, i.e a vector satisyfing

$$
X X^t z = \lambda z
$$

where $\lambda$ is the eigenvalue. The projection of $X$ onto $z$ is $X^t z$. Now $X^t z$ must be an eigenvector of $R$ because

$$
X^t X (X^t z) =  = X^t (X X^t) z = \lambda (X^t z)
$$

Conversely, if $s$ is an eigenvector of $R$ with eigenvalue $\gamma$, that is $X^t X s = \gamma s$, then

$$
X X^t (X s) = \gamma X s
$$

In other words **the eigenvalues of $R$ and $Z$ are the same** - and the eigenvectors are related by projecting the rows
and columns onto the eigenvectors respectively.

:::

Relatedness and LD are dual to each other!

### 

It turns out that these eigenvectors have a property which makes them useful:

* The first loading vector $z_1$ picks out the direction in genotype space (a linear combinations of SNPs) so that the first
  principal component $X^t z$ has the maximum possible variance (among all such projections).

* The second loading vector then picks out the direction in genotype space *orthogonal to the first* that makes the second
principal component have the maximum possible variance - and so on. These vectors thus pick out *the directions of greatest
variance in the genotype data*.

* and so on.



:::tip Note

There are two sources of LD that could turn up here. The first derives from genetic drift
or directional selection, which (as we discussed this morning) causes LD between local SNPs on a
chromosome. The second is LD deriving from population structure. This type of LD can occur between
SNPs anywhere in the genome - for example, it would be seen between any SNPs that differ in
frequency between sub-populations. Because we have ld-thinned our data, it is primarily this type
of population structure-driven LD that will be picked up by our principal components analysis.
:::


### Computing principal components in practice

Typically $Z$ is huge, while $R$ is somewhat smaller. (Although this is less true for biobank-scale data, where special methods
have to be used.). To compute the PCs it therefore makes sense to focus on $R$ first.  This is what tools like plink do.  They:

* First, compute the matrix $R$ by traversing the SNPs in the data.
* Then form the eigendecomposition to compute the right eigenvectors.
* Finally 

So tools like `plink` compute *R*, use this to compute the principal
components, and then compute loadings using a second pass through the data.

You can easily do this in R as well, for example:
```
X = (load data here, convert to a matrix and standardise...)
L = nrow(X)
R = (1/L) * t(X) %*% X
PCs = eigen(R)$vectors
plot( PCs[,1], PCs[,2], xlab = "PC 1", ylab = "PC 2" )
# etc.
```

The `eigen()` step will take quite a while on any real dataset, but is generally manageable up to around a few thousand samples.

**Computing in big cohorts**. While the above works in many studies, very large cohorts such as the
[UK Biobank[(https://www.nature.com/articles/s41586-018-0579-z) typically require other methods such as [flashPCA](https://github.com/gabraham/flashpca) that avoid computing either of the matrices directly.

**Note.** If all this hasn't melted your brain, [try reading
Gil McVean's paper on genealogies and PCA](https://doi.org/10.1371/journal.pgen.1000686).

#### Back to the computation...

When you're ready, [go back to the page on computing PCs](computing_PCs.md).

