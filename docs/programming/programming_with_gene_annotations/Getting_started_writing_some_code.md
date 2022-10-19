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

The aim of this tutorial is that **you** to write the code that does this (either on your own or working in a
group if you prefer). The tutorial will guide you through one way to do it, and if you run this as part of a
[WHG](www.well.ox.ac.uk) course, there will be lots of support.

:::tip Note
Remember we're not writing this code for it's own sake but to answer our questions like the ones in our introduction:
- How many genes are there?
- How big are they?
- How much of the genome is in genes?
- How complex are genes - How many exons?  How many different transcripts?
- How much of genes is actually protein-coding sequence - and how much is untranslated?
- How much do these patterns differ across species?
:::

How to start writing this code?  Well there are a few ways:

**Do it yourself.** It may well be that you already have a good idea how to go about this. If so, feel free to
dive straight in. You're free to use any language or system you like for this - standard options might be
[python](https://www.python.org) or [R](https://cran.r-project.org), but you could also use
[julia](https://julialang.org), or even [C++](https://en.wikipedia.org/wiki/C%2B%2B) or another compiled
language. Make sure you [have these installed first](/prerequisites/README.md).

**Use a package.** If you search, you will be able to find packages for your favourite programming language that
parse GFF3 for you - or perhaps a library that processes gene annotations at a higher level. Now, using that
would to some extent defeat the purpose of the exercise of this tutorial (which is about coding), but on the
other hand what we're really interested in is genes rather than the coding itself. So if you want to take that
route and it gets you to better answers quicker, go ahead!

**Write everything from scratch.** It's also quite possible to do this task in (say) base python or R without
using any existing libraries.

This tutorial will take a 'middle' way. We will use python but will use the popular [`pandas` dataframe
library](https://pandas.pydata.org) library to begin reading and manipulating the data. `pandas` is a natural
fit here because the GFF3 data is in tabulate format (it's many rows x nine named columns) and so it ought to
fit well in a dataframe.

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
file = open( "gencode.v41.annotation.head.gff" )
X = parse_gff3_to_dataframe( file )
```

...producing a dataframe with columns `id`, `parent`, `seqid`, `source`, `type`, `start`, `end`,
`score`, `strand`, `phase`, and `attributes`.

Simple! If only we knew what bit of code to write in the function there.

**Challenge.** Can you write `parse_gff3_to_dataframe()`?

To make your function really good it should: **deal with column names**, **handle missing data values**, and
**get the data types of columns right**. And, because we want to capture the relational structure, let's also
make it extract out the `ID` and `Parent` attributes as new columns. Good luck!

If you don't know where to start - don't worry, we will walk through a process of writing this below.

## Test-driven development

Funnily enough our function above already has a useful property, even though we haven't yet written it: it is *already testable*.  To see this let's first generate some test data:

```python
test_data = """##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"""
```

And then write a test:

```python
def test_parse_gff3_to_dataframe( data ):
	from io import StringIO # see comment below
  	
	# 1. run our function to parse the data:
	data = parse_gff3_to_dataframe( StringIO( data ))
	
	# 2. test it:
	# check some string fields:
	assert data['seqid'][0] == 'chr1'
	assert data['strand'][0] == '+'
	assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
	assert data['seqid'][1] == 'chr1'
	assert data['strand'][1] == '+'
	assert data['attributes'][1] == 'ID=gene1.1;Parent=gene1'
  	
	# check that start and end are integers
	assert data['start'][0] == 1 # start and end are integers, not strings
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

test_parse_gff3_to_dataframe( test_data )
```

This prints something like:

    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "<stdin>", line 5, in test_parse_gff3_to_dataframe
    NameError: name 'parse_gff3_to_dataframe' is not defined

Of course it's not defined, we haven't written it yet!

But we now have a concrete target to shoot for: when our code passes the test it will be doing the right thing.

:::tip Note
Hardly anyone ever actually writes code this way (writing the test first) but they really should, because

1. it makes you figure out how your code will be used beforehand
2. it makes you make testable code - which means typically means pieces that are small and easy to use
3. when you've written the code - hey presto, you've also written the tests (no extra work).

For these reasons I thought we'd get the test in up-front here.
:::

When your function passes the test, you're done! Go ahead and [turn it into a module](making_a_module.md).

## Anatomy of getting it to work

To figure out what to write it's useful to try a few things. Start an interactive python session now - a
[jupyter notebook](/prerequisites/Jupyterlab.md) or [ipython](/prerequisites/python.md) would be good options.
Also make sure you have [installed the pandas library](/prerequisites/pandas.md) because that's what we'll use.

### A first go

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

Try this again.  Does it work?  (Try just `X` to print out the result.)

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

### Extracting attributes

It turns out pandas makes this easy too - it has a specific function for this
type of thing: [`.str.extract()`](https://pandas.pydata.org/docs/reference/api/pandas.Series.str.extract.html). 

It works like this: we define a [regular expression](https://en.wikipedia.org/wiki/Regular_expression) that
captures the bit of the attributes we want to extract.  Then we pass that to the `.str.extract()` function.

For example, to capture a field of the form `ID=something;`, we could use the basic regular expression:

```
ID=([^;]+)
```


:::tip Note

If you haven't used regular expressions before this might look pretty opaque. It gives a specification for how
to parse some text in a particular way, and is understood as follows:

* The 'ID=' part looks for the exact string "ID=";
* The '[^;]+' part looks for a sequence of one or more characters (`+`) that are not semicolons (`[^;]`).
* The parentheses `(` and `)` tell the regexp to *capture* (i.e. remember) whatever matched.

So put together this says "find something of the form `ID=value`, up to but not including any semicolon, and
remember the value."

:::

Let's test this out by making some dummy data with the `ID` in different places in the string:
```
test_attributes = pandas.Series( [
    "a=b;ID=gene_1",
    "ID=gene_2;a=b",
    "ID=gene_3",
    "a=b"
] )
````

Let's try to extract the `ID` from that test data:

```
test_attributes.str.extract( 'ID=([^;]+)' )
```

This will print something like:

            0
    0  gene_1
    1  gene_2
    2  gene_3
    3     NaN
    

This looks good - for example it's correctly realised there's no ID in the last row.

Getting our `ID` field out of the attributes is therefore as easy as writing

```
X['ID'] = X.attributes.str.extract( 'ID=([^;]+)' )
```

and similarly for the `Parent` attribute.

:::tip Note

Thanks to Jonathan Chan for pointing out this neat way to extract attributes.

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
    X['ID'] = result.attributes.str.extract( 'ID=([^;]+)' )
    X['Parent'] = result.attributes.str.extract( 'Parent=([^;]+)' )
    # reorder to put ID and Parent at the front
    result = result[ [ 'ID', 'Parent', 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]]
    return result
```

...and test it out:

```
test_parse_gff3_to_dataframe( test_data )
```

Does it work?  **Congratulations!**

:::tip Note

If it still doesn't work - you have a bug. To fix it, **first** check you have the indentation correct. Python
expects everything to be indented the same - either tab characters, which I have used above, or spaces. If you
have a mix that will very likely confuse it.

**Second**, look carefully at the error message. Often the last part is the most important bit and points
straight at the line of your code that caused the error, but sometimes you have to scroll up a few lines to find
the bit that's referring to your code.

For example - a moment ago I had this error:

    File ~/Projects/Software/3rd_party/miniconda3/lib/python3.9/site-packages/pandas/core/indexes/base.py:6171, in Index._raise_if_missing(self, key, indexer, axis_name)
       6168     raise KeyError(f"None of [{key}] are in the [{axis_name}]")
       6170 not_found = list(ensure_index(key)[missing_mask.nonzero()[0]].unique())
    -> 6171 raise KeyError(f"{not_found} not in index")

    KeyError: "['ID', 'Parent'] not in index"  

The error is that python can't find the `ID` and `Parent` columns in the "index" (which is pandas' way of
calling the column names). The error is weird though because that is in python code (on line 6171 of `base.py`,
it says). There's no way base python is causing this error! However, scrolling up a bit I see this:

    Cell In [33], line 22, in parse_gff3_to_dataframe(file)
         20 X['Parent'] = X.attributes.str.extract( 'Parent=([^;]+)' )
         21 # reorder to put ID and Parent at the front
    ---> 22 result = result[ [ 'ID', 'Parent', 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]]
         23 return result

so it is failing in my code when it tries to reorder columns.

Staring hard at this code I see the problem, which is actually just before this on lines 19 and 20: I forgot to
change the code to use `result` instead of `X`. Thus `result` never gets an `ID` or `Parent` column, so the
re-ordering fails.

:::

My solution is
[here](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part1/gff.py)
(or [download directly](solutions/part1/gff.py)) if you want to take a look.

## Next steps

Once you've got your code working - go ahead and [turn it into a module](making_a_module.md).

