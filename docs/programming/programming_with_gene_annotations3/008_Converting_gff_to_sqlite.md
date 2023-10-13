---
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Writing a useful conversion program.

Your R package (or python module) is already useful!  To demonstrate this, let's use it to write a **command-line
utility** - a program you can run on the command-line to do something useful.

Specifically let's write a program to convert a GFF file to the [sqlite database](https://www.sqlite.org) format. There
are lots of good reasons to do this.  One of them is that `sqlite` will make it easy to load the data we want from
almost any language, without having to re-write another `parse_gff3_to_dataframe()` function. It will make it easy to
load bits of data we want.

## How we'll run the program

We will develop this a bit differently to the previous code (for which you may have used Jupyter lab, for example, to
work semi-interactively). Here we are writing a program so you'll want to create a new blank file `gff_to_sqlite.R`
which we will edit.

Ultimately we are aiming to use the file like this (from the command-line):

<Tabs groupId="language">
<TabItem value="R" label="In R">

```sh
Rscript --vanilla gff_to_sqlite.R --input my_file.gff --output genes.sqlite
```

Here `Rscript --vanilla` is the R way of running a script on the command line, `gff_to_sqlite.R` is our program,
and the other parts are the command-line options.

To get started, create a new R file named `gff_to_sqlite.R` in your editor now.

</TabItem>
<TabItem value="python" label="In python">

```
python gff_to_sqlite.py --input my_file.gff --output genes.sqlite
```

Here `python` (or you may need `python3`) is the python program, `gff_to_sqlite.py` is our program,
and the other parts are the command-line options.

To get started, create a new R file named 'gff_to_sqlite.py' in your editor now.

</TabItem>
</Tabs>

## Importing our code

The first thing we'll need to do is import our code.  And we'll need the sqlite3 library too. Add these line to your
file:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
library( gmsgff, RSQLite )
```

</TabItem>
<TabItem value="python" label="In python">

```python
import gmsgff, sqlite3
```

</TabItem>
</Tabs>

## Adding command-line arguments

Our program will take an *input* argument telling it where to find the input GFF file, and and *output* argument telling
it where to put the output.  To get these into our program we'll use the **argparse** library. I find the [argparse
documentation](https://docs.python.org/3/library/argparse.html) a bit confusing, so here is a quick head start:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
library( argparse )

parse_arguments = function() {
    parser = ArgumentParser(
        description = "Convert a GFF3 file to sqlite3 format. The result will be a table with the GFF3 fields, and with ID and Parent fields in columns."
    )
    parser$add_argument(
        '--input',
        type = "character",
        help = "The path of a GFF3-formatted file to work with",
        required = TRUE
    )
    # add other needed arguments here
    return( parser$parse_args() )
}

args = parse_arguments()
```

</TabItem>
<TabItem value="python" label="In python">

```python
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(
        description = """Convert a GFF3 file to sqlite3 format.
        The result will be a table with the GFF3 fields, and with ID and Parent fields in columns.
        """
    )
    parser.add_argument(
        '--input',
        help ='The path of a GFF3-formatted file to work with',
        required = True
    )

    # add other needed arguments here

    return parser.parse_args()

args = parse_arguments()
```

</TabItem>
</Tabs>

Your program is already runnable. Try it from a command-line:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```sh
Rscript --vanilla gff_to_sqlite.R
```

If all goes well you will see something like this:

```
usage: ./gff_to_sqlite.R [-h] --input INPUT
./gff_to_sqlite.R: error: the following arguments are required: --input
Execution halted
```

**Note.** you may have to install the argparse and RSQLite packages first.

</TabItem>
<TabItem value="python" label="In python">

```sh
python gff_to_sqlite.py
```

If all goes well you will see something like this:

    $ python3 gff_to_sqlite.py 
    usage: gff_to_sqlite.py [-h] --input INPUT
    gff_to_sqlite.py: error: the following arguments are required: --input

**Note.** you may have to install the argparse package first.

</TabItem>
</Tabs>

So it works!  (What does it do if you give it an argument i.e. `--input my_file.txt`?)

:::tip Challenge

Our program also needs a `--output` option - add it now.

:::

## Implementing the main function

Implementing the program itself is pretty easy thanks to our module. We read in the data and write it to the database.
Let's do that in a function called `process()` which takes in the arguments and does the work:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
process = function( args ) {
    # (parse the data and write the output here)
}
```
</TabItem>
<TabItem value="python" label="In python">

```
def process( args ):
    # (parse the data and write the output here)
```

</TabItem>
</Tabs>

Let's write that function now:

### Parsing the data

Parsing the data is easy right?  You've already written it:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
data = gmsgff::parse_gff_to_dataframe( args$input )
```

</TabItem>
<TabItem value="python" label="In python">

```python
data = gmsgff.parse_gff_to_dataframe( args.input )
```

