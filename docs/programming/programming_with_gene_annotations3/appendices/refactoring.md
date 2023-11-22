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

This form is **much better** because it is very easy to see what it does.

Rewriting code like this is known as a **refactor**.  It makes it easier to read, and often ends up making it easier to
test and to alter as well.   After a refactor you may also find you don't need any code comments any more - so delete
them!  This is because the function names (if you get them right) will document themselves.

:::tip Note

Of course, this doesn't change the fact that the code still has to do the same things - you'll still need all the bits
you had previously.  However, you push the details down into smaller, named units (functions) so that it's obvious what
the high-level code does.  

:::

:::caution Note
You can indeed undertake this challenge in the python version.

**Unfortunately**, however, this is difficult to do fully in R.  This is because R doesn't pass function arguments 'by
reference', meaning that those sub-functions can't really alter the 'result' dataframe.  In many situations this is
fine, i.e. we could just have the function return the updated data like this:

```r
result = add_attributes( result )
```

However, because our data frame is really large (remember it took up ~2.5Gb of RAM!) we also have to be really careful
about making copies of it.  (A hidden factor of writing the code as above, is that you end up making a copy of result,
modify it, and then store it back into result - while that's happening your program is using 5Gb.)

A solution to this might rely on R's [reference classes](http://adv-r.had.co.nz/OO-essentials.html#rc), but is beyond
the scope of this tutorial.

Nevertheless you can get some of the way there, e.g. yu can certainly implement this line:

```
result = read_gff_data( filename )
```

which would already substantially reduce the length / complexity of the function.


In **python** things are easier because python passes its arguments in a way that lets them be modified.

:::
