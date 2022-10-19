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

def parse_gff3_to_dataframe( file ):
    """Read GFF3-formatted data in the specified file (or file-like object)
    Return a pandas dataframe with ID, Parent, seqid, source, type, start, end, score, strand, phase, and attributes columns.
    The ID and Parent are extracted from the attributes columns"""
    result = pandas.read_table(
        file,
        comment = '#',
        names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
        na_values = ".",
        dtype = {
            'seqid': 'string',
            'source': 'string',
            'type': 'string',
            'start': 'Int64',
            'end': 'Int64',
            'score': 'float',
            'strand': 'string',
            'phase': 'string',
            'attributes': 'string'
        }
    )
    
    result['ID'] = result['attributes'].str.extract( 'ID=([^;]+)' )
    result['Parent'] = result['attributes'].str.extract( 'Parent=([^;]+)' )
    # reorder columns because I'd like to have ID and Parent first
    result = result[ ['ID', 'Parent', 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'] ]
    return result
