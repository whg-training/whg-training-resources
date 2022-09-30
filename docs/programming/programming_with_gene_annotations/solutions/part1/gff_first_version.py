# gff.py
# This file implements the function parse_gff3_to_dataframe()
#
# I've used a particular style here:
# - names_are_written_using_underscores (as opposed to camelCaseWhichSomePeopleLike.)
# - I've generally made functions create a `result` variable, and their job is to build & return it.
# - I've also written it in the top-down style, in which the highest-level function goes first
# followed by the immediate functions it uses etc.  This is a useful style to follow
# 
def parse_gff3_to_dataframe( file ):
    """Read GFF3-formatted data in the specified file (or file-like object)
    Return a pandas dataframe with ID, Parent, seqid, source, type, start, end, score, strand, phase, and attributes columns.
    The ID and Parent are extracted from the attributes columns"""
    import pandas
    result = pandas.read_table(
        file,
        comment = '#',
        names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
        na_values = ".",
        dtype = {
            'seqid': str,  'source': str, 'type': str,
            'start': int,  'end': int,    'score': float,
            'strand': str, 'phase': str,  'attributes': str
        }
    )
    
    result['ID'] = result['attributes'].apply( extract_ID_from_attributes )
    result['Parent'] = result['attributes'].apply( extract_Parent_from_attributes )
    # reorder columns because I'd like to have ID and Parent first
    result = result[ ['ID', 'Parent', 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'] ]
    return result

# Helper functions
def extract_ID_from_attributes( attributes ):
    return extract_value_from_attributes( attributes, 'ID' )

def extract_Parent_from_attributes( attributes ):
    return extract_value_from_attributes( attributes, 'Parent' )

def extract_value_from_attributes( attributes, key ):
  result = None
  key_pos = attributes.find( key + '=' )                       # find the '[key]=' bit
  if key_pos == -1:
    pass                                                       # no attribute for this key; do nothing
  else:
    start_of_value = key_pos+len(key)+1                        # find the start of the value
    semicolon_pos = attributes.find( ';', start_of_value )     # find the next semicolon (or -1 if none)
    if semicolon_pos == -1:
      semicolon_or_end = len(attributes)
    else:
      semicolon_or_end = semicolon_pos
    result = attributes[start_of_value:semicolon_or_end]       # extract the value
  return result