</TabItem>
</Tabs>

### Outputting to sqlite

This turns out to be very easy too.  You have to open the database, then write a table to it:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
db = DBI::dbConnect(RSQLite::SQLite(), args$output )
dbWriteTable(
    db,
    "gff",
    data,
    row.names = FALSE
)

```

</TabItem>
<TabItem value="python" label="In python">

Pandas dataframes have a [`.to_sql()`
function](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html) that does this for
you. To make this work, you open the database and then run it:

```python
db = sqlite3.connect( args.output )
data.to_sql( args.table, db, index = False )
```

</TabItem>
</Tabs>

### Adding an index

To maximise the benefit of the relational nature of sqlite, you can, if you like, now add a sqlite *index* on
the ID (or other columns) so lookups are quick. The correct incantation is:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
dbGetQuery( db, "CREATE INDEX IF NOT EXISTS gff_index ON gff( ID ))" )
```

</TabItem>
<TabItem value="python" label="In python">

```python
db.execute( "CREATE INDEX IF NOT EXISTS gff_index ON gff( ID )" )
```

</TabItem>
</Tabs>

### Closing the connection
We're meant to close the connection at the end:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
dbDisconnect( db )
```

</TabItem>
<TabItem value="python" label="In python">

```
db.close()
```

</TabItem>
</Tabs>

### Trying it out

Put that all into your `process()` function (**Note**: remember the indents in python, or the closing brace in R!)

And to have our program run it, we'd better call it:

```
process( args )
```

Job done!  Test it out in your shell again without any arguments, to see what happens.

Now try running it on some real data:

<Tabs groupId="language">
<TabItem value="R" label="In R">

```r
Rscript --vanilla gff_to_sqlite.py --input gencode.v41.annotation.gff3 --output genes.sqlite
```

</TabItem>
<TabItem value="python" label="In python">


```python
python gff_to_sqlite.py --input gencode.v41.annotation.gff3.gz --analysis_name Pf3D7 --output genes.sqlite
```

</TabItem>
</Tabs>

:::tip Note

Check how big the sqlite file is.  Is it larger or smaller than the input file?
(What about if you uncompress the input file first?)

:::

## Reading results from any language

One of the cool things about this is that we can now access the data in any language we like - without really
any extra effort.  Let's look at a few options:

### The command-line

To use the results from the command-line, you can use the [sqlite3 command-line client](www.sqlite.org) to print
the contents:

```
sqlite3 genes.sqlite "SELECT * FROM gff_data" | less -S
```

This output format is probably not quite what you wanted. However, sqlite gives us lots of tools for getting the
bit of data we want and in the right format. For example to output the locaitons of all the genes in a columnar
format:

```
sqlite3 -header -column genes.sqlite "SELECT analysis, seqid, start, end, strand FROM gff_data WHERE type == 'gene'"
```

Or to get a line-based output of all transcripts of the *ABO* gene:
```
sqlite3 -line genes.sqlite "SELECT * FROM gff_data WHERE type == 'transcript' AND attributes LIKE '%Name=ABO%'"
```

### Python

Loading results in python is easy too using the [`sqlite3`
module](https://docs.python.org/3/library/sqlite3.html):

```python
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
pandas.read_sql( "SELECT * FROM gff_data WHERE type=='gene'", db )
```

### R

To load results in R, use the [RSQLite](https://cran.r-project.org/web/packages/RSQLite/index.html) package:

```R
library( RSQLite )
db = dbConnect( dbDriver( "SQLite" ), "genes.sqlite" )
dbGetQuery( db, "SELECT * FROM gff_data WHERE type=='gene'"
```

### Julia

In Julia this is easy using the [`SQLite.jl` package](https://github.com/JuliaDatabases/SQLite.jl):

```julia
using SQLite, DataFrames
db = SQLite.DB( "genes.sqlite" )
DBInterface.execute( db, "SELECT * FROM gff_data WHERE type=='gene'" ) |> DataFrame
```

### On the web

It's also possible to serve the database over the web - using [datasette](https://datasette.io).
Assuming you are using [conda](/prerequisites/CONDA.md), install datasette like this:
```
mamba install datasette
```

To serve the database to your local machine, type:
```
datasette serve genes.sqlite
```

This starts the server process in your terminal. Visit <http://127.0.0.1:8001> in your browser, and browse away!
(Press Ctrl-C in your terminal to quit the server process when you're done.)

## Finishing touches

Your job is not done yet! Before leaving your program, spend a few minutes to make it as user-friendly as
possible. The simplest way to do this is to add some `print()` statements to the script to tell the user what
the script is doing.  Don't forget to include a 'Thank you for using...' message at the end!

## Solutions

If you want some inspiration, [my version of the program is here](solutions/part1/gff_to_sqlite.py).

## Back to the task

Now let's get [back to learning about genes](Counting_genes_1.md).
