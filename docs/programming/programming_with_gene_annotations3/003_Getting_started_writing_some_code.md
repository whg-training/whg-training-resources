---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# A first go at parsing GFF

This tutorial will lead you through a process of writing some code to load GFF data into *either*
python or R.  We will then use this to create a useful utility program.

The aim of this tutorial is that **you** to write the code that does this (either on your own or
working in a group if you prefer). But the tutorial will guide you through one way to do it, and if
you run this as part of a [WHG](www.well.ox.ac.uk) course, there will be lots of support.

:::tip Note
Remember we're not writing this code for it's own sake but to answer our questions like the ones in our introduction:
- How many genes are there?
- How big are they?
- How much of the genome is in genes?
- How complex are genes - How many exons?  How many different transcripts?
- How much of genes is actually protein-coding sequence - and how much is untranslated?
- How much do these patterns differ across species?

Or indeed any other questions you are interested in.
:::

Nevertheless for the moment we will focus on the programming part of this task, and leave the
analysis part until later.  The idea is to guide you to some useful ways to approach coding.

## Writing code

How to start writing code?  Well, it is worth noting that there are libraries around that will load
GFF data for you.
([rtracklayer](https://bioconductor.org/packages/release/bioc/html/rtracklayer.html) in R is one).
Conversely, you could use very low-level approaches to doing this - build the data structures
yourself. But this tutorial will take a 'middle' way - we will use population general 'dataframe'
libraries to load the data - [tidyverse](https://www.tidyverse.org) in R and
[pandas](https://pandas.pydata.org) in python.  

:::tip Note

You can choose to use R or python.  One of the interesting things of these libraries is 
that they are more similar than they are different, so we can write almost the same code in both programming languages.

:::

In the course of the tutorial we'll develop a little R or python library to help us answer the
questions.

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

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
parse_gff3_to_dataframe = function( file ):
    result = (some code to load the data from the file here)
    return( result )
```
</TabItem>
<TabItem value="python" label="In python">

```python
def parse_gff3_to_dataframe( file ):
    result = (some code to load the data from the file here)
    return result
```

</TabItem>
</Tabs>
and can be run like this:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
X = parse_gff3_to_dataframe( "gencode.v41.annotation.head.gff3" )
```

</TabItem>
<TabItem value="python" label="In python">

```python
file = open( "gencode.v41.annotation.head.gff" )
X = parse_gff3_to_dataframe( file )
```

</TabItem>
</Tabs>


This should produce a dataframe with columns `id`, `parent`, `seqid`, `source`, `type`, `start`, `end`,
`score`, `strand`, `phase`, and `attributes`.

Simple! If only we knew what bit of code to write in the function there.

:::caution Challenge
Can you write `parse_gff3_to_dataframe()`?
:::

To make your function really good, here are a few things it should get right:
* it should: **deal with column names**
* it should **handle missing data values** right
* it should **get the data types of columns right**.

And, because we want to capture the relational structure,  it shuld also  extract out the `ID` and
`Parent` attributes as new columns.   (In short - it should pass the **test** in the next section.)
Good luck!

If you don't know where to start - don't worry, we will walk through a process of writing this
below.

## Test-driven development

Funnily enough our function above already has a useful property, even though we haven't yet written
it yet!  It is *already testable*.  To see this let's design some test data:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```
test_data = "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"
```

</TabItem>
<TabItem value="python" label="In python">

```python
test_data = """##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"""
```

</TabItem>
</Tabs>

:::tip Note
The `\t`'s in there are **tab characters**.  This is how R and python (and most other programming languages) encode tabs.
If you want to see the full data (with tabs expanded), use `cat()` in R or `print()` in python:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```
cat( test_data )
```

</TabItem>
<TabItem value="python" label="In python">

```
print( test_data )
```
</TabItem>
</Tabs>

You should see that it's properly GFF formatted.
:::

Now let's use that test data to write a test capturing our requirements:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
test_parse_gff3_to_dataframe = function() {
    test_data = "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"
    cat( "Using test data:\n" )
    cat( test_data )
    # 1. run our function to parse the data:
    gff = parse_gff3_to_dataframe( test_data )
    print(gff)
    # 2. test it:
    # Check we have all the basic columns
    columns = c(
        "seqid", "source", "type", "start", "end",
        "score", "strand", "phase", "attributes"
    )
    stopifnot(
        length( which( columns %in% colnames(gff) )) == length(columns)
    )
    # check some string fields, does it get them right?
    stopifnot( gff[['seqid']][1] == 'chr1' )
    stopifnot( gff[['strand']][1] == '+' )
    stopifnot( gff[['attributes']][1] == 'ID=gene1;other_data=stuff' )
    stopifnot( gff[['seqid']][2] == 'chr1' )
    stopifnot( gff[['strand']][2] == '+' )
    stopifnot( gff[['attributes']][2] == 'ID=gene1.1;Parent=gene1' )

    # check that start and end are integers
	stopifnot( gff[['start']][1] == 1 )
    stopifnot( gff[['end']][1] == 1000 )
    stopifnot( gff[['start']][2] == 10 )
    stopifnot( gff[['end']][2] == 900 )
	
    # check that missing data is handled right
    # "." indicates missing data in the GFF spec
    # but we should have translated that to an R missing value
    stopifnot( is.na( gff[['score']][2] ) )

    # check that we extracted `ID` and `Parent` right.
    stopifnot(
        length( which( c( "ID", "Parent" ) %in% colnames(gff) )) == 2
    )

    stopifnot( gff[['ID']][1] == 'gene1' )
    stopifnot( gff[['ID']][2] == 'gene1.1' )
    stopifnot( gff[['Parent']][2] == 'gene1' )
    # etc.
    # add your own checks here!

    cat( "\n++ test_parse_gff3_to_dataframe(): Congratulations, all tests passed!\n" )
}

```

</TabItem>
<TabItem value="python" label="In python">

```python
def test_parse_gff3_to_dataframe():
    test_data = """##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"""
    print( "Using test data:" )
    print( test_data )
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

    print( "++ test_parse_gff3_to_dataframe(): Congratulations,all tests passed!" )
```

</TabItem>
</Tabs>



And then run this to test the function:
```
test_parse_gff3_to_dataframe()
```

This prints an error, something like:

<Tabs groupId="language">
<TabItem value="R" label="In R">

    Error in parse_gff3_to_dataframe(data) : 
      could not find function "parse_gff3_to_dataframe"

</TabItem>
<TabItem value="python" label="In python">

    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "<stdin>", line 5, in test_parse_gff3_to_dataframe
    NameError: name 'parse_gff3_to_dataframe' is not defined

</TabItem>
</Tabs>

Of course it's an error - we haven't written the function yet!

But we now have a concrete target to shoot for: when our code passes the test it will be doing the
right thing.

:::tip Note

This style of programming is known as **test-driven development** - in which you write the test(s)
first and only then write the implementation.

You don't have to work this way but it's quite cool if you can bring yourself to do it, because

1. It makes you figure out how you want your code to be used before you write it.
2. It forces you to write code that *can* be tested.  (This typically means you end up with pieces that are smallish and hopefully composable).
3. When you've written the code - hey presto, you've also written the tests (no extra work).

For these reasons I thought we'd get the test in up-front here.

:::

When your function passes the test, you're done! Go ahead and [turn it into a
module](making_a_module.md).

## Getting it to work

To figure out how to write `parse_gff3_to_dataframe()` let's try a few things. Start an R or python
session now if you haven't already.  Also make sure you have installed [the
tidyverse](/prerequisites/tidyverse.md) (in R) or [pandas](/prerequisites/pandas.md) (in python)
because that's what we'll use.  You can find the documentation for these packages here:

### A first go

The data in a GFF is basically tabular, so let's try to load the data using the function
`read_tsv()` (R) or `read_table()` function (python).  You can find the documentation for this function here:

* for tidyverse in R, search for `read_tsv` in the [readr docuemntation](https://readr.tidyverse.org/reference/index.html) 
* for pandas in python, search for `read_table`` in the [pandas documentation](https://pandas.pydata.org/docs/) 

Let's have a first go.  To get things working let's work with a small file - the
"gencode.v41.annotation.head.gff" file you [made
earlier](./002_What_gene_annotation_data_looks_like.md#making-some-test-files):

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
library( readr )
X = readr::read_tsv( "gencode.v41.annotation.head.gff" )
```

</TabItem>
<TabItem value="python" label="In python">

```python
import pandas
X = pandas.read_table( "gencode.v41.annotation.head.gff" )
```

</TabItem>
</Tabs>

Try running this now - what happens?

:::tip Note

You will probably find you have an error.

<Tabs groupId="language">
<TabItem value="R" label="In R">

If using R, print the resulting dataframe `X` now.  How many rows and columns does it have?  What
are the first few lines?

It doesn't look right - can you figure out what has gone wrong?

</TabItem>
<TabItem value="python" label="In python">

Running the above command prints out a bunch of stuff and then says, right near the end:

    ParserError : Error tokenizing data. C error: Expected 1 fields in line 8, saw 9

If you're not used to this kind of thing, errors like this may seem pretty cryptic. But they are
often more helpful than they look at first. This one tells us for example that a problem occurred
on line 8 of the input file. It expected to see 1 field there but found 9. [Look back at the input
data](What_gene_annotation_data_looks_like.md). Is there something different about line 8 than
earlier lines?  (Hint: yes there is!).

</TabItem>
</Tabs>

:::

### Skipping metadata

We haven't told the parser about the metadata lines - so it is unsurprisingly confused. For now
we're interested in the data records so would like the code to just ignore those lines.  There are a
few ways to do this, but the easiest is to tell `read_tsv()` or `read_table()` that these lines are
**comments** - that is, bits of text that aren't part of the data.  

<Tabs groupId="language">
<TabItem value="R" label="In R">

If you read the [`read_tsv()`
documentation](https://readr.tidyverse.org/reference/read_delim.html) you may spot there's an
argument called `comment`.  About this argument it says:

**comment**: *A string used to identify comments. Any text after the comment characters will be silently ignored.*

This sounds like the right thing!  Let's try:

```r
X = readr::read_tsv(
    "gencode.v41.annotation.head.gff",
    comment = '#'
)
```

</TabItem>
<TabItem value="python" label="In python">

If you read the
[`read_table()` documentation](https://pandas.pydata.org/docs/reference/api/pandas.read_table.html)
you may spot an argument - called `comment`.  About this argument it says:

**comment**: Character indicating that the remainder of line should not be parsed.  If found at the beginning of a line, the line will be ignored altogether.

This sounds like the right thing!  Let's try:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#'
)
```

</TabItem>
</Tabs>

Try this again.  Does it work?  (Print `X` again to see.)

It sort of works - but not quite.  This begins our long war of attrition to get this in shape.

### Adding column names

At the moment`X` doesn't have the right column names. In fact, how could it? The [file didn't have
them in](What_gene_annotation_data_looks_like.md).

<Tabs groupId="language">
<TabItem value="R" label="In R">

We can fix that by adding a [`col_names`
argument](https://readr.tidyverse.org/reference/read_delim.html#arguments). What names? Well, the ones from
[the GFF spec](https://m.ensembl.org/info/website/upload/gff3.html) of course:

```r
X = readr::read_tsv(
  "gencode.v41.annotation.head.gff",
  comment = '#',
  col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' )
)
```

</TabItem>
<TabItem value="python" label="In python">

We can fix that by adding a
[names](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html) argument. What names?
Well, the ones from [the GFF spec](https://m.ensembl.org/info/website/upload/gff3.html) of course:

```python
X = pandas.read_table(
  "gencode.v41.annotation.head.gff",
  comment = '#',
  names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]
)
```

</TabItem>
</Tabs>

Print out `X` again.  It is starting to look right:

![img](images/genes_df_1.png)

Now it has column names!  

Let's try putting this in our function and testing now?

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
parse_gff3_to_dataframe = function( filename ) {
    readr::read_tsv(
        filename,
        comment = '#',
        col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' )
    )
}
```
</TabItem>
<TabItem value="python" label="In python">

```python

def parse_gff3_to_dataframe( filename ):
    pandas.read_table(
        filename,
        comment = '#',
        names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ]
    )

```

</TabItem>
</Tabs>

and run the test: 
```python
test_parse_gff3_to_dataframe()
```

:::tip Note

Look at the output - does it pass the test?  If not, what fails?  Can you see why?

:::

### Dealing with missing values

This raises a more subtle issue.  The [spec](https://m.ensembl.org/info/website/upload/gff3.html)
says that `.` indicates a missing value - but our code thinks they are simply strings.  Look:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```
print( X$score[1:10] )
```

</TabItem>
<TabItem value="python" label="In python">

```python
[ 'this_is_a_%s_character' % s for s in X["score"] ]
```

</TabItem>
</Tabs>

Because of this our test is failing when it tests that the `score` has missing values.

This is going to make the test fail when it tests for missing data.  Somehow we need to convert
those `.`'s to missing values.

<Tabs groupId="language">
<TabItem value="R" label="In R">

However if you check the [`read_tsv()`
docs](https://readr.tidyverse.org/reference/read_delim.html#arguments) again you should see there's
again an argument that we can use to tell it to treat specific strings as missing values.  (Can you
see it?)

Let's try again:

```r
parse_gff3_to_dataframe = function( filename ) {
    readr::read_tsv(
        filename,
        comment = '#',
        col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ),
        na = "."
    )
}
test_parse_gff3_to_dataframe()
```

Now the missing values come up as `NA`  - R's shorthand for missing values.

</TabItem>
<TabItem value="python" label="In python">

However if you read the [`read_table()`
docs](https://www.google.com/search?client=safari&rls=en&q=panda+read_table) you'll see this is easy
as well - we need the `na_values` argument:

```python
def parse_gff3_to_dataframe( filename ):
    pandas.read_table(
        filename,
        comment = '#',
        names = [ 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ],
        na_values = '.'
    )
```

Now the missing values come up as `NaN` (which is
[what pandas uses for a missing value](https://pandas.pydata.org/docs/user_guide/missing_data.html).
)

</TabItem>
</Tabs>


### Specifying the right column types

There is also the more subtle issue of column types.  Currently our function has guessed the column
types for us, by looking at the data.

<Tabs groupId="language">
<TabItem value="R" label="In R">

To see them, print `X` again and look at the second row - it will look something like this:

```r
> X
# A tibble: 993 × 9
   seqid source type       start   end score strand phase attributes            
   <chr> <chr>  <chr>      <dbl> <dbl> <chr> <chr>  <chr> <chr>                 
 1 chr1  HAVANA gene       11869 14409 .     +      .     ID=ENSG00000223972.5;…
   (etc)
```

The `<chr>` means 'character' data (i.e. strings), and `<dbl>` means floating-point numbers. 

</TabItem>
<TabItem value="python" label="In python">

To see the types, try:

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

</TabItem>
</Tabs>

So this is pretty good for this particular dataset. But there are good reasons we should fix the column
types. First, they're not quite right at the moment (for example `score` should be a floating-point
number).  More importantly, because we're letting it guess the types from the input data, it might
conceivable guess different types depending on what data is passed in - likely to break code that
uses the results.

Here we know what the types should be - they're specified in [the
spec](https://m.ensembl.org/info/website/upload/gff3.html). So let's specify them directly.  

<Tabs groupId="language">
<TabItem value="R" label="In R">

The
[documentation](https://readr.tidyverse.org/reference/read_delim.html) tells us how to do this:
there's a `col_types` argument for this purpose.  The syntax is a bit involved (described
[here](https://readr.tidyverse.org/reference/cols.html)), but works like this:

```r
parse_gff3_to_dataframe = function( filename ) {
    library( readr )
    readr::read_tsv(
        filename,
        comment = '#',
        na = ".",
        col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ),
        col_types = cols(
            col_character(),
            col_character(),
            col_character(),
            col_integer(),
            col_double(),
            col_double(),
            col_character(),
            col_integer(),
            col_character()
        )
    )
}
```

</TabItem>
<TabItem value="python" label="In python">

Let's specify them instead using the `dtype` argument:

```python
def parse_gff3_to_dataframe( filename ):
    return pandas.read_table(
        filename,
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
</TabItem>
</Tabs>

And let's try again:

```python
X = parse_gff3_to_dataframe( "gencode.v41.annotation.head.gff" )
```

:::tip Note

Run this and look at the output.  Are the column types right now?  (If not, fix them.)
:::

:::tip Question
What about the test - does it pass now?

```
test_parse_gff3_to_dataframe()
```

If not, why not?

:::


## Next steps

Once you've got your code working - go ahead and [turn it into a module](making_a_module.md).

