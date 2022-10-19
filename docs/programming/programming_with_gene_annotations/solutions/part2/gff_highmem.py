# gff.py
# This file implements the function parse_gff3_to_dataframe()
# and a number of helper functions.
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
	extract_attributes_to_columns( result, attributes_to_extract )
	return result

# functions starting with underscores are private to the file
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

def extract_attributes_to_columns( data, attributes_to_extract = [ 'ID', 'Parent' ] ):
	column_index = 0
	for attribute_name in attributes_to_extract:
		extract_attribute_to_columns( data, column_index, attribute_name )
		column_index += 1

def extract_attribute_to_columns( data, column_index, attribute_name ):
	def remove_attribute( entry, regexp ): # a local helper function
		# substitute the matching part with an empty string...
		result = re.sub( regexp, "", entry )
		# ...and deal with semicolons
		if len(result) == 0:
			return result ;
		if result[0] == ';':
			result = result[1:]
		if result[-1] == ';':
			result = result[0:-1]
		return result.replace( ';;', ';' )

	regexp = re.compile( "%s=([^;]+)" % attribute_name )
	data.insert(
		column_index,
		attribute_name,
		data.attributes.str.extract( regexp )
	)

	# Now delete the field from the current attributes
	data.attributes = data.attributes.apply( lambda entry: remove_attribute( entry, regexp ))
	# Unfortunately, with big datasets, that uses up a lot of memory.
