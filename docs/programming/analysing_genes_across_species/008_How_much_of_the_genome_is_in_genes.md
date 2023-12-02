---
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How much of the genome is in genes?

:::warning Warning - This page is under construction!

It is not complete yet!

:::

If you've followed so far you should have:

- a table `genes` of genes (with some statistics from the ['canonical' transcript](./extreme_genes/003_canonical_transcripts.md)).
- a table `regions` of regions including chromosomes or other contigs, describing the assembly.
- and you should have (or know how to get) other things like a dataframe of `transcripts` and an `exons`.

Let's use this to try to figure out how much of the genome is actually covered by genes.

## Naive approach

You can probably think of a simple approach to this right now using [the dplyr data verbs](./004_filter_join_merge.md). We could

1. group genes by species and chromosome
2. compute the total length by summing
3. join to the `regions` dataset to compute total chromosome/region length
4. and then summarise.

Like this:

```r
lengths = (
   genes
   %>% group_by( dataset, seqid )
   %>% summarise(
      number_of_genes = n(),
      total_gene_length = sum( end - start + 1 )
   )
   %>% left_join(
      regions[, c( "dataset", "seqid", "attributes", "sequence_length" )],
      by = c( "dataset", "seqid" )
   )
)
print( lengths )
```

The idea is that this has both a 'total gene length' (sum of lengths of genes) and the total sequence length (length of
the chromosome or contig) in the same dataframe:

```
# A tibble: 5,469 × 6
# Groups:   dataset [11]
   dataset                                     seqid          number_of_genes total_gene_length attributes                                  sequence_length
   <chr>                                       <chr>                    <int>             <dbl> <chr>                                                 <dbl>
 1 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000001.1              56           1349511 Alias=orpheusFish_scaffold1,NW_019029117.1          2466117
 2 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000002.1              39           1029333 Alias=orpheusFish_scaffold2,NW_019029118.1          2338421
 3 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000003.1              56           1399228 Alias=orpheusFish_scaffold3,NW_019029119.1          2213793
 4 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000004.1              41           1113000 Alias=orpheusFish_scaffold4,NW_019029120.1          2013838
 5 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000005.1              45           1012078 Alias=orpheusFish_scaffold5,NW_019029121.1          1950346
 6 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000006.1              54            989013 Alias=orpheusFish_scaffold6,NW_019029122.1          2094391
 7 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000007.1              84           1074990 Alias=orpheusFish_scaffold7,NW_019029123.1          1729193
 8 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000008.1              72           1486459 Alias=orpheusFish_scaffold8,NW_019029124.1          2368326
 9 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000009.1              50           1237060 Alias=orpheusFish_scaffold9,NW_019029125.1          2396890
10 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000010.1              39            643138 Alias=orpheusFish_scaffold10,NW_019029126.1         1656807
# ℹ 5,459 more rows
# ℹ Use `print(n = ...)` to see more rows
```

Now all we have to do is sum them up across chromosomes:
```r
proportions = (
   lengths
   %>% group_by( dataset )
   %>% summarise(
      total_gene_length = sum( total_gene_length ),
      total_genome_length = sum( sequence_length )
   )
   %>% mutate(
      proportion_in_genes = total_gene_length / total_genome_length
   )
)
print( proportions )
```

```
# A tibble: 11 × 4
   dataset                                           total_gene_length total_genome_length proportion_in_genes
   <chr>                                                         <dbl>               <dbl>               <dbl>
 1 Acanthochromis_polyacanthus.ASM210954v1.110               422171067           830201259               0.509
 2 Asparagus_officinalis.Aspof.V1.57                         165883925          1015569172               0.163
 3 Bufo_bufo-GCA_905171765.1-2022_05-genes                  1290309576          5003028965               0.258
 4 Camelus_dromedarius.CamDro2.110.chr                       825762826          2052758708               0.402
 5 Gallus_gallus.bGalGal1.mat.broiler.GRCg7b.110.chr         583352821          1041139641               0.560
 6 Homo_sapiens.GRCh38.110.chr                              1379802830          3088286401               0.447
 7 Mus_musculus.GRCm39.110.chr                              1070748851          2723431143               0.393
 8 Pan_troglodytes.Pan_tro_3.0.110.chr                      1110722691          2967125077               0.374
 9 Plasmodium_falciparum.ASM276v2.57                          13776689            23292622               0.591
10 Plasmodium_knowlesi.ASM635v1.57                            12970692            23462187               0.553
11 Plasmodium_vivax.ASM241v2.57                               14052272            23768694               0.591
To figure out how much of the genome is covered by genes, or by exons, we face a problem.
In principle we could just add together the gene lengths.
```

