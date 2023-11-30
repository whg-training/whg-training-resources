---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Extreme genes!

We just saw an example of an [extreme gene](./004_filter_join_merge.md#transcripts-example) - a gene with more
transcripts than any other - 150 of them!

:::tip Challenge

Use `filter()` and/or `arrange()` to identify this gene.  What is it?

Does it also have lots of transcripts in other species, such as mouse?  (**Note**. you may need to add the 'Name' column
into the `transcripts_summary` dataframe to figure this out - or else use the gene `ID` to find it.)

Explore this gene using the [UCSC genome browser](https://genome-euro.ucsc.edu) and [Ensembl](http://www.ensembl.org),
or other sources such as [Uniprot](https://www.uniprot.org) and see what you can discover about it.  (Watch out though,
it has so many transcripts that it might take a while to load!)

:::

Looking for extreme genes is extremely fun - let's go and look for some others.

:::tip Challenge

What is:

* the largest gene in each species (by length on the genome)?
* The smallest?
* The gene with the most transcripts?
* ...or the most exons?
* The longest or shortest coding sequence?

:::

If you've followed so far you have most of the tools you need to solve these, but still they can take a bit of thought.
In the next few pages we'll give some tips on how you could answer these questions.

