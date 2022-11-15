---
sidebar_position: 2
---

# Some population-genetic statistics

If you followed the [basic simulation section](implementing_a_Wright-Fisher_model.md) you'll know that random inheritance
patterns in the population cause haplotypes to be lost over time, and others to increase in frequency. As a result genetic
diversity is lost.  Let's now try to measure that diversity and see how it behaves.  Two key measures are:

* The *heterozygosity*. This is the probability that two individuals carry the same haplotype.

* The *nucleotide diversity*. This is the number of genotype differences between two samples, averaged over all pairs of
  samples in the data.


::tip Challenge question

Implement these statistics and add them to the legend of our plot.

:::

**Note.** A basic facts about population-genetic models like this is as follows. The heterozygosity
is expected to decay at a rate that depends on the sample size:

$$
H_g = H_1\left(1-\frac{1}{N}\right)^{g-1}
$$

where *H<sub>1</sub>* is the heterozygosity in the first generation.  In particular, as you will have seen above, diversity is lost at a faster rate in smaller populations.

:::tip Note

The expected number of pairwise differences is, in fact, the sum of heterozygosity over loci.

To see this write them out as follows:
$$
\pi = \left(\frac{1}{N \choose 2}\right) \sum_i \sum_{j > i} \sum_{l=1}^L I(H_i(l) != H_j(l))
$$

(Where I have used $H_i(l)$ to denote the allele on the haplotype $H_i$ carried by individual $i$ at site $l$.)



:::