```
(
   ggplot( data = proportions )
   + geom_col(
      aes(
         x = proportion_in_genes,
         y = dataset
      )
   )
   + ylab( "Species" )
   + xlab( "Proportion of genome in genes" )
   + theme_minimal(16)
)
```

![img](images/propn_wrong.png)


Pretty cool huh!  Most species have... wait, 40-60% of the genome in genes?  Is this right?



:::tip Question

Unfortunately this calculation is **wrong**.   Why?

:::

## A correct approach

The reason this is wrong is that **genes overlap each other**.  So we have over-counted the length.

This happens either because there genuinely are different genes encoded by the same bit of DNA. (Or, sometimes, there
may be annotated 'genes' that arise mainly due to the computational gene annotation process). We saw some of those
[earlier](./extreme_genes/001_long_genes_1.md).  For example [here is the smallest annotated
gene](https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr10%3A66926269%2D66926385), inside an exon of the
larger gene *LRRTM3* - and you can also see that *LRRTM3* clearly overlaps *CTNNA3* there.

To handle this we will have to write some code to compute the total length of a set of genes, allowing for overlap.

:::tip Challenge

Write a function `compute_length_of_regions()` that computes the total region covered by a set of (possibly overlapping
ranges). 

The input will be a dataframe with `start` and `end` columns.
The output should be the total length of the regions, accounting for overlaps (i.e. a single number).

:::

How to write this?  As you know a good place to start is to write a test!  Here is one that tries out a few combinations
of regions:

```
test_compute_length_of_regions <- function() {

   # Test on a single region
   stopifnot(
      compute_length_of_regions(
         tibble(
            start = 1,
            end = 1
         )
      ) == 1
   )

   # Test on non-overlapping regions
   stopifnot(
      compute_length_of_regions(
         tribble(
            ~start, ~end,
                 1,   10,
                21,   30
         )
      ) == 20
   )

   # Test on overlapping regions
   stopifnot(
      compute_length_of_regions(
         tribble(
            ~start, ~end,
                 1,   10,
                 6,   15
         )
      ) == 15
   )

   # Complicated example with multiple overlaps
   stopifnot(
      compute_length_of_regions(
         tribble(
            ~start,  ~end,
                50,   100,   # A long region
                60,    80,   # A region enclosed in the larger one
                90,   120,   # A region overlapping the end of the larger one
                 1,    10    # A region not overlapping the others, but out of order.
         )
      ) == (10 + 71)
   )
}
```

It will of course fail:

```r
> test_compute_length_of_regions()
Error in compute_length_of_regions(tibble(start = 1, end = 1)) : 
  could not find function "compute_length_of_regions"
```

Once the test passes, your function is ready!

You can have a go at this challenge yourself, but if you're not used to this kind of coding it might be a bit tricky.
The rest of this page describes a way of solving this.

## Implementing `compute_length_of_regions()`

Here is a guide on how to do it.

First let's break the problem down by writing `compute_length_of_regions()` in terms another function `merge_regions()`:
```r
compute_length_of_regions <- function( regions ) {
   merged_regions = merge_regions( regions )
   sum( merged_regions$end - merged_regions$start + 1 )
}
```

Of course this just shifts the problem:
```r
test_compute_length_of_regions()
Error in compute_union_of_regions() : 
  could not find function "merge_regions"
```

Given this, we want the function to output these two merged regions: `[50,120]`, `[150,190]` and `[200,220]`.  Then our
`compute_length...` function above will sum up their lengths.

