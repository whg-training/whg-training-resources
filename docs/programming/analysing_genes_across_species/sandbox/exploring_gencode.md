---
sidebar_position: 50
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Investigating human genes

If [our module](making_a_module.md) is any good, we should be able to do all the things we were [able to do on
the command line](/bioinformatics/exploring_gene_annotations_in_bash) - and more. Let's see if we can.

### Loading the data

```
import gff
X = gff.parse_gff3_to_dataframe( 'gencode.v41.annotation.gff3.gz' )
```

### Viewing the data

This is either easier or harder than in the command-line, depending on how you look at it. One one hand
there's no equivalent of `less` - we can't scroll around the data. About the best we can do is print it:

```
print(X)
```

That's ok (it shows us the first few and the last few rows), but for example the attributes column is a bit hard
to look at.

On the other hand we can easily get at individual rows and columns, by name, in a way we couldn't before. For
example, to look just at the `ID` column, we would use `X['ID']` or just `X.ID`. Similarly, suppose we want to
look at rows 30-32 inclusive:

```
X.iloc[30:33]
```

                              ID             Parent seqid  source  type  start    end  score strand phase                                         attributes
    30  exon:ENST00000473358.1:1  ENST00000473358.1  chr1  HAVANA  exon  29554  30039    NaN      +   NaN  ID=exon:ENST00000473358.1:1;Parent=ENST0000047...
    31  exon:ENST00000473358.1:2  ENST00000473358.1  chr1  HAVANA  exon  30564  30667    NaN      +   NaN  ID=exon:ENST00000473358.1:2;Parent=ENST0000047...
    32  exon:ENST00000473358.1:3  ENST00000473358.1  chr1  HAVANA  exon  30976  31097    NaN      +   NaN  ID=exon:ENST00000473358.1:3;Parent=ENST0000047...

:::tip Note

To select rows by integer index like this, you are supposed to use the `.iloc` notation. To get rows by 'row
name', or for more complex queries, you are supposed to use `.loc` instead - for example
```
X.loc[(X.seqid == 'chr2') & (X.type == 'gene')]
```

This `.loc`/`.iloc` notation feels a bit clunky to me compared to R (or julia) data frames, but it works.

:::

Meanwhile, we have all the power of python available to look at it. So for example, suppose we wanted to unpack
the attributes on each row into a [dict](https://docs.python.org/3/tutorial/datastructures.html).  We could do:

```
def parse_attributes( attributes ):
	"""Parse the GFF3 attributes string into a dict of key=value pairs"""
	result = {}
	elts = attributes.split(";")
	for elt in elts:
		(key, value) = elt.split( "=" )
		result[key] = value
	return result
	
list(
	X.iloc[30:33]
	.attributes
	.apply( parse_attributes )
)
```

### How many of each type of gene are there?

The pandas [`value_counts()`` function](https://pandas.pydata.org/docs/reference/api/pandas.Series.value_counts.html) makes this
easy:

```
X['type'].value_counts()
```

    exon                                      1625321
    CDS                                        872459
    transcript                                 251236
    three_prime_UTR                            203260
    five_prime_UTR                             171599
    start_codon                                 97009
    stop_codon                                  90749
    gene                                        61852
    stop_codon_redefined_as_selenocysteine        119
    Name: type, dtype: int64

But we still have the problem that we are counting not just protein-coding genes, but all gene records.

In the command-line, we used a `grep` command to do this - we could mimic that here:

```
selection = X['attributes'].apply( str.contains( 'gene_type=protein_coding' )
X.loc[selection]['type'].value_counts()
```

:::tip Note

The above uses the pandas `.str` function which makes it easy to work with columns of string values.
It is described on the pandas [page about working with text](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html).

:::

Using this 'look for "gene_type=&lt;something&rt;"' syntax is a bit dis-satisfying - couldn't we isolate the
gene type as it's own column?  We'll come back to that later on.

### Investigating a single gene

What about individual genes? Let's again look up [FUT2](https://en.wikipedia.org/wiki/FUT2).

We can find the gene...
```
X.loc[ X.attributes.str.contains( 'gene_name=FUT2' ) & (X.type == "gene") ]
```

...its transcripts....
```
X.loc[ ( X.Parent == 'ENSG00000176920.13' ) & (X.type == "transcript") ]
```

...and its exons....
```
X.loc[ (X.Parent == 'ENST00000425340.3') & (X.type == "exon") ]
```

...pretty easily.

:::tip Note
Again, it would have been nice if we had the gene name `gene_name` attribute as a seperte column so we could
filter on it - but the above works.
:::

## Going beyond simple queries

andas/python give us tools to do more advanced queries as well. For example: suppose we want to know the
number of transcripts per gene. To do this, a conceptually natural way would be: take all transcripts, group
them by their gene (i.e. `Parent`), and then produce counts. Pandas lets us do this directly (if only you can
figure out the right syntax):

```
transcript_counts = (
  X.loc[ X.type == 'transcript' ]
    .Parent
    .value_counts()
)
```

:::tip Note

The brackets `()` around this are so that python treats it all as one expression.

:::


The result is something like this:

    ENSG00000179818.17    296
    ENSG00000215386.15    258
    ENSG00000109339.24    192
    ENSG00000249859.14    190
    ENSG00000226674.11    189
                         ... 
    ENSG00000278438.1       1
    ENSG00000247853.2       1
    ENSG00000251898.1       1
    ENSG00000251010.1       1
    ENSG00000210196.2       1
    Name: Parent, Length: 61852, dtype: int64

:::tip Question

What is that gene with the most transcripts?  Is it protein-coding?

:::

:::tip Note

Unlike the dataframe `X`, which has integers for row ids, this result has an 'index' made up of gene IDs
(printed on the left). This means you can look it up by `ID` e.g. in the form

```
transcript_counts.loc( 'ENSGXXX....' )
```

Check it gets the answer right for *FUT2*.

:::

## Next steps

In short we can do everything that's doable
[on the UNIX command-line](/bioinformatics/exploring_gene_annotations_in_bash) - and more.

Before going further, though, there are a few things we need to fix - we need a [refactor](a_refactor.md).

