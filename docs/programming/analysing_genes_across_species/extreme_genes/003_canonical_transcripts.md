---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Picking a 'canonical' transcript

To assign a 'coding length' to each gene, we have to deal with the fact that genes have multiple transcripts.  **Suggestion**: let's solve this by picking one 'represenative' transcript per gene - the one with the longest coding length.

:::tip Note

As it happens, Ensembl also create a list of 'canonical' transcripts as [described on this page](https://www.ensembl.org/info/genome/genebuild/canonical.html).  According to that page:

> "For accurate analysis, we recommend that more than one
> transcripts at a locus may need to be considered, however, we
> designate a single Ensembl Canonical transcript per locus to
> provide consistency when only one transcript is required"

For some species, the Ensembl canonical transcript can be found in the `tsv` folder on the Ensembl FTP site (at least
it's there for humans in [release 108](https://ftp.ensembl.org/pub/release-108/tsv/)).  However, the file isn't there for all species, making it a bit difficult for us.

However that page also says:

> “Default” selection: in the absence of the data above (which
> currently applies to all non-human genomes), transcripts
> prioritised accordingly, choosing the one with the longest
> combined exon length:
> * protein-coding
> ...

In other words - they're suggesting the coding sequence length as a reasonable default choice.  So that's what we'll compute here.

:::

In fact computing the transcript with the longest coding sequence turns out to be quite easy now.  First, let's sort our
transcripts-with-cds-length dataframe by length, to put the longest ones at the top:

```
transcripts_and_cds = (
	transcripts_and_cds
	%>% arrange(
			dataset,
			gene_id,
			transcript_id,
			desc( cds_length )
	)
)
```

If you look at the output and find genes that appear more than once (multiple transcripts) you should now see that they come in order of decrease `cds_length`.  Now let's capture those by using `head` to extract just the first entry for each gene:
```
canonical_transcripts = (
	transcripts_and_cds
	%>% group_by( dataset, gene_id )
	%>% summarise(
		canonical_transcript_id = head( transcript_id, 1 ),
		cds_start = head( cds_start, 1 ),
		cds_end = head( cds_end, 1 ),
		cds_length = head( cds_length, 1 )
	)
)
```

:::caution Note

You **must** always sanity check the results!  At the very least you should check some genes by hand to ensure this has got the answer right.  (Doing this also gets you used to filtering and manipulating dataframes, so it's good practice too.)

:::

As a last point, let's link the genes back to the canonical transcripts:

```r
genes = inner_join(
	genes,
	canonical_transcripts,
	by = c( "dataset", "gene_id" )
)
```

Congratulations!  You now have a table of genes, with a somewhat sensibly-chosen canonical transcript, and the coding sequence length!
