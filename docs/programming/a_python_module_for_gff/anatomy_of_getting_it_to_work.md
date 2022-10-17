---
sidebar_position: 3
---

# Anatomy of getting it to work

## A guided tour

If you're here you will be looking for some pointers on how to write `parse_gff3_to_dataframe()`.
I'll walk you through the approach I took below.

### A first go

To figure out what to write it's useful to try a few things interactively. Start an interactive python session
now - a [jupyter notebook](/prerequisites/Jupyterlab.md) or [ipython](/prerequisites/python.md)
would be good options. Also make sure you have
[installed the pandas library](/prerequisites/pandas.md) because that's what we'll use.

The data is basically tabular, so let's try to load the data using pandas' function designed for
reading tabular data:
[`read_table`](https://www.google.com/search?client=safari&rls=en&q=panda+read_table&ie=UTF-8&oe=UTF-8):

```python
import pandas
filename = "gencode.v41.annotation.head.gff"
X = pandas.read_table(
  "gencode.v41.annotation.head.gff"
)
```

Try running this now - what happens?

You will probably find you have an error. Mine prints out a bunch of stuff and then says, right
near the end:

    ParserError : Error tokenizing data. C error: Expected 1 fields in line 8, saw 9

If you're not used to this kind of thing, errors like this may seem pretty cryptic. But they are
often more helpful than they look at first. This one tells us for example that a problem occurred
on line 8 of the input file. It expected to see 1 field there but found 9. [Look back at the input
data](What_gene_annotation_data_looks_like.md). Is there something different about line 8 than
earlier lines?  (Hint: yes there is!).

### Skipping metadata

We haven't told the parser about the metadata lines - so it is unsurprisingly confused. WE would
like `read_table()` to just ignore those lines. There are a few ways to do this, but the easiest is
to tell `read_table` that these lines are **comments** - that is, bits of text that aren't part of
the data.  If you read the
[`read_table()` documentation](https://www.google.com/search?client=safari&rls=en&q=panda+read_table)
you may spot this argument - called `comment`:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#'
)
```

Try this again.  Does it work?  (Try `X.head()`, `print(X)`, or just `X` to print out the top of the results.)

It sort of works - but not quite. This begins our long war of attrition to get this in shape.

### Adding column names

At the moment`X` doesn't have the right column names. In fact, how could it? The [file didn't have them
in](What_gene_annotation_data_looks_like.md). We can fix that by adding a `names` argument. What
names? Well, the ones from [the GFF spec](https://m.ensembl.org/info/website/upload/gff3.html) of course:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#',
  names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]
)
```

    Out[6]: 
        seqid  source        type   start     end score strand phase                                         attributes
    0    chr1  HAVANA        gene   11869   14409     .      +     .  ID=ENSG00000223972.5;gene_id=ENSG00000223972.5...
    1    chr1  HAVANA  transcript   11869   14409     .      +     .  ID=ENST00000456328.2;Parent=ENSG00000223972.5;...
    2    chr1  HAVANA        exon   11869   12227     .      +     .  ID=exon:ENST00000456328.2:1;Parent=ENST0000045...
    3    chr1  HAVANA        exon   12613   12721     .      +     .  ID=exon:ENST00000456328.2:2;Parent=ENST0000045...
    4    chr1  HAVANA        exon   13221   14409     .      +     .  ID=exon:ENST00000456328.2:3;Parent=ENST0000045...
    ..    ...     ...         ...     ...     ...   ...    ...   ...                                                ...
    988  chr1  HAVANA        exon  942410  942488     .      +     .  ID=exon:ENST00000616125.5:7;Parent=ENST0000061...
    989  chr1  HAVANA         CDS  942410  942488     .      +     2  ID=CDS:ENST00000616125.5;Parent=ENST0000061612...
    990  chr1  HAVANA        exon  942559  943058     .      +     .  ID=exon:ENST00000616125.5:8;Parent=ENST0000061...
    991  chr1  HAVANA         CDS  942559  943058     .      +     1  ID=CDS:ENST00000616125.5;Parent=ENST0000061612...
    992  chr1  HAVANA        exon  943253  943377     .      +     .  ID=exon:ENST00000616125.5:9;Parent=ENST0000061...
    
    [993 rows x 9 columns]
    
Now it has column names!  

### Dealing with missing values

Now onto more subtle issues. The [spec](https://m.ensembl.org/info/website/upload/gff3.html) says
that '.' indicates a missing value - but our python code thinks they are simply strings.  Look:
```python
[ 'this_is_a_%s_character' % s for s in X["score"] ]
```

If you read the [`read_table()` docs](https://www.google.com/search?client=safari&rls=en&q=panda+read_table) you'll see
this is easy as well - we need the `na_values` argument:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#',
  names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
  na_values = '.'
)
```

Now the missing values come up as `NaN` (which is
[what pandas uses for a missing value](https://pandas.pydata.org/docs/user_guide/missing_data.html).
)

### Specifying the right column types

But now we run into a more subtle issue: it hasn't quite got the column types right. To see this,
try showing them:

```python
X.dtypes
```

which prints

    seqid          object
    source         object
    type           object
    start           int64
    end             int64
    score         float64
    strand         object
    phase         float64
    attributes     object
    dtype: object

Most of this is actually fine (`object` is referring to a python object, which in this case means a
string, and it has correctly realised that `start` and `end` are integers. It has got `phase`
wrong - it thinks it is a floating-poing value, when it
[really isn't](https://m.ensembl.org/info/website/upload/gff3.html).

However ther real problem here is that we're letting it guess the types from the input data, which
has the horrible property that it might give different types (leading to broken code) depending on
what data is passed in.
[We know what the types are](https://m.ensembl.org/info/website/upload/gff3.html): let's
specify them instead using the `dtype` argument:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#',
  names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
  na_values = '.',
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
```

What data types does the result have now?

:::tip Note

See [this page](https://pandas.pydata.org/docs/user_guide/basics.html#dtypes) for details of data types.

:::
### Testing it out

Now things are looking pretty good - right?  Let's put it in our function:
```python
def parse_gff3_to_dataframe( file ):
  result = pandas.read_table(
    file,
    comment = '#',
    names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
    na_values = '.',
    dtype = {
      'seqid': str,
      'source': str,
      'type': str,
      'start': int,
      'end': int,
      'score': float,
      'strand': str,
      'phase': str,
      'attributes': str
    }
  )
  return result
```

So now we can load whatever we want:
```python
X = parse_gff3_to_dataframe( "gencode.v41.annotation.head.gff" )
```

### Exploring the data

Now is a good time to load one of the full annotation files (e.g. the [gencode human gene
annotations](https://www.gencodegenes.org/human/) and explore it. For example, the pandas
[`query()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.query.html) is one
handy way to do this:

```python
X.query('seqid=="chrX"') # find X chromosome genes
X.query('type=="exon" & strand == "+"') # find exons expressed on the forward strand
```

Another useful function is `value_counts()` which tells you how many of each value are in a give column:

```
X["seqid"].value_counts() # how many records on each chromosome?
```

**Challenge.** Find all gene records (`type=gene`) that are at least 1Mb in length according to the
start and end coordinates.  How many of these 'big' genes are there on each chromosome?

### Extracting attributes

We're not quite done. `parse_gff3_to_dataframe()` gives us a good representation of input data. But
like many bioinformatics formats, the
[gff format is a bit weird](https://m.ensembl.org/info/website/upload/gff3.html).
It has important information hidden in the `attributes` column - I don't know why it's like this, but it is.

In particular to make sense of the file we will need to extract the `ID` and `Parent` fields. These
are important because they tell us how to link different records together (such as exons
to transcripts and transcripts to genes.)

How to extract these? Well, if you [looked at the data](What_gene_annotation_data_looks_like.md)
you'll know that the attributes values are semicolon-separated sets of `key=value` pairs, for example:

    ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1

Let's write a function that just returns a given value from this string - we can then apply it to
the whole column of attribute values. There are a couple of ways to do this; the simplest is to use
python's rich set of
[string manipulation tools](https://docs.python.org/3/library/stdtypes.html#string-methods).

### Extracting the ID

For example we could try to extract the ID this by searching for 'ID=' in the string and pulling out
the value. This can be done using the `find()` string method which here will return the position in
the string where 'ID=' was found (or -1 if it wasn't found).  Something like this:

```python
def extract_ID_from_attributes( attributes ):
  result = None
  id_pos = attributes.find( 'ID=' )                    # find the 'ID=' bit
  if id_pos == -1:
    pass                                               # no ID attribute; do nothing
  else:
    semicolon_pos = attributes.find( ';', id_pos )     # find the next semicolon (or -1 if none)
    result = attributes[id_pos:semicolon_pos]          # extract the value
  return result
```

Let's test it:

```python
extract_ID_from_attributes( "a=b;ID=test_value" )
extract_ID_from_attributes( "ID=1;Parent=2" )
```

You should get back "test_value" and "1" of course.

:::tip Challenge
`extract_ID_from_attributes()` has some bugs.  What are they?  **Can you fix them?**

<Tabs>
<TabItem value="hints" label="Hints" default>

**Hint.** There are two bugs.  One has to do with not locating the start of the value in the attributes properly.
The other has to do with when the value is right at the end of the string.
</TabItem>

<TabItem value="more hints" label="More Hints">

**More detailed hint.** This code:

```python
result = attributes[id_pos:semicolon_pos] 
```

extracts a 'slice' of the attributes string between `id_pos` and `semicolon_pos`. So for example if the string is

    a=1;ID=gene1;b=3

then (counting from index 0 at the left side of the string) `id_pos=4` and `semicolon_pos=12` and
above extracts the string `ID=gene1`. That's not quite what we want - `id_pos` is not the right
location here. **Also**, `semicolon_pos` won't be right either if there is no later semicolon to
find (what would it be in that case?).

To correctly extract just the value, the code should be something more like

```python
result = attributes[start_of_value:semicolon_or_end] 
```

where `start_of_value` is the position of the start of the value in the string, and
`semicolon_or_end` is the position of the next semicolon **or** the end of the attributes string,
if there wasn't another semicolon.
</TabItem>

<TabItem value="solution" label="Solution">
Here's a full solution:

```python
def extract_ID_from_attributes( attributes ):
  result = None
  id_pos = attributes.find( 'ID=' )                            # find the 'ID=' bit
  if id_pos == -1:
    pass                                                       # no ID attribute; do nothing
  else:
    start_of_value = id_pos+3                                  # find the start of the value
    semicolon_pos = attributes.find( ';', start_of_value )     # find the next semicolon (or -1 if none)
    if semicolon_pos == -1:
      semicolon_or_end = len(attributes)                       # no semicolon so point at end
    else:
      semicolon_or_end = semicolon_pos
    result = attributes[start_of_value:semicolon_or_end]       # extract the value
  return result
```
Phew!  It's not exactly *simple*, but at least all that complexity is wrapped up into a
function so it won't affect the rest of the code.
</TabItem>
</Tabs>
:::


### Testing the code

We can get python to test it using the `assert` statement, like this:

```
assert extract_ID_from_attributes( "a=b;ID=test_value" ) == "test_value"
assert extract_ID_from_attributes( "ID=1;Parent=2" ) == "1"
```

and so on.  If the function gets the answer wrong an `AssertionError` will be raised.

Feel free to add more tests - does the code work now?

### Applying the extraction function

Applying our function to the dataframe is easy - use the pandas `apply()` function:

```python
X["attributes"].apply( extract_ID_from_attributes )
```

And adding it to the dataframe is easy too:
```python
X = parse_gff3_to_dataframe( 'gencode.v41.annotation.head.gff' )
X['ID'] = X["attributes"].apply( extract_ID_from_attributes )
```

### Extracting the Parent as well

Now we need to do the same thing for the `Parent` attribute. It's tempting to write the same
function again but... hey that's a waste of effort. Instead let's generalise our function to
extract any value from the attributes:
```python
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
```

...and check it works:
```python
assert extract_value_from_attributes( "a=b;ID=test_value", "ID" ) == "test_value"
assert extract_value_from_attributes( "a=b;ID=test_value", "Parent" ) == None
assert extract_value_from_attributes( "ID=1;Parent=2", "ID" ) == "1"
assert extract_value_from_attributes( "ID=1;Parent=2", "Parent" ) == "2"
assert extract_value_from_attributes(
  "ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene",
  "ID"
) == "ENST00000456328.2"
assert extract_value_from_attributes(
  "ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene",
  "gene_type"
) == "transcribed_unprocessed_pseudogene"
```

Now we can easily extract the columns ones we want:

```python
def extract_ID_from_attributes( attributes ):
  return extract_value_from_attributes( attributes, 'ID' )

def extract_Parent_from_attributes( attributes ):
  return extract_value_from_attributes( attributes, 'Parent' )
  
X["ID"] = X["attributes"].apply( extract_ID_from_attributes )
X["Parent"] = X["attributes"].apply( extract_Parent_from_attributes )
```

### Wrapping it all up

To finish this off, update your `parse_gff3_to_dataframe()` to add lines like these that extract
the `ID` and `Parent` columns to the result before returning it (my solution is
[here](solutions/part1/gff.py) if you want to check it).  Does it work?

```
test_parse_gff3_to_dataframe( test_data )
```

With luck this will run without errors and we can be confident we've got it right.

Before moving on let's [make a module](making_a_module.md).

