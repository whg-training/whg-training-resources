options(tidyverse.quiet = TRUE)
library( tidyverse )
library( RSQLite )
library( gmsgff )

echo = function( message, ... ) {
	cat( sprintf( message, ... ))
}

parse_arguments = function() {
    library( argparse )
    parser = ArgumentParser(
        description = "Convert a GFF3 file to sqlite3 format. The result will be a table with the GFF3 fields, and with ID and Parent fields in columns."
    )
    parser$add_argument(
        '--input',
        type = "character",
        help = "The path of a GFF3-formatted file to work with",
        required = TRUE
    )
    parser$add_argument(
        '--output',
        type = "character",
        help = "The path of the output .tsv file.",
        required = TRUE
    )
    return( parser$parse_args() )
}

get_dataset_name = function( filename ) {
    # Get the input name without directories
    result = basename( filename )
    # Get rid of the .gff suffix using a 'regular expression'
    # [.] matches a dot
    # [^.]* matches any number of things that are NOT dots
    # $ matches the end of the string
    result = gsub( "[.][^.]*(.gz)*$", "", result )
    return( result )
}

process = function( args ) {
	echo( "++ process(): loading data from '%s'...\n", args$input )
    data = gmsgff::parse_gff3_to_dataframe( args$input, extra_attributes = c( "biotype", "Name" ) )
	echo( "++ ok, loaded %d rows and %d columns of data.\n", nrow(data), ncol(data) )
	echo( "first few rows are:\n" )
	print( head( data ))

	echo( "++ process(): Adding dataset filename as a column...\n" )
    data = add_column(
        data,
        dataset = get_dataset_name( args$input ),
        .before = 1
    )

	echo( "++ Summarising data by type and biotype...\n" )
    summary = (
        data
        %>% group_by( dataset, type, biotype )
        %>% summarise(
            number_of_features = n(),
            median_length = sprintf( "%.2fkb", median( end-start+1 ) / 1000 )
        )
    ) %>% arrange( number_of_features )

    # Encode type and biotype together
    w = which( !is.na( summary$biotype ))
    summary$type[w] = sprintf( "%s (%s)", summary$type[w], summary$biotype[w])
    summary = summary[,c(1:2,4:ncol(summary))]

	echo( "++ process(): Writing data to '%s'...\n", args$output )
	write_tsv( summary, args$output )
	echo( "++ process(): success.\n" )
}

echo( "++ Welcome to summarise_ensembl_gff.R!\n" )
args = parse_arguments()

echo( "++ summarise_ensembl_gff.R: processing...\n" )
process( args )

echo( "++ Thank you for using summarise_ensembl_gff.R.\n" )
