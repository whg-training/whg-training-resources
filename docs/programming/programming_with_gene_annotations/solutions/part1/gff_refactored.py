# gff.py
# This file implements the function parse_gff3_to_dataframe()
# and a number of helper functions.
# This is the 'refactored' version in which the main function is only 3 lines long.

import pandas, re

def parse_gff3_to_dataframe( file):
	"""Read GFF3-formatted data in the specified file (or file-like object)
	Return a pandas dataframe with seqid, source, type, start, end, score, strand, phase, and attributes columns.
	Additinally, the listed attributes are removed from the attributes column and placed in seperate
	columns at the start of the result dataframe."""
	result = read_gff3_using_pandas( file )
	extract_ID_and_Parent( result )
	return result

def read_gff3_using_pandas( file ):
	"""Helper function to read the given GFF3 file into a dataframe, without any postprocessing."""
	import pandas
	result = pandas.read_table(
		file,
		comment = '#',
		names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
		na_values = ".",
		dtype = {
			'seqid': "string",
			'source': "string",
			'type': "string",
			'start': "Int32",
			'end': "Int32",
			'score': "float",
			'strand': "string",
			'phase': "string",
			'attributes': "string"
		}
	)
	return result

def extract_ID_and_Parent( data ):
	data.insert( 0, 'ID', data.attributes.str.extract( 'ID=([^;]+)' ))
	data.insert( 1, 'Parent', data.attributes.str.extract( 'Parent=([^;]+)' ))
