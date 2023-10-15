---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing it out

Hopefully you have now got a working function, `parse_gff3_to_dataframe()` and got the extremely rewarding message:
```
++ test_parse_gff3_to_dataframe(): Congratulations,all tests passed!
```

If not here is my solution:

:::tip Solution

<Tabs groupId="solutions">
<TabItem value="teaser" label="Solution">
Please try to code it yourself first of course!  See the tabs for solutions.
</TabItem>

<TabItem value="R" label="R solution">

```r
parse_gff3_to_dataframe = function( filename ) {
    result = readr::read_tsv(
        filename,
        comment = '#',
        na = ".",
        col_names = c( 'seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes' ),
        col_types = readr::cols(
            readr::col_character(),
            readr::col_character(),
            readr::col_character(),
            readr::col_integer(),
            readr::col_double(),
            readr::col_double(),
            readr::col_character(),
            readr::col_integer(),
            readr::col_character()
        )
    )
	result[['ID']] = stringr::str_extract( result[['attributes']], 'ID=([^;]+)', group = TRUE )
	result[['Parent']] = stringr::str_extract( result[['attributes']], 'Parent=([^;]+)', group = TRUE )
	return( result )
}

test_parse_gff3_to_dataframe()
```

**Note.** Those `readr::` and `stringr::` bits are optional - you could just do `library( tidyverse )` at the top.

</TabItem>
<TabItem value="python" label="python solution">

```python
def parse_gff3_to_dataframe( file ):
	import pandas
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
	result.insert( loc = 0, column = 'ID', value = None )
	result.insert( loc = 1, column = 'Parent', value = None )
	result['ID'] = result.attributes.str.extract( 'ID=([^;]+)' )
	result['Parent'] = result.attributes.str.extract( 'Parent=([^;]+)' )
	return result

```

</TabItem>
</Tabs>

```
test_parse_gff3_to_dataframe()
```
:::

## Trying some real data

You ought to be able to load some real data now.  Does it work on the full gencode file? 

```
gencode = parse_gff3_to_dataframe( "gencode.v41.annotation.gff3.gz" )
```

What about the file downloaded from Ensembl - called something like `Homo_sapiens.GRCh38.107.chr.gff3.gz` or similar -
does it work? What about the [*P.falciparum* file](./002_What_gene_annotation_data_looks_like.md)?

Use your R skills [from the Introduction to R tutorial](/programming/introduction_to_R/working_with_data.md) or python
skills to view these files and explore a bit - for example pulling out all gene records, or records pertaining to
specific genes.  (For example you could look at *FUT2*, which has `ID=ENSG00000176920.13`, or at `PF3D7_1127000` in the
*P.falciparum* genome).

:::tip Note

<Tabs groupId="language">
<TabItem value="R" label="In R">

Here's a cool way to filter the dataframe - using a kind of 'pipe', just like the one in bash.
Instead of using `filter()` like this:
```
filter( gencode, ID == `ENSG00000176920.13` )
```
you can write

```
X %>% filter( ID == `ENSG00000176920.13` )
```

Here `%>%` plays the same role as `|` does in bash - it *pipes* the output of one command into the input of the next.
The advantage is that you can put multiple things in the same pipeline.  For example let's find all the *FUT2* transcripts
that start before `chr19:48,696,000`:
```
(
	gencode
	%>% filter( Parent == 'ENSG00000176920.13' )
	%>% filter( start < 48696000 )
)

```

So, just like in the command-line, you can build up *pipelines* of commands to get the data you want.  This filtering
syntax is a feature of [dplyr](https://dplyr.tidyverse.org), which is part of [tidyverse](https://www.tidyverse.org).

</TabItem>
<TabItem value="python" label="In python">

Here's a cool way to filter the data frame by rows in python - use
[`query()`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.query.html).  This takes a string as an
expression, for example:
```
gencode.query( "ID == 'ENSG00000176920.13'" )
```

The `query()` function is actually part of the dataframe object (it's a 'method' of the dataframe), which is why you can
call it in the style '`object.method()`'.

This also makes it easy to chain multiple filtering criteria together. For example, let's find all the *FUT2*
transcripts that start before `chr19:48,696,000`:
```python
(
	gencode
	.query( "Parent == 'ENSG00000176920.13'" )
	.query( "start < 48696000" )
)
```

This dataframe and filtering syntax is part of [pandas](https://pandas.pydata.org).

</TabItem>
</Tabs>

:::

If it's working, well done!

:::tip Note

Another great thing to do is *group* and *count* the data - much like the [pipeline using `uniq -c` in
BASH](/bioinformatics/exploring_gene_annotations_in_bash/counting.md).  For example let's make a count of record
types:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
(
	gencode
	%>% group_by( type )
	%>% summarise( count = n() )
)
```

**Note**. Another way to do this is R's built-in function `table()`:

```
table( gencode$type )
```

</TabItem>
<TabItem value="python" label="In python">

```python
(
	gencode
	.groupby( "type" )
	.agg({ "ID": 'count' })
)
```

This works, but I personally find this piece of code and its output harder to understand than the R / dplyr version.
Another way to do this in pandas is to use the simpler `value_counts()`:
```python
gencode['type'].value_counts()
```

...although that returns something called a 'Series', as opposed to a data frame.

</TabItem>
</Tabs>
:::

:::caution Warning

As you start to play around with loading multiple files, keep an eye on the memory usage of your process.  (You can do
this in your system monitor, or by opening a terminal and running:
* `top -u <username> -o '%MEM'` on linux or Ubuntu for Windows; or
* `top -U gav -o MEM` in Mac OS

:::

## Next steps

A better way to solve the memory issue to store the data in a database and only load what's needed into memory - we'll
see a way to do that [later](./008_Converting_gff_to_sqlite.md).  But first let's [package up the
code](./007_making_a_module.md).

