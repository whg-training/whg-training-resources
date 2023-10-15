library( gmsgff )
library( RSQLite )

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
    # add other needed arguments here
    return( parser$parse_args() )
}

get_source_name = function( filename ) {
    # Get the input name without directories
    result = basename( filename )
    # Get rid of the .gff suffix using a 'regular expression'
    # [.] matches a dot
    # [^.]* matches any number of things that are NOT dots
    # $ matches the end of the string
    result = gsub( "[.][^.]*+*$", "", result )
    return( result )
}


process = function( args ) {
	echo( "++ process(): loading data from '%s'...\n", args$input )
    data = gmsgff::parse_gff_to_dataframe( args$input )
	echo( "++ ok, data had %d rows and %d columns.\n", nrow(data), ncol(data))

	echo( "++ process(): Adding source filename as a column...\n" )
    add_column(
        data,
        source = get_source_name( args$input ),
        .before = 1
    )

	echo( "++ process(): Writing data to '%s', gff table...\n", args$output )
    db = DBI::dbConnect(RSQLite::SQLite(), args$output )
    dbWriteTable(
        db,
        "gff",
        data,
        row.names = FALSE
    )

	echo( "++ process(): ok, adding indexes...\n" )
    # Create the indexes
    dbGetQuery( db, "CREATE INDEX IF NOT EXISTS gff_id_index ON gff( ID ))" )
    dbGetQuery( db, "CREATE INDEX IF NOT EXISTS gff_parent_index ON gff( Parent ))" )

    # close the connection
    dbDisconnect( db )
	echo( "++ process(): success.\n" )
}

echo( "++ gff_to_sqlite.R: Welcome!\n" )
args = parse_arguments()

echo( "++ gff_to_sqlite.R: processing...\n" )
process()

echo( "++ Success!\n" )
echo( "++ Thank you for using gff_to_sqlite.R.\n" )

