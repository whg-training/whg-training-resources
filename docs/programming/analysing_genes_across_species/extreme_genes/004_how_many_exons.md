---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# The number of exons

If you follow steps similar to the above, you ought to know how you could also add columns to the dataset reflecting the
**number of exons** in each gene. has (in its canonical transcript).  

For example you could do it like this:

* Load the exon data from the gff file (they have `type == 'exon'`).
* join it to the canonical transcripts table, by `dataset` and `transcript_id`.
* Now re-do your join of the genes table to the canonical transcripts table.

Good luck!

:::tip Solutions

You should **definitely do this yourself**.  But if you get stuck, here is a solution.

<Tabs>
<TabItem value="hint" label="Reveal?">

Click the tab above to see some hints and a solution.

</TabItem>

<TabItem value="1" label="Hints">

Are you sure you want to see hints?  Here are some:

* Load the exon data, but make sure to rename columns like we did for [transcripts](./002_long_genes_2.md) so they don't
  get muddled up when you join.

* Join to the transcripts table by `transcript_id`, just as we did for [CDS records](./002_long_genes_2.md#computing-coding-length)

* Use `group_by( dataset, transcript_id )` to group by transcript, and then `summarise( number_of_exons = n() )` to count exons per transcript.

* Finally use a `left_join()` to add the column to the genes file.  **Note**. The transcript ID column in the `genes`
  dataframe is called `canonical_transcript_id`, but `transcript_id` in the transcripts table.  You may have to rename
  this column, or else use the [dplyr `join_by()`](https://dplyr.tidyverse.org/reference/join_by.html) function to
  complete the join.

</TabItem>

<TabItem value="2" label="Solution">

Here was my solution:
```r
# Load exon data
exons = (
	db
	%>% tbl( "gff" )
	%>% filter( type == 'exon' )
	%>% select( dataset, exon_id = ID, transcript_id = Parent, exon_seqid, exon_start = start, exon_end = end )
	%>% collect()
)

# Link to transcripts
transcripts_and_exons = inner_join( transcripts, exons, by = c( "dataset", "transcript_id" ))

# Count exons
exon_counts = (
	transcripts_and_exons
	%>% group_by( dataset, transcript_id )
	%>% summarise( number_of_exons = n() )
)

# Link to genes
genes = left_join(
	genes,
	exon_counts,
	by = join_by(
		dataset == 'dataset',
		canonical_transcript_id == 'transcript_id'
	)
)

```

The only bit of that we didn't do before was the last one - where I used two different columns names
('canonical_transcript_id' and 'transcript_id') to join the data frames.  Dplyr has a
[`join_by()`](https://dplyr.tidyverse.org/reference/join_by.html) function to do this.  (Another way would have been to
rename the columns first.)


</TabItem>

</Tabs>

:::