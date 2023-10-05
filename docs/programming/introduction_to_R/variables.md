---
sidebar_position: 5
---

# Storing values in variables

So far so good... we can compute with values, and 'vectors' of values.  But to do real programming we will need to store
the results.

Actually, storing the result of a computation is really easy: we create or assign a variable using the `=` or `<-`
syntax. Let's create a variable `y` now to store those powers of five we computed earlier:

```
> y = 5^(1:15)
```

or

```
> y <- 5^(1:15)
```

Both these do the same thing: they store the results of the computation into the variable called `y`.  

:::tip Note
In Rstudio, the variable `y` will appear in the top-right pane, in the 'Environment' tab.
:::

To see what's in the variable, just type its name:
```
> y
```

or 'print' it:
```
> print(y)
```

As you can see, `y` is now a variable containing all the powers of 5, up to 15.

Of course this is great because now we can manipulate it - for example we could double them all:
```
> 2 * y
```

or square them
```
> y^2
```

or sum them
```
> sum(y)
```

or plot them:
```
> plot( 1:15, y )
```

(As the plot shows, 5^15 is about 30 billion.)

:::tip Note on **variable names**

You can call variables mostly anything you want **except** for three main things.

1. You can't put whitespace into a variable name:
```
> my variable = 10
Error: unexpected symbol in "my variable"
```

2. And you can't put special characters (like the arithmetic operations)!80
 into a variable name:

```
> my*variable = 10 # doesn't work
Error in my * variable = 10 : object 'my' not found
```

3. Finally you can't put a number at the start of the name:
```
> 2_my_variable = 10
Error: unexpected input in "2_"
```

Otherwise, you can include most things, including for example underscores (`_`) or the `.` character - or numbers as
long as not at the start.  Here are some variable name examples that work just fine:

```
> my_variable = 10
> my.variable = 10
> my_variable2 = 10
> a.very.long.variable.name_too.long.perhaps = 5
```

:::

Another thing you have to be aware of is that variable names are **case sensitive** - this means CAPITAL LETTERS are
treated as different from lower case letters.  So this won't work very well:
```
> x = 5
> print(X)
Error in print(X) : object 'X' not found
```

Of course, if you had already created `X`, but meant to print `x` - it would seem to work, but it would give the wrong
answer. You'd have what's known in the trade as a **bug**.  The best way to prevent those is with [sanity checking
statements](help_going_wrong.md#bugs).

:::tip Advice: use descriptive variable names

When using R interactively like this, it's easiest to use short names:
```
> x = 3
> x^2
```

But as you start to write longer and more involved programs, this approach doesn't work very well,
because it will be hard to figure out what the variable is meant to be. For real programming it is
usually much better to use longwe, descriptive names, like this:

```
> number_of_desks = 3
> number_of_students_in_class = 24
> number_of_students_per_desk = number_of_students_per_class / number_of_sides
```

When you look back at the code later on to try to see what it does, you will find the
well-thought-out names helpful in a way that short, non-descriptive ones often aren't.

(Of course this is a balance - sometimes it really should be called `x`.)

:::
