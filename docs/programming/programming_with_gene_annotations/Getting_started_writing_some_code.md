---
sidebar_position: 3
---

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
that it comes in rows of data that are tab-delimited, but that it is also relational (meaning that
the records refer to each other, via the `Parent` attribute). Moreover, since exons are associated
with transcripts, which are in turn associated with genes, we ultimately have to build some form of
hierarchical data structure to capture this.

That sounds complex, but we can break off a manageable first bit of the job by just focussing on
getting the data in (c.f. "keep it simple"). So let's do the simplest thing possible and start by
writing a function to load the data.

```
def parse_gff3_to_dataframe( data ):
    """Parse data in GFF3 format, and return a pandas dataframe"""
    result = (!! do some work here)
    # more code here to add to result
    return result
```

**Note:** If you are not familiar with python syntax, now would be a good time to refresh via any
of the available tutorials. The above code defines a function, and shows a documentation comment
(the `"""..."""` bit) and also has code comments (starting with `#`).

This code doesn't work yet (you have to write the missing bits) but it already illustrates a few things that
might be helpful if you're not used to writing code. First, the name is pretty clear about what this function
does (indeed it makes the documentation comment pretty useless at the moment). I spent quite a while deciding
on that name! Second, even before we've written it, we can see the function is going to follow a very simple
pattern: it creates a new thing (the result of the function, so it is called `result`) and returns it on the
last line. All the function has to do is build `result` - simple!

The other thing to see is that, even in this prototype state, this function is already reasonably testable.
Look, let's test it with some fake data, like this for example:

    ##gff-version 3
    #description: test data
    chr1   me    gene    1    1000    .    +    .    ID=gene1;other_data=stuff
    chr1   me    exon    10    900    .    +    .    ID=gene1.1;Parent=gene1

Let's encode that in python:
```
test_data = """##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
"""
```

(Where '\t' is python-speak for 'a tab character').

Here is a test:

```

def test_parse_gff3_to_dataframe( data ):
	from io import StringIO
	from math import isnan
    
	# 1. run our function:
	data = parse_gff3_to_dataframe( StringIO( data ))
    
	# 2. test it:
	assert data['seqid'][0] == 'chr1'
	assert data['strand'][0] == '+'
	assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
    
	assert data['start'][1] == 10 # start and end are integers
	assert data['end'][0] == 1000
    
	assert isnan( data['score'][1] ) # "." indicates missing data in the GFF spec
    
	assert data['ID'][0] == 'gene1'
	assert data['ID'][1] == 'gene1.1'
	assert data['Parent'][1] == 'gene1'
	# etc.
```

(**Note:** The `StringIO` bit above is just there to handle the fact that we are passing in a string of data to our function. Normally we will pass in a file.  The `isnan()` function is there to test for not-a-number values.)

If you run this right now, you'll get and error, something like:
```
>>> test_parse_gff3_to_dataframe( test_data )
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 6, in test_parse_gff3_to_dataframe
NameError: name 'parse_gff3_to_dataframe' is not defined
```

The task is just to get this test to pass.

This leads us to a:

**Challenge:** write `parse_gff3_to_dataframe()`. Can you write this so all the tests pass?  Or at least some of them?

**Hints:** This challenge does have a few complexities to it.  Here are some points to think about that might be helpful:

- pandas has a [`read_table` function](https://pandas.pydata.org/docs/reference/api/pandas.read_table.html) that is a good way to get the data in.  It has many arguments that control how the data is parsed.

- The data itself doesn't have column names in. But the test clearly requires them - you have to
  add them in somehow.

- To pass the tests you have to pay attention to missing data! Check the [GFF
  spec](https://m.ensembl.org/info/website/upload/gff3.html) for how these are represented. See
  below for a couple of possible ways of dealing with it.

- Also, some of the columns [have different data
  types](https://m.ensembl.org/info/website/upload/gff3.html) like integers and floats - to pass
  the tests you also have to get the types right.

- The last three rows of the test use the `ID` and `Parent` fields. If you [examined the
  data](What_gene_annotation_data_looks_like.md) you'll know these aren't seperate columns in GFF3, but instead
  live inside the `attributes` column. So somehow you'll have to pull these out into new columns.
  
**More hints:**

- Be careful about whitespace. Python really cares about your indentation. In particular, you should decide at the
  start if you are going to indent with spaces or tabs and stick with it (otherwise you will get all sorts of strange syntax
  errors).

- It is very worth looking around for an editor you like. On the Mac,
  [Textmate](https://macromates.com) or [Sublime](https://www.sublimetext.com) or [github
  Atom](https://atom.io) might be good choices. On Windows
  [Notepad++](https://notepad-plus-plus.org) or [Atom](https://atom.io) might work. Sublime and
  Atom also work on linux. Of course there are also many others you can use.

- It's a good idea to write little helper functions to do bits of the task. (For example, it might be useful to write
 a `parse_attributes()` function that parses a semi-colon-separated list of key=value pairs and return a dict, e.g. so that this:
```
> parse_attributes( 'ID=gene1;other_data=stuff' )
```
would produce this object:
    {
        "ID": "gene1",
        "other_data": "stuff"
    }

- `.split()` can be used to split strings.  For example `"Hello;world".split( ";" ) == [ "Hello", "world" ]`

- If you want to apply a function to every row of a data frame - the [pandas `.apply()`
  method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html) is the ticket.
  For example, `int` is a function, so you could do:
```
    df['start'].apply( int )
```

- How do handle missing data? One way is to use the python [syntax for conditional
  expressions](https://mail.python.org/pipermail/python-dev/2005-September/056846.html):
```
# convert value to an int
value = None if value == "." else int(value)
```
But a better way for this task may be to exploit the `na_values` argument of `pandas.read_table`.

**Yet more hints:** The [`solutions/part1/gff_first_version.py`](solutions/part1/gff_first_version.py) file contains my
first go at a solution to this. As a comparison,
[`solutions/part1/gff_python_version.py`](solutions/part1/gff_python_version.py) also implements a similar pure python
version called `parse_gff3_to_list()`. (There are lots of other ways to write this of course - for example, gathering
the code into a class might be sensible - but I've gone with functions for simplicity.)

If my code still looks too complicated to you - that's because it is. Having written the first version, I had a go[refactored
the code](Refactoring_makes_code_better.md) to produce a [nicer version](solutions/part1/gff.py).

### A note on writing tests

I'd hazard a guess that not many people writing scientific code think of writing their tests first, like we did above.
However, it is a very useful approach, because it forces you to think about how your code will be used before you spend
the effort of writing it. Also, writing tests first is one way to ensure you're in the 1% of programmers whose code is
actually tested at all!

If you follow [the section on refactoring](Refactoring_makes_code_better.md), you will also end up with code that is
easy to test at high and low levels. To illustrate this I've written a proper [test for my version
of`gff.py`](solutions/part1/test_gff.py) using the python [unittest
module](https://docs.python.org/3/library/unittest.html). It includes the test above, but also tests individual
functions in the module.

(If you run this test using `python3 test_gff.py`, you'll see that my `add_ID_and_Parent()` function actually has a bug
that kicks in if you give it strange `attributes` values.)

How much time and effort should you spend on testing? This depends on what you're trying to achieve. If your script is
a one-off exploratory analysis, it might not matter that much. However, when you're deep in a piece of scientific
research you don't want to be worried about [off-by-one errors](https://doi.org/10.1038/nm1107-1276b). I suggest
writing at least some tests to make sure the code does what it says.

### Using the code

Do you have a working function `parse_gff3_to_dataframe()`? Then let's [turn this into a useful
program](Converting_gff_to_sqlite.md).
