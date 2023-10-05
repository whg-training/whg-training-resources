---
sidebar_position: 10
---

# Loading libraries

So far everything we've done has used 'base R', but many useful functions can be found in libraries. In particular there
are a set of libraries known as the 'tidyverse' that we find extremely useful, and which we recommend using.

Full documentation for this package can be found [on the tidyverse website](https://www.tidyverse.org).  During this
course there are four bits we'll use in particular:

* We'll use the functions like `read_tsv()` to [read in data](https://readr.tidyverse.org) - because they are a bit better than the R builtin functions.
* We'll use the [tidyverse `tibble` data type](https://tibble.tidyverse.org), instead of R built in data frames.
* We'll also use the functions from [`dplyr()`](https://dplyr.tidyverse.org) to easily manipulate data.
* And we'll use [`ggplot2`](https://ggplot2.tidyverse.org), which is an advanced library for plotting.

For the purpose of this tutorial we'll use tidyverse to load in and look at some data.  to do this we first need to
install it, and then load it them into your running R session.

## Installing libraries

To install a library, all we need is a single call:
```
> install.packages( name of library goes here )
```

So to install tidyverse:
```
> install.packages( 'tidyverse' )
```

**Note.** here you give the name of the package *in quotes*.

The package will be downloaded from the R pacakge repository, known as [CRAN](https://cran.r-project.org).  In fact when
you run it, R might first ask which 'CRAN mirror' you wish to download from.  It will then split out a bunch of stuff
showing that it is downloading and installing the package.  For example, when I ran it, the output ended like this:
```
The downloaded binary packages are in
	/var/folders/1j/6glxfbj173d604n6mx1zh30c0000gn/T//RtmprydQG6/downloaded_packages
```
This indicates the package was successfully downloaded and installed.

:::tip Note

So **where** has it been installed?  This depends on your system.
For example on my system (which is a mac) it winds up in:
```
/Library/Frameworks/R.framework/Versions/4.2-arm64/Resources/library
```

On the other hand it is also likely to be in an `R/` directory in your home directory - you could see the contents this
way:

```
> dir( "~/R/", recursive = TRUE )
``

The exact location on your system is given by the `.libPaths()` function.
:::

## Loading libraries

To load a library into your running R session, use `library()`:

```
library( tidyverse )
```

**Note** that unlike for `install.packages()` here you **do not** put quotes around the library name.

You will probably see a message, something like this:
```
── Attaching core tidyverse packages ─────────────────────── tidyverse 2.0.0 ──
✔ dplyr     1.1.3     ✔ readr     2.1.4
✔ forcats   1.0.0     ✔ stringr   1.5.0
✔ ggplot2   3.4.3     ✔ tibble    3.2.1
✔ lubridate 1.9.3     ✔ tidyr     1.3.0
✔ purrr     1.0.2     
── Conflicts ───────────────────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()
ℹ Use the conflicted package to force all conflicts to become errors
```

Don't worry - this is normal!  Tidyverse is in fact a large meta-package - a collection of other packages that work together.  (You can also load any of those component libraries individually, if you wanted to.)

This message is telling you what you've installed, and making a couple of warnings about functions that have been overridden by the new package.  We'll generally want the tidyverse versions of functions like `filter()`, so this is fine.

Once you have the tidyverse installed, let's use it to [look at some data](working_with_data.md).