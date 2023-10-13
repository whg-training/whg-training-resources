---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Writing a useful conversion program.

Your function is already very useful! To demonstrate this, let's use it to write a **command-line utility** - something
that you can run on the command-line to do something useful.

Specifically, we'll write a program to convert a GFF file to the [sqlite database](https://www.sqlite.org). `sqlite` is a useful format that works like a full database, but doesn't require a server - it's just a single file on the filesystem.  Unlike a flat file, it is relational, making it easy to link records together.  It also has very good support across many programming languages, so putting the data in a sqlite file helps to make it useable whatever langauge you prefer to work in.

For us, sqlite will help us to selectively load bits of data we want.

## Making your function loadable

To get started, we recommend first restarting R or python so you have a clean session to work with.

Now take the code for your `parse_gff_to_dataframe()` function and put it into a new file in the current directory.

:::tip Note
For this you need to use a text editor - for example Visual Studio Code, the RStudio editor, or the editor in Jupyter Lab will do.
:::

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

## Writing a command-line program

To make a good command-line program we'l

Our program will take an *input* argument telling it where to find the input GFF file, and and *output* argument telling
it where to put the output.  

To give




We will use your `gff` module to write a program called `gff_to_sqlite.py` which:

- uses the [argparse](https://docs.python.org/3/library/argparse.html) library to process
  command-line arguments for the input and output files.

- loads the data using your function above.

- stores the data in the output sqlite file.

This turns out to be pretty easy. 

### Adding command-line options

We'll start by importing the relevant stuff, and writing a
function to parse the arguments. I find the [argparse
documentation](https://docs.python.org/3/library/argparse.html) a bit confusing, so here is
a quick head start:

```
import argparse
import sqlite3
import gff # your module

def parse_arguments():
    parser = argparse.ArgumentParser(
        description = """Convert a GFF3 file to sqlite3 format.
        The result will be a table with the GFF3 fields, and with ID and Parent fields in columns.
        The resulting table will be indexed by the ID field for easy lookup."""
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

If you put this in a file called `gff_to_sqlite.py` then you can run it from your shell like this:
```sh
python gff_to_sqlite.py 
```

which will print something like this:

    $ python3 gff_to_sqlite.py 
    usage: gff_to_sqlite.py [-h] --input INPUT
    gff_to_sqlite.py: error: the following arguments are required: --input

I'll leave you to fill in the other needed arguments here. You will need an `--output` option to
specify the output file, and because sqlite files can contain several tables, maybe also a
`--table` option to specify the output table name. (If you specify, say, `default = "gff_data"` for
this, instead of `required=True`, the argument will have a default value.)

Implementing the program is pretty easy now.  We read in the data and write it to the database.

### Implementing the main function

Implementing the program itself is pretty easy thanks to our module. We read in the data and write it to the database. Let's put
that in a function called `process()` which takes in the arguments and does the work:

```
def process( args ):
    (parse the data and write the output here)
```

### Parsing the data

Parsing data is easy right?  You've already written it:

```
data = gff.parse_gff_to_dataframe( args.input )
```

### Adding an analysis 'name'

The program can be used to put many gff files into one database. To separate them, let's give our table an 'analysis' column at
the start, that records what we were running:

```
data.insert( 0, 'analysis', args.analysis_name )
```

To make this work, you have to add an `analysis_name` command-line argument - the user will have to supply this when they run the
program.

### Outputting to sqlite

This turns out to be very easy too. Pandas dataframes have a
[`.to_sql()` function](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html)
that does this for you. To make this work, you open the database and then run it:

```
db = sqlite3.connect( args.output )
data.to_sql( args.table, db, index = False )
```

### Adding an index

To maximise the benefit of the relational nature of sqlite, you can, if you like, now add a sqlite *index* on
the ID (or other columns) so lookups are quick. The correct incantation is:

```
db.execute(
    "CREATE INDEX IF NOT EXISTS `%s_ID_index` ON `%s`( ID )"
    % (args.table, args.table )
)
```

### Closing the connection
We're meant to close the connection at the end:
```
db.close()
```

### Trying it out

If all that went into a `process()` function, you'd better call it:

```
process( args )
```

Job done!  Test it out in your shell like this:
```
python gff_to_sqlite.py
```

    usage: gff_to_sqlite.py [-h] --analysis_name ANALYSIS --input INPUT --output OUTPUT [--table TABLE]

Now try running it on some real data:

```
python gff_to_sqlite.py --input gencode.v41.annotation.gff3.gz --analysis_name Pf3D7 --output genes.sqlite
```

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
