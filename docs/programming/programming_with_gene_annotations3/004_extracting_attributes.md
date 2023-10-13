---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Extracting the ID and Parent attributes

If you followed the [previous page](./003_Getting_started_writing_some_code.md), you'll have a function called
`parse_gff3_to_dataframe()` which *almost* - but not quite - loads GFF data the way we want it.

What's missing is that we need to extract out attributes - in particular the `ID` and `Parent` attributes that specify
the structure of the file.  As you saw before they are tucked away inside the `attributes` column.

For example look at the first of these - it will look something like:
```

> X$attributes[1]
[1] "ID=ENSG00000223972.5;gene_id=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;level=2;hgnc_id=HGNC:37102;havana_gene=OTTHUMG00000000961.2"

```
The value is a big long string, separated by semicolons, and somewhere in there is the bit we want: `ID=ENSG......`.  We
also want to get the `Parent` attribute, which only exists in *some* rows, because it indicates how the records are
linked together.  If it's not there, we should give it a missing value.

So we have to somehow split these bits out of the string.  How to do this?

## Extracting attributes

It turns out there is a great tool for this type of job - [*regular
expressions*](https://en.wikipedia.org/wiki/Regular_expression). Regular expressions are a language in their own right
that can be used to parse and extract pieces of text from larger strings.  It works like this: we define a regular
expression that captures the bit of the attributes we want to extract.  Then we use a functon to apply that to all of
the attributes strings in the dataframe.

For example, to capture a field of the form `ID=something;`, we could use the basic regular expression:

```
ID=([^;]+)
```

:::tip Note

If you haven't used regular expressions before this might look pretty opaque!  But this is how regular expressions look; they are very short and compact but pack a lot in.  This one can be understood as follows:

* The 'ID=' part looks for the exact string "ID=";
* The '\[^;\]+' part looks for a string of characters **except** semicolons.  (The `+` means the string has to be at least one character long).
* And the parentheses `(` and `)` tell the regexp to *capture* (i.e. remember) whatever bit of the string matched.  (This is called a 'capture group')

So put together this says "find something of the form "ID=value", up to but not including any semicolon, and
remember the value."

:::

Let's test this out by making some dummy data with the `ID` in different places in the string:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
test_attributes = tibble(
	attributes = c(
		"a=b;ID=gene_1",
		"ID=gene_2;a=b",
		"ID=gene_3",
		"a=b"
	)
)
```

The [`str_extract()`](https://stringr.tidyverse.org/reference/str_extract.html) function from the
[`stringr`](https://stringr.tidyverse.org/index.html) library (part of tidyverse) can now be used to extract attributes:
```r
str_extract(
	test_attributes$attributes,
	'ID=([^;]+)'
)
```

You should see something like this:
```
[1] "ID=gene_1" "ID=gene_2" "ID=gene_3" NA         
```

This looks good - for example it has correctly returned a missing value (`NA`) for that last row where there was no `ID`
attribute.  Check it carefully to make sure the others are correct.

:::tip Question

Of course we want to only get the *value* in there - that is the bit in the capture "group" `([^;]+)`. In fact
[`str_extract()`](https://stringr.tidyverse.org/reference/str_extract.html) has an argument that can be used to do that
- can you find it?  Add this and check that it gives the right answers.

:::


</TabItem>
<TabItem value="python" label="In python">

```python
test_attributes = pandas.DataFrame( { "attributes": [
    "a=b;ID=gene_1",
    "ID=gene_2;a=b",
    "ID=gene_3",
    "a=b"
] } )
````

Let's try to extract the `ID` from that test data:

```python
test_attributes[ 'attributes' ].str.extract( 'ID=([^;]+)' )
```

This will print something like:

            0
    0  gene_1
    1  gene_2
    2  gene_3
    3     NaN
    
This looks good - for example it has correctly returned a missing value (`NaN`) for that last row where there was no `ID`
attribute.  Check it carefully to make sure the others are correct.

</TabItem>
</Tabs>

Getting our `ID` field into a new column of `X` is now easy.  (Since the `ID` is so important, let's put it at the
start).

<Tabs groupId="language">
<TabItem value="R" label="In R">

In R there are a few ways to do this.  For example let's do it by creating a new column `ID` at the start with `NA`
values, and then filling it with the values:

```r
X = add_column( X, ID = NA, .before = 1 )
X[['ID']] = str_extract(
	X[['attributes']],
	'ID=([^;]+)',
	group = TRUE
)

```

**Note.** In R, indexing **starts at 1**, so here `.before = 1` means "place at the start".

</TabItem>
<TabItem value="python" label="In python">

In pandas there are a few ways to do this.  For example let's do it by inserting a new column `ID` at the start with  and then
filling it with the values:

```
X.insert( loc = 0, column = 'ID', value = None )
X['ID'] = X.attributes.str.extract( 'ID=([^;]+)' )
```

:::tip Note

In python, indexing **starts at 0**, so in the `insert()` the first argument `0` means "place the columns at the start".

:::

</TabItem>
</Tabs>

:::tip Note

Thanks to Jonathan Chan for pointing out this neat way to extract attributes.

:::

Print out `X` again to see your handiwork - there should be a new `ID` column in there.

## An aside on timing

The full dataset has something like three million rows - that's a lot of data to process!
So how long does it take to extract these attributes?  Let's time it now:

<Tabs groupId="language">
<TabItem value="R" label="In R">

In R a simple way to time some code is using `system.time()`:
```r
system.time({
	X[['ID']] = str_extract(
		X[['attributes']],
		'ID=([^;]+)',
		group = TRUE
	)
})
```

</TabItem>
<TabItem value="python" label="In python">

In python a simple way to time some code is using `time.time():`

```r
from time import time
start = time()
X['ID'] = X.attributes.str.extract( 'ID=([^;]+)' )
end = time()
print( "Extracting the ID took %.2fs!" % (end - start) )
```

</TabItem>
</Tabs>

On my laptop, the R version takes about 2 seconds (measuring 'elapsed' time), pretty consistently, while the python
version is slightly slower, and there are 34 million rows. So it is parsing over a million rows per second.

This is in fact one of the **really good reasons** to use regular expressions for this task.  They are *extremely* well optimised.  For example, compare the speed of a naive implementation that tries to extract the ID attribute:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
# Extract the `ID` attribute by:
# 1. splitting up the string on ';' characters
# 2. Finding one that starts with "ID="
# 3. and using `substring()` to get the value:
my_naive_extract = function(x) {
	elts = strsplit( x, split = ';', fixed = T )[[1]]
	w = which( stringr::str_starts( elts, "ID=" ))
	result = NA
	if( length(w) == 1 ) {
		result = substring( elts[w], 4 )
	}
	return( result )
}
```

To apply this to the whole column we can use [`map()`](https://purrr.tidyverse.org/reference/index.html):
```
system.time({
	ID = map( X[['attributes']], my_naive_extract )
})

```

</TabItem>
<TabItem value="python" label="In python">

```python

# Extract the `ID` attribute by:
# 1. splitting up the string on ';' characters
# 2. Finding one that starts with "ID="
# 3. and using `substring()` to get the value:
def my_naive_extract(x):
	elts = x.split( ";" )
	found = [ elt for elt in elts if elt.startswith("ID=")]
	result = None
	if len(found) == 1:
		result = found[0][3:]
	return result

```

To apply this to the whole column we can use pandas' [`apply()`
function](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html):

```python

start = time()
ID = X['attributes'].apply( my_naive_extract )
end = time()
print( "Extracting the ID took %.2fs!" % (end - start) )

```

</TabItem>
</Tabs>

On my system (an M1 mac) this 'naive' version takes about 80 seconds in R! (Though the python version is much better, at
around 7 seconds.) So we have a table of timings, something like:

| Language | Method | Best of three timings |
| -------- | ------ | --------------------- |
| R        | regex  | 1.8s                  |
| python   | regex  | 2.6s                  |
| python   | naive  | 6.0s                  |
| R        | naive  | 78s                   |

:::tip Note

This illustrates a key point when working with large genomic datasets: it's quite easy to find that things get really
slow, and some care over implementation is often needed to speed them up again.  (Although 70s might not seem much in
the scheme of things, it's easily ennough for your mind to wander. Or imagine we were processing fifty files instead of
one...)

Particularly when working in interpreted languages like R or python, finding ways to write efficient code soon becomes
important.  (For text manipulation, regex methods are often hard to beat.)

:::

:::caution Warning

Apart from speed - you should also be worried about how much memory your process is using!

Check this now using your system's activity monitor or by running `top -u <username> -o '%MEM'` (on linux) `top -U gav -o MEM` (in Mac OS) in a terminal.  On my system, **before** running the above both R and python are
 using somewhere around 2Gb of memory, while *after* extracting the ID they are using about 2.4Gb each.  
 
This is closely related to speed, because if your system runs out of memory it will probably keep working but will start
 using 'swap' space (on your hard drive).  At this point the code adn everything else on your laptop will likely start
 to slow down dramatically.

:::

## Testing it out

Now you should be all set to get our function working!

:::tip Challenge

**Get the function working**, by following these steps:

1. Add the above code to your `parse_gff3_to_dataframe()` so that it adds the `ID` attribute.

2. Don't forget to add the similar code to extract the `Parent` attribute as well.

3. Run the test:

```
test_parse_gff3_to_dataframe()
```

If all goes well you should see:

```
++ test_parse_gff3_to_dataframe(): Congratulations,all tests passed!
```

Congratulations!

:::

If you get stuck - go on to the [next page](004_testing_it_out.md).