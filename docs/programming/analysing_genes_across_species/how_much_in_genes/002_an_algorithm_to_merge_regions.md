---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# An algorithm to merge regions

## What was wrong?

The reason our 'proportion of genome in genes estimate' is wrong, is that **genes overlap each other**.    For example
[here is the smallest annotated
gene](https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr10%3A66926269%2D66926385), inside an exon of the
larger gene *LRRTM3* - and you can also see that *LRRTM3* clearly overlaps *CTNNA3* there.  

:::tip Question

Can you find more example by interrogating your data?  For example, maybe some other genes overlap the giant gene *TTN*
(titin)?

:::

What this means is we have **over-counted the length**.

To fix this we will have to develop an algorithm to *merge* the gene regions, so that we can compute the total length
without overlaps.  This page will show you how you can do that.

:::tip Challenge

Write a function `merge_regions()` that computes the union of (i.e. merges) a set of regions passed in.

The input should be a dataframe with `start` and `end` columns indicating the input regions.  They might overlap.

The output should be a dataframe with `start` and `end` columns indicating the merged regions.  They should cover the
same intervals but without overlaps.

For example if we give it this:
```r
test_regions = tribble(
   ~start,  ~end,
         50,   100,   # A long region
         90,   120,   # A region overlapping the end of the first one
         60,    80,   # A region enclosed in the first one
         200,  220,   # A region not overlapping the earlier ones
         205,  215,   # A region enclosed in the previous one
         150,  190    # A region not overlapping any others, and out of order
)
```

It should compute this:
```r
> merge_regions( test_regions )
# A tibble: 3 × 2
  start   end
  <dbl> <dbl>
1    50   120
2   150   190
3   200   220
```

