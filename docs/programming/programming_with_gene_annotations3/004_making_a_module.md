---
sidebar_position: 3.6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Making a module

If you've got this far, you've written a function `parse_gff3_to_dataframe()` that [passes the
test](./Getting_started_writing_some_code.md#test-driven-development).  And ope

That's already cool but let's go one step further - let's turn it into an R package (or python module.)

It's pretty easy.

## The easy way

The simplest way is to just put it in a single file, like this:

<Tabs groupId="language">
<TabItem value="R" label="In R">

Copy and paste the function and paste it into a new file, called `gff.R`, in the current directory.
(For good measure, paste the test function as well.)

To load this into your R session, you can use the `source()` function:
```r
source( 'gff.R' )
X = parse_gff_to_dataframe( "gencode.v41.annotation.head.gff" )
```

</TabItem>
<TabItem value="python" label="In python">

Copy and paste the function and paste it into a new file, called `gff.py`, in the current directory.
(For good measure, paste the test function as well.)

Congratulations!  You have just created a python module.  Load it like any other module, using the **import** statement:
```python
import gff
X = gff.parse_gff_to_dataframe( "gencode.v41.annotation.head.gff" )
```

</TabItem>
</Tabs>

Making a single file like this is ok, but it's not really a full package.  Let's instead make one now.
Choose one of the next sections depending on which language you are working in.

## Making an R package

Making an R package is a big topic - [whole books](https://r-pkgs.org) have been written about it! That link also takes
you to some advanced tools that make the whole process easier.  **Do** use that if you find yourself wanting to write a real R package.

But for now, we'll use base R approaches to get it working.  To get started, first you need to start with an empty R
workspace that has **only** the functions you want in it. So, start a new R session (quit the old one if you want) and
paste in the definition of `parse_gff3_to_dataframe()`.

Now, to create an R package, use `package.skeleton()`.  Let's call our package "gmsgff":

```r
package.skeleton( "gmsgff" )
```

This will create a new directory called 'gmsgff' in the working directory.  If you look inside it you will see a few
things:
```
gmsgff/
  NAMESPACE
  DESCRIPTION
  Read-and-delete-me
  man/
    gmsgff-package.Rd
    parse_gff3_to_dataframe.Rd
  R/
    parse_gff3_to_dataframe.R
```

Have a look at these files now using your preferred method.  They are:

* The `NAMESPACE` and `DESCRIPTION` files are package metadata - we will have to edit these to make the package work
* The `parse_gff3_to_dataframe.R` file contains your function.
* The `gmsgff-package.Rd` and `parse_gff3_to_dataframe.Rd` file contain the package documentation - we'll have to edit these too.

(You can read, and if you wish delete, `Read-md-and-delete-me`.)

Let's go through these in order.  You can also see a completed version of the package [on
github](https://github.com/whg-training/whg-training-resources/tree/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff).

First let's edit `NAMESPACE`, which declares what the package imports (in our case, `readr` and
`stringr`), and what it "exports" (in our case, the `parse_gff3_to_dataframe()` function.)  It should look like this:
```
import( readr )
import( stringr )
export("parse_gff3_to_dataframe")
```

Easy enough.

Second, `DESCRIPTION`, which (you've guessed it!) describes the package.  Edit it to give relevant values, e.g. mine looks like this:
```
Package: gmsgff
Type: Package
Title: Utilities for loading gene annotation data
Version: 0.1
Date: 2023-10-13
Author: My Name
Maintainer: My Name <my.email@server.info>
Description: Provides parse_gff3_to_dataframe
License: mit_license
```

:::caution Important
There is one extra line in this file you will need as well - to tell it about the dependency on the tidyverse packages :
```
Imports: stringr, readr
```

Make sure and add this to the end.
:::

## Trying to install

To try to install the package, you can run `R CMD INSTALL gmsgff` from the command-line:

```
% R CMD INSTALL gmsgff
```

But you will probably see an error like:

```
Error in Rd_info(db[[i]]) : 
  missing/empty \title field in '/private/var/folders/1j/6glxfbj173d604n6mx1zh30c0000gn/T/Rtmp14vvWH/Rbuild772d141c32f6/gmsgff/man/parse_gff3_to_dataframe.Rd'
Rd files must have a non-empty \title.
See chapter 'Writing R documentation' in manual 'Writing R Extensions'.
* removing ‘/private/var/folders/1j/6glxfbj173d604n6mx1zh30c0000gn/T/Rtmp14vvWH/Rinst772d4755beca/gmsgff’
      -----------------------------------
ERROR: package installation failed

```

In other words - **we can't install it until we have written the documentation**.  (Oh dear).

There are two documentation files to write, and if you look at them you'll see they look a bit complicated.  For example `gmsgff/man/gmsgff-package.Rd` starts like this:
```
\name{gmsgff-package}
\alias{gmsgff-package}
\alias{gmsgff}
\docType{package}
\title{
\packageTitle{gmsgff}
}
\description{
\packageDescription{gmsgff}
}
\details{
  (etc)
```

Pretty complicated!

To get this working for this tutorial I suggest just copying the files I quickly made for this:

* [gmsgff-package.Rd](https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff/man/gmsgff-package.Rd)
* [parse_gff3_to_dataframe.Rd](https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff/man/parse_gff3_to_dataframe.Rd)

(For example you could download these files and replace your original ones.)

If you look at these files you'll see I've edited to give very basic description of what the package does - along with some test code.





In fact there are good tools to make writing documentation easire =- see 

Let's take a simple route right now 

Third, to get the





or otherwise make sure you have an empty R workspace to work in.
You want 



, but here are some instructions:


because it is now incredibly easy to
turn this into a reuseable module. Do it like this:

* Copy your code into a new file, named `gff.py` using a [text editor](/prerequisites/editor.md). (This file
  should go in your current directory i.e. the one you started python / jupyterhub from.)

* Congratulations!  You have now written your first python module.

To use your python module, simply import it and use like this:

```python
import gff
X = gff.parse_gff3_to_dataframe( 'gencode.v38.annotation.head.gff' )
```

or if you don't want to type the "`gff.`" before the function name:
```python
from gff import parse_gff3_to_dataframe
X = parse_gff3_to_dataframe( 'gencode.v38.annotation.head.gff' )
```

Cool!

### Anything else?

Are we done? Well, really you should keep your tests along with your module. That's easy - e.g. [look at my
version here](solutions/part1/test_gff.py). All I have done there is to collect the test code from the previous
page - with a slight update to use the python's [unit testing
framework](https://docs.python.org/3/library/unittest.html). If you save that in a file called `test_gff.py` and
run it you should see something like:

```
    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 2 tests in 0.021s
    
    OK
```

(If the tests fail - you have a problem. Fix it before moving on!)

## Next steps

Great!  We have a fully functional, fully tested gff-loading module! Now let's use it to
[write a useful command-line program](Converting_gff_to_sqlite.md).
