---
sidebar_position: 12
---

# Scaling up for a real analysis

[Up to table of contents](README.md)

So far we've written some code and (if you've done what I did) looked at data from a few species.
This intriguing but it'd really be great to take a more systematic look across species.

For example - maybe you'd like to run it for [all ~300 species with data on Ensembl](http://ftp.ensembl.org/pub/current_gff3/)?). 
(To figure out how you might download this data - see [here](/bioinformatics/tips_and_tricks/recursive_ftp.md).)

However if you were to do this right now, you would likely run into problems - not least because
the output file will grow very large.

**Challenge** Make your code ready to apply at scale - say, to hundreds of species.

** An aside on python packaging. ** If all your code is currently in a single file (say `gff.py`),
it will be getting quite large - and possibly unwieldy. If so, a good idea is to turn it into a
python 'package'.  (A package is a glorified module which has been split across multiple files).

This is pretty easy as follows:

1. create a new directory `gff`

2. copy the code in `gff.py` into the new directory. This is a good time to split it up into pieces
of related code. (For example, I split up the gff parsing code into a file called `parse.py`, the
code for reading sequence lengths into a file called `sequences.py`, the code for dealing with
genomic regions into `regions.py`, and the code that computes summaries into `summary.py`.)

3. Create a file called `gff/__init__.py`.  The contents of mine is:

```
__all__ = [
    'parse',
    'sequences',
    'summary',
    'regions'
]

from .parse import *
from .sequences import *
from .summary import *
from .regions import *
```

Congratulations! You have now written a python package. 

If the above isn't clear, you can see my version of this in
[this folder](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part3/gff/).

:::tip Note
With the `__init__.py` written as above, the package can still be used in the same way as
before (i.e. by writing `import gff`). So you should still be able to run your test;
```
python3 ./test_gff.py
```

The key benefit of a package is that it lets you split code
up into smaller files, which I find makes it easier to edit and add to. It also provides you a
place to put tests (add a `tests/` folder), and allows you more control over how the code is
accessed (by altering `__init__.py`.)
:::

### Reducing how much is stored

The current code essentially reconstructs a database of the input data - storing all the records.
If you did this for 300 species it would rapidly get very large indeed. Of course - you might want
a reconstructed database, which is after all a useful thing. But for most purposes it is probably
better if we can reduce the amount of storage used - and also the amount of computation that needs
to be done.

What improvements can we make to this? Here are some thoughts.

* Our analysis so far only using the genes, transcripts, exons and CDS records. There's no point
  storing anything else.

* Many of the identifiers have redundant stuff in - for example `gene:` and `transcript:` prefixes.
  Editing the identifiers to remove these prefixes would save quite a bit of space.
  
* The attributes column uses up a lot of space.  Maybe we can just storing attributes for the gene
  records?
  
The above suggests one way to go. Storing only the records we need - and removing most of the
attributes columns - indeed reduces the size of the database (I found by about a third).

### Not storing it in the first place.

Of course if we really want to save space, we would avoid storing all that data for transcripts,
exons etc. at all. Why don't we run our analysis on the gene data as we load it, and then only
store the gene-leve summaries we have computed?

You can see [my quick attempt at that here](solutions/scaling_up/summarise_gff3.py). If you run it,
instead of the original `gff_data`, you get:

* a `genes` table which just lists the gene records, but with the number of transcripts and mean number of
  exons have been added as extra columns.
  
* a `sequences` table that lists the sequences extracted from the file.

* a `gene_statistics` table which lists our [gene count statistics](Counting_genes2.md).

* a `coverage_statistics` table which lists our [genome coverage statistics](How_much_of_the_genome_is_in_genes.md)

Importantly (unless you specify an option) the code does not store all the transcripts, exons, or
coding sequence records, and consequently the output file is much smaller. But it still allows us
to explore interesting genes.

### A real example

You can see the code I reached when using this to answer these questions
[in this folder](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/real_analysis/).
It has a few changes:

* The module has been split into a package of files, as described above.
* The program is called `summarise_genes.py` instead of `gff_to_sqlite.py`
* The program avoids storing stuff that isn't needed (as also described above).

To make it easier to write I wrapped up much of our analysis code into a new [python
class](https://docs.python.org/3/tutorial/classes.html) called `UnpackedGFF`. It holds the genes, transcripts, exons, CDS, and
sequences, and knows how to call the functions to summarise them.

**Note.** Encapsulating things into this class was useful, because we have several related data objects and the class keeps them
all in one place, and makes sure they are used appropriately. However, this class is arguably not very well written! It fails on
some of the [original criteria](Introduction.md) and it would be very hard to test. So really this class should be improved.

## What next?

[What next indeed](./What_next.md)

The next page has some [tips on visualisation](Visualisation.md).