For example, consider this small test dataset of overlapping regions:

```r
test_regions = tribble(
   ~start,  ~end,
         50,   100,   # A big long region
         90,   120,   # A region overlapping the end of the larger one
         60,    80,   # A region enclosed in the larger one (and out of order)
         200,  220,   # A region not overlapping the others
         205,  215,   # A region enclosed in the larger one
         150,  190    # A region not overlapping the others (and out of order)
)
```


We now have to write `merge_regions()`.  It's job is to read in a dataframe of regions, and output another
dataframe of regions that covers all the same bases but has no overlaps.  How?

### An algorithm to union regions

Here is an algorithm that could do that.  For example, consider this small test dataset of overlapping regions:

```r
test_regions = tribble(
   ~start,  ~end,
         50,   100,   # A big long region
         90,   120,   # A region overlapping the end of the larger one
         60,    80,   # A region enclosed in the larger one (and out of order)
         200,  220,   # A region not overlapping the others
         205,  215,   # A region enclosed in the larger one
         150,  190    # A region not overlapping the others (and out of order)
)
```

Given this, we want the function to output these two merged regions: `[50,120]`, `[150,190]` and `[200,220]`.  Then our
`compute_length...` function above will sum up their lengths.

How to do this?  We need something we haven't tried so far in this tutorial - an **algorithm**! A basic idea is to
**order** the regions along the chromosome, then walk through them keeping track of whether you are 'in' or 'out' of a
region.  Whenever we move 'out' we store the region we've just been through.

For example, here is a diagram of the first few steps of the algorithm in our example,  (Click the tabs to see the
algorithm steps):

<Tabs>
<TabItem value="0" label="Input regions">

```
              region 1:      ----------------
              region 2:                    -------
              region 3:            ----
              region 4:                                          ------
              region 5:                                        ------
              region 6:                              -----
```
</TabItem>
<TabItem value="1" label="Sort the regions">
The first step is to sort the regions so we can move through them in the right order:
```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
```
</TabItem>
<TabItem value="2" label="2nd step">
Next we initialise a 'current' merged region starting with the first:
```
          (*) region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
current region, step 1:      ↑              ↑
```
</TabItem>
<TabItem value="3" label="3rd step">
Now we 'walk' through the intervals assessing whether we should extend the interval...
```
              region 1:      ----------------
          (*) region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
current region, step 1:      ↑              ↑
current region, step 2:      ↑              ↑                              ← (no change)
```
</TabItem>
<TabItem value="4" label="4th step">
Now we 'walk' through the intervals assessing whether we should extend the interval...
```
              region 1:      ----------------
              region 3:            ----
          (*) region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
current region, step 1:      ↑              ↑
current region, step 2:      ↑              ↑                              ← (no change)
current region, step 3:      ↑                   ↑                         ← (extend)
```
</TabItem>
<TabItem value="5" label="5th step">
If the next interval doesn't overlap - we store the current merged interval in the output, and start with the next one interval:
```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
          (*) region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
current region, step 1:      ↑              ↑
current region, step 2:      ↑              ↑                              ← (no change)
current region, step 3:      ↑                   ↑                         ← (record this...)
current region, step 4:                              ↑    ↑                ← (..and start a new interval)
```
</TabItem>
<TabItem value="6" label="6th & 7th steps">
...and so on:
```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
          (*) region 4:                                          ------
current region, step 1:      ↑              ↑
current region, step 2:      ↑              ↑                              ← (no change)
current region, step 3:      ↑                   ↑                         ← (record this...)
current region, step 4:                              ↑    ↑                ← (record this...)
current region, step 5:                                        ↑    ↑      ← (start new interval)
current region, step 6:                                        ↑      ↑    ← (extend)
```
</TabItem>
<TabItem value="7" label="Final step">
As a last step - we should **remember to store the last inteval**:
```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
current region, step 1:      ↑              ↑
current region, step 2:      ↑              ↑                              ← (no change)
current region, step 3:      ↑                   ↑                         ← (record this...)
current region, step 4:                              ↑    ↑                ← (record this...)
current region, step 5:                                        ↑    ↑      ← (start new interval)
current region, step 6:                                        ↑      ↑    ← (record this too!)
    ...end of algorthm.
```
</TabItem>

