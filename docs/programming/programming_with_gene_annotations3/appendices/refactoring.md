---
sidebar_position: 2
---

# Refactor for better readability

If you've followed the [main tutorial](../005_testing_it_out.md), your `parse_gff3_to_dataframe()` function will have
something like... 20 or 30 lines in it.  It's quite complicated, but really it's very simple and only does a couple of
things:

* Reads in the data
* extracts some attributes

So really it should look much simpler, like this:
```r
parse_gff3_to_dataframe = function( filename ) {
	result = read_gff_data( filename )
	add_attributes( result )
	return( result )
}
```

I like this form because it is very easy to see what it does.

::tip Note

Re-writing code for clarity and simplicity like this is known as **refactoring**.  You should aim not to change any
functionality (use your test to make sure this is true) but will end up much more readable.

(After a refactor you also may find you don't need any code comments any more - ideally the code will document itself.)

:::

:::caution Note
You can indeed do this in the python version.

**Unfortunately**, however, this is difficult to do fully in R.  This is because R doesn't pass function arguments 'by
reference', meaning that those sub-functions can't really alter the 'result' dataframe.  In some situations this is fine
(we could just have them return the updated data) but because our data frame is really large (remember it took up ~2.5Gb
of RAM) we also have to be really careful about making copies of things. Nevertheless you can get some of the way there
- e.g. you could certainly implement this line:
```
result = read_gff_data( filename )
```

which would already substantially reduce the length of the function.

:::