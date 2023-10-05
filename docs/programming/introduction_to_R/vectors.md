---
sidebar_position: 3
---

# Computing with lots of values at once

One of the things you might have noticed is that when R prints out an answer, it puts `[1]`
first.  Like this:

```
> 5^2
[1] 25
```

What's this?

It turns out that R really works with whole **vectors** of values at once.  The values above were just treated as
'vectors' of length one.

:::tip Note
A 'vector' is R's name for an array of values, all of the same type.
:::

So that `[1]` is just there to tell you we are on the first value in the result, which in this case only has one entry.

## Making ranges of values

You can see this, for example, by creating a longer vector - say all the numbers from 1 to 100:
```
% 1:100
```
You should see something like:
```
  [1]   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18
 [19]  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36
 [37]  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54
 [55]  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72
 [73]  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90
 [91]  91  92  93  94  95  96  97  98  99 100
```

Now you can see what the numbers in brackets are for - they are a visual guide to the vector of output values.  
For example in the above I can see that the 1st, 19th, 37th, ... and 91st values are at the start of the rows.

:::tip Note

The syntax `1:100` is shorthand for 'list all the numbers from a to b'.  Another way to write this is using the `seq()`
function:

```
seq( from = 1, to = 100 )
```
Feel free to try some different ranges of numbers here.  You can also try the `by` argument to count in steps:
```
seq( from = 1, to = 100, by = 5 )
```

Make sure you know what this does.
:::


## Concatenating values

Another good way to create vectors is to use the `c()` (shorthand for 'concatenate') function.
It sticks together its arguments into a longer vector:
```
> c( "This", "is", "a", "vector", "of", "strings )
[1] "This"    "is"      "a"       "vector"  "of"      "strings"
```

:::tip Question
What do you think this will produce?
```
> c( 1:5, 11:15, 21:25 )
```
(Try it and see.)
:::

## Computing with vectors

Because everything is treated as a 'vector' of values, you can easily combine this to carry out complicated arithmetic
operations.  For example, let's work out the first fifteen powers of 5:

```
> 5^(1:15)
 [1]           5          25         125         625        3125       15625
 [7]       78125      390625     1953125     9765625    48828125   244140625
[13]  1220703125  6103515625 30517578125
```

:::caution Note

Here the brackets around `(5:15)` were needed.  What happens if you do just `5^1:15` instead?  Why?

In general **round brackets** act to group an expression together, so it gets treated all as one.

:::

