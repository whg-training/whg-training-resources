---
sidebar_position: 2
---

# R as a calculator

We'll assume you have started an R prompt - if not go and [start one now](README.md#getting-r).

## First steps

Let's try out R by trying a few interactive commands.  First, can R add numbers together?

```
> 5 + 10
[1] 15
```

It can!  It can also subtract them (`-`), multiply them (`*`), divide them (`/`), or exponentiate them (`^`).

:::tip Note

Start by playing around with these **arithmetic operations** now to make sure you know what they are doing. 

For example, what's $5$ to the power of $10$? Try
```
> 5^10
```
to find out.
:::

R can also manipulate other things, like strings.  Let's try a string now:
```
> "This is a string"
```
:::tip Note
Strings can also be given using single quotes, as in `'This is also a string'`.
:::

However, you can't add two strings together - try it:

```
> "This is a string" + " as well"
Error in "This is a string" + " as well" : 
  non-numeric argument to binary operator
```

This illustrates that **if you get something wrong** R will try to tell you what it is.  Here it's telling us that the
'binary operator' (which is `+`) expects 'numeric arguments' (i.e. numbers), as opposed to the strings we gave it.

That doesn't mean you can't concatenate strings - you can.  In R, operations on strings use particular functions.  The
one we want here is `paste()`:

```
> paste( "This is a string", "as well" )
[1] This is a string as well.
```

:::tip Note

Why 'paste'?  Good question.  This illustrates one of the worst aspects of R - some of the built-in functions have
fairly cryptic names.  Later on we'll suggest some useful libraries that make this easier.

:::


### Functions

R comes with a wide variety of functions, for mathematical and statistical operations. To call an R function, you use the function name and round brackets (`(`, `)`). The arguments to the function go inside the brackets, separated by commas. R functions support both **default arguments** and **named arguments**. Many of R's core functions have many, many possible arguments, and it would be impractical to have to type them all out.

An example of using an R function is:

```
> runif(1)
[1] 0.03999256
```

This has generated a random number from a uniform distribution. The argument 1 says how many numbers to generate. The function has two other arguments with default arguments, for the minimum and maximum values the random number can take. We can change those from the default values by adding arguments:

```
> runif(1, 0.25, 0.5)
[1] 0.3332207
> runif(1, max=0.5, min=0.25)
[1] 0.3211315
```

Note that both of these commands are using the same uniform distribution, between 0.25 and 0.5. In the first example, we give the argument in the order the function expects. in the second, we use named arguments to set them so we don't have to worry about the correct order.

At this point, you may be wondering how you know what order the arugments need to be, or what they are named. This where the `help` function comes in.

#### The Help Function

You can use the function:

`> help(runif)`

To look at R's help file for the function we used above. This will either open the html help file in a new browser window or show the help file in a command line text viewer (depending on how you are running R).

R help files are, unfortauntely, something of a mixed bag. They tend to be very thorough with respect to details, but aren't so good at explaining the context a function is meant to be used in. They are also not very useful when you know *what* you want to do, but you don't know where to start looking. In those cases, a web search will probably be more informative.

You can also look at the help for a function using this short-hand:

`> ?runif`

You can perform a fuzzy search using a double question mark:

`> ??runif`

#### Creating Your Own Functions

You can write your own functions in R. These are treated as objects, stored alongside data, with names that follow the same rules. Although it's possible to write them using R's command line interface it's more convenient to write them in a text editor or IDE and then load them into R. Creating a function in R looks like this:

```
my_exp_function <- function(arg1, arg2=10){
    out <- arg2 ^ arg1
    return(out)
}
```

(This is shown as it would appear in a script, without prompts)

The `my_exp_function <-` part is assigning the function to that name, as you would with a data object.

`function` is an R function, used to create a function, and it's hopefully not as confusing to understand as it was to type out.

Inside the round brackets are the argument names that the function will use. The second one is given a default value of 10 (using `=`; which is the only part of standard R code style where you should use `=`).

The curly brackets (`{`, `}`) contain the code block for the function itself. Inside that block are valid lines of R code, which are executed one by one when the function is called.

`return(out)` is a special function that it used to give the return value of a function. You can only return one value, and lines of code after this return function would be ignored.

We create an object inside this function. Objects created inside functions in this way are discarded after the function completes.

### Logic and If Statements

The comparison and equality operators in R do not result in number but in logical values. In R, these are represented by the special values `TRUE` and `FALSE`. They can abbreviated as `T` and `F`.

```
> 2 < 3
[1] TRUE
```

The table earlier gives you two logical operators: `&` for 'and' and `|` for 'or'.

#### If Statements

As in many programming languages, you may need to write code that is only executed when certain conditions are met. The structure that R uses looks like this:

```
> if(x > 10) {
+   "Big"
+ } else {
+   "Small"
+ }
[1] "Big"
```

Here we are taking advantage of the continuation prompt to write this over multiple lines so it's easier to read.

The keyword `if` kicks things off. Inside the round brackets there must be an expression that evaluates to a single logical value. In the next section we will discuss how to use R's vectors, but this part of an `if` statement is one place where you must have only a single value.

If that expression evaluates to `TRUE`, then the code inside the curly brackets will be run. Otherwise, it will not.

The follow-up keyword `else` marks a second block, which will be run when the condition evaluates to `FALSE`.

#### Recap Questions

todo...