---
sidebar_position: 2
---

# Some population-genetic statistics

If you followed the [basic simulation section](popgen_simulation.md) you'll know that random inheritance
patterns in the population cause haplotypes to be lost over time, and others to increase in frequency. As a result genetic
diversity is lost.

## Key popgen metrics

Let's use $h_i$ be mean the haplotype of individual $i$, and $h_{i}(l)$ to mean
the allele carried by haplotype $h_i$ at SNP $l$. And $I(\cdot)$ will denote the *indicator function*, which is $1$ or $0$
according to whether the condition is true.

Two key measures of diversity are:

* The *heterozygosity* $H$. This is the probability that two individuals drawn at random carry different haplotypes:

$$
\text{heterozygosity:}\quad H = \frac{1}{\text{number of pairs}}\sum_{i,j|j>i} I(h_{i} = h_{j})
$$

* The *nucleotide diversity*. This is often denoted $\pi$, and is the average number of genotype differences between two
  samples, where the average over all pairs of samples in the data. It is usually denoted $\pi$.

$$
\text{nucleotide diversity:}\quad\pi = \frac{1}{\text{number of pairs}} \sum_{i,j|j>i} \sum_{l=1}^L I(h^i_l \neq h_{jl})
$$
