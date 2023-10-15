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

def process( args ):
    print( "++ process(): loading data from '%s'..." % args.input )
    data = gmsgff.parse_gff3_to_dataframe( args.input )
    print( "++ ok, loaded %d rows and %d columns of data." % ( data.shape[0], data.shape[1] ) )
    print( "first few rows are:" )
    print( data.head() )

    print( "++ process(): Adding dataset filename as a column..." )
    data.insert( loc = 0, column = 'dataset', value = get_dataset_name( args.input ) )

    print( "++ process(): Writing data to '%s', gff table..." % args.output )
    db = sqlite3.connect( args.output )
    data.to_sql( "gff", db, index = False, if_exists = "append" )

    print( "++ process(): ok, adding indexes..." )
    db.execute( "CREATE INDEX IF NOT EXISTS gff_id_index ON gff( ID )" )
    db.execute( "CREATE INDEX IF NOT EXISTS gff_parent_index ON gff( Parent )" )

    print( "++ process(): closing the database." )
    db.close()

print( "++ Welcome to gff_to_sqlite.py!" )
args = parse_arguments()

print( "++ gff_to_sqlite.py: processing..." )
process( args )

print( "++ Success!" )
print( "++ Thank you for using gff_to_sqlite.py." )
