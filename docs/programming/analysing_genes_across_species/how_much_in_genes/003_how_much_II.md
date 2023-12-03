---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How much of the genome is *really* in genes?

If you followed the [previous section](./009_an_algorithm_to_merge_regions.md) you'll have a function `merge_regions()`
that can 'merge' a set of possibly overlapping regions into a set that don't overlap (but cover the same regions).
Let's use this to correct our computation of the proportion of genome in genes now.

:::tip Note

If you didn't manage to complete it - don't worry.  My final version is here:

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

</Tabs>

:::

We can use this to compute the *length* of a set of regions as follows.  (We'll put in a print statement so we can see what's happening.):
```r
compute_length_of_regions <- function( input_regions ) {
	merged = merge_regions( input_regions )
	sum( merged$end - merged$start + 1 )
}
```

So let's go back to [our code to compute the total length of genes on each
chromosome](./008_How_much_of_the_genome_is_in_genes.md#naive-approach) and make it use this function:

```r
compute_lengths_per_chromosome = function(
   data,
   chromosomes = contigs
) {
   (
      data
      # Group by species / chromosome
      %>% group_by( dataset, seqid )
      # Add up the gene lengths
      %>% summarise(
         number_of_regions          = n(),
         naive_total_length_covered = sum( end - start + 1 ),
         total_length_covered       = compute_length_of_regions( pick( start, end ) )
      )
      # Add the chromosome lengths
      %>% left_join(
         chromosomes[, c( "dataset", "seqid", "attributes", "sequence_length" )],
         by = c( "dataset", "seqid" )
      )
   )
}

```

:::tip Note

If you compare this to the [previous, incorrect code](./008_How_much_of_the_genome_is_in_genes.md#naive-approach) you'll
see it's the same, except that we've used our `compute_length_of_regions()` instead of just summing the lengths.
(But I've kept the naive calculation in there as well for comparison.)

The [`pick()`](https://dplyr.tidyverse.org/reference/pick.html) function is a way to create a tibble of just the start
and end coordinates for each of our chromosomes, and pass it into our function.

:::

Let's run that now to get the correct lengths:

```r
correct_lengths = compute_lengths_per_chromosome( genes )
print( correct_lengths )
```

This takes a minute or two to run - after all, it has to run our merging loop for each species and chromosome.

Now at last we can compute the proportion of each genome covered by genes:

```r
compute_proportion_of_genome_covered = function(
	per_chromosome_lengths
) {
	(
		per_chromosome_lengths
		%>% group_by( dataset )
		%>% summarise(
			naive_total_length_covered = sum( naive_total_length_covered ),
			total_length_covered = sum( total_length_covered ),
			total_genome_length = sum( sequence_length )
		)
		%>% mutate(
			naive_proportion_covered = naive_total_length_covered / total_genome_length,
			proportion_covered = total_length_covered / total_genome_length
		)
	)
}
```

It looks like this:
```r
gene_proportions = compute_proportion_of_genome_covered( correct_lengths )
print( gene_proportions )
```
```
# A tibble: 11 × 6
   dataset                                           naive_total_length_covered total_length_covered total_genome_length naive_proportion_covered proportion_covered
   <chr>                                                                  <dbl>                <dbl>               <dbl>                    <dbl>              <dbl>
 1 Acanthochromis_polyacanthus.ASM210954v1.110                        422171067            415283627           830201259                    0.509              0.500
 2 Asparagus_officinalis.Aspof.V1.57                                  165883925            165883925          1015569172                    0.163              0.163
 3 Bufo_bufo-GCA_905171765.1-2022_05-genes                           1290309576           1267077494          5003028965                    0.258              0.253
 4 Camelus_dromedarius.CamDro2.110.chr                                825762826            815771759          2052758708                    0.402              0.397
 5 Gallus_gallus.bGalGal1.mat.broiler.GRCg7b.110.chr                  583352821            556604796          1041139641                    0.560              0.535
 6 Homo_sapiens.GRCh38.110.chr                                       1379802830           1305325027          3088286401                    0.447              0.423
 7 Mus_musculus.GRCm39.110.chr                                       1070748851           1040456122          2723431143                    0.393              0.382
 8 Pan_troglodytes.Pan_tro_3.0.110.chr                               1110722691           1101782444          2967125077                    0.374              0.371
 9 Plasmodium_falciparum.ASM276v2.57                                   13776689             13577802            23292622                    0.591              0.583
10 Plasmodium_knowlesi.ASM635v1.57                                     12970692             12970692            23462187                    0.553              0.553
11 Plasmodium_vivax.ASM241v2.57                                        14052272             14020584            23768694                    0.591              0.590
```

You can see that the correct proportion is a bit (but not much) smaller than the `naive_total_region_length` column.

:::tip Question

How much difference was there between the 'naive' calculation and the correct one?  Was it big enough to worry about?

:::

