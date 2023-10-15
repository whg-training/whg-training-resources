import os
import sqlite3
import gmsgff

def parse_arguments():
	import argparse
	parser = argparse.ArgumentParser(
		description = """Convert a GFF3 file to sqlite3 format.
		The result will be a table with the GFF3 fields, and with ID and Parent fields in columns.
		"""
	)
	parser.add_argument(
		'--input',
		help ='The path of a GFF3-formatted file to work with',
		required = True
	)
	parser.add_argument(
		'--output',
		help = "The path to the output file",
		required = True
	)
	# add other needed arguments here
	return parser.parse_args()

def get_dataset_name( filename ):
	# Get the input name without directories
	result = os.path.basename( args.input )
	# Get rid of the .gff suffix - python has a function for this
	result = os.path.splitext( result )[0]
	return( result )

def write_records( data, db, table_name, record_types ):
	print(
		"++ write_records(): Writing %s records to table '%s'..." % (
			', '.join( record_types ),
			table_name
		)
	)
	subset = data[ data['type'].isin( record_types )]
	subset.to_sql( table_name, db, index = False, if_exists = "append" )
	print( "   ... ok, adding indexes..." )
	db.execute( "CREATE INDEX IF NOT EXISTS %s_id_index ON %s( ID )" % ( table_name, table_name ))
	db.execute( "CREATE INDEX IF NOT EXISTS %s_parent_index ON %s( Parent )" % ( table_name, table_name ))

def process( args ):
	print( "++ process(): loading data from '%s'..." % args.input )
	data = gmsgff.parse_gff3_to_dataframe( args.input )
	print( "++ ok, loaded %d rows and %d columns of data." % ( data.shape[0], data.shape[1] ) )
	print( "first few rows are:" )
	print( data.head() )

	print( "++ process(): Adding dataset filename as a column..." )
	data.insert( loc = 0, column = 'dataset', value = get_dataset_name( args.input ) )

	print( "++ process(): Connecting to database '%s'..." % args.output )
	db = sqlite3.connect( args.output )
	
	# Set up some GFF record types that we want to save.
	# We arrange this in a list so that it works for both Ensembl and gencode files
	# The name is the table name, and the list value is a vector of GFF types to put in that table.
	# We here used a python 'dict' type for this (i.e. keys and values) but other data structures
	# would also work (or you could hard-code it).
	tables_and_types = {
		"chromosome": [ 'chromosome' ],
		"gene": [ 'gene', 'pseudogene' ],
		"transcript": [ 'transcript', 'mRNA' ],
		"exon": [ 'exon' ],
		"cds": [ 'CDS' ],
		"utr": [ 'five_prime_UTR', 'three_prime_UTR' ]
	}
	for table_name in tables_and_types.keys():
		write_records(
			data,
			db,
			table_name,
			tables_and_types[table_name]
		)

	print( "++ process(): closing the database." )
	db.close()

print( "++ Welcome to gff_to_sqlite.py!" )
args = parse_arguments()

print( "++ gff_to_sqlite.py: processing..." )
process( args )

print( "++ Success!" )
print( "++ Thank you for using gff_to_sqlite.py." )
