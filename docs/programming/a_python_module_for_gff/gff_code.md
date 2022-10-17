---
sidebar_position: 2
---

# Writing code to parse GFF

## Your task

Your task, if you choose to accept it, is to write some code that processes a GFF file and allows you to analyse
it. We can then hopefully use the code to learn something about the genome biology of the world's organisms.

How to start writing this code? This tutorial has a guided tour of one approach.

### General thoughts

There are a few things we want from our code: it ought to work well, be reasonably efficient, be easy to use, and be easy to understand. That's what we'll aim for in this tutorial and what
you should aim for in your own code projects.

The last of these -b

To achieve this there are well-known techniques that include:

* giving things descriptive names;
* writing code in pieces (e.g. functions) that do one thing each;
* testing the code; and
* using *refactoring* to improve the implementation

None of these are necessarily easy but they're a good thing to shoot for.

### A note on alternative approaches

If you wanted you could of course use an existing library to look at GFF files. In `R`, the [rtracklayer](https://www.bioconductor.org/packages/release/bioc/html/rtracklayer.html) package
does this; there are [python packages](https://pypi.org/project/gff3/) as well.

Still it's worth doing this yourself because 1. it's not that hard 2. you get to make it the way **you** want it 3. you get to spend your time creating, rather than reading someone else's
documentation.

## Diving straight in - parsing data

### A function to parse GFF

GFF data is basically tabular - it has 9 named columns x many rows. There's a data structure tailor-made for this: a *data frame*.

So let's write a function to load GFF file into a dataframe. It will look like this:

```python
def parse_gff3_to_dataframe( file ):
    result = (some code to load the data from the file here)
    return result
```

and can be run like this:
```python
file = open( "gencode.v41.annotation.gff.gz" )
X = parse_gff3_to_dataframe( file )
```

The output will be a dataframe with columns `id`, `parent`, `seqid`, `source`, `type`, `start`, `end`, `score`, `strand`, `phase`, and `attributes`.

In python, data frames are provided by the pandas library - [make sure you have this installed](/prerequisites/pandas.md). So the output will be a pandas dataframe.

All we have to do is write it - easy right?

### Test-driven development

Funnily enough our function above already has a useful property - even though we haven't yet written it: it is *already testable*.

Look, here is some test data:

```python
# Set up some test data
test_data = '\n'.join( [ 
	"##gff-version 3",
	""#description: test data",
	"chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff",
	"chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1"
] )
```

And here is a test:

```python
def test_parse_gff3_to_dataframe( data ):
	from io import StringIO # see comment below
  	
	# 1. run our function to parse the data:
	data = parse_gff3_to_dataframe( StringIO( data ))
	
	# 2. test it:
	# check some of the string fields:
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
	# but we should have translated that to pandas missing data value,
	# which is `NaN` ('not a number').
	from math import isnan
	assert isnan( data['score'][1] ) 
	
	# check that we extracted `ID` and `Parent` right.
	assert data['ID'][0] == 'gene1'
	assert data['ID'][1] == 'gene1.1'
	assert data['Parent'][1] == 'gene1'
	# etc.
```

Run this test now:

```python
test_parse_gff3_to_dataframe( test_data )
```

You should see something like:

    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "<stdin>", line 5, in test_parse_gff3_to_dataframe
    NameError: name 'parse_gff3_to_dataframe' is not defined

Well, of course it's not defined, we haven't written it yet!

But despite failing this test is super-useful: when it passes, our task is complete.

:::note Note

Hardly anyone in our building ever actually writes their tests first in this way. Professional software development teams do, though, because it has major advantages:

1. it forces you to figure out how your code will be used beforehand (in our case it's a function call)
2. it forces you to divide code up into small, seperate units - that are easy to test.
3. when you've written the code you already have tests
4. you can change the code in future knowing that the tests will help identify bugs.

In short it's a really good idea if you can bring yourself to do it.

:::

### The challenge

:::tip Problem

Write the function `parse_gff3_to_dataframe()` that makes the test above pass.

:::

Can you do it?  Here are some tips:

* Pandas' [`read_table()` function](https://pandas.pydata.org/docs/reference/api/pandas.read_table.html#pandas.read_table) will get you a long way.

* A good way to start is by experimenting with `read_table()` interactively in your notebook or python session.  (You can put it together in a function later).

* There are various gotchas you'll need to handle - metadata lines, column names, missing data values, and so on. You'll need to figure these out.

* The **hardest part** is on those last three lines of the tests - it expects you to extract the `ID` and `Parent` attributes as seperate columns.

Good luck!

When your function passes the test, you're done.  Go ahead and [turn it into a module](making_a_module.md).

### But I'm stuck!

Fear not, help is at hand. See the [guide to getting it to work](anatomy_of_getting_it_to_work.md).

### A note on fast iteration time

For all 'big data' analyses, a very good idea when you're starting is to make sure you can have a fast iteration time. Any more than a few seconds' wait between attempts to run your code
will turn into a big time sink, very fast.

To do this it's a good idea to **make smaller data files** to experiment with while you get up and running. Always do this! The
easiest way is to use `head` in your terminal, e.g.:

```
gunzip -c
gencode.v41.annotation.gff3.gz | head -n 1000 > gencode.v41.annotation.head.gff3
```

Now you can run your code experiments with `gencode.v41.annotation.head.gff3` instead. (Just remember to switch back to the real
files when you want real numbers.)

## Next steps

Have a function?  Read the [guide](anatomy_of_getting_it_to_work.md) if need be?  Now go and [make a module](making_a_module.md).

