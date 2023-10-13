library( gmsgff )
library( unittest )

test_parse_gff3_to_dataframe = function() {
    test_data = "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"
    cat( "Using test data:\n" )
    cat( test_data )
    # 1. run our function to parse the data:
    gff = parse_gff3_to_dataframe( test_data )
    print(gff)
    # 2. test it:
    # Check we have all the basic columns
    columns = c(
        "seqid", "source", "type", "start", "end",
        "score", "strand", "phase", "attributes"
    )
    stopifnot(
        length( which( columns %in% colnames(gff) )) == length(columns)
    )
    # check some string fields, does it get them right?
    stopifnot( gff[['seqid']][1] == 'chr1' )
    stopifnot( gff[['strand']][1] == '+' )
    stopifnot( gff[['attributes']][1] == 'ID=gene1;other_data=stuff' )
    stopifnot( gff[['seqid']][2] == 'chr1' )
    stopifnot( gff[['strand']][2] == '+' )
    stopifnot( gff[['attributes']][2] == 'ID=gene1.1;Parent=gene1' )

    # check that start and end are integers
	stopifnot( gff[['start']][1] == 1 )
    stopifnot( gff[['end']][1] == 1000 )
    stopifnot( gff[['start']][2] == 10 )
    stopifnot( gff[['end']][2] == 900 )
	
    # check that missing data is handled right
    # "." indicates missing data in the GFF spec
    # but we should have translated that to an R missing value
    stopifnot( is.na( gff[['score']][2] ) )

    # check that we extracted `ID` and `Parent` right.
    stopifnot(
        length( which( c( "ID", "Parent" ) %in% colnames(gff) )) == 2
    )

    stopifnot( gff[['ID']][1] == 'gene1' )
    stopifnot( gff[['ID']][2] == 'gene1.1' )
    stopifnot( gff[['Parent']][2] == 'gene1' )
    # etc.
    # add your own checks here!

    cat( "\n++ test_parse_gff3_to_dataframe(): Congratulations, all tests passed!\n" )
}


test_parse_gff3_to_dataframe()