</Tabs>

Can you implement it?

## Implementing the algorithm

### Setting up

We should start by sorting the regions:
```r
test_regions = test_regions %>% arrange( start, end )
```

Let's also create a variable `result` to keep track of the merged regions so far, and another variable
`current_merged_region` to track the start and end point of the 'current' region we are working on:

```r
result = tibble()
current_merged_region = test_regions[1,]
```

Now how should we 'walk' through the remaining regions?  The obvious way is a loop:
```r
for( 2 in 1:nrow(test_regions)) {
   next_region = test_regions[i,]

   # do something here!
}
```

### Testing for overlap

So what should go in the loop?  Evidently what should happen is:

* If `next_region` *overlaps* the current region we are merging, then the current region isn't big enough - we'd better extend it
* Otherwise, we'd better record the current region we've been merging, and start a new 'current' region.

So something like this might go in the loop:
```r
for( i in 2:nrow(test_regions)) {
   next_region = test_regions[i,]

   overlapping = (next_region$start <= current_merged_region$end)
   if( overlapping ) {
      # Extend the current region
   } else {
      # Store the current region
      # and start a new one
   }
}
```

What goes in the `if()` statement?  Well, extending the region is easy:
```r
# Extend the current region
current_merged_region$end = max( current_merged_region$end, next_region$end )
```

And storing the old one is also easy:
```r
# Store the current region
result = rbind(
   result,
   current_merged_region
)
# and start a new one
current_merged_region = next_region
```

### Putting it all together

Let's put this all together in a function now:
```r
merge_regions = function( regions ) {
   # Sort regions
   regions = regions %>% arrange( start, end )

   # Create variables to put the result in
   result = tibble()
   current_merged_region = regions[1,]

   # Loop over regions
   for( i in 2:nrow(regions)) {
      next_region = regions[i,]

      overlapping = (next_region$start <= current_merged_region$end)
      if( overlapping ) {
         # Extend the current region
         current_merged_region$end = max( current_merged_region$end, next_region$end )
      } else {
         result = rbind(
            result,
            current_merged_region
         )
         # Start a new region!
         current_merged_region = next_region
      }
   }
   return( result )
}
```

So does it work?

:::tip Note
Try this out now:
```r
test_compute_length_of_regions()
```

Did it work?  No it didn't!

In fact there are two problems here.  First, the `merge_regions`() function is not handling the case where there is only one input region:
```r
merge_regions( test_regions[1,])
```

Why not?  Can you fix it?   (**Hint:** if there's only one region, you might as well just return it straight away.)

The second problem is that we forgot to handle the last interval!  You can see that by running it our test dataset:

```r
merge_regions( test_regions )
```

```
# A tibble: 1 × 2
  start   end
  <dbl> <dbl>
1    50   120
2   150   190
```

If you compare this to `test_regions` you'll see it's missed the last interval `[200,220]`.

Can you fix it?

:::

## Finishing it

Your final function should look something like this:

```r
merge_regions = function( regions ) {
   # Catch the case where there's only one region
   if( nrow( regions ) == 1 ) {
      return( regions ) ;
   }

   # Otherwise, sort regions
   regions = regions %>% arrange( start, end )

   # create variables to put the result in
   result = tibble()
   current_merged_region = regions[1,]

   # Loop over regions
   for( i in 2:nrow(regions)) {
      next_region = regions[i,]

      overlapping = (next_region$start <= current_merged_region$end)
      if( overlapping ) {
         # Extend the current region
         current_merged_region$end = max( current_merged_region$end, next_region$end )
      } else {
         result = rbind(
            result,
            current_merged_region
         )
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

This is looking good!
```r
> merge_regions( test_regions )
# A tibble: 3 × 2
  start   end
  <dbl> <dbl>
1    50   120
2   150   190
3   200   220

> test_compute_length_of_regions()
```

