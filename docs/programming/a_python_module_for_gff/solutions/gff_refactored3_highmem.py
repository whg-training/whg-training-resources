# gff.py
# This file implements the function parse_gff3_to_dataframe()
#
# I've used a particular style here:
# - names_are_written_using_underscores (as opposed to camelCaseWhichSomePeopleLike.)
# - I've generally made functions create a `result` variable, and their job is to build & return it.
# - I've also written it in the top-down style, in which the highest-level function goes first
# followed by the immediate functions it uses etc.  This is a useful style to follow
# 

import pandas

def parse_gff3_to_dataframe(
    file,
    attributes_to_extract = [ 'ID', 'Parent' ]
):
    result = read_gff3_using_pandas( file )
    extract_attributes_as_columns( result, attributes_to_extract )
    remove_attributes( result, attributes_to_extract )
    return result

def read_gff3_using_pandas( file ):
    result = pandas.read_table(
        file,
        comment = '#',
        names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
        na_values = ".",
        dtype = {
            'seqid':        "string",
            'source':       "string",
            'type':         "string",
            'start':        "Int32",
            'end':          "Int32",
            'score':        "float",
            'strand':       "string",
            'phase':        "string",
            'attributes':   "string"
        }
    )
    return result

def extract_attributes_as_columns( data, attributes_to_extract ):
    column_index = 0 # use this counter to add the attributes at the start
    for name in attributes_to_extract:
        data.insert(
            column_index,
            name, 
            data['attributes'].apply( lambda attributes: extract_value_from_attributes( attributes, name ) )
        )
        column_index += 1

def extract_value_from_attributes( attributes, key ):
    result = None
    key_pos = attributes.find( key + '=' )                        # find the '[key]=' bit
    if key_pos == -1:
        return                                                    # no attribute for this key; do nothing
    else:
        start_of_value = key_pos+len(key)+1                       # find the start of the value
        semicolon_pos = attributes.find( ';', start_of_value )    # find the next semicolon (or -1 if none)
        if semicolon_pos == -1:
            semicolon_or_end = len(attributes)
        else:
            semicolon_or_end = semicolon_pos
        result = attributes[start_of_value:semicolon_or_end]      # extract the value
    return result

def remove_attributes( data, attributes_to_remove ):
    for name in attributes_to_remove:
        data.attributes = data.attributes.apply(
            lambda attributes:remove_value_from_attributes( attributes, name )
        )

def remove_value_from_attributes( attributes, key ):
    """Remove the given key=value pair from a semicolon-separated list of key=value attributes"""
    result = attributes
    key_pos = attributes.find( key + '=' )
    if key_pos == -1:
        pass
    else:
        start = key_pos
        next_semicolon_pos = attributes.find( ';', key_pos )
        if next_semicolon_pos == -1:
            # no trailing semicolon, remove to end of attributes string
            # and make sure to remove the preceding semicolon instead, if any
            end = len(attributes)
            if start > 0:
                start -= 1
        else:
            # there's a trailing semicolon, remove it as well
            end = next_semicolon_pos+1
        result = attributes[0:start] + attributes[end:]
    return result
