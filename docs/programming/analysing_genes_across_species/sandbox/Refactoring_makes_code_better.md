---
sidebar_position: 40
---

# An aside on refactoring

[Up to table of contents](README.md)

How much do you like the code you wrote in `gff.py`?

Personally, I don't like [my original version](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part1/gff.py)
very much. Shorn of comments it looks like this:

```
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
    
    result['ID'] = result['attributes'].apply( extract_ID_from_attributes )
    result['Parent'] = result['attributes'].apply( extract_Parent_from_attributes )
    # reorder columns because I'd like to have ID and Parent first
    result = result[ ['ID', 'Parent', 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'] ]
    return result
```

It's long and just... *complicated*.

### Making it easier to read
The function should be simple.  It only does three things:

1. Loads the data
2. Extract the `ID` and `Parent` fields from the `attributes` column
3. Returns it.

So that is how we should write it:

```
def parse_gff3_to_dataframe( file ):
    result = read_gff3_using_pandas( file )
    extract_ID_and_Parent( result )
    return result
```

That's more like it! This new version of the function is much shorter and simpler, and it's easy to understand. It doesn't really
need any comments because it's more or less obvious what it does just from the function names.

Of course we have to write the `read_gff3_using_pandas()` and `extract_ID_and_Parent()` functions, but that's not
hard - it's just reworking what we already have. For example:

```
def extract_ID_and_Parent( data ):
    result['ID'] = result['attributes'].str.extract( 'ID=([^;]+)' )
    result['Parent'] = result['attributes'].str.extract( 'Parent=([^;]+)' )
```

:::tip Note
In the process of writing this I realised that the pandas
[`.insert()`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.insert.html)
method can be used to put the columns in at the start - so the last line of the original version (that reorders
columns) isn't needed any more.
:::

:::tip Note
The `extract_ID_and_Parent()` function follows a different pattern from the other functions we have written: it
*mutates its first argument*.
:::

This type of change - making the code easier to understand or more flexible, without changing its behaviour, is called
**refactoring**.

:::tip Challenge

Refactor your code to make it easier to understand.

:::

Note that it should still pass the test - otherwise you have broken it! My version is [here](solutions/part1/gff_refactored.py).

## Next steps

When you're happy with your code - let's go and [count some genes](Counting_genes_1.md).
