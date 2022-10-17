---
sidebar_position: 7
---

# Refactoring for better code

Look back at the code you wrote in `gff.py`.  How much do you like it?

Personally I don't like mine much... it looks like this:

```
# in gff.py
def parse_gff3_to_dataframe( file ):
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

### What's wrong with it?

There are three problems with this code:

1. **It's just.... *complicated***. The code only does two things (load data and add some attributes) - so why
does it look so complex?

2. **It's not flexible enough**. We already ran into some limitations when looking at the GENCODE data... and
what about the Ensembl files?

3. **It wastes memory**. On my machine loading the GENCODE data makes the process take up about 2.4Gb (three billion bytes) of
memory. (Luckily my laptop has plenty of memory, so this isn't causing an issue, but we had better be careful). Memory issues are
tricky but importnat and I'll go into this [on the next page](./memory_issues_and_how_to_solve_them.md).

Let's try to deal with these three issues now using a **refactor**.

### How to refactor

**Refactoring** means improving code for readability and flexibility *without breaking any of the basic use
cases*.  That way no downstream code should break.

How can we do this? Easy: we rely on our [test](gff_code.md) to ensure that we haven't broken things. Let's
start by double-checking the test still passes:

    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 2 tests in 0.021s
    
    OK

We'll try to improve `parse_gff3_to_dataframe()` without stopping the test from passing. Let's attack our three
problems one by one.

:::tip Note

Before getting started, **copy your original `gff.py` to a new location - say `gff_version1.py`.
:::

### Making it less complicated 

The function should be simple.  It only does three things:

1. Loads the data
2. Extract some attributes (`ID` and `Parent`) and puts them in columns
3. Returns it.

If we can write it that simply as bullet points, it ought to be that simple as code:

```
def parse_gff3_to_dataframe( file ):
    result = read_gff3_using_pandas( file )
    extract_attributes_as_columns( result )
    return result
```

To do that is easy: we just move bits of code into helper functions.  First, the bit that loads the data:

```
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
```

And the but that adds the columns:

```
def extract_attributes_as_columns( data ):
    data.insert( 0, 'ID', data['attributes'].apply( extract_ID_from_attributes ))
    data.insert( 1, 'ID', data['attributes'].apply( extract_Parent_from_attributes ))
```

:::tip Note

While writing this I discovered that the pandas
[`insert()` function](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.insert.html)
can be used to insert a column at the desired place in the data frame.
So this version no longer needs the 'reorder columns' bit in my version above.

:::

:::tip Note

`extract_attributes_as_columns()` follows a different pattern from the other ones we've written: it *mutates its
argument*.

:::

Try updating `gff.py` with the functions above in place of the original `parse_gff3_to_dataframe()` and re-run the tests.  Do they still pass?

:::tip Note
If they don't pass - figure out why and fix them before moving on!
:::

### Adding flexibility

When looking at the [GENCODE data](exploring_gencode.md) it would have been useful to have some extra attributes
as columns - in particular `gene_name` and `gene_type`. So we could alter the code to extract these as well.

On the other hand in the [introduction](Introduction.md) we looked at files from Ensembl and PlasmoDB and saw
that they encode the attributes slightly differently - for example they have a `biotype` instead of a
`gene_type`. So sometimes we don't want the `gene_type` after all.

Our function is simply there to load data, so the best way to deal with these complexities is probably to **let
the user decide which columns they want**. Our function would become something like this:

```python
def parse_gff3_to_dataframe(
    file,
    attributes_to_extract = [ 'ID', 'Parent' ]
):
    result = read_gff3_using_pandas( file )
    extract_attributes_as_columns( result, attributes_to_extract )
    return result
```

:::tip Challenge

Update your `extract_attributes_as_columns()` function to extract the list of attributes passed to it as the 2nd
argument.

:::

:::note Hint

If you followed the [guide](anatomy_of_getting_it_to_work.md) you'll have had a `extract_ID_from_attributes()`
and a `extract_Parent_from_attributes()` function in there. These are unfortunately no use at all for this new
problem, because they only apply to `ID` and `Parent`. So remove them.

Instead, you can try using a *lambda function* - that is, an anonymous (un-named) function. Specifically,
instead of declaring a specific named function:

```python
def extract_ID_from_attributes( attributes ):
    return extract_value_from_attributes( attributes, 'ID' )
```

which we call like this:

```
data['attributes'].apply( extract_ID_from_attributes )
```

you would instead just write a lambda function that works for *any* attribute:

```python
data['attributes'].apply(
    lambda attributes: extract_value_from_attributes( attributes, name )
)
```

Here, `name` is a variable holding the attribute name... so if `name="ID"` it would do the same as before. The
`lambda` statement just creates an un-named function that is used right where it is written.

The point of this is that `name` is a variable above - you can now have `name` loop over all the attributes in
the list passed in, adding the columns one by one.

:::

:::tip Note

Update `gff.py` to make it work for any list of attributes.  Do the tests still run?
:::

### Memory issues - and how to solve them

See [the next page](./memory_issues_and_how_to_solve_them.md) for more on memory.
