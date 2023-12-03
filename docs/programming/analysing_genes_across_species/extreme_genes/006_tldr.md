---
sidebar_position: 5
---

# Too long, didn't read

Here is all the code from this section in one place for reference.  I've slightly reorganised in places.

```r
library( RSQLite )
library( dplyr )
library( dbplyr )

db = DBI::dbConnect( RSQLite::SQLite(), "genes.sqlite" )

# 1. Load the genes...
genes = (
	db
	%>% tbl( "gff" )
	%>% filter( type == 'gene' & biotype == 'protein_coding' )
	%>% select( dataset, gene_id = ID, seqid, start, end, strand, Name, biotype )
	%>% collect()
)

# ...transcripts...
transcripts = (
	db
	%>% tbl( "gff" )
	%>% filter( type == 'mRNA' )
	%>% select(
		dataset, gene_id = Parent, transcript_id = ID,
		transcript_start = start, transcript_end = end,
		transcript_attributes = attributes
	)
	%>% collect()
)

# ...exons...
exons = (
	db
	%>% tbl( "gff" )
	%>% filter( type == 'exon' )
	%>% select( dataset, exon_id = ID, transcript_id = Parent, seqid, exon_start = start, exon_end = end )
	%>% collect()
)

# ...and cds.
cds = (
	db
	%>% tbl( 'gff' )
	%>% filter( type == "CDS" )
	%>% select(
		dataset, cds_id = ID, transcript_id = Parent,
		cds_seqid = seqid, cds_start = start, cds_end = end
	)
	%>% collect()
)

# 2. Count transcripts per gene
transcripts_per_gene = (
	genes
	%>% left_join(
		transcripts,
		by = c( 'dataset', 'gene_id' )
	)
	%>% group_by( dataset, gene_id )
	%>% summarise(
		number_of_transcripts = n(),
		min_transcript_length = min( transcript_end - transcript_start + 1 ),
		max_transcript_length = min( transcript_end - transcript_start + 1 )
	)
)

# 3. Compute 'canonical' transcripts
transcripts_and_cds = (
	transcripts
	%>% left_join(
		cds,
		by = c( "dataset", "transcript_id" )
	)
	%>% group_by(
		dataset,
		gene_id,
		transcript_id
	)
	%>% summarise(
		number_of_cds = n(),
		cds_length = sum( cds_end - cds_start + 1 ),
		cds_start = min( cds_start ),
		cds_end = max( cds_end )
	)
)

canonical_transcripts = (
	transcripts_and_cds
	%>% arrange(
		dataset, gene_id, transcript_id,
		desc( cds_length )
	)
	%>% group_by( dataset, gene_id )
	%>% summarise(
		canonical_transcript_id = head( transcript_id, 1 ),
		number_of_cds = head( number_of_cds, 1 ),
		cds_start = head( cds_start, 1 ),
		cds_end = head( cds_end, 1 ),
		cds_length = head( cds_length, 1 )
	)
)

# 4. Compute exons summary for each transcript
exon_counts = (
	transcripts
	%>% inner_join(
		exons,
		by = c( "dataset", "transcript_id" )
	)
	%>% group_by( dataset, transcript_id )
	%>% summarise(
		number_of_exons = n(),
		exons_start = min( exon_start ),
		exons_end = max( exon_end ),
		exon_length = sum( exon_end - exon_start + 1 )
	)
)

# 5. Add sumaries to genes table:
genes$length = genes$end - genes$start + 1

genes = (
	genes
	%>% left_join(
		transcripts_per_gene,
		by = c( "dataset", "gene_id" )
	)
	%>% left_join(
		canonical_transcripts,
		by = c( "dataset", "gene_id" )
	)
	%>% left_join(
		exon_counts,
		by = join_by(
			dataset == 'dataset',
			canonical_transcript_id == 'transcript_id'
		)
	)
)

```
