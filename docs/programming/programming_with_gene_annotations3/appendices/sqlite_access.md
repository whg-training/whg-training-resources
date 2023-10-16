---
sidebar_position: 1
---

# Reading results from a sqlite file in any language

In the tutorial you wrote a command-line program to [convert the data into sqlite3
format](008_Converting_gff_to_sqlite.md).  One of the cool things about this is that it makes it easy to access the data
in any language we like - without really any extra effort.  This page demonstrates a few options. 

:::tip Note

For the commands on this page to work, you'll have to have used your `gff_to_sqlite.R` / `gff_to_sqlite.R` program to
create a `genes.sqlite` file containing some data imported from a gff file.  If not, [run the relevant
tutorial](../008_Converting_gff_to_sqlite.md) first.

:::

## The command-line

To use the results from the command-line, you can use the [sqlite3 command-line client](www.sqlite.org) to print
the contents:

```
sqlite3 genes.sqlite "SELECT * FROM gff" | less -S
```

This output format is probably not quite what you wanted. However, sqlite gives us lots of tools for getting the
bit of data we want and in the right format. For example to output the locaitons of all the genes in a columnar
format:

```
sqlite3 -header -column genes.sqlite "SELECT analysis, seqid, start, end, strand FROM gff WHERE type == 'gene'"
```

Or to get a line-based output of all transcripts of the *ABO* gene:
```
sqlite3 -line genes.sqlite "SELECT * FROM gff WHERE type == 'transcript' AND attributes LIKE '%Name=ABO%'"
```

Or if you want just the first few lines in CSV format:
```
sqlite3 -csv -header genes.sqlite "SELECT * FROM gff LIMIT 10"
```

Or just records for *FUT2* in tab-separated format:
```
sqlite3 -separator $'\t' -header genes.sqlite "SELECT * FROM gff WHERE ID=='ENSG00000176920.13' Or Parent == 'ENSG00000176920.13'"
```

:::tip Note
These same queries can of course be used with the languages below, too.
:::

Using the `sqlite3` tool, you can also see the whole database "schema" like so:
```
% sqlite3 genes.sqlite ".schema"
```
You should see one table (`gff`) and the two indexes we created.

## Python

Loading results in python is easy too using the [`sqlite3` module](https://docs.python.org/3/library/sqlite3.html):

```python
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
data = pandas.read_sql( "SELECT * FROM gff WHERE type=='gene'", db )
print(data)
```

## R

To load results in R, use the [RSQLite](https://cran.r-project.org/web/packages/RSQLite/index.html) package:

```R
library( RSQLite )
db = dbConnect( dbDriver( "SQLite" ), "genes.sqlite" )
data = dbGetQuery( db, "SELECT * FROM gff WHERE type=='gene'" )
print( data )
```

:::tip Note

This produces an R 'data frame'.  If you want a tidyverse tibble, load the tidyverse library and convert it:
```
data = as_tibble( data )
```
:::

## Julia

In Julia this is easy using the [`SQLite.jl` package](https://github.com/JuliaDatabases/SQLite.jl):

```julia
using SQLite, DataFrames
db = SQLite.DB( "genes.sqlite" )
DBInterface.execute( db, "SELECT * FROM gff WHERE type=='gene'" ) |> DataFrame
```

## On the web

It's also possible to serve the database over the web - using [datasette](https://datasette.io).
Assuming you are using [conda](/prerequisites/CONDA.md), you may be able to install datasette like this:
```
mamba install datasette
```

To serve the database to your local machine, type:
```
datasette serve genes.sqlite
```

This starts the server process in your terminal. Visit <http://127.0.0.1:8001> in your browser, and browse away!
(Press Ctrl-C in your terminal to quit the server process when you're done.)

:::tip Note
For example, I used datasette and [javascript visualisation](/prerequisites/Other_languages/javascript.md) to create the
figures for our paper (Malaria protection due to sickle haemoglobin depends on parasite
genotype)[https://www.nature.com/articles/s41586-021-04288-3].
:::
