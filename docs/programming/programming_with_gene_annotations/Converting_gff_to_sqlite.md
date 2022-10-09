---
sidebar_position: 5
---

[Up to table of contents](README.md) / [Back to the previous page](making_a_module.md) / [Go to the next page](Counting_genes_1.md)

# Writing a useful conversion program.

In the [first part of this tutorial](Getting_started_writing_some_code.md) you will have written a
small python module to parse a GFF3 file and output a pandas dataframe. I'll assume your function
is called `parse_gff3_to_dataframe()` and you call it something like:

```
import gff
X = gff.parse_gff3_to_dataframe( <filename here> )`
```

Now we want to get back to our aim of studying these gene annotations across.

Now we want to use this function to load and analyse data from multiple species at once.

To do this, you first need to get some data. If you haven't already, visit the links in the
introduction.  For example I recommend

- human and mouse annotations [from gencode](https://www.gencodegenes.org)
- [malaria genome annotations from PlasmoDB](https://plasmodb.org/plasmo/app/downloads/Current_Release/)
- other vertebrate genomes [from ensembl](http://ftp.ensembl.org/pub/current_gff3/) (see the [species list](https://www.ensembl.org/info/about/species.html).)
- or you can find other assemblies from [ensemblgenomes.org](https://ensemblgenomes.org)

One way to go about this is simple.  Just repeat the lines above for as many files as you have:
```
X = gff.parse_gff3_to_dataframe( "human.gff" )`
Y = gff.parse_gff3_to_dataframe( "chimpanzee.gff" )`
Z = gff.parse_gff3_to_dataframe( "malaria.gff" )`
```

(you should put in the actual filenames).  This works - but it has a problem.

### Memory issues

First off, like many files in bioinformatics these files are *pretty big*. This translates into
using up a lot of memory.  For example, start a python interpreter and load the human annotations:
```
import gff
X = gff.parse_gff3_to_dataframe( "gencode.v41.annotation.gff3.gz" )`
```

On my machine this is taking up about 2.5 gigabytes of memory.  And my laptop has only 16.
If we load ten or a hundred species, we're going to run out pretty fast.

### Code issues

The memory issues could be dealt with by filtering the files after we load them.  





Your function is already useful! To demonstrate this, let's convert the GFF file into a different format - a [sqlite
database](https://www.sqlite.org) database. `sqlite` is a very useful file format that works like a full database, but
doesn't require a server or anything like that - it's just a single file on the filesystem. But unlike a flat file, it
is relational, making it easy to link records together. (This is [similar to pandas
functionality]([https://pandas.pydata.org/docs/getting_started/comparison/comparison_with_sql.html#compare-with-sql-join
) but doesn't need to load all the data into memory.)

To get started, put your function in a file called `gff.py`. If you start python in the same
directory you should now be able to write:

```
import gff
data = gff.parse_gff3_into_dataframe('PlasmoDB-54_Pfalciparum3D7.head.gff')
print(data)
```

Congratulations - you've written a python module!

### Writing a command-line program

We will use your `gff` module to write a program called `gff_to_sqlite.py` which:

- uses the [argparse](https://docs.python.org/3/library/argparse.html) library to process
  command-line arguments for the input and output files.

- loads the data using your function above.

- stores the data in the output sqlite file.

This turns out to be pretty easy. We'll start by importing the relevant stuff, and writing a
function to parse the arguments. I find the [argparse
documentation](https://docs.python.org/3/library/argparse.html) a bit confusing, so here is
a quick head start:

```
import argparse, sqlite3
import gff

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

```
$ python3 gff_to_sqlite.py 
usage: gff_to_sqlite.py [-h] --input INPUT
gff_to_sqlite.py: error: the following arguments are required: --input
```

I'll leave you to fill in the other needed arguments here. You will need an `--output` option to
specify the output file, and because sqlite files can contain several tables, maybe also a
`--table` option to specify the output table name. (If you specify, say, `default = "gff_data"` for
this, instead of `required=True`, the argument will have a default value.)

### Parsing the data

This is easy right?  You've already written it:

