---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Processing GFF files

[Up to table of contents](README.md) / [Back to the previous page](What_gene_annotation_data_looks_like.md) / [Go to the next page](Converting_gff_to_sqlite.md)

Your task, if you choose to accept it, is to write some code that processes a GFF file, makes sense of the
data, and uses it to gather some interesting statistics. And then to apply it to analyse genes from multiple
species. By doing this we can hopefully learn something about the genome biology of the world's organisms.

The aim of this tutorial is that **you** to write the code that does this (although you can either do this on
your own or working together in a group). There will be lots of support, and this tutorial will guide you
through one way to do it. If you're doing this as part of a WHG course, we'll talk through the results and the
code itself in the discussion sessions.

:::tip
Remember we're not writing this code for it's own sake but to answer our questions like the ones in our introduction:
- How many genes are there?
- How big are they?
- How much of the genome is in genes?
- How complex are genes - How many exons?  How many different transcripts?
- How much of genes is actually protein-coding sequence - and how much is untranslated?
- How much do these patterns differ across species?
:::

How to start writing this code?  Well there are a few ways:

**Do it yourself.** It may well be that you already have a good idea how to go about this. If so,
feel free to dive straight in. You're free to use any language or system you like for this -
standard options might be [python](https://www.python.org) or [R](https://cran.r-project.org), but
you could also use [julia](https://julialang.org), or even
[C++](https://en.wikipedia.org/wiki/C%2B%2B) or another compiled language.  Make sure you [have these installed first](/prerequisites/README.md).

**Use a package.** If you search, you will be able to find packages for your favourite programming language
that parse GFF3 for you - or perhaps a library that processes gene annotations at a higher level. Now, using
that would to some extent defeat the purpose of the exercise of this tutorial (which is about coding), but on
the other hand what we're really interested in is genes rather than the coding itself. So if you want to take
that route and it gets you to better answers quicker, go ahead!

**Write everything from scratch.** It's also quite possible to do this task in (say) base python or R without
using any existing libraries. In fact that can be a good way to it because it gives you lots of control over
how it works, and (as we'll see later) you might need control over things like performance and memory usage.

This tutorial will take a 'middle' way. We will use python but will use the popular [`pandas` dataframe
library](https://pandas.pydata.org) library to begin reading and manipulating the data. `pandas` is a natural
fit here because the GFF3 data is basically tabular in format (many rows x 9 named columns) and so it ought to
fit well in a dataframe. Unpacking the `attributes` column is a bit tricky of course - this will take most of
the work.

In the course of the tutorial we'll develop a little python module to help us answer the questions.

## Diving straight in - parsing data

If you [looked at the gene annotation data](What_gene_annotation_data_looks_like.md), you'll know
that it comes in rows of data that are tab-delimited. That's good and will be a good fit to a
dataframe structure. But the data is also relational (meaning that the records refer to each other,
via the `Parent` attribute). And since this has several levels (e.g. exons are associated with
transcripts, which are in turn associated with genes), we might ultimately have to build some form
of hierarchical data structure to capture this.

That sounds complex, so let's break off a manageable first bit of the job by just focussing on
getting the data in. We'll start by trying to write a function that loads the data. We'll call this
function `parse_gff3_to_dataframe()` because that's what it will do. It will look like this:

```python
def parse_gff3_to_dataframe( file ):
    result = (some code to load the data from the file here)
    return result
```

and can be run like this:
```python
file = open( "gencode.v38.annotation.head.gff" )
X = parse_gff3_to_dataframe( file )
```

...producing a dataframe with columns `id`, `parent`, `seqid`, `source`, `type`, `start`, `end`,
`score`, `strand`, `phase`, and `attributes`.

Simple! If only we knew what bit of code to write in the function there.

**Challenge.** Can you write `parse_gff3_to_dataframe()`?

**Notes**. To make it really good it should deal with column names, handle missing data values, and
get the data types of columns right. And, because we want to capture the relational structure, it
should extract out the `ID` and `Parent` attributes as new columns (this is the hardest part). When
it's 100% correct it will [pass the test on the next page](testing_it_out.md). Good luck!

If you don't know where to start - don't worry, we will walk through a process of writing this
below.

:::tip An aside on functions

You might be thinking "why bother putting this in a function? It already works." 

There are two key advantages to putting it in a function like this. The first is that it **makes it
obvious what it does**. Imagine the scenario: you've run some analyses on several `.gff` files,
you've written and submitted a paper. Six months later the reviews come back raising an issue and
you suddenly need to revisit one of your analyses. If your code says:

```python
human_genes = parse_gff3_to_dataframe( "gencode.v38.annotation.gff" )
pf_genes = parse_gff3_to_dataframe( "PlasmoDB-54_Pfalciparum3D7.gff" )
...
```

and so on then you have helped yourself enormously, because it's obvious what these lines do.

The second advantage is that **it makes it easy to test**. By testing it, you know the function
works, and when you get back to your analysis you won't waste time trying to figure this out.
Ultimately these are about being efficient - trying to write your code in a way that doesn't waste
your time later.  We'll see how to [test your code](testing_it_out.md) on the next page.

:::

## Anatomy of getting it to work

To figure out what to write it's useful to try a few things. Start an interactive python session
now - a [jupyter notebook](/prerequisites/Jupyterlab.md) or [ipython](/prerequisites/python.md)
would be good options. Also make sure you have
[installed the pandas library](/prerequisites/pandas.md) because that's what we'll use.

### A first go

The data is basically tabular, so let's try to load the data using pandas' function designed for
reading tabular data:
[`read_table`](https://www.google.com/search?client=safari&rls=en&q=panda+read_table&ie=UTF-8&oe=UTF-8):

```python
import pandas
filename = "gencode.v38.annotation.head.gff"
X = pandas.read_table(
  "gencode.v38.annotation.head.gff"
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
  "gencode.v38.annotation.head.gff",
  comment = '#'
)
```

Try this again.  Does it work?  (Try just `X` to print out the result.)

It sort of works - but not quite. This begins our long war of attrition to get this in shape.

### Adding column names

At the moment`X` doesn't have the right column names. In fact, how could it? The [file didn't have them
in](What_gene_annotation_data_looks_like.md). We can fix that by adding a `names` argument. What
names? Well, the ones from [the GFF spec](https://m.ensembl.org/info/website/upload/gff3.html) of course:

```python
X = pandas.read_table(
  "gencode.v38.annotation.head.gff",
  comment = '#',
  names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]
)
```

![img](images/genes_df_1.png)

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
  "gencode.v38.annotation.head.gff",
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
  "gencode.v38.annotation.head.gff",
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
```
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
X = parse_gff3_to_dataframe( "gencode.v38.annotation.head.gff" )
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

## Extracting attributes

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

extracts a 'slice' of the attributes string between `id_pos` and `semicolon_pos`. But `id_pos` is
not the right location here. And `semicolon_pos` isn't right either if there is no later semicolon
to find. To correctly extract the value, it should be something more like

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
X = parse_gff3_to_dataframe( 'gencode.v38.annotation.head.gff' )
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
assert extract_value_from_attributes( "ID=1;Parent=2" ) == "1"
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
[here](solutions/part1/gff_first_version.py) if you want to check it), and let's
[test it out](./testing_it_out.md).

