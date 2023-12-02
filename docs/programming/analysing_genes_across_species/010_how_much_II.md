---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How much of the genome is *really* in genes?

If you followed the [previous section](./009_an_algorithm_to_merge_regions.md) you'll have a function `merge_regions()`
that can 'merge' a set of possibly overlapping regions into a set that don't overlap (but cover the same regions).
Let's use this to correct our computation of the proportion of genome in genes now.

:::tip Note

If you didn't manage to complete it - don't worry.  My final version can be revealed below:

<Tabs>
<TabItem value="hide" label = "Hint">

Click the tab above to reveal the solution.

</TabItem>
<TabItem value = "R" label = "Solution">

```r
merge_regions = function( input_regions ) {
   # Catch the case where there's only one or no regions
   # There's nothing to do in this case, may as well just return the input regions:
   if( nrow( input_regions ) < 2 ) {
      return( input_regions ) ;
   }

   # Otherwise:
   # Sort regions by position
   input_regions = input_regions %>% arrange( start, end )

   # Create variables to put the result in
   result = tibble()
   current_merged_region = input_regions[1,]

   # Loop over regions
   for( i in 2:nrow(input_regions)) {
      next_region = input_regions[i,]

      overlapping = (next_region$start <= current_merged_region$end)
      if( overlapping ) {
         current_merged_region$end = max( current_merged_region$end, next_region$end )
      } else {
         result = rbind( result, current_merged_region )
         # Start a new region!
         current_merged_region = next_region
      }
   }

   # Add the last region
   result = rbind(
      result,
      current_merged_region
   )

   return( result )
}
```

(You can run the test to make sure it works.)


</TabItem>
<TabItem value = "R" label = "Faster version">

A problem with the version of `merge_regions()` above is that it is *really slow*.


</Tabs>

:::

We can use this to compute the *length* of a set of regions like this:
```r
compute_length_of_regions <- function( input_regions ) {
	merged = merge_regions( input_regions )
	sum( merged$end - merged$start + 1 )
}
```

You should be aware that the `merge_regions()` can take some time to run.  Try it on the human genes on chromosome 1 for
example:

```
merge_regions(
	genes %>% filter( dataset == 'Homo sapiens' & seqid == '1' )
)

```

On my laptop this takes about 10 minutes.  This is **a limitation of R** - it is not very fast for this type of
loop-style programming.

:::


So let's go back to [our code to compute the proportions](./008_How_much_of_the_genome_is_in_genes.md#naive-approach)
and make it use this function:

```r
correct_lengths = (
   genes
   %>% group_by( dataset, seqid )
   %>% summarise(
      number_of_genes = n(),
      total_gene_length = compute_length_of_regions( . )
   )
   %>% left_join(
      regions[, c( "dataset", "seqid", "attributes", "sequence_length" )],
      by = c( "dataset", "seqid" )
   )
)
print( lengths )
```