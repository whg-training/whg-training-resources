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
    remove_attributes( result, attributes_to_extract )
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
        extract_attribute_as_column( data, column_index, attribute_name )
        column_index += 1

def extract_attribute_as_column( data, column_index, attribute_name ):
    # A regular expression that matches *just* the attribute of interest
    regexp = re.compile( '%s=([^;]+)' % attribute_name )
    data.insert(
        column_index,
        attribute_name,
        data['attributes'].str.extract( regexp )
    )

def remove_attributes( data, attributes_to_remove ):
    for name in attributes_to_remove:
        remove_attribute( data, name )

def remove_attribute( data, attribute_name ):
    # A regular expression that matches everything *around* the
    # attribute of interest.
    regexp = re.compile(
        '(.*)%s=[^;]+(.*)'
        % attribute_name
    )
    # Note: if the attribute is not present, it won't match and the
    # result values will be missing.  Dealing with this is a bit tricky.
    matched_parts = data['attributes'].str.extract( regexp )
    reconstruct_attributes( data, matched_parts )

def reconstruct_attributes( data, matched_parts ):
    def fix_semicolons( a ):       # A helper function
        if len(a) == 0:
            return a
        if a[0] == ';':
            a = a[1:]
        if a[-1] == ';':           # last character in the string
            a = a[0:-1]
        a = a.replace( ';;', ';' )
        return a

    # Reconstruct the attributes without the attribute in question
    joined = matched_parts[0] + matched_parts[1]
    # This only actually works for rows that matched (otherwise we get NAs)
    # find those rows now...
    matched_rows = ( matched_parts.notnull().any( axis = 1 ))
    # ...and put back in the result, fixing the semicolons
    data.attributes.loc[ matched_rows ] = joined[ matched_rows ].apply( fix_semicolons )

