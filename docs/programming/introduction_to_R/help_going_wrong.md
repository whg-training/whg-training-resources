---
sidebar_position: 4
---

# Help! it's not working!

If something in the above examples isn't working - first of all, don't panic!
This page will try to help you get it fixed.

## The emergency exit - `Ctrl-C`

The first thing to know about is what to do if you are really stuck.

If you can't seem to get back to the basic prompt (`>`) for any reason - try pressing
`Ctrl-C`.  (In Rstudio, you can also try pressing `<escape>`.)

Pressing `Ctrl-C` will **cancel the current command**, including any command that is running right now or any that you
have partially written, and return you to the prompt.  In short it behaves similarly to the way it behaves in the
command-line.

This may be enough to get you out of your immediate problem.  As to what caused it in the first place, read on for three
types of thing that could be going wrong.

## Syntax errors

It could be that R is refusing to run something and spits out an error message, as in:
```
> 5 + "six"
Error in 5 + "six" : non-numeric argument to binary operator
```

This is a **a syntax error**. 

The actual error message you get might be more or less helpful.  Often it **is** helpful, like the
one above.  Sometimes it is more cryptic, like this one:

```
> 2023 = 2022
Error in 2023 = 2022 : invalid (do_set) left-hand side to assignment
```

Usually these **are** helpful, but only once you have the experience to know what it means.  This particular one means
what it says: we can't set 2023 to 2022 (otherwise we'd have invented time travel.)  It is indeed an invalid 'left-hand
side' to the 'assignment'.

Solving syntax errors is sometimes more of an art than a science, but hq
ere are some general suggestions for solving them:

1. Read the error message carefully.  Usually the last line or so will tell you the actual problem - see if you can
   figure out what it means.

2. Look back at the code - maybe there is something obvious?  (Or type it again to make sure.)

3. If stuck, try copying the last part of the error message into a search engine.

:::tip Note

On this course, we are of course supporting you, so another good way is to ask the instructor team -
or each other.

:::

## Incomplete commands

Another type of syntax 'error' happens if you don't quite finish a line:

```
> 5^(1:15
+
```

Here, you'll see a `+` instead of the regular `>` prompt on the next line.  This is R's **command
continuation prompt** and it happens because R thinks we hadn't finished the command.

:::tip Question
What was 'unfinished' about this command?
:::

You might have meant this on purpose (sometimes it's useful to write commands over several lines)
but if not - fear not.  Your options are: 1. finish the command (here by adding the closing `)`) or
2. press `Ctrl-C` or `escape` to cancel it and get back to the regular prompt.

## Bugs

Perhaps the worse thing that can happen is that the code appears to work but **gives the wrong answer**.
For example:

```
> powers_of_five = 5^1-15
```

:::tip Note
What value(s) does this compute?  Why?
:::

What you have here is a **bug**.

Luckily, there is an easy way to prevent bugs: add sanity-checking statements.

In R this can be done using the `stopifnot()` function.  For example:

```
> stopifnot( powers_of_five[1] == 5 )
```

This command checks that the first element of `powers_of_five` is `5`.  If it isn't, it 'stops' R.
(At the moment, this just means printing a message, but in a script this will stop the script.)

:::tip Advice
**Use `stopifnot` a lot**.  It helps you check your code is doing what you thought it was.
:::

## Summary

It takes some practice, but you'll get used to using the tools above to handle error situations.