(If you stare hard at the test regions above you'll see this is the right answer.)
:::

:::caution Note

Note how in the above we used the dplyr [`tribble()` function](https://tibble.tidyverse.org/reference/tribble.html).  It
provides a useful way to specify test dataframes by row instead of column.

:::

## The algorithm

A basic idea for an algorithm to solve this is to 'walk' through the regions from one end of the chromosome to the
other, keeping track of the current merged region. At each step we will then either **extend** the current merged region
if the next region overlaps), or else **store** the current merged region in the output and move on to the next.

For example, here is a diagram of that algorithm in action for a dataset like our test regions above.  You can click
through the tabs to see the algorithm steps:

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
<TabItem value="1" label="Sort">

```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
```
</TabItem>
<TabItem value="2" label="Initialise">

```
            → region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
```
</TabItem>
<TabItem value="3" label="Step 3">

```
              region 1:      ----------------
            → region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
```
</TabItem>
<TabItem value="4" label="Extend">

```
              region 1:      ----------------
              region 3:            ----
            → region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
 merged region, step 3:      ↑                   ↑                         ← (extend)
```
</TabItem>
<TabItem value="5" label="Step 5">

```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
            → region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
 output region, step 3:      ↑-------------------↑                         ← (output...)
 merged region, step 4:                              ↑   ↑                 ← (...and start new interval)
```
</TabItem>
<TabItem value="6" label="Steps 6">

```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
            → region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
 output region, step 3:      ↑-------------------↑                         ← (output)
 output region, step 4:                              ↑---↑                 ← (output)
 merged region, step 5:                                        ↑    ↑      ← (start new interval)
```
</TabItem>
<TabItem value="7" label="Steps 7">

```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
            → region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
 output region, step 3:      ↑-------------------↑                         ← (output)
 output region, step 4:                              ↑---↑                 ← (output)
 merged region, step 5:                                        ↑    ↑      ← (start new interval)
 merged region, step 6:                                        ↑      ↑    ← (extend)
```
</TabItem>
<TabItem value="8" label="Final step">

```
              region 1:      ----------------
              region 3:            ----
              region 2:                    -------
              region 6:                              -----
              region 5:                                        ------
              region 4:                                          ------
 merged region, step 1:      ↑              ↑
 merged region, step 2:      ↑              ↑                              ← (no change)
 output region, step 3:      ↑-------------------↑                         ← (output)
 output region, step 4:                              ↑---↑                 ← (output)
 merged region, step 5:                                        ↑    ↑      ← (start new interval)
 output region, step 6:                                        ↑------↑    ← (output this too!)

(end of algorithm).
```

</TabItem>

</Tabs>

At this point we have output a set of three merged intervals that cover the same regions as the input ones, but without
overlap.

Can you implement it?

## Implementing the algorithm

If you're stuck - don't worry, this page will guide you to a solution.  

### Start with a test

We should of course start with a test - that'll help us to know when we have got it right.    Here is one that tests
simple examples and more complicated ones:

```r
test_merge_regions <- function() {
   # Test on a single region
   {
      merged = merge_regions(
         tibble(
            start = 1,
            end = 1
         )
      )
      stopifnot( nrow( merged ) == 1 )
      stopifnot( merged$start[1] == 1 )
      stopifnot( merged$end[1] == 1 )
   }

   # Test on non-overlapping regions
   {
      merged = merge_regions(
         tribble(
            ~start, ~end,
                 1,   10,
                21,   30
         )
      )
      stopifnot( nrow( merged ) == 2 )
      stopifnot( merged$start[1] == 1 )
      stopifnot( merged$end[1] == 10 )
      stopifnot( merged$start[2] == 21 )
      stopifnot( merged$end[2] == 30 )
   }

   # Test on overlapping regions
   {
      merged = merge_regions(
         tribble(
            ~start, ~end,
                 1,   10,
                 6,   15
         )
      )
      stopifnot( nrow( merged ) == 1 )
      stopifnot( merged$start[1] == 1 )
      stopifnot( merged$end[1] == 15 )
   }

   # Test using our complicated example above
   {
      merged = merge_regions(
          tribble(
              ~start,  ~end,
                  50,   100,   # A long region
                  90,   120,   # A region overlapping the end of the first one
                  60,    80,   # A region enclosed in the first one
                  200,  220,   # A region not overlapping the earlier ones
                  205,  215,   # A region enclosed in the previous one
                  150,  190    # A region not overlapping any others, and out of order
          )
	  )
      stopifnot( nrow( merged ) == 3 )
      stopifnot( merged$start[1] == 50 )
      stopifnot( merged$end[1] == 120 )
      stopifnot( merged$start[2] == 150 )
      stopifnot( merged$end[2] == 190 )
      stopifnot( merged$start[3] == 200 )
      stopifnot( merged$end[3] == 220 )
   }
}
```

If you run the test right now, it will of course fail:

```r
> test_merge_regions()
Error in merge_regions(tibble(start = 1, end = 1)) : 
  could not find function "merge_regions"
```

Once the test passes, your `merge_regions() function is ready!

### Sort

We should start the by sorting the regions:
```r
input_regions = input_regions %>% arrange( start, end )
```

### initialise

We'll initialise the algorithm by starting with the first (sorted) region passed in.
Let's also create a variable `result` to keep track of the output regions:

```r
result = tibble()
current_merged_region = input_regions[1,]
```

### Stepping through regions

How should we 'walk' through the remaining regions?  The obvious way is a loop:
```r
for( 2 in 1:nrow(input_regions)) {
   next_region = input_regions[i,]

   # do something here!
}
```

### Checking for overlap

So what should go in the loop?  Evidently what should happen is:

* If `next_region` *overlaps* the current region we are merging, then the current region isn't big enough - we'd better extend it
* Otherwise, we'd better record the current region we've been merging, and start a new 'current' region.

So something like this:
```r
for( i in 2:nrow(input_regions)) {
   next_region = input_regions[i,]

   overlapping = (next_region$start <= current_merged_region$end)
   if( overlapping ) {
      # Extend the current region
   } else {
      # Store the current region
      # and start a new one
   }
}
```

What goes in the `if()` statement?  Well, extending the region is easy - we make the current merged region at least as
large as it is now, plus the new overlapping region:

```r
# Extend the current region
current_merged_region$end = max( current_merged_region$end, next_region$end )
```

Or, if we're not overlapping, then storing the current one in the output is also easy:
```r
# Store the current region
result = rbind( result, current_merged_region )
# and start a new one
current_merged_region = next_region
```

:::tip Note

`rbind()` here stands for 'bind rows'.  That is R-speak for 'concatenate rows', i.e. here used to add this new row to
the existing dataframe.  (You can also use dplyr [`bind_rows()`](https://dplyr.tidyverse.org/reference/bind.html) if you
prefer the name).  This is quite a common / usefulpattern to build up a result dataframe within a loop.

:::

### Putting it together

Let's put this all together in a function now:
```r
merge_regions = function( input_regions ) {
   # Sort regions
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
   return( result )
}
```

### Testing it

So does it work?


:::tip Note
Try out the test:
```r
> test_merge_regions()
Error in if (overlapping) { : missing value where TRUE/FALSE needed

Uh-oh!

You can also try it on our test dataset:
```r
merge_regions( test_regions )
```

This is wrong as well!  (Two output regions instead of three.)

There are actually two problems with the current function:

* The **first problem** occurs if we pass in an input dataframe with only one region (or indeed, an empty dataframe with
  no regions in).  Can you see what the problem is and how to fix it?

* The **second problem** is that we havent quite finished the algorithm - we didn't implement the [last
  step](#an-algorithm-to-merge-regions)!  Can you finish it?

Use the test to know when you've fixed it - good luck!

:::
