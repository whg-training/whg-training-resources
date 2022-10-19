# gff.py
# This file implements the function parse_gff3_to_dataframe()
# and a number of helper functions.
# This is the 'refactored' version in which the main function is only 3 lines long.

import pandas, re

def parse_gff3_to_dataframe(
	file,
	attributes_to_extract = [ 'ID', 'Parent' ]
):
	"""Read GFF3-formatted data in the specified file (or file-like object)
	Return a pandas dataframe with seqid, source, type, start, end, score, strand, phase, and attributes columns.
	Additinally, the listed attributes are removed from the attributes column and placed in seperate
	columns at the start of the result dataframe."""
	result = read_gff3_using_pandas( file )
	extract_attributes_as_columns( result, attributes_to_extract )
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

def extract_attributes_as_columns( data, attributes_to_extract ):
	column_index = 0
	for attribute_name in attributes_to_extract:
		# Put a placeholder column in
		data.insert( column_index, attribute_name, None )
		extract_attribute_as_column( data, attribute_name )
		column_index += 1

def extract_attribute_as_column( data, attribute_name ):
	# A regular expression that matches everything *before* and *after* the
	# attribute of interest, and the attribute itself.
	regexp = re.compile( '(.*)%s=([^;]+)(.*)' % attribute_name )
	matched_parts = data.attributes.str.extract( regexp )
	# matched_parts has three columns: the bit before, the value itself, and the bit after.
	# First let's set the attribute column itself:
	data[ attribute_name ] = matched_parts[1]
	# Now let's reconstruct the remainder by pasting together the parts
	joined = matched_parts[0] + matched_parts[2]
	# If the attribute didn't match, both parts will be NA.
	# To deal with this we skip these rows
	matched_rows = ( matched_parts.notnull().any( axis = 1 ))
	# ...and put back in the result, fixing the semicolons
	data.attributes[ matched_rows ] = joined.loc[matched_rows].apply( fix_semicolons )

def fix_semicolons( a ):	   # A helper function
	if len(a) == 0:
		return a
	if a[0] == ';':
		a = a[1:]
	if a[-1] == ';':		   # last character in the string
		a = a[0:-1]
	a = a.replace( ';;', ';' )
	return a
