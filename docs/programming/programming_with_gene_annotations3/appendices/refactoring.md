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

I like this form because it is very easy to see what it does - it is *readable*.
(You also don't really need code comments when you write code like this - if you can make those function names obvious enough, they document themselves.)

If you've added extra attributes from [the challenge question](../009_challenge_questions.md#challenge-1-extract-more-attributes), it should perhaps instead look something like this:

```r
parse_gff3_to_dataframe = function(
	filename,
	extra_attributes = c( 'biotype', 'Name' )
) {
	result = read_gff_data( filename )
	add_attributes( result, extra_attributes )
	return( result )
}
```

:::tip Challenge
Refactor (i.e. rewrite) the code so the function looks more like the above.

**Hint** To do this, you need to split out bits of the function into other, named functions that do the work - here
`read_gff_data()` and `add_attributes()`.  You can choose the function names you like, of course, beause the point is to
make it readable. (Another advantage of this is that you can test these bits of code seperately)

:::

