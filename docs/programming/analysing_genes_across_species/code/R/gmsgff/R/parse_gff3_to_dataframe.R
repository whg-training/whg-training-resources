echo <- function( message, ... ) {
    cat( sprintf( message, ... ))
}

parse_gff3_to_dataframe <-
function(
    filename,
    extra_attributes = c()
) {
    echo( "++parse_gff3_to_dataframe(): Reading GFF3 data from \"%s\"...\n", filename )
    result = read_gff3( filename )

    result = tibble::add_column( result, ID = NA, .before = 1 )
    result = tibble::add_column( result, Parent = NA, .before = 2 )

    for( attribute in c( "ID", "Parent", extra_attributes )) {
        echo( "++parse_gff3_to_dataframe(): Extracting \"%s\" attribute...\n", attribute )
        # Updated regex that also matches the trailing semicolon or end-of-string
        # so we can remove it
        regex = sprintf( "%s=([^;]+)[;|$]", attribute )
        # Extract the matching part
        result[[attribute]] = stringr::str_extract( result[['attributes']], regex, group = TRUE )
        # Remove from the attributes
        result[['attributes']] = stringr::str_remove( result[['attributes']], regex )
    }

    # Get rid of 'gene:', 'exon:', etc in ID which is just wasting space.
    echo( "++parse_gff3_to_dataframe(): Removing prefixes from ID fields...\n" )
    result[['ID']] = stringr::str_remove( result[['ID']], '^(chromosome:|gene:|transcript:|exon:|CDS:)' )
    result[['Parent']] = stringr::str_remove( result[['Parent']], '^(chromosome:|gene:|transcript:|exon:|CDS:)' )

    echo( "++parse_gff3_to_dataframe(): ok.\n" )
    return( result )
}

read_gff3 <- function( filename ) {
    readr::read_tsv(
        filename,
        comment = '#',
        na = ".",
        col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ),
        col_types = readr::cols(
            readr::col_character(),
            readr::col_character(),
            readr::col_character(),
            readr::col_integer(),
            readr::col_double(),
            readr::col_double(),
            readr::col_character(),
            readr::col_integer(),
            readr::col_character()
        )
    )
}