```
data = gff.parse_gff_to_dataframe( args.input )
```

### Outputting to sqlite

This turns out to be easy too. Pandas dataframes have a [`.to_sql()`
function](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html)
that does this for you. To make this work, you open the database and then run it:

```
db = sqlite3.connect( args.output )
data.to_sql( args.table, db, index = False )
```

Finally you can, if you like, add a SQL index on the ID (or other columns) so lookups are quick:

```
db.execute( "CREATE INDEX IF NOT EXISTS `%s_ID_index` ON `%s`( ID )" % (args.table, args.table ))
```

Job done!  Run it in your shell like this:
```
$ python gff_to_sqlite.py --input ../PlasmoDB-54_Pfalciparum3D7.head.gff --output genes.sqlite
```

To check ths worked, you can use the [sqlite3 command-line client](www.sqlite.org) to look at the
result:

```
$ sqlite3 -header -column genes.sqlite "SELECT COUNT(*) FROM gff_data WHERE type == 'gene'"
$ sqlite3 -header -csv genes.sqlite "SELECT * FROM gff_data WHERE type == 'gene'"
$ sqlite3 -line genes.sqlite "SELECT * FROM gff_data WHERE attributes LIKE '%Name=ABO%'"
```

Or load it back into python:
```
>>> import pandas, sqlite3
>>> db = sqlite3.connect( "genes.sqlite" )
>>> pandas.read_sql( "SELECT Parent, COUNT(*) AS number_of_transcripts FROM gff WHERE type == 'mRNA' GROUP BY Parent", db )
```

Or load it into R:
```
library( RSQLite )
db = dbConnect( dbDriver( "SQLite" ), "genes.sqlite" )
dbGetQuery( db, "SELECT Parent, COUNT(*) AS number_of_transcripts FROM gff WHERE type == 'mRNA' GROUP BY Parent" )
```

etc.

This combination of between-language interoperability and flexible querying are the main reasons to
write this script in the first place. There's also another advantage which has to do with
controlling memory, that we'll [come back to later](Counting_genes_2.md).

**Warning:** Do check the output file size. For big organisms it can get quite big quite fast.

## Job not done yet

To make this genuinely useful there are a few things still to do.

1. You don't really want to leave your users hanging while your script processes stuff. It will
take not much of your time to add some `print()` statements to the script to tell the user what it
is doing, so you should do this. It will make you look good.

2. Your script is not so great at the moment if you want to process several files into the same
database - say several different organisms from
[Ensembl](http://ftp.ensembl.org/pub/current_gff3/). (Try running the above twice and you'll see
what I mean.) For one thing, you don't really know if the user wants to *append* the data to the
same table, or *overwrite* the table with the new one (this is a good candidate for another
command-line argument.). For another thing, if you did run it twice it would be difficult to figure
out which record came from which input file. Because of this I find it helps a lot to add an output
column that records an analysis name to distinguishes it from the other analyses. (This could
either be taken from another command-line argument, or taken from the input filename. I tend to
call this column `analysis`.)

3. The script can take a while (minutes) to process some of the larger files. It would be very worthwhile
to profile it to figure out if there are obvious slow bits that can be sped up. Profiling is beyond the scope of this
tutorial, but at some point you're going to need it to make code fast. [Here's how you can profile code in
python](https://docs.python.org/3/library/profile.html).)

4. How much memory does the script use?  (Try running it and watching `top` in another terminal).

My version of this code implements some of the above - it is in
[`solutions/part1/gff_to_sqlite_dataframe_version.py`](solutions/part1/gff_to_sqlite_dataframe_version.py). There is also [a version that does not rely on
pandas](solutions/part1/gff_to_sqlite_python_version.py).

I also tried profiling this code on a human gff file by running:

```
python3 -m cProfile gff_to_sqlite.py [arguments...]
```
If I read the profiling output right, it is
taking 60% of its time inside `parse_attributes()`. This means I could probably make it quite a bit
faster with some simple changes to `parse_gff3_to_dataframe()` - we'll get back to this later.

## Back to the task

Now let's get [back to learning about genes](Counting_genes_1.md).
