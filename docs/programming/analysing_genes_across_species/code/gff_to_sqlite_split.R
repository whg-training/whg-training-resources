library(
	tidyverse,
	quietly = TRUE
)
library( RSQLite )
library( gmsgff )

echo = function( message, ... ) {
	cat( sprintf( message, ... ))
}

parse_arguments = function() {
    library( argparse )
    parser = ArgumentParser(
        description = "Convert a GFF3 file to sqlite3 format. Different record types will be stored in different tables: gene, transcript, exon, CDS, chromosome, and so on. The ID and Parent fields are also extracted; for genes, we also extract into columns any attributes named in the --attributes argument."
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
        help = "The path of the output file.",
        required = TRUE
    )
    parser$add_argument(
        '--attributes',
        type = "character",
		nargs = "+",
        help = "Attributes, in addition to 'ID' and 'Parent' to extract into columns.",
        default = c()
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
    result = gsub( "[.][^.]*$", "", result )
    return( result )
}

write_records = function(
	data,
	db,
	table_name
) {
	dbWriteTable(
		db,
		table_name,
		data,
		row.names = FALSE,
		append = TRUE
	)
	echo( "    ...ok, adding indexes...\n" )
	# Create the indexes
	dbExecute( db, sprintf( "CREATE INDEX IF NOT EXISTS %s_id_index ON %s( ID )", table_name, table_name ))
	dbExecute( db, sprintf( "CREATE INDEX IF NOT EXISTS %s_parent_index ON %s( Parent )", table_name, table_name ))
}

process = function( args ) {
	echo( "++ process(): loading data from '%s'...\n", args$input )
	data = gmsgff::parse_gff3_to_dataframe( args$input, extra_attributes = args$attributes )
	echo( "++ ok, loaded %d rows and %d columns of data.\n", nrow(data), ncol(data) )
	echo( "first few rows are:\n" )
	print( head( data ))

	echo( "++ process(): Adding dataset filename as a column...\n" )
	data = add_column(
		data,
		dataset = get_dataset_name( args$input ),
		.before = 1
	)

	echo( "++ process(): Connecting to db '%s'...\n", args$output )
	db = DBI::dbConnect(RSQLite::SQLite(), args$output )

	# Set up some GFF record types that we want to save.
	# We arrange this in a list so that it works for both Ensembl and gencode files
	# The name is the table name, and the list value is a vector of GFF types to put in that table.
	# We here used a 'named' list for this, but other data structures would do (or you could hard-code it).
	tables_and_types = list(
		chromosome = 'chromosome',
		gene = c( 'gene', 'pseudogene', plasmodb = 'protein_coding_gene' ),
		transcript = c( gencode = 'transcript', ensembl = 'mRNA' ),
		exon = 'exon',
		cds = 'CDS',
		utr = c( 'five_prime_UTR', 'three_prime_UTR' )
	)
	for( table_name in names(tables_and_types) ) {
		record_types = tables_and_types[[ table_name ]]
		echo( "++ process(): Writing %s records to table '%s'...\n", paste( record_types, collapse = ", " ), table_name )
		write_records(
			data %>% filter( type %in% record_types ),
			db,
			table_name
		)
	}

    # close the connection
    dbDisconnect( db )
	echo( "++ process(): success.\n" )
}

echo( "++ Welcome to gff_to_sqlite.R!\n" )
args = parse_arguments()

echo( "++ gff_to_sqlite.R: processing...\n" )
process( args )

echo( "++ Success!\n" )
echo( "++ Thank you for using gff_to_sqlite.R.\n" )

