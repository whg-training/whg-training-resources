---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Computing coding length

If you followed so far you'll have looked at some [very long genes](./001_long_genes_1.md) - some of them are pretty interesting.

But wait, that only measured gene 'length' as it is on the chromosome.  Surely a better measure would be the coding sequence length.  Let's try to compute that now.

:::tip Note

The coding sequence length, in bases, is of course related to the length of the encoded protein.  What's the
relationship?

:::

## Computing coding sequence length

To compute 'the coding sequence length of a gene' we run into two problems.

Here we run into two problems.  The first problem is that we somehow have to compute the coding length of each transcript, which isn't listed in the dataframe at the moment.  The second is that the coding length depends on the transcript, and there are multiple transcripts per gene - we'll somehow need to pick one.

Let's solve the first problem now by computing the coding length of each transcript.  (We'll then solve the second
problem by [computing a 'canonical' representative transcript of each gene](./003_canonical_transcripts.md)).

Make sure you've followed [this page](../004_filter_join_merge.md) first so you will know how to do this.  You should
also have the `genes` and `transcripts` tables from that page loaded.  

You can compute the coding length like this:

* **First**, load the coding sequence records.  We will be 'joining' the result to the transcripts, so makre sure to rename the `Parent` column as `transcript_id`, and add a `cds_` prefix to other column names to distringuish them from the transcript table.

:::tip Solution

<Tabs>
<TabItem value="hint" label="Don't show me!">

Please try this yourself!

If you get stuck, you can click the tabs above to see solutions.

</TabItem>

<TabItem value="R" label="R code">

```r
cds = dbGetQuery(
	db,
	"SELECT dataset, ID AS cds_id, Parent AS transcript_id,
	seqid AS cds_seqid, start AS cds_start, end AS cds_end
	FROM gff
	WHERE type == 'CDS'"
)
```
</TabItem>
<TabItem value = "dbplyr" label = "dbplyr code">

```r
cds = (
	db
	%>% tbl( 'gff' )
	%>% filter( type == "CDS" )
	%>% select(
		dataset,
		cds_id = ID,
		transcript_id = Parent,
		cds_seqid = seqid,
		cds_start = start,
		cds_end = end
	)
	%>% collect()
)
```

</TabItem>
</Tabs>

:::

**Secondly**, use a join to link the CDS records to the transcripts:

:::tip Solution

<Tabs>
<TabItem value="hint" label="Don't show me!">

Please try this yourself!  You can click the tabs above to see solutions.

</TabItem>

<TabItem value="R" label="R code">

```r
joined = left_join(
	transcripts,
	cds,
	by = c( "dataset", "transcript_id" )
)
```

**Note** you should always sanity check to see things are correct.
Are there any transcripts without CDS records?  Any CDS without transcripts?  Remembering that we're focussing on proteing-coding genes, satisfy yourself that the join has done the right thing.

</TabItem>
</Tabs>

:::

And **lastly**, use the `group_by()` and `summarise()` operations to compute the coding length of each transcript.

:::tip Solution

<Tabs>
<TabItem value="hint" label="Don't show me!">

Please try this yourself!  You can click the tab above to see solutions.

</TabItem>

<TabItem value="R" label="R code">

```r
transcripts_and_cds = (
	joined
	%>% group_by( dataset, gene_id, transcript_id )
	%>% summarise(
		number_of_cds = n(),
		cds_length = sum( cds_end - cds_start + 1 ),
		cds_start = min( cds_start ),
		cds_end = max( cds_end )
	)
)
```

</TabItem>
</Tabs>

:::
**As always**, you should sanity check the results - for example add up the coding length by hand for one gene to see that the above is right.  Don't forget that the length of each record is $(\text{end} - \text{start} + 1)$.

:::tip Note

There is of course another good sanity check.  Proteins are encoded in groups of three nucleotides, so if we've got this right then all the coding lengths should be multiples of three.

In R you can check this by using the 'modulo operator' `%%` - it computes the remainder of any number after dividing by three.  Let's try:

```r
transcripts_and_cds$length_mod_3 = transcripts_and_cds$cds_length %% 3
table( transcripts_and_cds$length_mod_3 )
```

When I did this, it worked fine for almost all transcripts, but...
```
     0      1      2 
311392  14769  14877
```

Investigate a few of those transcripts with the 'wrong' lengths now - for example by looking at them in the [Ensembl browser](https://www.ensembl.org) or inspecting the data in the 'attributes' column.  Is this something we've done wrong, or something in the data?

The majority of genes *do* have coding lengths a multiple of three, so (unless you've found a bug in your code) I suggest putting up with this issue for now.  (Another option would be to filter these records out.)

:::

