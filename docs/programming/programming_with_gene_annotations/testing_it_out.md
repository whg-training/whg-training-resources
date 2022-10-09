---
sidebar_position: 3.5
---

# Testing it out

A function is only as good as its tests - so let's test our code before using it in anger.

Here's some simple test data:

    ##gff-version 3
    #description: test data
    chr1   me    gene    1    1000    .    +    .    ID=gene1;other_data=stuff
    chr1   me    exon    10    900    .    +    .    ID=gene1.1;Parent=gene1

or the same thing encoded in python using the `"""` multi-line string syntax:
```python
test_data = """##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"""
```

If the code is right, we should be able to recover all this data using our function. Let's try now:

```python
from io import StringIO # see comment below
  
# 1. run our function to parse the data:
data = parse_gff3_to_dataframe( StringIO( test_data ))
  
# 2. test it:
# check some string fields:
assert data['seqid'][0] == 'chr1'
assert data['strand'][0] == '+'
assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
assert data['seqid'][1] == 'chr1'
assert data['strand'][1] == '+'
assert data['attributes'][1] == 'ID=gene1.1;Parent=gene1'
  
# check that start and end are integers
assert data['start'][0] == 1000 # start and end are integers, not strings
assert data['end'][0] == 1000
assert data['start'][1] == 10
assert data['end'][1] == 900

# check that missing data is handled right
# "." indicates missing data in the GFF spec
# but we should have translated that to `NaN`, which
# is pandas' way of indicating missing data.
from math import isnan
assert isnan( data['score'][1] ) 
  
# check that we extracted `ID` and `Parent` right.
assert data['ID'][0] == 'gene1'
assert data['ID'][1] == 'gene1.1'
assert data['Parent'][1] == 'gene1'
# etc.

```

:::tip note

The `StringIO` stuff is just there to turn our test data string into a file-like object (otherwise
it would think it is a filename, and try to find the file.)

:::


:::

If all the tests pass - congratulations! (If not try reading the
[guide to getting it to work](Getting_started_writing_some_code.md#anatomy-of-getting-it-to-work) again. My solution is
[here](solutions/part1/gff.py) if you want to peek.


