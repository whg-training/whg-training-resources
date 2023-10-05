---
sidebar_position: 6
---

# Some other data types

Strings and numbers are just two of the data types R can work with.  What else?  Well, there are
*lists*:

```
> list( "This", "list", "has", 5, "entries" )
```

As you can see, a `list` is just a list of things, and the things can be of different types.

There are also *vector types*, which we've seen already - they are a kind of list where all the
entries have the same type.  The `c()` (for 'concatenate') function can be used to stick things
together into a vector:

```
> c( "This", "vector", "has", "5", "entries" )
```

You can also create **matrixes**:
```
> matrix( 1:6, nrow = 2 )
```

:::tip Question
Did this matrix get filled *row-wise* (along rows) or *column-wise* with the numbers 1 to 6?
:::

And multidimensional arrays - for example here's a `25 x 2 x 2` array:
```
> array( 1:40, dim = c( 10, 2, 2 ))
```

There's also another very useful type, the **data frame**, which is often used to store scientific
data.  We'll come back to it a bit later.

