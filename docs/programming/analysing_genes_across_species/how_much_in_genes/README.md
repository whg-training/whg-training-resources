---
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How much of the genome is in genes?

If you've followed so far you should have:

- a table `genes` of genes (with some statistics from the ['canonical' transcript](../extreme_genes/003_canonical_transcripts.md)).
- a table `regions` of regions including chromosomes or other contigs, describing the assembly.
- and you should have (or know how to get) other things like a dataframe of `transcripts` and an `exons`.

Let's use this to try to figure out how much of the genome is actually covered by genes.
