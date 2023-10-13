parse_gff3_to_dataframe <-
function( filename ) {
    library( tidyverse )
    result = readr::read_tsv(
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
    result[['ID']] = stringr::str_extract( result[['attributes']], 'ID=([^;]+)', group = TRUE )
    result[['Parent']] = stringr::str_extract( result[['attributes']], 'Parent=([^;]+)', group = TRUE )
    return( result )
}
