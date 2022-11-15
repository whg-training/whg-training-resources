---
sidebar_position: 2
---

# Some population-genetic statistics

If you followed the [basic simulation section](implementing_a_Wright-Fisher_model.md) you'll know that random inheritance
patterns in the population cause haplotypes to be lost over time, and others to increase in frequency. As a result genetic
diversity is lost.  Let's now try to measure that diversity and see how it behaves.  

## Key popgen metrics

Before starting let's define some notation. Let's use $h_i$ be mean the haplotype of individual $i$, and $h_{i}(l)$ to mean
the allele carried by haplotype $h_i$ at SNP $l$. And $I(\cdot)$ will denote the *indicator function*, which is $1$ or $0$
according to whether the condition is true.

Two key measures of diversity are:

* The *heterozygosity* $H$. This is the probability that two individuals drawn at random carry different haplotypes:

$$
\text{heterozygosity:}\quad H = \sum_{i,j|j>i} I(h_{i} = h_{j})
$$

We could also define the heterozygosity at variant $l$, $H_l$, to be the probability they carry different alleles at the variant:
$$
\text{heterozygosity at variant $l$:}\quad H_l = \sum_{i,j|j>i} I(h_{il} = h_{jl})
$$

* The *nucleotide diversity*. This is often denoted $\pi$, and is the average number of genotype differences between two
  samples, where the average over all pairs of samples in the data. It is usually denoted $\pi$.

$$
\text{nucleotide diversity:}\quad\pi = \sum_{i,j|j>i} \sum_{l=1}^L I(h^i_l \neq h_{jl})
$$

These quantities are closely related: simply reordering the sums shows that nucleotide diversity ithe sum of per-variant
heterozygosities:

$$
\pi = \sum_{l=1}^L \sum_{i,j|j>i} I(h^i_l \neq h_{jl}) = \sum_{l=1}^L H_l
$$

The heterozygosity and number of pairwise differences are pretty interesting numbers, because they reflect the level of
diversity and can be easily computed from population data.

:::tip Challenge question

Implement these statistics and add them to the legend of our plot.

:::

### The decay of heterozygosity

A slightly amazing fact about population models like this is that - even though the behaviour of the model is highly
stochastic, still regular behaviour emerges *on average*. That's true for the heterozygosity. To see this, consider two
individuals randomly chosen at generation $t+1$. There's a $1/N$ chance they 'picked' the same parent at time $t$ - if so they
definitely carry the same haplotype. On the other hand, there's a $\left(1-\frac{1}{N}\right)$ chance they picked different
parents - in which case the chance of having inhereting different haplotypes is the same as the chance the parents had different haplltpye - that is, $H_l$.  This leads to the recurrence relation:
$$
H_{l+1} = \left( 1 - \frac{1}{N}\right) H_l
$$

Heterozygosity decays across generations, on average, at a rate of $(-\[frac{1}{N}).
