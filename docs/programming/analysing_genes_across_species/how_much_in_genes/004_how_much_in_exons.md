---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How much of the genome is in exons?

You might be a bit underwhelmed by the difference between our 'naive' and 'correct' calculations for genes. However the
power of our functions really comes into play if we do the same thing for exons, or coding sequence.  To do this, we
just have to put back the `start` and `end` columns, since we renamed them earlier:

```r
covered_by_exons = compute_lengths_per_chromosome(
	exons %>% mutate( start = exon_start, end = exon_end )
)
covered_by_cds = compute_lengths_per_chromosome(
	cds %>% mutate( start = cds_start, end = cds_end )
)

exon_proportions = compute_proportion_of_genome_covered( covered_by_exons )
cds_proportions = compute_proportion_of_genome_covered( covered_by_cds )

print( gene_proportions )
print( exon_proportions )
print( cds_proportions )
```

:::caution Warning

This might several minutes to run!  (There are a lot of exons and coding sequence regions.)

:::

```r
p = (
   ggplot( data = exon_proportions )
   + geom_col(
      aes(
         x = proportion_covered,
         y = dataset
      )
   )
   + ylab( "Species" )
   + xlab( "Proportion of genome in exons" )
   + theme_minimal(16)
   + xlim( 0, 1 )
)
print(p)
```

```r
p = (
   ggplot( data = cds_proportions )
   + geom_col(
      aes(
         x = proportion_covered,
         y = dataset
      )
   )
   + ylab( "Species" )
   + xlab( "Proportion of genome in cds" )
   + theme_minimal(16)
)
print(p)
```