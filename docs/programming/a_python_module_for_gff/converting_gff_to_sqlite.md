---
sidebar_position: 9
---

# Writing a useful conversion program



Your module is already useful! To demonstrate this, let's convert the GFF file into a different format - a
[sqlite database](https://www.sqlite.org) database. `sqlite` is a very useful file format that works like a
full database, but doesn't require a server or anything like that - it's just a single file on the filesystem.

Unlike a flat file, it is relational, making it easy to link records together. (This is [similar to pandas
functionality]([https://pandas.pydata.org/docs/getting_started/comparison/comparison_with_sql.html#compare-with-
sql-join ) but doesn't need to load all the data into memory.)

For us, sqlite will help us to selectively load bits of data we want.

## Writing a command-line program

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
    parser.add_argument(
        '--analysis_name',
        help ='A name to give this analysis, e.g. species name',
        required = True
    )

    # add other needed arguments here

    return parser.parse_args()

args = parse_arguments()
```

If you put this in a file called `gff_to_sqlite.py` then you can run it from your shell like this:

```
python3 gff_to_sqlite.py 
usage: gff_to_sqlite.py [-h] --input INPUT
gff_to_sqlite.py: error: the following arguments are required: --input
```

:::tip Challenge

Add the other needed arguments.  You need at least:

* An `--output` option to specify the output filename

* Maybe also a `--table` option to specify the table the results will go into - this is because a sqlite file can hold many
  tables at once. (If you specify, say, `default = "gff_data"` for

:::

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

The program can be used to put many gff files into one database. To seperate them we can give them an 'analysis name' (which was
why I added this as one of the command-line options.  Let's add that at the start of our dataframe:

```
    data.insert( 0, 'analysis', args.analysis_name )
```

### Outputting to sqlite

This turns out to be very easy too. Pandas dataframes have a
[`.to_sql()` function](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html)
that does this for you. To make this work, you open the database and then run it:

```
    db = sqlite3.connect( args.output )
    data.to_sql( args.table, db, index = False )
```

### Adding an index

To maximise the benefit of the relational nature of sqlite, you can, if you like, now add a SQL index on the ID
(or other columns) so lookups are quick.  The correct incantation is:

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

## Testing it out
Job done!  Run it in your shell like this:
```
python gff_to_sqlite.py --input PlasmoDB-54_Pfalciparum3D7.head.gff --analysis_name Pf3D7 --output genes.sqlite
```

To check this worked, you can use the [sqlite3 command-line client](www.sqlite.org) to look at the
result.  For example:

```
sqlite3 -header -column genes.sqlite "SELECT COUNT(*) FROM gff_data WHERE type == 'gene'"
```
or
```
sqlite3 -header -csv genes.sqlite "SELECT * FROM gff_data WHERE type == 'gene'"
```
or
```
sqlite3 -line genes.sqlite "SELECT * FROM gff_data WHERE attributes LIKE '%Name=ABO%'"
```

Or you can load it back into python:
```
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
pandas.read_sql( "SELECT Parent, COUNT(*) AS number_of_transcripts FROM gff WHERE type == 'mRNA' GROUP BY Parent", db )
```

Or load it into R:
```
library( RSQLite )
db = dbConnect( dbDriver( "SQLite" ), "genes.sqlite" )
dbGetQuery( db, "SELECT Parent, COUNT(*) AS number_of_transcripts FROM gff WHERE type == 'mRNA' GROUP BY Parent" )
```

etc.

This combination of between-language interoperability and flexible querying are the main reasons to write this script in the
first place.

**Warning:** Do check the output file size. For big organisms it can get quite big quite fast.

## Job not done yet

You are not done yet!  

:::tip Task

You don't really want to leave your users hanging while your script processes stuff. It will take not much of your time to add
some `print()` statements to the script to tell the user what it is doing, so you should do this. It will make you look good.

:::

My version of this code can be found in
[this folder](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/a_python_module_for_gff/solutions/). It
prints out some useful info (and also adds a `--overwrite` option, that tells the program to replace whatever's in the table
instead of appending it.)

## Back to the task



Now let's get [back to learning about genes](Counting_genes_1.md).
